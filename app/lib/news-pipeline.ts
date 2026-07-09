// ── Shared news pipeline ─────────────────────────────────────────────────────
// The SINGLE source of truth for fetching, cleaning, generating, and caching
// briefs. Both /api/brief (live) and /api/cron (scheduled) import from here, so
// the two can never drift — whichever generates a topic first caches the exact
// same high-quality result for everyone.
import { createClient } from "@supabase/supabase-js";

export interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  image?: string; // real article photo (provided directly by GNews — no scraping)
}

// ── Cache ────────────────────────────────────────────────────────────────────
// Intraday freshness window: a monotonic 6-hour block id (UTC-epoch based),
// folded into the cache key so a topic regenerates ~4× a day instead of being
// frozen at its first-of-day snapshot. Opening the app in the evening now pulls
// evening news, not the 7am version. Monotonic ids make "previous window" simply
// id-1 with no day-boundary math — used for the stale-while-revalidate fallback
// so a user is never forced to wait for a cold generation at a window boundary.
const WINDOW_MS = 6 * 60 * 60 * 1000;
export function cacheWindow(): number {
  return Math.floor(Date.now() / WINDOW_MS);
}

function topicKeyForWindow(topic: string, window: number): string {
  return `${topic.toLowerCase().trim().replace(/\s+/g, " ")}#${window}`;
}

export function normalizeTopicKey(topic: string): string {
  return topicKeyForWindow(topic, cacheWindow());
}

// The same topic's key for the PREVIOUS 6h window — served instantly (≤6h old)
// while the current window regenerates in the background.
export function previousWindowKey(topic: string): string {
  return topicKeyForWindow(topic, cacheWindow() - 1);
}

export function briefDateKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function supa() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function readTopicCache(keys: string[], dateKey: string): Promise<Record<string, any>> {
  const sb = supa();
  if (!sb || !keys.length) return {};
  try {
    const { data, error } = await sb
      .from("topic_briefs")
      .select("topic_key, content")
      .eq("brief_date", dateKey)
      .in("topic_key", keys);
    if (error || !data) return {};
    const map: Record<string, any> = {};
    for (const row of data) map[row.topic_key] = row.content;
    return map;
  } catch { return {}; }
}

// Read arbitrary cache keys (which already embed their window) across the last
// couple of days — used for stale-while-revalidate, where we look up both the
// current-window and previous-window keys in one round-trip. Returns newest row
// per key. Not filtered to a single brief_date so a previous window that spans
// midnight is still found.
export async function readTopicCacheKeys(keys: string[]): Promise<Record<string, any>> {
  const sb = supa();
  if (!sb || !keys.length) return {};
  try {
    const since = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { data, error } = await sb
      .from("topic_briefs")
      .select("topic_key, content, generated_at")
      .in("topic_key", keys)
      .gte("brief_date", since)
      .order("generated_at", { ascending: false });
    if (error || !data) return {};
    const map: Record<string, any> = {};
    for (const row of data) if (!(row.topic_key in map)) map[row.topic_key] = row.content; // newest wins
    return map;
  } catch { return {}; }
}

export async function writeTopicCache(entries: { key: string; content: any }[], dateKey: string): Promise<void> {
  const sb = supa();
  if (!sb || !entries.length) return;
  try {
    await sb.from("topic_briefs").upsert(
      entries.map(e => ({
        topic_key: e.key,
        brief_date: dateKey,
        content: e.content,
        generated_at: new Date().toISOString(),
      })),
      { onConflict: "topic_key,brief_date" }
    );
  } catch { /* table may not exist yet — caching is best-effort */ }
}

// ── Rate limiting (IP-based, best-effort) ────────────────────────────────────
// Blocks abuse loops (spamming novel topics to burn Groq quota) without touching
// real usage. Best-effort: if the brief_rate table doesn't exist, never blocks.
// Returns true if the request should be REJECTED.
export async function isRateLimited(ip: string, limit = 15, windowSec = 60): Promise<boolean> {
  const sb = supa();
  if (!sb || !ip || ip === "unknown") return false;
  try {
    const since = new Date(Date.now() - windowSec * 1000).toISOString();
    const { count } = await sb
      .from("brief_rate")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("ts", since);
    if ((count ?? 0) >= limit) return true;
    // Record this request without blocking the response on the write
    void sb.from("brief_rate").insert({ ip }).then(() => {}, () => {});
    return false;
  } catch { return false; } // table missing / error → don't block real users
}

// ── Feeds ────────────────────────────────────────────────────────────────────
export const TOPIC_FEEDS: Record<string, string[]> = {
  "world news":        ["https://feeds.apnews.com/rss/apf-intlnews","http://feeds.bbci.co.uk/news/world/rss.xml","https://www.theguardian.com/world/rss","https://feeds.npr.org/1004/rss.xml"],
  "us politics":       ["https://feeds.apnews.com/rss/apf-politics","https://feeds.npr.org/1014/rss.xml","http://feeds.bbci.co.uk/news/rss.xml"],
  "science":           ["https://feeds.apnews.com/rss/apf-science","http://feeds.bbci.co.uk/news/science_and_environment/rss.xml","https://www.theguardian.com/science/rss","https://feeds.npr.org/1007/rss.xml"],
  "climate":           ["https://feeds.apnews.com/rss/apf-science","http://feeds.bbci.co.uk/news/science_and_environment/rss.xml","https://www.theguardian.com/environment/climate-crisis/rss"],
  "health & wellness": ["https://feeds.apnews.com/rss/apf-Health","http://feeds.bbci.co.uk/news/health/rss.xml","https://feeds.npr.org/1128/rss.xml"],
  "mental health":     ["http://feeds.bbci.co.uk/news/health/rss.xml","https://feeds.npr.org/1128/rss.xml"],
  "nutrition":         ["http://feeds.bbci.co.uk/news/health/rss.xml","https://feeds.npr.org/1128/rss.xml"],
  "fitness":           ["http://feeds.bbci.co.uk/news/health/rss.xml","https://feeds.npr.org/1128/rss.xml"],
  "tech & ai":         ["https://www.theverge.com/rss/index.xml","https://feeds.arstechnica.com/arstechnica/index","https://techcrunch.com/feed/"],
  "business":          ["https://feeds.apnews.com/rss/apf-business","http://feeds.bbci.co.uk/news/business/rss.xml","https://feeds.npr.org/1006/rss.xml"],
  "stock market":      ["https://feeds.apnews.com/rss/apf-business","http://feeds.bbci.co.uk/news/business/rss.xml"],
  "crypto":            ["https://feeds.arstechnica.com/arstechnica/index","https://techcrunch.com/feed/"],
  "personal finance":  ["https://feeds.apnews.com/rss/apf-business","https://feeds.npr.org/1006/rss.xml"],
  "real estate":       ["https://feeds.apnews.com/rss/apf-business","http://feeds.bbci.co.uk/news/business/rss.xml"],
  "startups":          ["https://techcrunch.com/feed/","https://feeds.arstechnica.com/arstechnica/index"],
  "deals & m&a":       ["https://feeds.apnews.com/rss/apf-business","http://feeds.bbci.co.uk/news/business/rss.xml","https://techcrunch.com/feed/"],
  "women in business": ["https://feeds.apnews.com/rss/apf-business","http://feeds.bbci.co.uk/news/business/rss.xml","https://techcrunch.com/feed/"],
  "auto & evs":        ["https://feeds.arstechnica.com/arstechnica/index","https://techcrunch.com/feed/","https://www.theverge.com/rss/index.xml"],
  "gaming":            ["https://feeds.arstechnica.com/arstechnica/index","https://www.theverge.com/rss/index.xml","https://techcrunch.com/feed/"],
  "entertainment":     ["https://feeds.apnews.com/rss/apf-entertainment","http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"],
  "film & tv":         ["https://feeds.apnews.com/rss/apf-entertainment","http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"],
  "music":             ["https://feeds.apnews.com/rss/apf-entertainment","http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"],
  "celebrity news":    ["https://feeds.apnews.com/rss/apf-entertainment","http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"],
  "fashion & style":   ["http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml","https://feeds.apnews.com/rss/apf-entertainment"],
  "beauty":            ["http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml","https://feeds.apnews.com/rss/apf-entertainment"],
  "books":             ["http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml","https://www.theguardian.com/books/rss","https://feeds.npr.org/1007/rss.xml"],
  "sports":            ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/"],
  "nfl":               ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/nfl/","https://www.espn.com/espn/rss/nfl/news"],
  "nba":               ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/nba/","https://www.espn.com/espn/rss/nba/news"],
  "mlb":               ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/mlb/","https://www.espn.com/espn/rss/mlb/news"],
  "nhl":               ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/nhl/","https://www.espn.com/espn/rss/nhl/news"],
  "soccer":            ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/soccer/","https://www.espn.com/espn/rss/soccer/news"],
  "golf":              ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/golf/","https://www.espn.com/espn/rss/golf/news"],
  "tennis":            ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/tennis/","https://www.espn.com/espn/rss/tennis/news"],
  "formula 1":         ["https://feeds.apnews.com/rss/apf-sports","https://www.espn.com/espn/rss/rpm/news"],
  "mma / ufc":         ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/mma/","https://www.espn.com/espn/rss/mma/news"],
  "wnba":              ["https://feeds.apnews.com/rss/apf-sports","https://www.cbssports.com/rss/headlines/wnba/","https://www.espn.com/espn/rss/wnba/news"],
  "travel":            ["https://feeds.apnews.com/rss/apf-travel","http://feeds.bbci.co.uk/news/rss.xml"],
  "food & dining":     ["http://feeds.bbci.co.uk/news/rss.xml","https://feeds.apnews.com/rss/apf-oddities"],
  "home & design":     ["http://feeds.bbci.co.uk/news/rss.xml","https://feeds.apnews.com/rss/apf-oddities"],
  "education":         ["https://feeds.apnews.com/rss/apf-education","https://feeds.npr.org/1013/rss.xml"],
  "parenting":         ["https://feeds.apnews.com/rss/apf-Health","https://feeds.npr.org/1128/rss.xml"],
  "relationships":     ["https://feeds.npr.org/1128/rss.xml","http://feeds.bbci.co.uk/news/rss.xml"],
};

export function googleNewsUrl(topic: string): string {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
}

// ── RSS parsing (cable-partisan brands blocked for neutrality) ───────────────
const BLOCKED_DOMAINS = /(cnn\.com|foxnews\.com|foxbusiness\.com|msnbc\.com|breitbart|dailywire|huffpost|newsmax|oann|infowars)/i;
const BLOCKED_SOURCES = /^(cnn|fox news|fox business|fox|msnbc|breitbart|the daily wire|huffpost|newsmax|oan|infowars)$/i;

export function sourceName(url: string): string {
  if (url.includes("news.google.com")) return "Google News";
  if (url.includes("apnews"))          return "AP";
  if (url.includes("bbc"))             return "BBC";
  if (url.includes("reuters"))         return "Reuters";
  if (url.includes("theguardian"))     return "The Guardian";
  if (url.includes("npr.org"))         return "NPR";
  if (url.includes("espn"))            return "ESPN";
  if (url.includes("cbssports"))       return "CBS Sports";
  if (url.includes("theverge"))        return "The Verge";
  if (url.includes("arstechnica"))     return "Ars Technica";
  if (url.includes("techcrunch"))      return "TechCrunch";
  if (url.includes("wired"))           return "Wired";
  try { return new URL(url).hostname.replace("www.","").replace("feeds.","").replace("rss.","").replace("moxie.",""); }
  catch { return "News"; }
}

export function parseRSS(xml: string, feedUrl: string): Article[] {
  const articles: Article[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const isGoogleNews = feedUrl.includes("news.google.com");
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag: string) => {
      const r = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i");
      return block.match(r)?.[1]?.trim()
        .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
        .replace(/&quot;/g,'"').replace(/&#39;/g,"'") || "";
    };
    const link = get("link") || block.match(/<link[^>]*href="([^"]+)"/i)?.[1]?.trim() || "";
    let title = get("title");
    const pub = get("pubDate") || get("dc:date");
    if (!title || !link) continue;
    if (/espn\.com\/.*\/(game|scores|gamecast|recap)\//i.test(link)) continue;
    const pubMs = pub ? new Date(pub).getTime() : Date.now();
    if (pubMs < cutoff) continue;

    let source = sourceName(feedUrl);
    if (isGoogleNews) {
      const sep = title.lastIndexOf(" - ");
      if (sep > 20) { source = title.slice(sep + 3).trim(); title = title.slice(0, sep).trim(); }
    }
    if (BLOCKED_DOMAINS.test(link) || BLOCKED_SOURCES.test(source.trim())) continue;

    // Google News "descriptions" are just the headline repeated with the publisher
    // glued on — feeding that to the AI produces duplicated headlines. Drop them.
    const description = isGoogleNews ? "" : get("description").replace(/<[^>]+>/g,"").slice(0, 400);
    articles.push({ title, link, description, pubDate: pub, source });
  }
  return articles;
}

export async function fetchFeed(url: string): Promise<Article[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "NewsHall/1.0 RSS Reader", "Accept": "application/rss+xml,application/xml,text/xml" },
      signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined,
    });
    if (!res.ok) return [];
    return parseRSS(await res.text(), url);
  } catch { return []; }
}

// ── GNews search (real article URLs + real article PHOTOS, no scraping) ──────
// GNews indexes articles and returns each one's image directly, so nothing can
// block us. Activates automatically when GNEWS_API_KEY is set; no-op otherwise.
export async function fetchGNews(topic: string): Promise<Article[]> {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&country=us&max=10&sortby=publishedAt&apikey=${key}`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return (data.articles || [])
      .map((a: any) => ({
        title: (a.title || "").trim(),
        link: a.url || "",
        description: (a.description || "").replace(/<[^>]+>/g, "").slice(0, 400),
        pubDate: a.publishedAt || "",
        source: a.source?.name || "News",
        // Drop logo/branded "images" so they don't ship as a fake photo
        image: (a.image && !isUselessImage(a.image)) ? a.image : undefined,
      }))
      .filter((a: Article) =>
        a.title && a.link &&
        new Date(a.pubDate || 0).getTime() >= cutoff &&
        !BLOCKED_DOMAINS.test(a.link) &&
        !BLOCKED_SOURCES.test(a.source.trim())
      );
  } catch { return []; }
}

// ── Quality pipeline ─────────────────────────────────────────────────────────
export function capBySource(articles: Article[], maxPerSource = 4): Article[] {
  const counts: Record<string, number> = {};
  return articles.filter(a => {
    const src = a.source.toLowerCase();
    counts[src] = (counts[src] || 0) + 1;
    return counts[src] <= maxPerSource;
  });
}

const JUNK_TITLE = /\b(watch live|live updates?|live blog|liveblog|in pictures|photos? of|photo gallery|quiz|crossword|podcast|how to watch|where to watch|betting odds|best bets|odds, picks|prediction|fantasy|horoscope|newsletter|sign up|subscribe|brief\b.*sponsored|advertisement)\b/i;
const JUNK_LINK = /\/(videos?|live|podcasts?|gallery|galleries|quiz|crossword|newsletters?|betting|odds|fantasy|games?\/)/i;
function isJunk(a: Article): boolean {
  if (!a.title || a.title.length < 16) return true;
  if (JUNK_TITLE.test(a.title)) return true;
  if (JUNK_LINK.test(a.link)) return true;
  return false;
}

export function sourceRank(source: string): number {
  const s = source.toLowerCase();
  if (/(^|\b)(ap|associated press|reuters)(\b|$)/.test(s)) return 0;
  if (/(bbc|npr|pbs|the guardian|bloomberg|c-span)/.test(s)) return 1;
  if (/(ars technica|the verge|techcrunch|wired|cbs sports|espn|axios|the athletic|wsj|wall street journal|financial times|cnbc|the economist|nature|science)/.test(s)) return 2;
  return 3;
}

const STOPWORDS = new Set("the a an of to in on for and or but with at by from as is are was were be been has have had will would could should after before over under amid into out up down off new latest report says said tells told amid plans plan more than that this these those who what when where why how".split(" "));
function titleWords(title: string): Set<string> {
  return new Set(
    title.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
      .filter(w => w.length > 3 && !STOPWORDS.has(w))
  );
}

function dedupeStories(articles: Article[]): Article[] {
  const kept: { a: Article; words: Set<string> }[] = [];
  for (const a of articles) {
    const words = titleWords(a.title);
    let dupIdx = -1;
    for (let i = 0; i < kept.length; i++) {
      const shared = [...words].filter(w => kept[i].words.has(w)).length;
      const minLen = Math.min(words.size, kept[i].words.size);
      if (minLen >= 3 && shared >= Math.max(3, Math.ceil(minLen * 0.55))) { dupIdx = i; break; }
    }
    if (dupIdx === -1) kept.push({ a, words });
    else if (sourceRank(a.source) < sourceRank(kept[dupIdx].a.source)) kept[dupIdx] = { a, words };
  }
  return kept.map(k => k.a);
}

// Freshness tier: 0 = last 8h, 1 = last 18h, 2 = older. Recency dominates source
// prestige so today's news always leads; within a tier we still prefer the wires.
function freshnessTier(pubDate: string): number {
  const ageH = (Date.now() - new Date(pubDate || 0).getTime()) / 3.6e6;
  if (ageH <= 8) return 0;
  if (ageH <= 18) return 1;
  return 2;
}

export function cleanArticles(articles: Article[]): Article[] {
  const filtered = articles.filter(a => !isJunk(a));
  const deduped = dedupeStories(filtered);
  return deduped.sort((x, y) => {
    const t = freshnessTier(x.pubDate) - freshnessTier(y.pubDate);
    if (t !== 0) return t;                                   // newer tier first
    const r = sourceRank(x.source) - sourceRank(y.source);
    if (r !== 0) return r;                                   // then better source
    return new Date(y.pubDate || 0).getTime() - new Date(x.pubDate || 0).getTime();
  });
}

export function sampleBySource(articles: Article[], total = 6): Article[] {
  const buckets: Record<string, Article[]> = {};
  for (const a of articles) {
    const k = a.source.toLowerCase();
    (buckets[k] = buckets[k] || []).push(a);
  }
  const sources = Object.values(buckets).sort((a, b) => sourceRank(a[0].source) - sourceRank(b[0].source));
  const out: Article[] = [];
  let round = 0;
  while (out.length < total) {
    let added = 0;
    for (const src of sources) {
      if (round < src.length && out.length < total) { out.push(src[round]); added++; }
    }
    round++;
    if (added === 0) break;
  }
  return out;
}

// ── Lead photo selection ─────────────────────────────────────────────────────
function isPhotoFetchable(u: string): boolean {
  if (!u || !u.startsWith("http")) return false;
  if (u.includes("news.google.com")) return false;
  if (/espn\.com/i.test(u)) return false;
  return true;
}

export function promoteLeadWithPhoto(topic: any): any {
  const stories = Array.isArray(topic?.stories) ? topic.stories : [];
  if (stories.length < 2) return topic;
  // Best lead: a story that already carries its real photo (GNews); otherwise
  // one whose URL we can scrape a photo from.
  let idx = stories.findIndex((s: any) => s?.image);
  if (idx === -1) idx = stories.findIndex((s: any) => isPhotoFetchable(s?.url));
  if (idx > 0) {
    const lead = stories[idx];
    topic.stories = [lead, ...stories.filter((_: any, i: number) => i !== idx)];
  }
  return topic;
}

// ── Article photo resolution (server-side; baked into the cached brief) ───────
const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};
const GENERIC_IMAGE_PATTERNS = [
  /ichef\.bbci\.co\.uk\/news\/1024\/branded/i,
  /bbci\.co\.uk\/news\/nojsready/i,
  /static\.bbc\.co\.uk/i,
  /npr\.brightspotcdn\.com.*default/i,
  /apnews\.com\/hub\//i,
  /(?:^|[/._-])(?:logos?|icons?|avatar|placeholder|fallback|sprite|default|branded?|masthead|noimage|no-image|og-default|default-share|social-default|site-image|share-image|share-default|twitter-card|card-default)(?:[/._-]|$)/i,
];
function isUselessImage(url: string): boolean { return GENERIC_IMAGE_PATTERNS.some(p => p.test(url)); }

// Decode Google News RSS URLs (base64 protobuf) to the real article URL
function decodeGoogleNewsUrl(gnUrl: string): string | null {
  try {
    const m = gnUrl.match(/\/articles\/([^?#]+)/);
    if (!m) return null;
    let encoded = m[1].replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) encoded += "=";
    const decoded = Buffer.from(encoded, "base64").toString("binary");
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

// Scrape an article's og:image (handles Google News decode, rejects logos/defaults)
export async function fetchOgImage(rawUrl: string): Promise<string | null> {
  try {
    const url = resolveArticleUrl(rawUrl);
    if (!url || !url.startsWith("http") || url.includes("news.google.com")) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(url, { signal: controller.signal, headers: BROWSER_HEADERS, redirect: "follow" });
    clearTimeout(timeout);
    if (!res.ok) return null;
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
  } catch { return null; }
}

// ── AI image fallback (when no real article photo exists) ────────────────────
// Generates a clean editorial illustration of the TOPIC (abstract/conceptual —
// never a fabricated photo of real people or events, so it stays honest), hosts
// it in Supabase Storage, and reuses it forever (generate once per topic).
function topicImagePath(topic: string): string {
  return (normalizeTopicKey(topic).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "general") + ".png";
}

async function geminiGenerateImage(topic: string): Promise<Buffer | null> {
  const gKey = process.env.GEMINI_API_KEY;
  if (!gKey) return null;
  const prompt = `A clean, minimalist editorial illustration representing the news subject "${topic}". Deep navy and charcoal background, soft cinematic lighting, premium magazine-cover aesthetic, conceptual and abstract. Absolutely no text, no words, no logos, no watermarks, no real or identifiable people's faces.`;
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${gKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["IMAGE"] } }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined,
    });
    if (!r.ok) return null;
    const d = await r.json();
    const part = (d.candidates?.[0]?.content?.parts || []).find((p: any) => p.inlineData?.data);
    return part ? Buffer.from(part.inlineData.data, "base64") : null;
  } catch { return null; }
}

async function getOrCreateTopicImage(topic: string): Promise<string | null> {
  const sb = supa();
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!sb || !baseUrl) return null;
  const path = topicImagePath(topic);
  const publicUrl = `${baseUrl}/storage/v1/object/public/topic-images/${path}`;
  // Reuse if we've already made this topic's image (generate once, reuse forever)
  try { const head = await fetch(publicUrl, { method: "HEAD" }); if (head.ok) return publicUrl; } catch {}
  // Generate + upload
  const png = await geminiGenerateImage(topic);
  if (!png) return null;
  try {
    const { error } = await sb.storage.from("topic-images").upload(path, png, { contentType: "image/png", upsert: true });
    return error ? null : publicUrl;
  } catch { return null; }
}

// Resolve the lead image — REAL photos only (no AI art):
// 1. the article's own photo from GNews (instant, unblockable)
// 2. scraped og:image from the article page
// 3. nothing → client shows the curated topic photo
async function attachLeadImage(topic: any, topicName: string): Promise<any> {
  promoteLeadWithPhoto(topic);
  const lead = topic?.stories?.[0];
  let img: string | null = lead?.image || null;
  if (!img && lead?.url) img = await fetchOgImage(lead.url);
  if (img) topic.leadImage = img;
  return topic;
}

// ── Fetch + clean articles for a set of topics ───────────────────────────────
export async function fetchArticlesForTopics(topics: string[]): Promise<Record<string, Article[]>> {
  const feedUrls = new Set<string>();
  const topicFeedMap: Record<string, string[]> = {};
  for (const topic of topics) {
    const key = normalizeTopicKey(topic);
    const feeds = [...(TOPIC_FEEDS[key] ?? []), googleNewsUrl(topic)];
    topicFeedMap[topic] = feeds;
    feeds.forEach(f => feedUrls.add(f));
  }
  // RSS feeds + GNews (when key set) in parallel. GNews articles carry direct
  // URLs and real photos, so they're preferred where they overlap.
  const [feedResults, gnewsResults] = await Promise.all([
    Promise.all([...feedUrls].map(async url => ({ url, articles: await fetchFeed(url) }))),
    Promise.all(topics.map(async t => ({ topic: t, articles: await fetchGNews(t) }))),
  ]);
  const feedMap: Record<string, Article[]> = {};
  for (const { url, articles } of feedResults) feedMap[url] = articles;
  const gnewsMap: Record<string, Article[]> = {};
  for (const { topic, articles } of gnewsResults) gnewsMap[topic] = articles;

  const byTopic: Record<string, Article[]> = {};
  for (const topic of topics) {
    const seen = new Set<string>();
    const all: Article[] = [];
    // GNews first (direct URLs + images), then RSS
    for (const a of gnewsMap[topic] || []) {
      if (!seen.has(a.link)) { seen.add(a.link); all.push(a); }
    }
    for (const url of topicFeedMap[topic]) {
      for (const a of feedMap[url] || []) {
        if (!seen.has(a.link)) { seen.add(a.link); all.push(a); }
      }
    }
    // IDENTICAL cleaning everywhere: junk filter → dedupe → authority sort → cap
    byTopic[topic] = capBySource(cleanArticles(all), 4);
  }
  return byTopic;
}

// RSS-only fallback so a brief always renders even if the AI is unavailable
export function fallbackBrief(topics: string[], articlesByTopic: Record<string, Article[]>): any[] {
  return topics.map(topic => {
    const arts = (articlesByTopic[topic] || []).slice(0, 3);
    if (!arts.length) return null;
    return {
      topic,
      stories: arts.map(a => ({
        headline: a.title,
        summary: a.description && a.description.length > 30 ? a.description : "",
        source: a.source,
        url: a.link,
      })),
      watch_for: [],
    };
  }).filter(Boolean);
}

function repairJson(txt: string): string {
  const s = txt.indexOf("{");
  if (s === -1) return txt;
  let fragment = txt.slice(s);
  let opens: string[] = [];
  let inStr = false, escaped = false;
  for (const ch of fragment) {
    if (escaped) { escaped = false; continue; }
    if (ch === "\\") { escaped = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{" || ch === "[") opens.push(ch);
    if (ch === "}" || ch === "]") opens.pop();
  }
  if (inStr) fragment += '"';
  for (let i = opens.length - 1; i >= 0; i--) fragment += opens[i] === "{" ? "}" : "]";
  return fragment;
}

const SYSTEM_PROMPT = `You are a senior news editor at a wire service. Select the 2-4 most newsworthy stories per topic.

SUMMARY GOAL: In 1-3 TIGHT sentences, tell the reader what happened and the specifics that matter. PULL THE SPECIFICS FROM THE "Details" TEXT under each article — that's where the real facts are (numbers, names, causes, consequences). The summary must go beyond the headline using those details. If an article has no Details and the headline is all you have, one honest sentence is fine — but whenever Details exist, mine them for the concrete facts. Fewer strong sentences beat padded ones. Never pad, never invent facts that aren't in the source.

SUMMARY RULES (this is where quality lives — follow exactly):
- NO attribution, NO dateline. Never write "as reported by X", "according to Y", the outlet's name, or "on July 9, 2026". The source and date are shown separately. Open with the news itself.
- NO filler closing sentence. Never end on an obvious or empty statement. These closers (and anything like them) are BANNED: "improved their record", "expecting large crowds", "a major venue in the area", "sheds light on", "brings new challenges and rewards", "marks a significant development", "the process is open to residents", "will take place throughout the summer".
- Every sentence must contain a concrete anchor — a number, name, place, score, dollar figure, or specific next step. A sentence with no new specific gets CUT, not softened.
- Do not restate the headline in different words. Add what the headline leaves out.
- BANNED phrases: "this event matters", "this could impact", "raising questions", "the overall market", "steps can be taken", "advisors recommend", "experts say".

EXAMPLE (kill the padding):
BAD:  "The Chicago Cubs beat the Baltimore Orioles 9-7 on July 8, 2026, as reported by ESPN. The game was played at Wrigley Field. The Cubs' win improved their record."
GOOD: "The Cubs beat the Orioles 9-7 at Wrigley Field." — one clean sentence; drop the dateline, the attribution, and the obvious closer. Only add a second sentence if the source gives real detail (a decisive inning, a standings shift, an injury), never to fill space.
- Use exact URLs from the list. Never invent URLs. Facts only. No opinion.
- Headlines: write ONE clean headline per story. Never repeat the headline text, never append the publisher/outlet name, never copy dash-separated suffixes from the source title.
- "watch_for": For EACH topic, add 1-2 forward-looking items written so a casual reader instantly gets it. 15-28 words. Every item MUST include: (1) the SPECIFIC named event — never a vague placeholder, (2) WHEN it happens — the exact date or day, or the narrowest window you can state, (3) a few words of plain-English context on what it is and why it matters. Always spell out acronyms and names.
  BANNED (too vague — never write these): "the next major tournament", "an upcoming election", "the next meeting", "later this month", "a key report soon". If you can't name the actual event and its date, DO NOT include the item.
  GOOD: "The Open Championship, golf's oldest major, runs July 17-20 at Royal Portrush in Northern Ireland — the year's final men's major.", "Fed interest-rate decision Wednesday, July 30 — a cut would lower borrowing costs on mortgages and credit cards.", "PGA FedEx Cup playoffs begin August 7, a three-tournament series deciding the season champion and a $25M prize."
  If nothing concrete and dated is upcoming for a topic, use an empty array rather than a vague guess.
- Respond ONLY with valid JSON:
{"topics":[{"topic":"Topic Name","stories":[{"headline":"string","summary":"string","source":"string","url":"string"}],"watch_for":["short upcoming item"]}]}`;

// ── Unified AI generation ────────────────────────────────────────────────────
// Fetches + cleans articles for the given topics, then asks Groq to select and
// summarize. Returns a map keyed by the EXACT topic strings passed in. Empty map
// if the AI is unavailable (caller can fall back to RSS-only).
// Public entry point: generate any number of topics, automatically split into
// small batches so a single Groq response can never truncate. Batches run with
// limited concurrency. Results keyed by the EXACT topic strings passed in.
// In-flight coalescing: if another concurrent request is already generating a
// topic in this same cache slot, join its result instead of re-fetching + re-
// generating. Cheap, dependency-free protection against a cache stampede when a
// new slot opens (keyed by normalizeTopicKey, which already includes the slot).
// Best-effort within a warm instance — the cron path is separately stampede-safe.
const inflightTopics = new Map<string, Promise<Record<string, any>>>();

export async function generateTopics(topics: string[], today: string): Promise<Record<string, any>> {
  if (!topics.length) return {};
  const out: Record<string, any> = {};
  const fresh: string[] = [];
  const joined: Promise<void>[] = [];

  for (const t of topics) {
    const existing = inflightTopics.get(normalizeTopicKey(t));
    if (existing) joined.push(existing.then(m => { if (m[t] !== undefined) out[t] = m[t]; }).catch(() => {}));
    else fresh.push(t);
  }

  if (fresh.length) {
    const genPromise = generateFresh(fresh, today);
    // Register a per-topic slice so concurrent callers can coalesce onto this work,
    // then self-clean once settled so the map never grows unbounded or goes stale.
    for (const t of fresh) {
      const k = normalizeTopicKey(t);
      const slice = genPromise.then(m => ({ [t]: m[t] }));
      inflightTopics.set(k, slice);
      void slice.finally(() => { if (inflightTopics.get(k) === slice) inflightTopics.delete(k); });
    }
    Object.assign(out, await genPromise);
  }

  await Promise.all(joined);
  return out;
}

// Actual batched generation (no coalescing) — wrapped by generateTopics above.
async function generateFresh(topics: string[], today: string): Promise<Record<string, any>> {
  const BATCH = 5;        // max topics per Groq call — keeps responses well within limits
  const CONCURRENCY = 3;  // batches in flight at once
  const batches: string[][] = [];
  for (let i = 0; i < topics.length; i += BATCH) batches.push(topics.slice(i, i + BATCH));

  const out: Record<string, any> = {};
  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const group = batches.slice(i, i + CONCURRENCY);
    const results = await Promise.all(group.map(b => generateBatch(b, today).catch(() => ({}))));
    for (const r of results) Object.assign(out, r);
  }
  return out;
}

// Normalize a URL for comparison (ignore protocol, www, trailing slash, query)
function normUrl(u: string): string {
  try {
    const x = new URL(u);
    return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/+$/, "")).toLowerCase();
  } catch { return (u || "").toLowerCase().replace(/[?#].*$/, "").replace(/\/+$/, ""); }
}

// Clean a headline: collapse "Headline — Headline Publisher" duplication (a
// Google News artifact the AI sometimes copies) and strip trailing source names.
export function sanitizeHeadline(raw: string, source?: string): string {
  let t = (raw || "").replace(/\s+/g, " ").trim();
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  // Collapse duplicated halves around a dash separator, repeat until stable
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (const sep of [" — ", " – ", " - "]) {
      const i = t.indexOf(sep);
      if (i > 10) {
        const a = t.slice(0, i).trim(), b = t.slice(i + sep.length).trim();
        const na = norm(a), nb = norm(b);
        if (na && nb && (nb.startsWith(na) || na.startsWith(nb))) {
          t = na.length <= nb.length ? a : b; changed = true; break;
        }
      }
    }
    if (!changed) break;
  }
  // Strip a trailing publisher name ("... The College Fix", "... WPRI.com")
  if (source) {
    const ns = norm(source), nt = norm(t);
    if (ns && nt.endsWith(" " + ns)) t = t.slice(0, t.toLowerCase().lastIndexOf(source.toLowerCase())).replace(/[\s\-–—|:]+$/, "").trim();
  }
  return t;
}

// Guard against AI URL hallucination: every story's URL must trace back to a real
// article we actually showed Groq. If the URL matches one, keep it. If not, repair
// by matching the headline to a source article and using ITS real URL + source.
// If neither works, drop the story (never ship a fabricated link).
function validateStories(stories: any[], articles: Article[]): any[] {
  if (!Array.isArray(stories) || !articles.length) return [];
  const byUrl = new Map(articles.map(a => [normUrl(a.link), a]));
  const out: any[] = [];
  for (const s of stories) {
    if (!s?.headline) continue;
    s.headline = sanitizeHeadline(s.headline, s.source);
    const exact = byUrl.get(normUrl(s.url || ""));
    if (exact) { out.push({ ...s, url: exact.link, source: s.source || exact.source, image: exact.image }); continue; }
    // Repair: find the source article whose title best matches the headline
    const sw = titleWords(s.headline);
    let best: Article | null = null, bestShared = 0;
    for (const a of articles) {
      const aw = titleWords(a.title);
      const shared = [...sw].filter(w => aw.has(w)).length;
      const minLen = Math.min(sw.size, aw.size);
      if (minLen >= 3 && shared >= Math.max(3, Math.ceil(minLen * 0.5)) && shared > bestShared) {
        best = a; bestShared = shared;
      }
    }
    if (best) out.push({ ...s, url: best.link, source: best.source, image: best.image });
    // else: unverifiable URL — drop it rather than ship a hallucinated link
  }
  return out;
}

// Get a JSON-text completion. Primary: Gemini 2.5 Flash (great quality, generous
// limits, thinking off for speed). Falls back to Groq if Gemini is unavailable so
// briefs never break. Returns "" only if every provider fails.
async function fetchModelText(systemPrompt: string, userMsg: string): Promise<string> {
  // ── Primary: Gemini 2.5 Flash ──
  const gKey = process.env.GEMINI_API_KEY;
  if (gKey) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userMsg }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 5000,
            thinkingConfig: { thinkingBudget: 0 }, // skip "thinking" — faster + cheaper for this task
          },
        }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined,
      });
      if (r.ok) {
        const d = await r.json();
        const t = (d.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "").trim();
        if (t) return t;
      }
    } catch { /* fall through to Groq */ }
  }

  // ── Fallback: Groq (llama-3.3-70b → 8b on rate limit) ──
  const callGroq = (model: string) => fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      max_tokens: 4096,
      temperature: 0.15,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMsg }],
    }),
  });
  try {
    let res = await callGroq("llama-3.3-70b-versatile");
    if (res.status === 429) res = await callGroq("llama-3.1-8b-instant");
    if (res.status === 429) { await new Promise(r => setTimeout(r, 1500)); res = await callGroq("llama-3.1-8b-instant"); }
    if (res.ok) { const d = await res.json(); return (d.choices?.[0]?.message?.content || "").trim(); }
  } catch { /* both providers failed */ }
  return "";
}

// One generation call for a small batch of topics (≤5).
async function generateBatch(topics: string[], today: string): Promise<Record<string, any>> {
  if (!topics.length) return {};
  const articlesByTopic = await fetchArticlesForTopics(topics);

  const shownByTopic: Record<string, Article[]> = {};
  const sections = topics.map(topic => {
    const sampled = sampleBySource(articlesByTopic[topic] || [], 6);
    shownByTopic[topic] = sampled;
    const lines = sampled.map((a, i) =>
      `[${i + 1}] (${a.source}) ${a.title}${a.description ? "\n   Details: " + a.description.slice(0, 350) : ""}\n   URL: ${a.link}`
    ).join("\n");
    return `TOPIC: ${topic}\n${lines || "No articles found"}`;
  }).join("\n\n---\n\n");

  const USER_MSG = `Today is ${today}.\n\n${sections}\n\nReturn JSON with all ${topics.length} topics.`;

  const out: Record<string, any> = {};
  const txt = await fetchModelText(SYSTEM_PROMPT, USER_MSG);
  if (!txt) return out;

  try {
    const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
    let parsed: any;
    try { parsed = JSON.parse(s !== -1 && e !== -1 ? txt.slice(s, e + 1) : txt); }
    catch { parsed = JSON.parse(repairJson(txt)); }
    const arr = Array.isArray(parsed?.topics) ? parsed.topics : [];
    // Match each returned topic back to the REQUESTED topic by name — never by
    // array index, because Groq can drop or reorder topics, which would shift
    // every subsequent topic onto the wrong content.
    const requestedByKey = new Map<string, string>(topics.map(t => [normalizeTopicKey(t), t]));
    const sameCount = arr.length === topics.length;
    const usedKeys = new Set<string>();
    arr.forEach((tg: any, i: number) => {
      if (!tg?.stories?.length) return;
      let key = tg.topic ? requestedByKey.get(normalizeTopicKey(tg.topic)) : undefined;
      // Positional fallback only when the AI returned exactly as many topics as
      // requested (so index alignment is actually safe) and the slot is unused.
      if (!key && sameCount && !usedKeys.has(topics[i])) key = topics[i];
      if (key && !usedKeys.has(key)) {
        // Validate every story URL against the articles we actually showed Groq
        const stories = validateStories(tg.stories, shownByTopic[key] || []);
        if (stories.length) { out[key] = { ...tg, stories }; usedKeys.add(key); }
      }
    });
  } catch { /* parse failed — return what we have (caller falls back) */ }

  // Resolve + bake each topic's lead photo server-side so it's cached with the
  // brief — no client scraping, no image swap, consistent every load.
  await Promise.all(Object.keys(out).map(async key => { out[key] = await attachLeadImage(out[key], key); }));

  return out;
}
