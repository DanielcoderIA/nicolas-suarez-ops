import type { Metadata } from "next";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import { BottomNav, LoyaltyTracker } from "@repo/ui";
import "./globals.css";

/**
 * DM Sans — body font (context_ui.md §Fuentes)
 * Maps to --font-sans in tokens.css
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Libre Baskerville — display/hero font for Mar y Tierra
 * Maps to --font-serif-lb in tokens.css
 */
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-lb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mar y Tierra Zipa · Restaurante en Zipaquirá",
  description:
    "Sabores del mar y la tierra en Zipaquirá. Menú fresco, reservas en línea y una experiencia gastronómica única.",
  metadataBase: new URL("https://marytierrazipa.co"),
  openGraph: {
    title: "Mar y Tierra Zipa · Restaurante",
    description: "Sabores del mar y la tierra en Zipaquirá.",
    url: "https://marytierrazipa.co",
    siteName: "Mar y Tierra Zipa",
    locale: "es_CO",
    type: "website",
  },
  keywords: ["restaurante", "zipaquira", "mariscos", "carnes", "mar y tierra", "reservas"],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${libreBaskerville.variable}`}>
      <body
        className="theme-mar-y-tierra antialiased"
        style={{
          fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
          backgroundColor: "var(--mt-surface, #F0F8FF)",
          color: "var(--mt-text-dark, #1a2e3d)",
        }}
      >
        {children}
        <BottomNav restaurant="mar-y-tierra" />
        <LoyaltyTracker
          restaurantId={process.env.NEXT_PUBLIC_RESTAURANT_ID!}
          analyticsToken={process.env.NEXT_PUBLIC_ANALYTICS_TOKEN!}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
        />
      </body>
    </html>
  );
}

