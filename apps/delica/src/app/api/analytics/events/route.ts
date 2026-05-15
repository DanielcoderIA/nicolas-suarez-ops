/**
 * POST /api/analytics/events — Registra evento analítico
 *
 * api_specification.md: §POST /api/analytics/events 🔑
 * Autenticado con ANALYTICS_INTERNAL_TOKEN (header Authorization).
 * Usa getAdminSupabase() (service role) — tabla analytics_events es append-only.
 *
 * ⚠️ Sin datos personales en ningún payload.
 */

import { NextResponse } from "next/server";
import { getAdminSupabase } from "@repo/database/server";

const VALID_EVENT_TYPES = [
  "page_view",
  "menu_view",
  "menu_item_view",
  "reservation_start",
  "reservation_complete",
  "cata_view",
  "cata_book_intent",
  "loyal_visitor_detected",
] as const;

type ValidEventType = (typeof VALID_EVENT_TYPES)[number];

function isValidEventType(value: string): value is ValidEventType {
  return (VALID_EVENT_TYPES as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  try {
    // Validate internal token
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.ANALYTICS_INTERNAL_TOKEN;

    if (!expectedToken) {
      console.error("[analytics] ANALYTICS_INTERNAL_TOKEN is not configured");
      return NextResponse.json(
        { error: "Analytics not configured" },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { restaurant_id, event_type, page, referrer } = body;

    // Validate required fields
    if (!restaurant_id || typeof restaurant_id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid restaurant_id" },
        { status: 400 }
      );
    }

    if (!event_type || !isValidEventType(event_type)) {
      return NextResponse.json(
        {
          error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Insert using service role (analytics_events is service_role only)
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("analytics_events")
      .insert({
        restaurant_id,
        event_type,
        page: typeof page === "string" ? page : null,
        referrer: typeof referrer === "string" ? referrer : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`[analytics] Insert failed: ${error.message}`);
      return NextResponse.json(
        { error: "Failed to record event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error(
      "[analytics] Unexpected error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
