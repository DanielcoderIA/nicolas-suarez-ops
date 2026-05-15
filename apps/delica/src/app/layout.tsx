import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { BottomNav } from "@repo/ui";
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
 * Cormorant Garamond — display/hero font for Delica
 * ALWAYS weight-300 or italic/600. Never bold in body. (context_ui.md §Delica)
 * Maps to --font-serif-cg in tokens.css
 */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-cg",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Delica · Experiencias Gastronómicas | Zipaquirá",
  description:
    "Experiencias gastronómicas exclusivas y catas de autor en Zipaquirá. Reserva tu lugar en la próxima experiencia Delica.",
  metadataBase: new URL("https://delicazipa.co"),
  openGraph: {
    title: "Delica · Experiencias Gastronómicas",
    description: "Catas de autor y experiencias gastronómicas exclusivas en Zipaquirá.",
    url: "https://delicazipa.co",
    siteName: "Delica",
    locale: "es_CO",
    type: "website",
  },
  keywords: ["catas", "experiencias", "gastronomia", "zipaquira", "restaurante de autor", "reservas"],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
      <body
        className="theme-delica antialiased"
        style={{
          fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
          backgroundColor: "var(--dl-surface, #FAFAF8)",
          color: "var(--dl-text-dark, #2C1810)",
        }}
      >
        {children}
        <BottomNav restaurant="delica" />
      </body>
    </html>
  );
}

