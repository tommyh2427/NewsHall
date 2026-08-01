import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subscription, delivery_time, delivery_hour_utc, delivery_minute_utc, timezone, topics } = await req.json();

  // supabase-js resolves with { error } instead of throwing, so these must be
  // inspected. Reporting ok:true on a failed write is the worst case here: the
  // user is told notifications are on while the settings row the cron uses to
  // FIND them was never written, so they'd silently never receive a brief.
  const { error: subErr } = await supabase.from("push_subscriptions").upsert({
    user_id: user.id,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  // Save user settings including delivery_hour_utc so the cron can find this user
  const { error: setErr } = await supabase.from("user_settings").upsert({
    user_id: user.id,
    topics,
    delivery_time,
    delivery_hour_utc,
    delivery_minute_utc,
    timezone,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (subErr || setErr) {
    console.warn(`[newshall] push subscribe failed for ${user.id}: ${subErr?.message || ""} ${setErr?.message || ""}`.trim());
    return NextResponse.json({ error: "Could not save notification settings — please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
