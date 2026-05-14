import { NextRequest, NextResponse } from "next/server";

// ESPN free scoreboard API — no key needed, just needs a server-side proxy for CORS
// Usage: GET /api/scores?sport=basketball/nba
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport");
  if (!sport) {
    return NextResponse.json({ error: "Missing sport param" }, { status: 400 });
  }

  try {
    const res = await fetch(`${ESPN_BASE}/${sport}/scoreboard`, {
      next: { revalidate: 60 }, // cache for 60 seconds, then revalidate
    });

    if (!res.ok) {
      return NextResponse.json({ error: "ESPN API error", status: res.status }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
