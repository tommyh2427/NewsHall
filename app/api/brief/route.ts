import { NextRequest, NextResponse, after } from "next/server";
import {
  normalizeTopicKey, previousWindowKey, briefDateKey, readTopicCacheKeys, writeTopicCache,
  fetchArticlesForTopics, generateTopics, fallbackBrief, promoteLeadWithPhoto,
  isRateLimited,
} from "@/app/lib/news-pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_TOPICS = 10;
const MAX_TOPIC_LEN = 80;

// Harden the client-supplied topics array: enforce string type, strip control
// chars, collapse whitespace, cap each topic's length, drop empties, de-dupe, and
// cap the count. No whitelist — arbitrary custom topics are the product — but no
// unbounded/abusive input reaches the DB or the LLM either.
function sanitizeTopics(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    if (typeof t !== "string") continue;
    const clean = t.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/[\s]+/g, " ").trim().slice(0, MAX_TOPIC_LEN);
    if (!clean) continue;
    const k = clean.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(clean);
    if (out.length >= MAX_TOPICS) break;
  }
  return out;
}

// `today` also flows into the prompt, so constrain it to date-ish characters.
function sanitizeToday(raw: unknown): string {
  if (typeof raw === "string") {
    const clean = raw.replace(/[^\w ,:-]/g, "").trim().slice(0, 40);
    if (clean) return clean;
  }
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// ── Live brief generation ────────────────────────────────────────────────────
// Cache-aside: serve cached topics instantly, generate only the misses, cache
// them for everyone else, and always fall back to an RSS-only brief if the AI
// is unavailable so a brief never fully fails.
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  const topics = sanitizeTopics(body?.topics);
  if (!topics.length) return NextResponse.json({ error: "No topics" }, { status: 400 });
  const today = sanitizeToday(body?.today);

  // IP-based rate limit — blocks abuse loops, ignores real usage (best-effort)
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim()
    || req.headers.get("x-real-ip") || "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests — please wait a moment." }, { status: 429 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

      try {
        const dateKey = briefDateKey();
        const curKey: Record<string, string> = {};
        const prevKey: Record<string, string> = {};
        for (const t of topics) { curKey[t] = normalizeTopicKey(t); prevKey[t] = previousWindowKey(t); }

        // 1. Shared cache — look up BOTH the current and previous window in one query.
        const lookup = [...new Set([...Object.values(curKey), ...Object.values(prevKey)])];
        const rows = await readTopicCacheKeys(lookup);

        // Classify each topic: fresh hit (current window), stale hit (previous window —
        // serve now, refresh in background), or a true miss (must generate now).
        const ready: Record<string, any> = {};   // topic -> content to serve this request
        const staleTopics: string[] = [];         // served stale; regenerate in after()
        const missTopics: string[] = [];          // no cache at all
        for (const t of topics) {
          if (rows[curKey[t]]) ready[t] = rows[curKey[t]];
          else if (rows[prevKey[t]]) { ready[t] = rows[prevKey[t]]; staleTopics.push(t); }
          else missTopics.push(t);
        }

        if (missTopics.length) {
          // 2. Generate true misses with the shared pipeline (identical to cron)
          const fresh = await generateTopics(missTopics, today);
          const writes: { key: string; content: any }[] = [];
          for (const t of missTopics) {
            const content = fresh[t];
            if (content?.stories?.length) { ready[t] = content; writes.push({ key: curKey[t], content }); }
          }
          // 3. Cache the real AI results for everyone else this window
          if (writes.length) await writeTopicCache(writes, dateKey);

          // 4. Any miss the AI didn't cover → RSS-only fallback (not cached)
          const uncovered = missTopics.filter((t: string) => !ready[t]);
          if (uncovered.length) {
            const articles = await fetchArticlesForTopics(uncovered);
            const fb = fallbackBrief(uncovered, articles);
            fb.forEach((tg: any, i: number) => {
              const requested = uncovered[i];
              if (requested) ready[requested] = { ...tg, _fallback: true };
            });
          }
        }

        // 5. Assemble in the user's requested order; lead = a photo-fetchable story
        const allTopics: any[] = [];
        for (const t of topics) {
          const content = ready[t];
          if (content?.stories?.length) {
            const { _fallback, ...clean } = content;
            allTopics.push(promoteLeadWithPhoto({ ...clean, topic: t }));
          }
        }

        // 6. Stale-while-revalidate: topics served from the previous window get
        // regenerated for the current window in the background, so the next visitor
        // (and this user's next load) is fully fresh — nobody waits at a boundary.
        if (staleTopics.length) {
          after(async () => {
            try {
              const fresh = await generateTopics(staleTopics, today);
              const writes = Object.entries(fresh)
                .filter(([, c]: any) => c?.stories?.length)
                .map(([t, content]) => ({ key: curKey[t], content }));
              if (writes.length) await writeTopicCache(writes, dateKey);
            } catch { /* next request will retry */ }
          });
        }

        if (!allTopics.length) {
          send({ type: "error", message: "Could not generate brief" });
        } else {
          for (const topic of allTopics) send({ type: "topic", topic });
          const extraCount = allTopics.length - 1;
          send({
            type: "done",
            headline: extraCount > 0
              ? `${allTopics[0]?.topic || "Morning"} & ${extraCount} more topic${extraCount !== 1 ? "s" : ""}`
              : (allTopics[0]?.topic || "Morning Brief"),
          });
        }
      } catch (err: any) {
        send({ type: "error", message: err?.message || "Failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
