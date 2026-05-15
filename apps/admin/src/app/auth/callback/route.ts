import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSupabase } from "@repo/database/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard/reservas";

  if (code) {
    const cookieStore = await cookies();
    const supabase = getServerSupabase(cookieStore);
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Security: Redirect directly to the requested path (e.g. /dashboard)
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("[Auth Callback] Exchange Error:", error.message);
    }
  }

  // If no code or error, redirect to login with error state
  return NextResponse.redirect(`${origin}/login?error=true`);
}
