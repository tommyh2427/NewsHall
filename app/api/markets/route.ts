import { NextRequest, NextResponse } from "next/server";

// Usage: GET /api/markets?tickers=AAPL,MSFT,^GSPC,BTC-USD
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
        // Try Yahoo Finance v8 — free, no key needed
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`;
        const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;

        if (meta) {
          results[sym] = {
            sym,
            price: meta.regularMarketPrice,
            prev: meta.chartPreviousClose || meta.previousClose,
            high: meta.regularMarketDayHigh,
            low: meta.regularMarketDayLow,
            open: meta.regularMarketOpen,
            volume: meta.regularMarketVolume,
            name: meta.shortName || sym,
            currency: meta.currency || "USD",
            marketState: meta.marketState,
          };
        }
      } catch {
        results[sym] = { sym, error: true };
      }
    })
  );

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
