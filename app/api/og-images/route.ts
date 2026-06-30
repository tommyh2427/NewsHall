import { NextRequest, NextResponse } from "next/server";
import { fetchOgImage } from "@/app/lib/news-pipeline";

// Legacy client fallback: resolves article photos for briefs generated before
// lead images were baked server-side. New briefs carry tg.leadImage and skip this.
// Uses the shared scraper in news-pipeline.ts (single source of truth).
export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    if (!Array.isArray(urls) || !urls.length) return NextResponse.json({ images: {} });

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
