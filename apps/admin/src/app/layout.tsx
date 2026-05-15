import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  style: ["italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panel Admin · Nicolás Suárez Digital",
  description: "Panel de administración unificado para La Carreta, Mar y Tierra y Delica.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${dmMono.variable} ${cormorantGaramond.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
