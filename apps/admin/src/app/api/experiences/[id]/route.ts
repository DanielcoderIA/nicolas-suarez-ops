import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { getPublicSupabase } from "@repo/database/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { restaurant_id, ...updates } = body; // restaurant_id needed for auth check

    if (!restaurant_id) {
      return NextResponse.json({ error: "Missing restaurant_id for validation" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = getServerSupabase(cookieStore) as unknown as ReturnType<typeof getPublicSupabase>;
    const adminProfile = await getAdminProfile(cookieStore);

    if (!adminProfile || !adminProfile.restaurants?.includes(restaurant_id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("experiences")
      .update(updates)
      .eq("id", id)
      .eq("restaurant_id", restaurant_id)
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify ownership and delete
    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id)
      .eq("restaurant_id", restaurantId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
