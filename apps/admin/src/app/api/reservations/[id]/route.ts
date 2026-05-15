import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { getPublicSupabase } from "@repo/database/client";
import { updateAdminReservationStatus } from "@repo/database/queries/admin";
import type { ReservationStatus } from "@repo/database/types";

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
    const { status, restaurantId } = body as { status: ReservationStatus, restaurantId: string };

    if (!status || !restaurantId) {
      return NextResponse.json({ error: "Missing status or restaurantId" }, { status: 400 });
    }

    // Verify admin owns this restaurant (Multi-tenant check)
    if (!(adminProfile.restaurants || []).includes(restaurantId)) {
      return NextResponse.json({ error: "Forbidden: Not your restaurant" }, { status: 403 });
    }

    const updated = await updateAdminReservationStatus(supabase, id, restaurantId, status);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/reservations/[id]] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
