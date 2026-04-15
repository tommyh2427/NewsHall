import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sport, today, yesterday, tomorrow } = await req.json();

  const prompt = `Give me ${sport} scores and schedule for ${yesterday}, ${today}, and ${tomorrow}. Include final scores, live games, and upcoming games with times. Return ONLY JSON:
{"id":"${sport.toLowerCase().replace(/\s+/g,'_')}","games":[{"home":"team","away":"team","homeScore":"score or null","awayScore":"score or null","status":"FINAL or LIVE or UPCOMING","detail":"time or score detail","venue":""}]}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: "You are a sports scores assistant. Return ONLY raw JSON, no markdown.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    // Handle tool use loop
    let messages: any[] = [{ role: "user", content: prompt }];
    let current = data;
    let iter = 0;

    while (current.stop_reason === "tool_use" && iter < 8) {
      iter++;
      messages = [...messages, { role: "assistant", content: current.content }];
      const acks = (current.content || [])
        .filter((b: any) => b.type === "tool_use")
        .map((b: any) => ({ type: "tool_result", tool_use_id: b.id, content: "" }));
      if (!acks.length) break;
      messages = [...messages, { role: "user", content: acks }];

      const r2 = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: "You are a sports scores assistant. Return ONLY raw JSON, no markdown.",
          messages,
        }),
      });
      current = await r2.json();
    }

    const txt = (current.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();

    const stripped = txt.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
    const s = stripped.indexOf("{");
    const e = stripped.lastIndexOf("}");
    if (s === -1 || e === -1) return NextResponse.json({ games: [] });

    const parsed = JSON.parse(stripped.slice(s, e + 1));
    return NextResponse.json({ games: parsed.games || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, games: [] }, { status: 500 });
  }
}
