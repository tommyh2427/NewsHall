import { NextRequest, NextResponse, after } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import webpush from "web-push";
import {
  normalizeTopicKey, briefDateKey, readTopicCache, writeTopicCache,
  generateTopics, promoteLeadWithPhoto,
} from "@/app/lib/news-pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

// ── Scaling model ────────────────────────────────────────────────────────────
// The cron is split into an ORCHESTRATOR (GET, hit by Vercel's scheduler) and
// WORKERS (POST, invoked by the orchestrator). Each worker handles a slice of
// users in its OWN 300s serverless invocation, so total capacity scales with the
// number of workers, not a single function's time budget. Workers ack instantly
// and do their work in `after()`, so the orchestrator only pays dispatch time and
// can fan out to thousands of users without timing out.
const USERS_PER_WORKER = 40;      // users each worker handles (comfortably fits 300s)
const WORKER_WAVE = 25;           // worker invocations dispatched per parallel wave
const POPULAR_PREWARM = 40;       // hottest shared topics warmed once before fan-out
const ASSEMBLE_CONCURRENCY = 15;  // per-user assembly/push parallelism inside a worker

type UserRow = { user_id: string; topics: string[]; delivery_hour_utc?: number };

// ── Shared helpers ───────────────────────────────────────────────────────────
function supaAdmin(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function setupPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

// Pre-warm the shared cache: generate each unique topic exactly once. This is the
// only AI work; identical to the live route so cache entries never drift. Chunked
// so results are written incrementally (resilient if the invocation is cut short).
async function prewarmTopics(allKeys: string[], today: string, dateKey: string): Promise<void> {
  const unique = [...new Set(allKeys)];
  if (!unique.length) return;
  const cached = await readTopicCache(unique, dateKey);
  const misses = unique.filter(k => !cached[k]);
  if (!misses.length) return;

  const CHUNK = 15;
  for (let i = 0; i < misses.length; i += CHUNK) {
    const slice = misses.slice(i, i + CHUNK);
    const generated = await generateTopics(slice, today).catch(() => ({}));
    const entries = Object.entries(generated)
      .filter(([, content]: any) => content?.stories?.length)
      .map(([key, content]) => ({ key, content }));
    if (entries.length) await writeTopicCache(entries, dateKey);
  }
}

// Note: generateTopics/prewarmTopics key the cache via normalizeTopicKey, which
// already normalizes the topic — so we pass RAW topics here, not pre-normalized
// keys, and let the pipeline do the (slot-aware) normalization consistently.
async function assembleFromCache(topics: string[], dateKey: string): Promise<any[]> {
  const keyByTopic: Record<string, string> = {};
  for (const t of topics) keyByTopic[t] = normalizeTopicKey(t);
  const cached = await readTopicCache([...new Set(Object.values(keyByTopic))], dateKey);
  return topics
    .map(t => { const c = cached[keyByTopic[t]]; return c?.stories?.length ? promoteLeadWithPhoto({ ...c, topic: t }) : null; })
    .filter(Boolean);
}

// Assemble + persist + push for a batch of users. Run by workers (and by the
// orchestrator itself when the whole run fits in one batch).
async function processUsers(users: UserRow[], today: string, dateKey: string): Promise<number> {
  const supabase = supaAdmin();
  const nowISO = new Date().toISOString();

  // Warm any topics in this batch not already cached (the long tail beyond the
  // globally pre-warmed popular set). Popular topics are already cache hits here.
  const topicPool: string[] = [];
  for (const u of users) for (const t of (u.topics || [])) topicPool.push(t);
  await prewarmTopics(topicPool.map(normalizeTopicKey), today, dateKey);

  let generated = 0;
  for (let i = 0; i < users.length; i += ASSEMBLE_CONCURRENCY) {
    const chunk = users.slice(i, i + ASSEMBLE_CONCURRENCY);
    await Promise.allSettled(chunk.map(async (u) => {
      const briefTopics = await assembleFromCache(u.topics, dateKey);
      if (!briefTopics.length) return;

      const extraCount = briefTopics.length - 1;
      const headline = extraCount > 0
        ? `${briefTopics[0]?.topic} & ${extraCount} more`
        : briefTopics[0]?.topic || "Morning Brief";

      await supabase.from("briefs").upsert(
        { user_id: u.user_id, content: { headline, topics: briefTopics }, generated_at: nowISO },
        { onConflict: "user_id" }
      );

      const { data: sub } = await supabase.from("push_subscriptions")
        .select("endpoint, p256dh, auth").eq("user_id", u.user_id).maybeSingle();

      if (sub) {
        const totalStories = briefTopics.reduce((n: number, t: any) => n + (t.stories?.length || 0), 0);
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: "Your Morning Brief is ready", body: `${totalStories} stories across ${briefTopics.length} topics.`, url: "/" })
        ).catch(() => {});
      }
      generated++;
    }));
  }
  return generated;
}

// ── ORCHESTRATOR — Vercel's scheduler hits this ──────────────────────────────
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setupPush();
  const supabase = supaAdmin();

  const now = new Date();
  const today = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const dateKey = briefDateKey();
  const currentHour = now.getUTCHours();
  const DEFAULT_HOUR = 12; // ~7-8am US Eastern for users who never set a delivery time

  // HOURLY_MODE honors each user's chosen delivery time — requires an hourly cron
  // ("0 * * * *", Vercel Pro). On the daily Hobby cron we process everyone at once.
  const HOURLY_MODE = false;

  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("user_id, topics, delivery_hour_utc");
  if (error || !settings?.length) return NextResponse.json({ ok: true, generated: 0, hour: currentHour });

  const due: UserRow[] = (settings as UserRow[]).filter((s) => {
    if (!s.topics?.length) return false;
    if (!HOURLY_MODE) return true;
    return (s.delivery_hour_utc ?? DEFAULT_HOUR) === currentHour;
  });
  if (!due.length) return NextResponse.json({ ok: true, generated: 0, hour: currentHour, due: 0 });

  // Phase 1 — warm the hottest shared topics ONCE, before fan-out. Because workers
  // run in parallel, without this the most popular topics would race and get
  // generated redundantly across workers; warming them first makes them cache hits.
  const popularity = new Map<string, number>();
  for (const u of due) for (const t of u.topics) {
    const k = normalizeTopicKey(t);
    popularity.set(k, (popularity.get(k) || 0) + 1);
  }
  const popularKeys = [...popularity.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, POPULAR_PREWARM).map(([k]) => k);
  await prewarmTopics(popularKeys, today, dateKey);

  // Phase 2 — fan out users into worker invocations. Small runs (single batch) or
  // fan-out disabled → just process inline; no point paying a self-call round-trip.
  const batches: UserRow[][] = [];
  for (let i = 0; i < due.length; i += USERS_PER_WORKER) batches.push(due.slice(i, i + USERS_PER_WORKER));

  const fanoutEnabled = process.env.CRON_FANOUT !== "false";
  if (!fanoutEnabled || batches.length <= 1) {
    const generated = await processUsers(due, today, dateKey);
    return NextResponse.json({ ok: true, generated, users: due.length, workers: 0, hour: currentHour });
  }

  // Each worker acks instantly and processes in after(), so these fetches resolve
  // fast — the orchestrator only pays dispatch time, not the workers' full runtime.
  const origin = new URL(req.url).origin;
  const auth = `Bearer ${process.env.CRON_SECRET}`;
  let dispatched = 0;
  for (let i = 0; i < batches.length; i += WORKER_WAVE) {
    const wave = batches.slice(i, i + WORKER_WAVE);
    const acks = await Promise.allSettled(wave.map(users =>
      fetch(`${origin}/api/cron/generate-briefs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: auth },
        body: JSON.stringify({ users, today, dateKey }),
      })
    ));
    dispatched += acks.filter(a => a.status === "fulfilled" && (a.value as Response).ok).length;
  }

  return NextResponse.json({
    ok: true, dispatchedWorkers: dispatched, totalWorkers: batches.length,
    users: due.length, hour: currentHour,
  });
}

// ── WORKER — invoked by the orchestrator, one batch of users ─────────────────
// Acks immediately, then does the real work in after() within its own 300s
// invocation. This is what makes fan-out scale: N workers = N× the time budget.
export async function POST(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { users: UserRow[]; today: string; dateKey: string };
  try { payload = await req.json(); } catch { return NextResponse.json({ error: "Bad payload" }, { status: 400 }); }
  const { users, today, dateKey } = payload;
  if (!Array.isArray(users) || !users.length) return NextResponse.json({ ok: true, accepted: 0 });

  setupPush();
  after(async () => {
    try { await processUsers(users, today, dateKey); } catch { /* next slot re-runs */ }
  });

  return NextResponse.json({ ok: true, accepted: users.length });
}
