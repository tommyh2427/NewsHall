import { NextRequest, NextResponse } from "next/server";

// Ticker metadata
const TICKER_META: Record<string, { label: string; type: string }> = {
  "^GSPC":   { label: "S&P 500",  type: "index" },
  "^DJI":    { label: "Dow",      type: "index" },
  "^IXIC":   { label: "Nasdaq",   type: "index" },
  "GC=F":    { label: "Gold",     type: "commodity" },
  "CL=F":    { label: "Oil",      type: "commodity" },
  "BTC-USD": { label: "Bitcoin",  type: "crypto" },
  "ETH-USD": { label: "Ethereum", type: "crypto" },
};

async function fetchYahoo(sym: string): Promise<any> {
  // Use v8 chart endpoint with cache-busting and no-store
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1m&range=1d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error("No meta");
  return meta;
}

export async function GET(req: NextRequest) {
  const tickersParam = req.nextUrl.searchParams.get("tickers");
  if (!tickersParam) return NextResponse.json({ error: "Missing tickers" }, { status: 400 });

  const tickers = tickersParam.split(",").map(t => t.trim()).filter(Boolean);
  const results: Record<string, any> = {};

  await Promise.all(tickers.map(async (sym) => {
    try {
      const meta = await fetchYahoo(sym);
      const price = meta.regularMarketPrice ?? meta.postMarketPrice ?? null;
      const prev  = meta.chartPreviousClose ?? meta.previousClose ?? null;
      const open  = meta.regularMarketOpen ?? null;
      const meta2 = TICKER_META[sym];

      results[sym] = {
        sym,
        price,
        prev,
        open,
        label:       meta2?.label  ?? meta.shortName ?? sym,
        type:        meta2?.type   ?? "stock",
        marketState: meta.marketState ?? "CLOSED",
        currency:    meta.currency ?? "USD",
      };
    } catch (e: any) {
      results[sym] = { sym, error: true, msg: e.message };
    }
  }));

  return NextResponse.json(results, {
    headers: {
      // Cache for only 60 seconds so data stays fresh in the app
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
