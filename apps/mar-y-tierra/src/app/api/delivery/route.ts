import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rate limiting map (IP -> timestamp array)
// Note: In production, use Redis or a proper rate limiter. This is a basic in-memory map.
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_HOUR = process.env.RATE_LIMIT_RESERVATIONS ? parseInt(process.env.RATE_LIMIT_RESERVATIONS) : 5;
const HOUR_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "unknown_ip";
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < HOUR_MS);

    if (recentTimestamps.length >= MAX_REQUESTS_PER_HOUR) {
      return NextResponse.json({ error: "Demasiados pedidos. Intenta más tarde." }, { status: 429 });
    }

    recentTimestamps.push(now);
    rateLimitMap.set(ip, recentTimestamps);

    // 2. Parse request body
    const body = await req.json();
    const { clientName, clientAddress, clientNeighborhood, paymentMethod, items, totalPrice } = body;

    const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

    if (!clientName || !clientAddress || !items || items.length === 0 || !restaurantId) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // 3. Initialize Supabase Admin Client
    // We use the service role key to insert securely from the backend
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 4. Insert order into database
    const { data, error } = await supabaseAdmin
      .from("delivery_orders")
      .insert([
        {
          restaurant_id: restaurantId,
          client_name: clientName,
          client_address: clientAddress,
          client_neighborhood: clientNeighborhood || null,
          payment_method: paymentMethod,
          items_snapshot: items,
          total_price: totalPrice,
          status: "pending_whatsapp",
        },
      ])
      .select("short_id")
      .single();

    if (error) {
      console.error("Error inserting delivery order:", error);
      // We don't want to block the user from ordering if DB fails.
      // We can fallback to a generated ID.
      const fallbackId = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
      return NextResponse.json({ success: true, orderId: fallbackId }, { status: 200 });
    }

    return NextResponse.json({ success: true, orderId: `#${data.short_id}` }, { status: 200 });
  } catch (error) {
    console.error("Delivery API error:", error);
    // Always succeed from user perspective so they can proceed to WhatsApp
    const fallbackId = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({ success: true, orderId: fallbackId }, { status: 200 });
  }
}
