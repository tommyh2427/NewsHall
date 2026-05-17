import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

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
      model: "claude-opus-4-7",
      max_tokens: maxTokens,
      tools: [{ type: "web_search_20260209", name: "web_search" }],
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

const SYSTEM = `You are NewsHall's chief briefing editor. Your job is to surface what a smart, busy person genuinely needs to know this morning — not a list of everything that happened, but the stories that actually matter and why.

SOURCE RULES:
- General news: AP, Reuters, BBC, NPR, PBS NewsHour, ABC News, CBS News, NBC News, WSJ, Bloomberg, Axios, The Guardian, C-SPAN
- Business/markets: WSJ, Bloomberg, Reuters, CNBC, Financial Times, Axios
- Tech: The Verge, Ars Technica, Wired, TechCrunch, Reuters
- Sports: ESPN, AP, The Athletic, CBS Sports
- Health/science: Reuters, AP, BBC, Nature, New Scientist, Harvard Health, Mayo Clinic

POLITICAL & POLITICALLY ADJACENT TOPICS — STRICT NEUTRALITY:
- ONLY use AP, Reuters, BBC, NPR, PBS, C-SPAN, ABC News, CBS News, NBC News
- NEVER use CNN, MSNBC, Fox News, Breitbart, Daily Wire, Daily Caller, HuffPost, Salon, Vox, The Atlantic, National Review, Newsmax, OAN
- Report ONLY verified facts — what happened, who said what (direct quotes only), official actions
- No framing language: no "slams", "blasts", "destroys", "defends" — just what occurred
- If a story only exists on partisan outlets, skip it

STORY SELECTION — BE RUTHLESS:
- Only stories with genuine morning significance that broke or developed in the last 24 hours
- For broad topics (World News, US Politics): the 3-5 most impactful stories, not everything
- For niche topics (NBA, Formula 1): 2-4 stories — actual games, trades, injuries, real news
- Skip think pieces, opinion, analysis, predictions, and "could this happen?" speculation
- Lead story must be the single most important development — rank by real-world impact
- No duplicates — if two stories are the same event with different angles, pick the better one

SUMMARY QUALITY:
- "summary": 1-2 sentences of the core facts — what happened and the most important detail
- "context": exactly 1 sentence explaining why this matters or what happens next — the "so what"
- Both fields must be concrete and specific. Never vague. Never "experts say this is significant."
- Bad context: "This development could have wide-ranging implications."
- Good context: "The ruling blocks the administration's plan to cut $4B in education funding by Friday."

Output ONLY valid JSON. Real URLs only. No markdown.`;

async function generateTopic(topic: string, today: string): Promise<any | null> {
  const maxTokens = 4000;
  const userMsg = `Today is ${today}. Morning brief for: ${topic}

Search for what actually happened in the last 24 hours. Be selective — only the stories a well-informed person genuinely needs to know this morning. Put the most impactful story first.

Return ONLY raw JSON:
{"topics":[{"topic":"${topic}","stories":[{"headline":"specific factual headline","summary":"1-2 sentences of core facts","context":"1 sentence: why this matters or what happens next","source":"outlet name","url":"https://real-url"}]}]}

Raw JSON only, no markdown.`;

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

  if (data.error) throw new Error(data.error.message);

  const txt = (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();
  if (!txt) return null;

  const clean = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
  try {
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s === -1 || e === -1) return null;
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

export async function POST(req: NextRequest) {
  const { topics, today } = await req.json();
  if (!topics?.length) return NextResponse.json({ error: "No topics provided" }, { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        const allTopics: any[] = [];

        await Promise.all(
          topics.map(async (topic: string) => {
            try {
              const result = await generateTopic(topic, today);
              if (result) {
                allTopics.push(result);
                send({ type: "topic", topic: result });
              }
            } catch {
              // Skip failed topics silently
            }
          })
        );

        if (!allTopics.length) {
          send({ type: "error", message: "No topics could be generated" });
        } else {
          const headline = `${allTopics[0]?.topic || "Morning"} & ${allTopics.length - 1} more stories`;
          send({ type: "done", headline });
        }
      } catch (err: any) {
        send({ type: "error", message: err?.message || "Failed to generate brief" });
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
