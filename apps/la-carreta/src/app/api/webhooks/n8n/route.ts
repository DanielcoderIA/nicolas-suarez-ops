/**
 * POST /api/webhooks/n8n — Callback receptor from n8n
 *
 * Validates HMAC-SHA256 signature → updates reservation status.
 * api_specification.md: §Webhooks — `x-n8n-signature` header
 * executive_summary.md: POST /api/webhooks/n8n — HMAC secreto
 */

import { NextResponse } from "next/server";
import { getAdminSupabase } from "@repo/database/server";
import {
  validateHMAC,
  type N8NCallbackPayload,
} from "@repo/database/services/notifications";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-n8n-signature");
    const secret = process.env.N8N_WEBHOOK_SECRET;

    if (!secret) {
      console.error("[webhook/n8n] N8N_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Read raw body for HMAC verification
    const rawBody = await request.text();

    if (!signature || !validateHMAC(rawBody, signature, secret)) {
      console.warn("[webhook/n8n] ❌ Invalid HMAC signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the validated payload
    const payload: N8NCallbackPayload = JSON.parse(rawBody);

    if (!payload.reservationId) {
      return NextResponse.json(
        { error: "Missing reservationId" },
        { status: 400 }
      );
    }

    console.log(
      `[webhook/n8n] ✅ Callback received — reservationId: ${payload.reservationId} | timestamp: ${payload.timestamp}`
    );

    // Update reservation status using service role (bypasses RLS)
    const supabase = getAdminSupabase();

    const newStatus = payload.whatsappSent ? "notified" as const : "pending" as const;

    const { data, error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("id", payload.reservationId)
      .select("id, status")
      .single();

    if (error) {
      console.error(
        `[webhook/n8n] Failed to update reservation ${payload.reservationId}: ${error.message}`
      );
      return NextResponse.json(
        { error: "Failed to update reservation" },
        { status: 500 }
      );
    }

    console.log(
      `[webhook/n8n] 📝 Reservation ${data.id} → status: ${data.status}`
    );

    return NextResponse.json({
      success: true,
      reservationId: data.id,
      status: data.status,
    });
  } catch (error) {
    console.error(
      "[webhook/n8n] Unexpected error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
