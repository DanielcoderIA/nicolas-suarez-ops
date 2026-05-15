import { test, expect } from "@playwright/test";

/**
 * E2E: Pruebas de Seguridad y Resiliencia
 * 
 * Verifica:
 * 1. Protección de API (401 sin JWT)
 * 2. Rate Limiting (Máx 5 reservas por IP/hora)
 * 3. Seguridad de Webhooks (Firma HMAC)
 * 4. Aislamiento Multi-tenant (RLS)
 */

test.describe("Seguridad de API y RLS", () => {
  
  test("GET /api/reservations sin JWT debe retornar 401", async ({ request }) => {
    const response = await request.get("http://localhost:3050/api/reservations?restaurantId=any");
    expect(response.status()).toBe(401);
  });

  test("Rate Limit: Bloquea la 6ta reserva desde la misma IP", async ({ request }) => {
    const reservationData = {
      restaurant_id: "11111111-1111-1111-1111-111111111111",
      client_name: "Rate Limit Test",
      whatsapp: "3000000000",
      date: "2026-05-10",
      time: "19:00",
      guests: 2
    };

    // Realizamos 5 peticiones exitosas (o al menos que no sean 429)
    // Nota: El rate limit en context_prd.md dice "5 req/IP/hora"
    const requests = Array.from({ length: 5 }).map(() => 
      request.post("http://localhost:3010/api/reservations", { data: reservationData })
    );
    
    await Promise.all(requests);

    // La 6ta petición debe fallar con 429 Too Many Requests
    const lastResponse = await request.post("http://localhost:3010/api/reservations", { data: reservationData });
    expect(lastResponse.status()).toBe(429);
  });

  test("Webhook HMAC: POST sin firma válida debe retornar 401", async ({ request }) => {
    const response = await request.post("http://localhost:3010/api/webhooks/n8n", {
      data: { event: "test" },
      headers: { "x-n8n-signature": "invalid-signature" }
    });
    
    expect(response.status()).toBe(401);
  });

  test("Multi-tenant: Admin A no puede acceder a datos de Restaurante B", async ({ browser }) => {
    const context = await browser.newContext();
    
    // Simulamos sesión de Admin para Restaurante A (La Carreta)
    await context.addCookies([
      { name: "sb-access-token", value: "valid-token-A", domain: "localhost", path: "/", httpOnly: true }
    ]);

    const page = await context.newPage();
    
    // Intentamos pedir reservas de Restaurante B (Mar y Tierra) vía API
    const response = await page.request.get("http://localhost:3050/api/reservations?restaurantId=22222222-2222-2222-2222-222222222222");
    
    // El backend debe filtrar mediante RLS o validación de adminProfile.restaurants
    expect(response.status()).toBe(403);
  });
});
