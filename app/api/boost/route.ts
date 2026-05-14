import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

async function callClaude(messages: any[]) {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system:
        "You are a health and wellness research assistant. Find real evidence-based tips from reputable sources like Harvard Health, Mayo Clinic, NHS, Healthline, or peer-reviewed studies. Return only raw JSON with no markdown.",
      messages,
    }),
  });
  return res.json();
}

export async function GET(req: NextRequest) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const prompt = `Today is ${today}. Search for a real research-backed health tip, a practical daily habit, and a meaningful personal challenge from a reputable source (Harvard Health, Mayo Clinic, NHS, Healthline, Psychology Today, or similar). Also find a well-known motivational quote that fits the theme.

Return ONLY this JSON:
{"quote":"quote text","author":"Author Name","tip":{"text":"2-3 sentence evidence-based tip","source":"source name","url":"https://url"},"habit":{"text":"2-3 sentence practical habit","source":"source name","url":"https://url"},"challenge":{"text":"specific actionable challenge for today","source":"source name","url":"https://url"}}`;

  try {
    let messages = [{ role: "user", content: prompt }];
    let data = await callClaude(messages);
    let iter = 0;

    while (data.stop_reason === "tool_use" && iter < 10) {
      iter++;
      messages = [...messages, { role: "assistant", content: data.content }];
      const acks = (data.content || [])
        .filter((b: any) => b.type === "tool_use")
        .map((b: any) => ({ type: "tool_result", tool_use_id: b.id, content: "" }));
      if (!acks.length) break;
      messages = [...messages, { role: "user", content: acks }];
      data = await callClaude(messages);
    }

    const txt = (data.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();

    const stripped = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
    const s = stripped.indexOf("{");
    const e = stripped.lastIndexOf("}");
    if (s === -1 || e === -1) throw new Error("No JSON");

    const parsed = JSON.parse(stripped.slice(s, e + 1));
    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
