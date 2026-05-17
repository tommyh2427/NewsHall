import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function callClaude(messages: any[], system: string, maxTokens: number, attempt = 0): Promise<any> {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      system,
      messages,
    }),
  });
  const data = await res.json();
  if (data.error?.type === "rate_limit_error" && attempt < 3) {
    await sleep((attempt + 1) * 20000);
    return callClaude(messages, system, maxTokens, attempt + 1);
  }
  return data;
}

function repairJson(txt: string): string {
  const s = txt.indexOf("{");
  if (s === -1) return txt;
  let fragment = txt.slice(s);
  let opens: string[] = [];
  let inStr = false, escaped = false;
  for (const ch of fragment) {
    if (escaped) { escaped = false; continue; }
    if (ch === "\\") { escaped = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{" || ch === "[") opens.push(ch);
    if (ch === "}" || ch === "]") opens.pop();
  }
  if (inStr) fragment += '"';
  for (let i = opens.length - 1; i >= 0; i--) fragment += opens[i] === "{" ? "}" : "]";
  return fragment;
}

const SYSTEM = `You are NewsHall's AI journalist. Surface what actually matters — stories a well-informed person genuinely needs to know this morning.

SOURCE RULES:
- General: AP, Reuters, BBC, NPR, PBS, ABC News, CBS News, NBC News, WSJ, Bloomberg, Axios, Guardian, C-SPAN
- Business/markets: WSJ, Bloomberg, Reuters, CNBC, Financial Times
- Tech: The Verge, Ars Technica, Wired, TechCrunch, Reuters
- Sports: ESPN, AP, The Athletic, CBS Sports
- Health/science: Reuters, AP, BBC, Nature, Harvard Health, Mayo Clinic

POLITICS — STRICT NEUTRALITY:
- ONLY: AP, Reuters, BBC, NPR, PBS, C-SPAN, ABC News, CBS News, NBC News
- NEVER: CNN, MSNBC, Fox News, Breitbart, Daily Wire, HuffPost, Salon, Vox, National Review, Newsmax, OAN
- Facts only — what happened, direct quotes only, no framing language

RELEVANCE: Only stories with genuine morning significance from the last 24 hours. 2-5 per topic based on what actually happened.

Output ONLY valid JSON.`;

async function generateTopic(topic: string, today: string): Promise<any | null> {
  const maxTokens = 3400;
  const userMsg = `Today is ${today}. Morning brief for: ${topic}.

Search for what actually happened in the last 24 hours. Select only stories with real significance. 1-2 sentence factual summaries.

Return ONLY raw JSON:
{"topics":[{"topic":"${topic}","stories":[{"headline":"headline","summary":"summary","source":"outlet","url":"https://url"}]}]}`;

  let messages: any[] = [{ role: "user", content: userMsg }];
  let data = await callClaude(messages, SYSTEM, maxTokens);
  let iter = 0;

  while (data.stop_reason === "tool_use" && iter < 10) {
    iter++;
    messages = [...messages, { role: "assistant", content: data.content }];
    const acks = (data.content || [])
      .filter((b: any) => b.type === "tool_use")
      .map((b: any) => ({ type: "tool_result", tool_use_id: b.id, content: "" }));
    if (!acks.length) break;
    messages = [...messages, { role: "user", content: acks }];
    data = await callClaude(messages, SYSTEM, maxTokens);
  }

  if (data.error) return null;

  const txt = (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();
  if (!txt) return null;

  const clean = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
  try {
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    const parsed = JSON.parse(clean.slice(s, e + 1));
    return Array.isArray(parsed.topics) ? parsed.topics[0] : null;
  } catch {
    try {
      const parsed = JSON.parse(repairJson(clean));
      return Array.isArray(parsed.topics) ? parsed.topics[0] : null;
    } catch {
      return null;
    }
  }
}

async function generateBriefForUser(topics: string[], today: string): Promise<any[]> {
  // All topics in parallel — total time = slowest single topic, not sum
  const results = await Promise.all(
    topics.map(t => generateTopic(t, today).catch(() => null))
  );
  return results.filter(Boolean);
}

// Concurrency limiter — run up to `limit` tasks at a time
async function pLimit<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
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
  const currentHour = now.getUTCHours();
  const today = now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  // Find all users whose delivery UTC hour matches right now
  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("user_id, topics, delivery_hour_utc")
    .eq("delivery_hour_utc", currentHour);

  if (error || !settings?.length) {
    return NextResponse.json({ ok: true, generated: 0, hour: currentHour });
  }

  let generated = 0;

  // Process up to 5 users in parallel to stay within Vercel limits
  const tasks = settings.map(setting => async () => {
    try {
      const topics = setting.topics as string[];
      if (!topics?.length) return;

      const briefTopics = await generateBriefForUser(topics, today);
      if (!briefTopics.length) return;

      const headline = `${briefTopics[0]?.topic || "Morning"} & ${briefTopics.length - 1} more`;
      const briefData = { headline, topics: briefTopics };

      // Upsert into briefs table
      await supabase.from("briefs").upsert({
        user_id: setting.user_id,
        content: briefData,
        generated_at: now.toISOString(),
      }, { onConflict: "user_id" });

      // Send push notification if subscription exists
      const { data: sub } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", setting.user_id)
        .single();

      if (sub) {
        const totalStories = briefTopics.reduce(
          (n: number, t: any) => n + (t.stories?.length || 0), 0
        );
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: "Your Morning Brief is ready ☀️",
            body: `${totalStories} stories across ${briefTopics.length} topics — tap to read.`,
            url: "/",
          })
        ).catch(() => {});
      }

      generated++;
    } catch {}
  });

  await pLimit(tasks, 5);

  return NextResponse.json({ ok: true, generated, hour: currentHour });
}
