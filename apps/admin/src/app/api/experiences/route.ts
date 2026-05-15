import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { getPublicSupabase } from "@repo/database/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ error: "Missing restaurantId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = getServerSupabase(cookieStore) as unknown as ReturnType<typeof getPublicSupabase>;
    const adminProfile = await getAdminProfile(cookieStore);

    if (!adminProfile || !adminProfile.restaurants?.includes(restaurantId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { restaurant_id, title, description, date, capacity, price, photos, is_published } = body;

    if (!restaurant_id || !title || !date || capacity === undefined || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = getServerSupabase(cookieStore) as unknown as ReturnType<typeof getPublicSupabase>;
    const adminProfile = await getAdminProfile(cookieStore);

    if (!adminProfile || !adminProfile.restaurants?.includes(restaurant_id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("experiences")
      .insert({
        restaurant_id,
        title,
        description,
        date,
        capacity,
        price,
        photos: photos || [],
        is_published: is_published ?? false
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
