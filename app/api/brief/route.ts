import { NextRequest, NextResponse } from "next/server";
import {
  normalizeTopicKey, briefDateKey, readTopicCache, writeTopicCache,
  fetchArticlesForTopics, generateTopics, fallbackBrief, promoteLeadWithPhoto,
  isRateLimited,
} from "@/app/lib/news-pipeline";

export const maxDuration = 300;

const MAX_TOPICS = 10;

// ── Live brief generation ────────────────────────────────────────────────────
// Cache-aside: serve cached topics instantly, generate only the misses, cache
// them for everyone else, and always fall back to an RSS-only brief if the AI
// is unavailable so a brief never fully fails.
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.topics?.length) return NextResponse.json({ error: "No topics" }, { status: 400 });

  // Hard server-side cap so one request can't generate an unbounded number of topics
  const topics = (body.topics as string[]).slice(0, MAX_TOPICS);
  const today = body.today;

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
        const keyByTopic: Record<string, string> = {};
        for (const t of topics) keyByTopic[t] = normalizeTopicKey(t);

        // 1. Shared cache — topics already generated today by anyone
        const cached = await readTopicCache([...new Set(Object.values(keyByTopic))], dateKey);
        const misses = topics.filter((t: string) => !cached[keyByTopic[t]]);

        const generated: Record<string, any> = {};
        if (misses.length) {
          // 2. Generate the misses with the shared pipeline (identical to cron)
          const fresh = await generateTopics(misses, today);
          for (const [topic, content] of Object.entries(fresh)) {
            if (content?.stories?.length) generated[keyByTopic[topic]] = content;
          }

          // 3. Cache the real AI results for everyone else today
          await writeTopicCache(
            Object.entries(generated).map(([key, content]) => ({ key, content })),
            dateKey
          );

          // 4. Any miss the AI didn't cover → RSS-only fallback (not cached)
          const uncovered = misses.filter((t: string) => !generated[keyByTopic[t]]);
          if (uncovered.length) {
            const articles = await fetchArticlesForTopics(uncovered);
            const fb = fallbackBrief(uncovered, articles);
            fb.forEach((tg: any, i: number) => {
              const requested = uncovered[i];
              if (requested) generated[keyByTopic[requested]] = { ...tg, _fallback: true };
            });
          }
        }

        // 5. Assemble in the user's requested order; lead = a photo-fetchable story
        const allTopics: any[] = [];
        for (const t of topics) {
          const content = generated[keyByTopic[t]] ?? cached[keyByTopic[t]];
          if (content?.stories?.length) {
            const { _fallback, ...clean } = content;
            allTopics.push(promoteLeadWithPhoto({ ...clean, topic: t }));
          }
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
