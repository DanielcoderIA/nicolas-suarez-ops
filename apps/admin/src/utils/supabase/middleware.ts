import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Updates the Supabase session and manages cookies during middleware execution.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // Update request cookies for downstream access
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        
        supabaseResponse = NextResponse.next({
          request,
        });

        // Apply updated cookies to the response
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            httpOnly: true, // Enforcement
            secure: true,
            sameSite: "strict",
          })
        );
      },
    },
  });

  // This will refresh the session if expired and update cookies automatically
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route protection logic
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/auth/callback");
  const isApiOrStatic = request.nextUrl.pathname.startsWith("/api") || request.nextUrl.pathname.includes(".");

  if (!isApiOrStatic && !isAuthRoute && !user) {
    // No user, redirect to login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (!isApiOrStatic && isAuthRoute && user && request.nextUrl.pathname === "/login") {
    // User already logged in, don't show login page
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard/reservas";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
