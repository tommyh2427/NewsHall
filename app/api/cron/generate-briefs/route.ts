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
      tools: [{ type: "web_search_20250305", name: "web_search" }],
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

async function generateBriefForUser(topics: string[], today: string): Promise<any> {
  const BATCH_SIZE = 3;
  const batches: string[][] = [];
  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    batches.push(topics.slice(i, i + BATCH_SIZE));
  }

  const system = `You are NewsHall's AI journalist. Surface what actually matters — stories a well-informed person genuinely needs to know this morning.

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

  const allTopics: any[] = [];

  for (let i = 0; i < batches.length; i++) {
    if (i > 0) await sleep(2000);
    const batch = batches[i];
    const maxTokens = 3000 + batch.length * 400;
    const userMsg = `Today is ${today}. Morning brief for: ${batch.join(", ")}.

Search for what actually happened in the last 24 hours. Select only stories with real significance. 1-2 sentence factual summaries.

Return ONLY raw JSON:
{"topics":[{"topic":"name","stories":[{"headline":"headline","summary":"summary","source":"outlet","url":"https://url"}]}]}`;

    let messages: any[] = [{ role: "user", content: userMsg }];
    let data = await callClaude(messages, system, maxTokens);
    let iter = 0;

    while (data.stop_reason === "tool_use" && iter < 10) {
      iter++;
      messages = [...messages, { role: "assistant", content: data.content }];
      const acks = (data.content || [])
        .filter((b: any) => b.type === "tool_use")
        .map((b: any) => ({ type: "tool_result", tool_use_id: b.id, content: "" }));
      if (!acks.length) break;
      messages = [...messages, { role: "user", content: acks }];
      data = await callClaude(messages, system, maxTokens);
    }

    if (data.error) continue;

    const txt = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("").trim();
    if (!txt) continue;

    const clean = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
    try {
      const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
      const parsed = JSON.parse(clean.slice(s, e + 1));
      if (Array.isArray(parsed.topics)) allTopics.push(...parsed.topics);
    } catch {
      try {
        const parsed = JSON.parse(repairJson(clean));
        if (Array.isArray(parsed.topics)) allTopics.push(...parsed.topics);
      } catch {}
    }
  }

  return allTopics;
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
  const today = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  // Find users whose delivery time (stored as UTC hour) matches right now
  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("user_id, topics, delivery_hour_utc")
    .eq("delivery_hour_utc", currentHour);

  if (error || !settings?.length) {
    return NextResponse.json({ ok: true, generated: 0 });
  }

  let generated = 0;

  for (const setting of settings) {
    try {
      const topics = setting.topics as string[];
      if (!topics?.length) continue;

      const briefTopics = await generateBriefForUser(topics, today);
      if (!briefTopics.length) continue;

      const headline = `${briefTopics[0]?.topic || "Morning"} & ${briefTopics.length - 1} more`;
      const briefData = { headline, topics: briefTopics };

      // Save brief to database
      await supabase.from("briefs").upsert({
        user_id: setting.user_id,
        content: briefData,
        generated_at: now.toISOString(),
      }, { onConflict: "user_id" });

      // Send push notification
      const { data: sub } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", setting.user_id)
        .single();

      if (sub) {
        const totalStories = briefTopics.reduce((n: number, t: any) => n + (t.stories?.length || 0), 0);
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
      await sleep(1000);
    } catch {}
  }

  return NextResponse.json({ ok: true, generated });
}
