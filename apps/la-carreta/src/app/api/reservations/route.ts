import { NextResponse } from "next/server";
import { createReservation } from "@repo/database/queries/reservations";
import type { ReservationInsert } from "@repo/database/types";

// In-memory rate limiting (simple implementation for MVP)
// A more robust solution for serverless/edge would use Redis/KV
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  try {
    // 1. Extract IP for rate limiting
    // Fallbacks for Vercel/proxies
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "anonymous";

    // 2. Apply Rate Limit
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    
    if (validTimestamps.length >= RATE_LIMIT_REQUESTS) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }
    
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    // 3. Parse and Validate Request
    const body = await request.json();
    const { restaurantId, clientName, whatsapp, date, time, guests, notes } = body;

    if (!restaurantId || !clientName || !whatsapp || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare insert payload
    const payload: ReservationInsert = {
      restaurant_id: restaurantId,
      client_name: clientName,
      whatsapp: whatsapp,
      date: date,
      time: time,
      guests: guests,
      notes: notes,
      status: "pending" // Overridden securely inside createReservation
    };

    // 4. Insert into Supabase
    const reservation = await createReservation(payload);

    // 5. Trigger n8n webhook asynchronously
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      // We don't await this so it doesn't block the client response
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          restaurantId: reservation.restaurant_id,
          clientName: reservation.client_name,
          whatsapp: reservation.whatsapp,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          notes: reservation.notes,
          timestamp: new Date().toISOString()
        })
      }).catch(err => {
        console.error("[n8n webhook error]", err);
      });
    }

    // 6. Return success
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
