import Image from "next/image";
import { Footer, NavBar } from "@repo/ui";
import { MenuContent } from "@/components/MenuContent";

export const revalidate = 5;

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const NAVY = "#041C2C";
const TEAL = "#1ABC9C";

/* ─── Nav & Footer data ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "INICIO", href: "/" },
  { label: "MENÚ", href: "/menu" },
];

const FOOTER_HOURS = [
  { days: "Lunes a Jueves", hours: "12:00 pm - 9:00 pm" },
  { days: "Viernes y Sábado", hours: "12:00 pm - 10:30 pm" },
  { days: "Domingos y Festivos", hours: "12:00 pm - 8:30 pm" },
];

export default function MenuPage() {
  return (
    <div className="theme-mar-y-tierra min-h-screen bg-[#F0F8FF] flex flex-col">
      <NavBar
        restaurant="mar-y-tierra"
        brandName="Mar y Tierra Zipa"
        brandMark={
          <img
            src="/images/logo-mar-y-tierra.png"
            alt="Restaurante Mar y Tierra"
            className="h-full w-auto object-contain"
          />
        }
        links={NAV_LINKS}
        ctaLabel="RESERVAR MESA"
        ctaHref="/reservas"
      />

      <main className="flex-1 pb-20">
        {/* Hero Section — Oceanic menu header */}
        <div className="relative h-[42vh] md:h-[48vh] flex items-center justify-center overflow-hidden group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/images/hero-menu-ingredients.png"
              alt="Nuestra Carta — Mar y Tierra"
              fill
              sizes="100vw"
              quality={75}
              priority
              className="object-cover brightness-[0.6] object-[center_40%] transition-transform duration-1000 group-hover:scale-105"
              aria-hidden="true"
            />
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${NAVY}dd 0%, ${NAVY}99 60%, ${NAVY}aa 100%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${NAVY} 0%, transparent 60%)`,
              }}
            />
          </div>

          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center relative z-10 px-6">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className="block w-8 h-px"
                style={{ backgroundColor: TEAL }}
                aria-hidden="true"
              />
              <span
                className="font-['DM_Sans',sans-serif] text-[10px] font-medium tracking-[0.25em] uppercase"
                style={{ color: `${TEAL}cc` }}
              >
                Carta Completa
              </span>
              <span
                className="block w-8 h-px"
                style={{ backgroundColor: TEAL }}
                aria-hidden="true"
              />
            </div>

            <h1
              className="font-['Libre_Baskerville',serif] text-[44px] md:text-[68px] font-normal leading-[1.08] mb-4 drop-shadow-lg"
              style={{ color: "#F0F8FF" }}
            >
              Nuestra{" "}
              <em className="italic" style={{ color: TEAL, fontWeight: 400 }}>
                Carta
              </em>
            </h1>
            <p
              className="font-['DM_Sans',sans-serif] text-[15px] md:text-[18px] max-w-xl mx-auto leading-relaxed drop-shadow-md"
              style={{ color: "rgba(240,248,255,0.7)" }}
            >
              Del Pacífico a tu mesa — ingredientes frescos, preparados con técnica y alma
            </p>
          </div>

          {/* Wave transition */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,38 1440,30 L1440,60 L0,60 Z"
                fill="#F0F8FF"
              />
            </svg>
          </div>
        </div>

        {/* Menu Content with Category Filter */}
        <div className="-mt-4 relative z-20">
          <MenuContent />
        </div>
      </main>

      <Footer
        restaurant="mar-y-tierra"
        brandName="Mar y Tierra Zipa"
        address="Carrera 8 # 3-12, Centro, Zipaquirá"
        whatsappNumber="+573213359659"
        hours={FOOTER_HOURS}
        links={[
          { label: "Inicio", href: "/" },
          { label: "Reservas", href: "/reservas" },
        ]}
      />
    </div>
  );
}
