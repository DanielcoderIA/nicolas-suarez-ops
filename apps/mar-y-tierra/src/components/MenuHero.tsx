import Image from "next/image";

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const NAVY = "#041C2C";
const TEAL = "#1ABC9C";
const PEARL = "#F0F8FF";

/**
 * MenuHero — Full-bleed hero banner for the /menu page.
 * Server component (no "use client") — static, no interactivity.
 */
export function MenuHero() {
  return (
    <div className="relative h-[42vh] md:h-[48vh] flex items-center justify-center overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/hero2.png"
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
            background: `linear-gradient(135deg, ${NAVY}dd 0%, ${NAVY}99 50%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${NAVY} 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="layout-container text-center relative z-10 px-6">
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
          style={{ color: PEARL }}
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
            fill={PEARL}
          />
        </svg>
      </div>
    </div>
  );
}
