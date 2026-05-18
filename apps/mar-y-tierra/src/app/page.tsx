import Image from "next/image";
import { NavBar, MenuCard, Footer, ScrollReveal } from "@repo/ui";
import { getMenuByRestaurant } from "@repo/database/queries/menu";

// ─── Constants ────────────────────────────────────────────────────────────────

const RESTAURANT_ID = "22222222-2222-2222-2222-222222222222";
const RESTAURANT_SLUG = "mar-y-tierra" as const;

export const revalidate = 5;

// ─── Design Tokens ────────────────────────────────────────────────────────────

const NAVY = "#041C2C";
const OCEAN = "#0A3D62";
const TEAL = "#1ABC9C";
const PEARL = "#F0F8FF";
const MIST = "rgba(10,61,98,0.06)";

const WHATSAPP_DELIVERY = "https://wa.me/573213359659?text=" + encodeURIComponent(
  "🛵 *Pedido Domicilio — Mar y Tierra*\n━━━━━━━━━━━━━━━━━━━━━━━\n📋 *Mi pedido:*\n  • \n\n💰 *Total estimado:* \n📍 *Dirección:* \n📝 *Notas:* "
);

// ─── Sections ─────────────────────────────────────────────────────────────────

function CustomHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero2.png"
          alt="Restaurante Mar y Tierra"
          fill
          sizes="100vw"
          quality={75}
          priority
          className="object-cover"
        />
        {/* Overlay — oceanic diagonal */}
        <div className="absolute inset-0 z-[1]" style={{ background: `linear-gradient(135deg, ${NAVY}ee 0%, ${NAVY}cc 40%, transparent 100%)` }} />
        <div className="absolute inset-0 z-[2]" style={{ background: `linear-gradient(to top, ${NAVY} 0%, transparent 50%)` }} />
      </div>

      {/* Content */}
      <div className="layout-container relative z-10 pb-16 pt-12 md:pb-20">
        <div className="max-w-[620px]">
          {/* Eyebrow */}
          <p className="flex items-center gap-3 mb-4 font-['DM_Sans',sans-serif] text-[11px] font-medium tracking-[0.22em] uppercase" style={{ color: TEAL }}>
            <span className="block w-8 h-px" style={{ backgroundColor: TEAL }} aria-hidden="true" />
            Zipaquirá · Un ambiente tropical en medio de la sabana.
          </p>

          {/* Title */}
          <h1 className="font-['Libre_Baskerville',serif] text-[clamp(42px,7vw,78px)] font-normal leading-[1.08] tracking-[-0.015em] text-[#F0F8FF] mb-5" style={{ textShadow: '0 2px 12px rgba(4,28,44,0.4)' }}>
            Donde el{" "}
            <span style={{ color: TEAL, fontWeight: 600 }}>océano</span>
            <br />abraza la{" "}
            <span style={{ color: TEAL, fontWeight: 600 }}>montaña</span>
          </h1>

          {/* Subtitle */}
          <p className="font-['DM_Sans',sans-serif] text-[15px] font-light leading-[1.8] max-w-[440px]" style={{ color: 'rgba(240,248,255,0.7)' }}>
            Una travesía gastronómica que fusiona la frescura del Pacífico con la tradición de los Andes. Ingredientes de origen, preparados con alma.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href="/reservas"
              className="inline-flex items-center gap-3 no-underline transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: TEAL, color: 'white', fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 36px', borderRadius: '9999px' }}
            >
              🍽️ Reservar Mesa
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a
              href="/menu"
              className="inline-flex items-center gap-3 no-underline transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              style={{ color: TEAL, border: `2px solid ${TEAL}`, fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 36px', borderRadius: '9999px', backgroundColor: 'rgba(26,188,156,0.08)' }}
            >
              🛵 Pedir Domicilio
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 right-[6vw] flex-col items-center gap-3 hidden md:flex z-10">
        <div className="w-[1px] h-[60px]" style={{ background: `linear-gradient(to bottom, ${TEAL}, rgba(26,188,156,0.3), transparent)` }} />
        <span className="text-[10px] font-medium tracking-[0.25em] uppercase opacity-80" style={{ color: 'rgba(240,248,255,0.35)', writingMode: 'vertical-rl' as const }}>
          Descubrir
        </span>
      </div>

      {/* Wave SVG Transition */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill={NAVY} />
        </svg>
      </div>
    </section>
  );
}

function InfoBand() {
  const columns = [
    {
      num: "01", label: "Ubicación",
      main: "Cra. 6 #1-17", sub: "Centro · Zipaquirá",
      icon: <><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></>
    },
    {
      num: "02", label: "Hoy abierto",
      main: "11:00 am — 7:00 pm", sub: "Lunes a Domingo",
      icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>
    },
    {
      num: "03", label: "Domicilios",
      main: "+57 321 335 9659", sub: "Pide por WhatsApp",
      icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.13 1.05.39 2.08.74 3.07a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.38-.38a2 2 0 0 1 2.11-.45c.99.35 2.02.61 3.07.74A2 2 0 0 1 21 17z" /></>,
      isHighlight: true, isLink: true
    },
    {
      num: "04", label: "Origen",
      main: "Pacífico & Andes", sub: "Productos certificados",
      icon: <><path d="M2 12c2-4 6-8 10-8s8 4 10 8c-2 4-6 8-10 8s-8-4-10-8z" /><circle cx="12" cy="12" r="3" /></>
    }
  ];

  return (
    <div style={{ backgroundColor: NAVY, position: 'relative', overflow: 'hidden', borderBottom: `1px solid rgba(26,188,156,0.2)` }}>
      {/* Sea water photographic texture */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.15, 
          pointerEvents: 'none', 
          backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=2000')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'luminosity'
        }} 
      />
      {/* Gradient overlay to ensure text legibility */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(to right, ${NAVY}F0, ${NAVY}40, ${NAVY}F0)` }} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .mt-info-grid { display: grid; grid-template-columns: repeat(2,1fr); position: relative; z-index: 1; }
        @media (min-width:768px) { .mt-info-grid { grid-template-columns: repeat(4,1fr); } }
        .mt-info-col { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 36px 24px; gap: 10px; position: relative; }
        @media (min-width:768px) { .mt-info-col { padding: 44px 32px; } }
      ` }} />

      <div className="mt-info-grid">
        {columns.map((col, i) => (
          <div key={col.num} className="mt-info-col" style={{ borderRight: i < 3 ? `1px solid rgba(26,188,156,0.1)` : 'none', backgroundColor: col.isHighlight ? 'rgba(26,188,156,0.05)' : 'transparent' }}>
            {/* Ghost number */}
            <div style={{ position: 'absolute', fontSize: '80px', fontFamily: "'Libre Baskerville', serif", fontWeight: '900', color: TEAL, opacity: 0.04, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', userSelect: 'none' }}>{col.num}</div>

            {/* Icon */}
            <div style={{ padding: '12px', border: `1px solid rgba(26,188,156,${col.isHighlight ? '0.5' : '0.3'})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `rgba(26,188,156,${col.isHighlight ? '0.08' : '0.03'})` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1">{col.icon}</svg>
            </div>

            {/* Separator */}
            <div style={{ width: '20px', height: '1px', backgroundColor: TEAL, opacity: 0.4 }} />

            {/* Text */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.35em', textTransform: 'uppercase', color: `rgba(26,188,156,0.6)`, marginBottom: '6px' }}>{col.label}</div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: col.isHighlight ? '20px' : '17px', fontWeight: col.isHighlight ? '500' : '400', color: col.isHighlight ? TEAL : PEARL, lineHeight: 1.3, marginBottom: '3px' }}>{col.main}</div>
              <div style={{ fontSize: '11px', fontWeight: '300', color: col.isHighlight ? `rgba(26,188,156,0.6)` : 'rgba(240,248,255,0.45)', letterSpacing: '0.04em' }}>{col.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${TEAL} 20%, ${TEAL} 80%, transparent)`, opacity: 0.5 }} />
    </div>
  );
}

// ─── PLACEHOLDER: Part 2 will add StorySection, FeaturedMenuSection, ExperienceStrip ───

function StorySection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 overflow-hidden" style={{ backgroundColor: PEARL }}>
      {/* Image Column */}
      <div className="relative group overflow-hidden h-[500px] md:h-auto md:min-h-[700px]">
        <Image
          src="/images/escencia.jpeg"
          alt="Cocina Mar y Tierra"
          fill
          className="object-cover object-[30%_70%] transition-transform duration-[10s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F0F8FF]/10 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ backgroundColor: `${NAVY}15` }} />
      </div>

      {/* Text Column */}
      <div className="flex flex-col justify-center items-center px-8 md:px-20 lg:px-24 py-16 md:py-0 relative" style={{ backgroundColor: PEARL, minHeight: '700px' }}>
        <div className="absolute top-16 right-16 w-12 h-12 border-t border-r pointer-events-none" style={{ borderColor: `rgba(26,188,156,0.2)` }} />

        <div style={{ maxWidth: '460px', width: '100%' }}>
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8" style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.3em', textTransform: 'uppercase', color: TEAL }}>
            <span className="block w-8 h-px" style={{ backgroundColor: TEAL }} />
            Nuestra Esencia
          </div>

          {/* Title */}
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: '400', lineHeight: '1.08', color: OCEAN, marginBottom: '32px' }}>
            Un ambiente{" "}
            <em style={{ fontStyle: 'italic', color: TEAL, fontWeight: '400' }}>tropical</em>
            <br />en medio de{" "}
            <em style={{ fontStyle: 'italic', color: TEAL, fontWeight: '400' }}>la sabana</em>
          </h2>

          {/* Separator */}
          <div style={{ width: '48px', height: '1px', backgroundColor: TEAL, marginBottom: '32px', opacity: 0.5 }} />

          {/* Paragraphs */}
          <p className="font-['DM_Sans',sans-serif]" style={{ fontSize: '15px', fontWeight: '300', lineHeight: '1.9', color: '#1a2e3d', marginBottom: '20px' }}>
            Somos un restaurante pescadería en donde encontrarás platos como: paella, arroz con camarón, arroz marinero, pasta en salsa marinera, ceviche de camarón, ceviche peruano, salmón, trucha, entre otros.
          </p>
          <p className="font-['DM_Sans',sans-serif]" style={{ fontSize: '15px', fontWeight: '300', lineHeight: '1.9', color: '#1a2e3d', marginBottom: '48px' }}>
            Estamos ubicados a 100 metros de la entrada a la Catedral de Sal en Zipaquirá. Visítanos y vive la experiencia de degustar nuestros deliciosos platos en un ambiente tropical en medio de la sabana.
          </p>

          {/* Quality Badges */}
          <div className="flex flex-wrap gap-3 mb-10">
            {["Pescados Certificados", "Kilómetro Cero", "Artesanal"].map(badge => (
              <span key={badge} className="px-5 py-2 rounded-full font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ border: `1px solid rgba(26,188,156,0.3)`, color: OCEAN, backgroundColor: `rgba(26,188,156,0.06)` }}>
                {badge}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a href="/menu" className="group inline-flex items-center transition-all duration-300 hover:gap-5" style={{ gap: '12px', fontSize: '11px', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', color: OCEAN, textDecoration: 'none' }}>
            Explorar carta
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none z-10 col-span-full" style={{ background: `linear-gradient(to bottom, transparent 0%, ${NAVY}08 30%, ${NAVY}20 60%, ${NAVY}50 85%, ${NAVY}80 100%)` }} />
    </section>
  );
}
interface FeaturedMenuSectionProps {
  items: any[];
}

function FeaturedMenuSection({ items }: FeaturedMenuSectionProps) {
  if (items.length === 0) return null;

  // Map each item to its high-quality image
  const getFeaturedImage = (name: string) => {
    const lowName = name.toLowerCase();
    if (lowName.includes('paella')) return "/images/paella-featured.png";
    if (lowName.includes('arroz')) return "/images/arroz-featured.png";
    if (lowName.includes('cazuela')) return "/images/cazuela-featured.png";
    return "/images/hero2.png";
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: NAVY }}>
      {/* Watermark background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '20vw', fontWeight: '900', fontStyle: 'italic', color: TEAL, whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
          Pacífico
        </span>
      </div>

      <div className="layout-container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase mb-5" style={{ color: TEAL }}>
              <span className="w-10 h-px" style={{ backgroundColor: TEAL }} />
              Selección de Autor
            </div>
            <h2 className="font-['Libre_Baskerville',serif] text-[clamp(34px,5vw,56px)] font-normal leading-[1.1] tracking-tight" style={{ color: PEARL }}>
              Lo mejor de <em className="italic" style={{ color: TEAL }}>nuestro océano</em>
            </h2>
          </div>
          <a href="/menu" className="group flex items-center gap-4 text-[12px] font-bold tracking-[0.2em] uppercase no-underline transition-all duration-300 hover:gap-6" style={{ color: TEAL }}>
            Explorar la Carta
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const imgSrc = getFeaturedImage(item.name);
            return (
              <div 
                key={item.id} 
                className="group relative h-[520px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-2"
                style={{ backgroundColor: OCEAN }}
              >
                {/* Plate Image */}
                <Image
                  src={imgSrc || "/images/hero2.png"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041C2C] via-[#041C2C]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-[10px] font-bold tracking-[0.2em] text-teal-400 uppercase">Destacado</span>
                     <div className="flex-1 h-px bg-teal-400/20" />
                  </div>
                  
                  <h3 className="font-['Libre_Baskerville',serif] text-2xl text-white mb-2 leading-snug">
                    {item.name}
                  </h3>
                  
                  <p className="text-[13px] text-white/60 font-light line-clamp-2 mb-6 font-['DM_Sans',sans-serif]">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                    <span className="font-['DM_Sans',sans-serif] text-xl font-medium text-teal-400">
                      $ {item.price.toLocaleString()}
                    </span>
                    
                    <a 
                      href="/menu"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-teal-400 hover:text-[#041C2C] hover:border-teal-400 transition-all duration-300"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceStrip() {
  return (
    <div style={{ backgroundColor: NAVY, padding: '56px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px', position: 'relative', overflow: 'hidden', borderBottom: `1px solid rgba(26,188,156,0.2)` }}>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(80px,14vw,160px)', fontWeight: '900', fontStyle: 'italic', color: TEAL, opacity: 0.04, whiteSpace: 'nowrap', lineHeight: 1 }}>Mar y Tierra</span>
      </div>

      {/* Eyebrow */}
      <div className="flex items-center gap-4 z-10" style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.3em', textTransform: 'uppercase', color: `rgba(26,188,156,0.7)` }}>
        <span className="block w-8 h-px" style={{ backgroundColor: `rgba(26,188,156,0.7)` }} />
        Horarios de atención
        <span className="block w-8 h-px" style={{ backgroundColor: `rgba(26,188,156,0.7)` }} />
      </div>

      {/* Hours Grid */}
      <div className="grid grid-cols-1 w-full z-10" style={{ maxWidth: '520px', border: `1px solid rgba(26,188,156,0.12)`, borderRadius: '2px' }}>
        {[
          { label: "Horario General", hours: "11:00 am – 7:00 pm", sub: "Lunes a Domingo", highlight: true }
        ].map((slot) => (
          <div key={slot.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '32px 24px', backgroundColor: 'rgba(26,188,156,0.04)' }}>
            <span style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,248,255,0.4)' }}>{slot.label}</span>
            <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(20px, 2.5vw, 36px)', fontWeight: '400', color: TEAL, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>{slot.hours}</span>
            <span style={{ fontSize: '11px', color: `rgba(26,188,156,0.6)`, letterSpacing: '0.1em' }}>{slot.sub}</span>
          </div>
        ))}
      </div>

      {/* Dual CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 z-10">
        <a href="/reservas" className="inline-flex items-center gap-3 no-underline transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style={{ backgroundColor: TEAL, color: 'white', fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 36px', borderRadius: '9999px' }}>
          🍽️ Reservar Mesa
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
        <a href="/menu" className="inline-flex items-center gap-3 no-underline transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style={{ color: TEAL, border: `2px solid ${TEAL}`, fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 36px', borderRadius: '9999px', backgroundColor: 'rgba(26,188,156,0.08)' }}>
          🛵 Pedir Domicilio
        </a>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOOTER_HOURS = [
  { days: "Lunes a Domingo", hours: "11:00 am - 7:00 pm" },
];

const FOOTER_LINKS = [
  { label: "Menú Digital", href: "/menu" },
  { label: "Hacer una Reserva", href: "/reservas" },
];

const NAV_LINKS = [
  { label: "INICIO", href: "/" },
  { label: "MENÚ", href: "/menu" },
];

const RESTAURANT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Mar y Tierra Zipa",
  url: "https://marytierrazipa.co",
  telephone: "+573009876543",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cra. 6 #1-17, Centro",
    addressLocality: "Zipaquirá",
    addressRegion: "Cundinamarca",
    addressCountry: "CO",
  },
  servesCuisine: "Seafood",
  priceRange: "$$",
  openingHours: "Mo-Su 11:00-19:00",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const menuItems = await getMenuByRestaurant(RESTAURANT_ID);
  
  // Find specific star dishes for the homepage (High-end only)
  const paellaItem = menuItems.find(item => item.name.toLowerCase().includes('paella') && item.price > 40000);
  const arrozItem = menuItems.find(item => (item.name.toLowerCase().includes('arroz con camarón') || item.name.toLowerCase().includes('arroz marinero')) && item.price > 30000);
  const cazuelaItem = menuItems.find(item => item.name.toLowerCase().includes('cazuela') && item.price > 40000);

  const finalItems = [paellaItem, arrozItem, cazuelaItem].filter(Boolean) as typeof menuItems;

  return (
    <main className="theme-mar-y-tierra min-h-screen flex flex-col">
      <NavBar
        restaurant={RESTAURANT_SLUG}
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

      <CustomHero />
      <InfoBand />
      <StorySection />
      <FeaturedMenuSection items={finalItems} />
      <ExperienceStrip />

      <Footer
        restaurant={RESTAURANT_SLUG}
        brandName="Mar y Tierra Zipa"
        address="Cra. 6 #1-17, Centro, Zipaquirá"
        whatsappNumber="+573213359659"
        hours={FOOTER_HOURS}
        links={FOOTER_LINKS}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_SCHEMA) }}
      />
    </main>
  );
}
