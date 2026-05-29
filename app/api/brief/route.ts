import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

const SYSTEM = `You are NewsHall's chief briefing editor. Use Google Search to find today's top stories and return structured JSON.

SOURCE RULES:
- General/politics: AP, Reuters, BBC, NPR, PBS, ABC News, CBS News, NBC News, WSJ, Bloomberg, Axios, C-SPAN only
- NEVER use: CNN, MSNBC, Fox News, Breitbart, Daily Wire, HuffPost, Salon, Vox, National Review, Newsmax, OAN
- Business/markets: WSJ, Bloomberg, Reuters, CNBC, Financial Times
- Tech: The Verge, Ars Technica, Wired, TechCrunch, Reuters
- Sports: ESPN, AP, The Athletic, CBS Sports
- Health/science: Reuters, AP, BBC, Nature, Harvard Health

STORY RULES:
- Only stories from the last 24 hours with real significance
- 2-4 stories per topic, most impactful first
- Facts only — no opinion, no framing language like "slams" or "blasts"
- "summary": 1-2 factual sentences of what happened
- "watch_for": 1-3 short items (max 12 words) for concrete upcoming events — votes, games, deadlines only. Omit if nothing concrete.

Output ONLY valid JSON, no markdown fences, no explanation.`;

async function generateAllTopics(topics: string[], today: string, attempt = 0): Promise<any[]> {
  const topicList = topics.map(t => `"${t}"`).join(", ");

  const userMsg = `Today is ${today}. Search Google News for today's top stories for each of these topics: ${topicList}

Output ONLY this JSON — one object per topic in the same order as requested:
{"topics":[{"topic":"Topic Name","stories":[{"headline":"factual headline","summary":"1-2 sentences of facts","source":"outlet name","url":"https://..."}],"watch_for":["upcoming event"]}]}

2-4 stories per topic. Omit watch_for if nothing concrete is upcoming.`;

  const res = await fetch(`${GEMINI_API}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1,
      },
    }),
  });

  if (res.status === 429 && attempt < 3) {
    await sleep((attempt + 1) * 3000);
    return generateAllTopics(topics, today, attempt + 1);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const txt = (data.candidates?.[0]?.content?.parts || [])
    .map((p: any) => p.text || "")
    .join("")
    .trim();

  if (!txt) return [];

  const clean = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();

  const normalize = (raw: any[]): any[] =>
    raw.map((t, i) => ({ ...t, topic: topics[i] || t.topic }));

  try {
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s === -1 || e === -1) return [];
    const parsed = JSON.parse(clean.slice(s, e + 1));
    return Array.isArray(parsed.topics) ? normalize(parsed.topics) : [];
  } catch {
    try {
      const parsed = JSON.parse(repairJson(clean));
      return Array.isArray(parsed.topics) ? normalize(parsed.topics) : [];
    } catch {
      return [];
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
        const allTopics = await generateAllTopics(topics, today);

        if (!allTopics.length) {
          send({ type: "error", message: "No topics could be generated" });
        } else {
          for (const topic of allTopics) {
            send({ type: "topic", topic });
          }
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
