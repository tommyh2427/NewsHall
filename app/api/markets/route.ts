import { NextRequest, NextResponse } from "next/server";

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
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(sym)}`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://finance.yahoo.com/",
            "Origin": "https://finance.yahoo.com",
          },
          next: { revalidate: 300 },
        });
        const data = await res.json();
        const quote = data?.quoteResponse?.result?.[0];
        if (quote) {
          results[sym] = {
            sym,
            price: quote.regularMarketPrice,
            prev: quote.regularMarketPreviousClose,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow,
            name: quote.shortName || quote.longName || sym,
            currency: quote.currency || "USD",
            marketState: quote.marketState,
          };
        } else {
          results[sym] = { sym, error: true };
        }
      } catch (e) {
        results[sym] = { sym, error: true };
      }
    })
  );

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
