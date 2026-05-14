import { NextRequest, NextResponse } from "next/server";

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
  if (data.error?.type === "rate_limit_error" && attempt < 2) {
    await sleep((attempt + 1) * 8000);
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

async function generateBatch(topics: string[], today: string): Promise<any[]> {
  const maxTokens = 3000 + topics.length * 400;

  const system = `You are NewsHall's AI journalist. Your job is to surface what actually matters — the stories a well-informed person genuinely needs to know this morning.

SOURCE RULES:
- General news: AP, Reuters, BBC, NPR, PBS NewsHour, ABC News, CBS News, NBC News, WSJ, Bloomberg, Axios, The Guardian, C-SPAN
- Business/markets: WSJ, Bloomberg, Reuters, CNBC, Financial Times, Axios
- Tech: The Verge, Ars Technica, Wired, TechCrunch, Reuters
- Sports: ESPN, AP, The Athletic, CBS Sports
- Health/science: Reuters, AP, BBC, Nature, New Scientist, Harvard Health, Mayo Clinic

POLITICAL & POLITICALLY ADJACENT TOPICS — STRICT NEUTRALITY RULES:
- ONLY use AP, Reuters, BBC, NPR, PBS, C-SPAN, ABC News, CBS News, NBC News
- NEVER use CNN, MSNBC, Fox News, Breitbart, Daily Wire, Daily Caller, HuffPost, Salon, Vox, The Atlantic, National Review, Newsmax, OAN for political stories
- Report ONLY verified facts — what happened, who said what (direct quotes only), official actions taken
- No framing language, no "slams", "blasts", "destroys", "defends" — just what occurred
- If a story only exists on partisan outlets, skip it

RELEVANCE RULES:
- Only include stories with genuine morning significance — something that actually happened or broke in the last 24 hours
- For broad topics (World News, US Politics) select 3-5 of the most impactful stories; fewer if little happened
- For niche topics (NBA, Formula 1) select 2-4 stories — actual games, trades, news, injuries
- Skip stories that are "think pieces", opinion, analysis, or editorial commentary
- Each story should add new information — no duplicates with different framing

Output ONLY valid JSON. Real URLs only.`;

  const userMsg = `Today is ${today}. Morning brief for ${topics.length} topics:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

For each topic: search for what actually happened in the last 24 hours. Select only the stories with real morning significance. Vary story count by how much genuinely happened (2-5 per topic). Each summary is 1-2 sentences, plain facts only, no opinion language.

Return ONLY raw JSON:
{"topics":[{"topic":"name","stories":[{"headline":"factual headline","summary":"1-2 sentence factual summary, key fact + context","source":"outlet name","url":"https://real-url"}]}]}

${topics.length} topic objects in order. Raw JSON only, no markdown.`;

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

  if (data.error) throw new Error(data.error.message);

  const txt = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("").trim();
  if (!txt) throw new Error("Empty response");

  const clean = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
  let parsed: any;
  try {
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s === -1 || e === -1) throw new Error("No JSON");
    parsed = JSON.parse(clean.slice(s, e + 1));
  } catch {
    parsed = JSON.parse(repairJson(clean));
  }

  return Array.isArray(parsed.topics) ? parsed.topics : [];
}

export async function POST(req: NextRequest) {
  const { topics, today } = await req.json();
  if (!topics?.length) return NextResponse.json({ error: "No topics provided" }, { status: 400 });

  try {
    // Run every topic in parallel — total time = slowest single topic, not sum of all
    const results = await Promise.all(
      topics.map((topic: string) =>
        generateBatch([topic], today).catch(() => [])
      )
    );

    const allTopics = results.flat();
    if (!allTopics.length) throw new Error("No topics generated");

    const headline = `${allTopics[0]?.topic || "Morning"} & ${allTopics.length - 1} more stories`;
    return NextResponse.json({ headline, topics: allTopics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate brief" }, { status: 500 });
  }
}
