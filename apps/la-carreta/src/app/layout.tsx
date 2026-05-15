import type { Metadata, Viewport } from "next";
import { Jost, Cormorant_Garamond } from "next/font/google";
import { BottomNav } from "@repo/ui";
import "./globals.css";

/* ── Fuentes ────────────────────────────────────────────────────────
   DM Sans: UI body — weight 700 eliminado (no usado en ningún
   componente; reduce ~8 KB del subset descargado).
   Fraunces: display/hero — weight "variable" carga el eje wght
   completo + opsz. Correcto para titulares animados o fluid type.
─────────────────────────────────────────────────────────────────── */
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/* ── Metadata ───────────────────────────────────────────────────────
   - viewport exportado por separado (Next.js 14.2+ requiere que
     themeColor y viewport vivan en export viewport, no en metadata)
   - twitter card añadida (mejora CTR en compartidos)
   - alternates.canonical evita contenido duplicado en Google
   - category ayuda a Google Knowledge Graph para restaurantes
─────────────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: "#6b2c1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,   // permite zoom de accesibilidad (WCAG 1.4.4)
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lacarreta.co"),

  title: {
    default: "La Carreta · Cocina Tradicional Colombiana | Zipaquirá",
    template: "%s · La Carreta",   // pages hijas usan: title: "Menú"
  },
  description:
    "Restaurante de cocina tradicional colombiana en Zipaquirá, Cundinamarca. " +
    "Menú digital, reservas en línea y la mejor sazón casera.",

  keywords: [
    "restaurante zipaquirá",
    "cocina tradicional colombiana",
    "comida típica cundinamarca",
    "reservas restaurante",
    "menú digital",
  ],

  openGraph: {
    title: "La Carreta · Cocina Tradicional Colombiana",
    description: "Restaurante de cocina tradicional colombiana en Zipaquirá, Cundinamarca.",
    url: "https://lacarreta.co",
    siteName: "La Carreta",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",   // 1200×630 — agregar a /public
        width: 1200,
        height: 630,
        alt: "La Carreta — Cocina Tradicional Colombiana, Zipaquirá",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "La Carreta · Cocina Tradicional Colombiana",
    description: "Restaurante de cocina tradicional colombiana en Zipaquirá.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://lacarreta.co",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  category: "restaurant",
};

/* ── Layout ─────────────────────────────────────────────────────────
   - inline style eliminado del <body>: los valores ya viven en
     globals.css (@layer base) y en tokens.css (.theme-la-carreta).
     Tenerlos duplicados como inline style crea especificidad más
     alta que los tokens y dificulta overrides desde componentes.
   - suppressHydrationWarning en <html> previene el warning de
     hidratación cuando extensiones del navegador (ej. LastPass,
     Grammarly) modifican atributos del DOM antes de que React hidrate.
─────────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${jost.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="theme-la-carreta antialiased">
        {children}
        <BottomNav restaurant="la-carreta" />
      </body>
    </html>
  );
}