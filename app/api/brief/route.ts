import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

async function callClaude(messages: any[], system: string) {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system,
      messages,
    }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const { topics, fmt, today } = await req.json();

  if (!topics?.length) {
    return NextResponse.json({ error: "No topics provided" }, { status: 400 });
  }

  const fmtMap: Record<string, string> = {
    flash: "3 bullets per section.",
    concise: "4 bullets.",
    standard: "5 bullets.",
    deep: "6-7 bullets.",
  };

  const system =
    "You are NewsHall's AI journalist. Write in a sharp, direct style — WSJ/Bloomberg tone, zero filler. ONLY use sources with a strong reputation for straight factual news reporting. AVOID sources with strong editorial bias. For politics report ONLY verified facts. Use web_search. Extract real article URLs.";

  const userMsg = `Today is ${today}. Morning brief for ${topics.length} topics:\n${topics
    .map((t: string, i: number) => `${i + 1}. ${t}`)
    .join("\n")}

For each topic find 3-6 of the most important stories from the last 24 hours. Use only reputable straight-news sources. Include the real article URL for every story.

Output ONLY raw JSON:
{"headline":"5-6 word brief headline","topics":[{"topic":"name","stories":[{"headline":"headline of the story","summary":"one sentence, max 20 words, just the key fact","source":"outlet name","url":"https://real-article-url"}]}]}

Exactly ${topics.length} topic entries in order. Keep summaries tight — one sentence, the single most important fact only.`;

  try {
    let messages = [{ role: "user", content: userMsg }];
    let data = await callClaude(messages, system);
    let iter = 0;

    while (data.stop_reason === "tool_use" && iter < 20) {
      iter++;
      messages = [...messages, { role: "assistant", content: data.content }];
      const acks = (data.content || [])
        .filter((b: any) => b.type === "tool_use")
        .map((b: any) => ({ type: "tool_result", tool_use_id: b.id, content: "" }));
      if (!acks.length) break;
      messages = [...messages, { role: "user", content: acks }];
      data = await callClaude(messages, system);
    }

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const txt = (data.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();

    const stripped = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
    const s = stripped.indexOf("{");
    const e = stripped.lastIndexOf("}");
    if (s === -1 || e === -1) throw new Error("No JSON in response");

    const parsed = JSON.parse(stripped.slice(s, e + 1));
    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate brief" }, { status: 500 });
  }
}
