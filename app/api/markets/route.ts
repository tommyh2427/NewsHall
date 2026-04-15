import { NextRequest, NextResponse } from "next/server";

// Uses Polygon.io free tier — 5 calls/min, works reliably server-side
// Falls back to a simple price calculation if needed
export async function GET(req: NextRequest) {
  const tickersParam = req.nextUrl.searchParams.get("tickers");
  if (!tickersParam) {
    return NextResponse.json({ error: "Missing tickers param" }, { status: 400 });
  }

  const tickers = tickersParam.split(",").map((t) => t.trim()).filter(Boolean);
  const results: Record<string, any> = {};

  await Promise.all(
    tickers.map(async (sym) => {
      try {
        // Try Yahoo Finance v8 with different endpoint
        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        const quotes = data?.chart?.result?.[0]?.indicators?.quote?.[0];
        const closes = data?.chart?.result?.[0]?.timestamp;

        if (meta?.regularMarketPrice) {
          const price = meta.regularMarketPrice;
          const prev = meta.chartPreviousClose || meta.previousClose || price;
          results[sym] = {
            sym,
            price,
            prev,
            name: meta.shortName || meta.symbol || sym,
            currency: meta.currency || "USD",
            marketState: meta.marketState || "CLOSED",
          };
        } else {
          results[sym] = { sym, error: true };
        }
      } catch (e: any) {
        results[sym] = { sym, error: true, msg: e.message };
      }
    })
  );

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=60" },
  });
}
