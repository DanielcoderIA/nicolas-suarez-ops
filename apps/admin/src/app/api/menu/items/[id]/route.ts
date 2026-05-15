import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { getPublicSupabase } from "@repo/database/client";
import { toggleAdminMenuItem } from "@repo/database/queries/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = getServerSupabase(cookieStore) as unknown as ReturnType<typeof getPublicSupabase>;
    
    // Verify admin access
    const adminProfile = await getAdminProfile(cookieStore);
    if (!adminProfile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId } = body as { restaurantId: string };

    if (!restaurantId) {
      return NextResponse.json({ error: "Missing restaurantId" }, { status: 400 });
    }

    // Verify admin owns this restaurant (Multi-tenant check)
    if (!(adminProfile.restaurants || []).includes(restaurantId)) {
      return NextResponse.json({ error: "Forbidden: Not your restaurant" }, { status: 403 });
    }

    const updated = await toggleAdminMenuItem(supabase, id, restaurantId);

    // Note: To revalidate public sites, we'd ideally trigger a webhook here to the 
    // public next.js instances. For now, since they run on ISR (revalidate: 5), 
    // the public sites will automatically see the change within 5 seconds.

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/menu/items/[id]] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
