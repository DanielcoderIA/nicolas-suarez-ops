import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration — nicolas-suarez-ops
 * 
 * Supports multi-app E2E testing for:
 * - La Carreta (:3010)
 * - Mar y Tierra (:3020)
 * - Delica (:3030)
 * - Admin Panel (:3050)
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    /* ─── La Carreta ───────────────────────────────────────── */
    {
      name: "la-carreta-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3010" },
      testMatch: /reservas\.spec\.ts/,
    },
    {
      name: "la-carreta-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3010" },
      testMatch: /reservas\.spec\.ts/,
    },
    {
      name: "la-carreta-webkit",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3010" },
      testMatch: /reservas\.spec\.ts/,
    },

    /* ─── Mar y Tierra ─────────────────────────────────────── */
    {
      name: "mar-y-tierra-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3020" },
      testMatch: /reservas\.spec\.ts/,
    },
    {
      name: "mar-y-tierra-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3020" },
      testMatch: /reservas\.spec\.ts/,
    },
    {
      name: "mar-y-tierra-webkit",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3020" },
      testMatch: /reservas\.spec\.ts/,
    },

    /* ─── Delica ───────────────────────────────────────────── */
    {
      name: "delica-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3030" },
      testMatch: /reservas\.spec\.ts/,
    },
    {
      name: "delica-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3030" },
      testMatch: /reservas\.spec\.ts/,
    },
    {
      name: "delica-webkit",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3030" },
      testMatch: /reservas\.spec\.ts/,
    },

    /* ─── Admin Panel ──────────────────────────────────────── */
    {
      name: "admin-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3050" },
      testMatch: /(admin-menu|auth)\.spec\.ts/,
    },
    {
      name: "admin-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3050" },
      testMatch: /(admin-menu|auth)\.spec\.ts/,
    },
    {
      name: "admin-webkit",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3050" },
      testMatch: /(admin-menu|auth)\.spec\.ts/,
    },
  ],
});
