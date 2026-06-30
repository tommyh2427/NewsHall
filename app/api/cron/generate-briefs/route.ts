import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import {
  normalizeTopicKey, briefDateKey, readTopicCache, writeTopicCache,
  generateTopics, promoteLeadWithPhoto,
} from "@/app/lib/news-pipeline";

export const maxDuration = 300;

// PHASE 1 — pre-warm the shared cache: generate every unique topic exactly once.
// This is the only AI work. Uses the SAME pipeline as the live /api/brief route.
async function prewarmTopics(allKeys: string[], today: string, dateKey: string): Promise<void> {
  const unique = [...new Set(allKeys)];
  const cached = await readTopicCache(unique, dateKey);
  const misses = unique.filter(k => !cached[k]);
  if (!misses.length) return;

  // generateTopics batches + limits concurrency internally. Process in chunks so
  // results are cached incrementally (resilient if the run is cut short).
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

// PHASE 2 — assemble a user's brief from the now-warm cache (no generation here)
async function assembleFromCache(topics: string[], dateKey: string): Promise<any[]> {
  const keyByTopic: Record<string, string> = {};
  for (const t of topics) keyByTopic[t] = normalizeTopicKey(t);
  const cached = await readTopicCache([...new Set(Object.values(keyByTopic))], dateKey);
  return topics
    .map(t => { const c = cached[keyByTopic[t]]; return c?.stories?.length ? promoteLeadWithPhoto({ ...c, topic: t }) : null; })
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const today = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const dateKey = briefDateKey();
  const currentHour = now.getUTCHours();
  const DEFAULT_HOUR = 12; // ~7-8am US Eastern for users who never set a delivery time

  // HOURLY_MODE honors each user's chosen delivery time — but it requires the cron
  // to run hourly ("0 * * * *"), which needs Vercel Pro. On Hobby (daily cron) we
  // process everyone in the single daily run. To enable per-user delivery times:
  //   1) upgrade to Vercel Pro
  //   2) set the cron schedule in vercel.json to "0 * * * *"
  //   3) flip HOURLY_MODE to true
  const HOURLY_MODE = false;

  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("user_id, topics, delivery_hour_utc");
  if (error || !settings?.length) return NextResponse.json({ ok: true, generated: 0, hour: currentHour });

  const due = settings.filter((s: any) => {
    const topics = s.topics as string[];
    if (!topics?.length) return false;
    if (!HOURLY_MODE) return true;
    return (s.delivery_hour_utc ?? DEFAULT_HOUR) === currentHour;
  });
  if (!due.length) return NextResponse.json({ ok: true, generated: 0, hour: currentHour, due: 0 });

  // ── PHASE 1: pre-warm every unique topic once ──
  const allKeys: string[] = [];
  for (const s of due) for (const t of (s.topics as string[])) allKeys.push(normalizeTopicKey(t));
  await prewarmTopics(allKeys, today, dateKey);

  // ── PHASE 2: assemble + push per user, in parallel ──
  let generated = 0;
  const CONCURRENCY = 15;
  for (let i = 0; i < due.length; i += CONCURRENCY) {
    const chunk = due.slice(i, i + CONCURRENCY);
    await Promise.allSettled(chunk.map(async (setting: any) => {
      const topics = setting.topics as string[];
      const briefTopics = await assembleFromCache(topics, dateKey);
      if (!briefTopics.length) return;

      const extraCount = briefTopics.length - 1;
      const headline = extraCount > 0 ? `${briefTopics[0]?.topic} & ${extraCount} more` : briefTopics[0]?.topic || "Morning Brief";

      await supabase.from("briefs").upsert(
        { user_id: setting.user_id, content: { headline, topics: briefTopics }, generated_at: now.toISOString() },
        { onConflict: "user_id" }
      );

      const { data: sub } = await supabase.from("push_subscriptions")
        .select("endpoint, p256dh, auth").eq("user_id", setting.user_id).single();

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

  return NextResponse.json({ ok: true, generated, hour: currentHour, due: due.length });
}
