import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nicolás Suárez · Chef Ejecutivo | Zipaquirá",
  description:
    "Chef Ejecutivo y Gerente General en Zipaquirá. Cocina colombiana de autor, catas exclusivas y experiencias gastronómicas.",
  metadataBase: new URL("https://nicolassuarez.co"),
  openGraph: {
    title: "Nicolás Suárez · Chef Ejecutivo",
    description: "Perfil profesional del Chef Nicolás Suárez.",
    url: "https://nicolassuarez.co",
    siteName: "Nicolás Suárez",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
