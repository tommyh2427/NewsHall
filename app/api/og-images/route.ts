import { NextRequest, NextResponse } from "next/server";

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

// Known generic/stock images that outlets use as default OG — reject these
const GENERIC_IMAGE_PATTERNS = [
  /ichef\.bbci\.co\.uk\/news\/1024\/branded/i,   // BBC branded default
  /bbci\.co\.uk\/news\/nojsready/i,
  /static\.bbc\.co\.uk/i,
  /npr\.brightspotcdn\.com.*default/i,            // NPR default
  /apnews\.com\/hub\//i,                          // AP hub images
  // Match these only as whole tokens (delimited by / . _ -) so real photos like
  // "brandon-young-orioles.png" aren't falsely rejected by a "brand" substring.
  // Covers conventional branded/default share images from any outlet (Bloomberg,
  // WSJ, FT, etc.) without brittle per-outlet rules.
  /(?:^|[/._-])(?:logos?|icons?|avatar|placeholder|fallback|sprite|default|branded?|masthead|noimage|no-image|og-default|default-share|social-default|site-image|share-image|share-default|twitter-card|card-default)(?:[/._-]|$)/i,
];

function isUselessImage(url: string): boolean {
  return GENERIC_IMAGE_PATTERNS.some(p => p.test(url));
}

// Decode a Google News RSS article URL to get the real article URL.
// Google News embeds the actual URL as base64url-encoded protobuf bytes.
function decodeGoogleNewsUrl(gnUrl: string): string | null {
  try {
    const m = gnUrl.match(/\/articles\/([^?#]+)/);
    if (!m) return null;
    let encoded = m[1].replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) encoded += "=";
    const decoded = Buffer.from(encoded, "base64").toString("binary");
    // The real URL is embedded as a readable string inside the protobuf payload
    const start = Math.max(decoded.indexOf("https://"), decoded.indexOf("http://"));
    if (start === -1) return null;
    let end = start;
    while (end < decoded.length && decoded.charCodeAt(end) >= 32 && decoded.charCodeAt(end) < 127) end++;
    const url = decoded.slice(start, end).trim();
    return url.startsWith("http") ? url : null;
  } catch { return null; }
}

function resolveArticleUrl(url: string): string {
  if (!url.includes("news.google.com")) return url;
  return decodeGoogleNewsUrl(url) || url;
}

async function fetchOgImage(rawUrl: string): Promise<string | null> {
  try {
    // Decode Google News redirect URLs to get the real article URL
    const url = resolveArticleUrl(rawUrl);
    if (!url || !url.startsWith("http")) return null;
    // Skip if still a Google News URL (decode failed)
    if (url.includes("news.google.com")) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    // Stream only the first 25KB — enough to find the <head>
    const reader = res.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder();
    let html = "";
    while (html.length < 25000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      if (html.includes("</head>") || (html.includes("<body") && html.length > 8000)) break;
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
        if (!imgUrl || imgUrl.length < 10 || isUselessImage(imgUrl)) continue;
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

    // Fetch the real article photo for each story URL, in parallel.
    // Keyed by URL so every story (not just the lead) can show its own image.
    // Curated/gradient fallbacks are handled client-side.
    const results = await Promise.allSettled(
      urls.slice(0, 18).map(async (item: { url: string }) => {
        const articleUrl = item?.url || "";
        if (!articleUrl || !articleUrl.startsWith("http")) return null;
        const ogImage = await fetchOgImage(articleUrl);
        return ogImage ? [articleUrl, ogImage] : null;
      })
    );

    const images: Record<string, string> = {};
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        images[result.value[0] as string] = result.value[1] as string;
      }
    }

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: {} });
  }
}
