import { NextResponse } from "next/server";
import { createReservation } from "@repo/database/queries/reservations";
import type { ReservationInsert } from "@repo/database/types";

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= RATE_LIMIT_REQUESTS) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    const body = await request.json();
    const { restaurantId, clientName, whatsapp, date, time, guests, notes } = body;

    if (!restaurantId || !clientName || !whatsapp || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload: ReservationInsert = {
      restaurant_id: restaurantId,
      client_name: clientName,
      whatsapp,
      date,
      time,
      guests,
      notes,
      status: "pending",
    };

    const reservation = await createReservation(payload);

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          restaurantId: reservation.restaurant_id,
          restaurantName: "Delica",
          clientName: reservation.client_name,
          whatsapp: reservation.whatsapp,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          notes: reservation.notes,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error("[n8n webhook error]", err);
      });
    }

    return NextResponse.json(
      { id: reservation.id, status: "created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/reservations] Error:", error);
    return NextResponse.json(
      { error: "Internal server error processing reservation." },
      { status: 500 }
    );
  }
}
