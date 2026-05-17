import { NextRequest, NextResponse } from "next/server";

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
};

// Curated Unsplash fallbacks per topic — always looks great
const TOPIC_IMAGES: Record<string, string> = {
  "world news":      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=85",
  "us politics":     "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=85",
  "politics":        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=85",
  "tech & ai":       "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=85",
  "technology":      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=85",
  "markets":         "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=85",
  "stock market":    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=85",
  "business":        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=85",
  "nba":             "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=85",
  "nfl":             "https://images.unsplash.com/photo-1567459169568-e1b872a93ec0?w=900&q=85",
  "mlb":             "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=900&q=85",
  "nhl":             "https://images.unsplash.com/photo-1580420919917-b3e0e0b8943c?w=900&q=85",
  "sports":          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=85",
  "soccer":          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=85",
  "formula 1":       "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=85",
  "formula one":     "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=85",
  "health":          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=85",
  "health & wellness":"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=85",
  "science":         "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&q=85",
  "climate":         "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=900&q=85",
  "entertainment":   "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=900&q=85",
  "film & tv":       "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=85",
  "music":           "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=85",
  "crypto":          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=900&q=85",
  "real estate":     "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=85",
  "travel":          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=85",
  "fashion & style": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85",
  "food & dining":   "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85",
  "personal finance":"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&q=85",
  "mental health":   "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=85",
  "mma / ufc":       "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=85",
  "mma":             "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=85",
  "ufc":             "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=85",
  "golf":            "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=900&q=85",
  "tennis":          "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=900&q=85",
  "education":       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=85",
  "auto & evs":      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
};

function isLogoLikeUrl(url: string): boolean {
  return /logo|icon|avatar|badge|brand|default|placeholder|fallback|og-default|\/img\/logo|site-image/i.test(url);
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const reader = res.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder();
    let html = "";
    while (html.length < 20000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      if (html.includes("</head>") || (html.includes("<body") && html.length > 5000)) break;
    }
    reader.cancel().catch(() => {});

    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const imgUrl = match[1].trim();
        if (!imgUrl || imgUrl.length < 10 || isLogoLikeUrl(imgUrl)) continue;
        if (imgUrl.startsWith("//")) return "https:" + imgUrl;
        if (imgUrl.startsWith("/")) return new URL(url).origin + imgUrl;
        if (imgUrl.startsWith("http")) return imgUrl;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    if (!Array.isArray(urls) || !urls.length) return NextResponse.json({ images: {} });

    const results = await Promise.all(
      urls.slice(0, 15).map(async (item: { url: string; topic: string }) => {
        const url = item?.url || "";
        const topic = (item?.topic || "").toLowerCase().trim();
        const fallback = TOPIC_IMAGES[topic] || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=85";

        if (url.startsWith("http")) {
          const ogImage = await fetchOgImage(url);
          if (ogImage) return [topic, ogImage];
        }
        return [topic, fallback];
      })
    );

    const images: Record<string, string> = {};
    for (const [topic, image] of results) {
      if (topic && image) images[topic as string] = image as string;
    }

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: {} });
  }
}
