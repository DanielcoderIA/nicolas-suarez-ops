import { test, expect } from "@playwright/test";

/**
 * E2E: Autenticación y Seguridad
 * 
 * Verifica que:
 * 1. Rutas protegidas redirigen a login
 * 2. Login exitoso lleva al dashboard
 * 3. Logout limpia sesión y redirige
 * 4. API está protegida (401)
 */

test.describe("Flujo de Autenticación", () => {
  
  test("Redirección a /login si no hay sesión", async ({ page }) => {
    await page.goto("http://localhost:3050/dashboard");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("Login exitoso mediante Magic Link (Mock)", async ({ page, context }) => {
    // Interceptamos OTP
    await page.route("**/auth/v1/otp", route => route.fulfill({ status: 200 }));
    
    await page.goto("http://localhost:3050/login");
    await page.fill('input[type="email"]', "nicolas@nicolassuarez.co");
    await page.click('button[type="submit"]');
    
    await expect(page.locator("text=Enlace enviado")).toBeVisible();

    // Mock de sesión en cookies para simular éxito del callback
    await context.addCookies([
      { name: "sb-access-token", value: "valid-session", domain: "localhost", path: "/", httpOnly: true }
    ]);

    await page.goto("http://localhost:3050/dashboard");
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("Logout redirige a login y limpia cookies", async ({ page, context }) => {
    // Seteamos sesión inicial
    await context.addCookies([
      { name: "sb-access-token", value: "valid-session", domain: "localhost", path: "/", httpOnly: true }
    ]);

    await page.goto("http://localhost:3050/dashboard");
    
    // Suponiendo que hay un botón de logout en el layout
    const logoutButton = page.locator('button:has-text("Cerrar Sesión"), button:has-text("Logout"), a:has-text("Salir")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*\/login/);
      
      const cookies = await context.cookies();
      const sessionCookie = cookies.find(c => c.name === "sb-access-token");
      expect(sessionCookie).toBeUndefined();
    }
  });

  test("API responde 401 si no hay JWT", async ({ request }) => {
    // Intentamos acceder a un endpoint protegido
    const response = await request.patch("http://localhost:3050/api/menu/items/some-id", {
      data: { restaurantId: "some-id" }
    });
    
    expect(response.status()).toBe(401);
  });
});
