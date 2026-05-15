import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSupabase } from "@repo/database/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = getServerSupabase(cookieStore);
  
  await supabase.auth.signOut();
  
  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/login`);
}
