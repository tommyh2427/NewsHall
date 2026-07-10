import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Supabase SSR requires this on every page request: it refreshes the auth token
// and reconciles the (chunked) session cookies between request and response.
// Without it, the browser client doesn't reliably see the session on the first
// load after the OAuth callback redirect — which forced users to sign in twice.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do NOT insert logic between client creation and getUser(): it refreshes the
  // session and writes the reconciled cookies onto `response`.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on page navigations only. Exclude Next internals, static assets, and
  // /api/* (the auth callback does its own exchange; /api/brief has no user
  // session to refresh, so we skip the extra Supabase round-trip there).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|manifest|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml)$).*)",
  ],
};
