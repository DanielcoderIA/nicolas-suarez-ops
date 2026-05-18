import Image from "next/image";
import { NavBar, HeroSection, MenuCard, Footer, ScrollReveal } from "@repo/ui";
import { getMenuByRestaurant } from "@repo/database/queries/menu";

// ─── Constants ────────────────────────────────────────────────────────────────

const RESTAURANT_ID = "11111111-1111-1111-1111-111111111111";
const RESTAURANT_SLUG = "la-carreta" as const;

export const revalidate = 3600;

// ─── Types ────────────────────────────────────────────────────────────────────

interface EyebrowProps {
  children: React.ReactNode;
}

interface SectionHeadingProps {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function EyebrowLabel({ children }: EyebrowProps) {
  return (
    <p className="flex items-center gap-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-4">
      <span className="block w-8 h-px bg-brand-gold" aria-hidden="true" />
      {children}
    </p>
  );
}

function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <EyebrowLabel>{eyebrow}</EyebrowLabel>
        <h2 className="font-display text-[32px] md:text-[44px] text-brand-dark font-light leading-tight tracking-tight">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-brand-red font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors hover:text-brand-gold"
    >
      {children}
      <span
        className="transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  );
}

function UnderlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="mt-12 self-start inline-flex items-center gap-3 border-b border-brand-gold pb-1.5 text-brand-red font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors hover:text-brand-gold"
    >
      {children}
      <span className="text-lg leading-none" aria-hidden="true">
        →
      </span>
    </a>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function InfoBand() {
  return (
    <div style={{
      backgroundColor: '#1C0A06',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(201,151,58,0.3)',
      borderBottom: '1px solid rgba(201,151,58,0.3)'
    }}>

      {/* Textura de madera de fondo real */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/wood-texture.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.12,
        mixBlendMode: 'luminosity',
        pointerEvents: 'none'
      }}/>

      <style dangerouslySetInnerHTML={{ __html: `
        .info-band-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          position: relative;
          z-index: 1;
        }
        @media (min-width: 768px) {
          .info-band-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .info-band-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 36px 24px;
          gap: 10px;
          position: relative;
        }
        @media (min-width: 768px) {
          .info-band-col {
            padding: 44px 32px;
          }
        }
        .info-band-col-1 {
          border-right: 1px solid rgba(201,151,58,0.12);
          border-bottom: 1px solid rgba(201,151,58,0.12);
        }
        .info-band-col-2 {
          border-bottom: 1px solid rgba(201,151,58,0.12);
        }
        .info-band-col-3 {
          border-right: 1px solid rgba(201,151,58,0.12);
        }
        @media (min-width: 768px) {
          .info-band-col-1 {
            border-right: 1px solid rgba(201,151,58,0.12);
            border-bottom: none;
          }
          .info-band-col-2 {
            border-right: 1px solid rgba(201,151,58,0.12);
            border-bottom: none;
          }
          .info-band-col-3 {
            border-right: 1px solid rgba(201,151,58,0.12);
          }
          .info-band-col-4 {
            border: none;
          }
        }
        .info-band-reservas {
          background-color: rgba(201,151,58,0.07);
        }
        .info-band-reservas-bar {
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 2px;
          background-color: #C9973A;
          opacity: 0.7;
        }
        @media (max-width: 767px) {
          .info-band-reservas-bar {
            display: none;
          }
        }
      ` }} />

      <div className="info-band-grid">

        {/* UBICACIÓN */}
        <div className="info-band-col info-band-col-1">
          <div style={{
            position: 'absolute',
            fontSize: '80px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '900',
            color: '#C9973A',
            opacity: 0.04,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            userSelect: 'none'
          }}>01</div>
          <div style={{
            padding: '12px',
            border: '1px solid rgba(201,151,58,0.35)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(201,151,58,0.05)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#C9973A" strokeWidth="1">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8
                8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style={{
            width: '20px', height: '1px',
            backgroundColor: '#C9973A', opacity: 0.5
          }}/>
          <div>
            <div style={{
              fontSize: '9px', fontWeight: '600',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(201,151,58,0.6)',
              marginBottom: '6px'
            }}>Ubicación</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '17px', fontWeight: '400',
              color: '#FDFAF5', lineHeight: 1.3,
              marginBottom: '3px'
            }}>Cra. 6 # 3-26</div>
            <div style={{
              fontSize: '11px', fontWeight: '300',
              color: 'rgba(245,239,227,0.5)',
              letterSpacing: '0.04em'
            }}>Centro · Zipaquirá</div>
          </div>
        </div>

        {/* HORARIO */}
        <div className="info-band-col info-band-col-2">
          <div style={{
            position: 'absolute',
            fontSize: '80px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '900',
            color: '#C9973A',
            opacity: 0.04,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', userSelect: 'none'
          }}>02</div>
          <div style={{
            padding: '12px',
            border: '1px solid rgba(201,151,58,0.35)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(201,151,58,0.05)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#C9973A" strokeWidth="1">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div style={{
            width: '20px', height: '1px',
            backgroundColor: '#C9973A', opacity: 0.5
          }}/>
          <div>
            <div style={{
              fontSize: '9px', fontWeight: '600',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(201,151,58,0.6)',
              marginBottom: '6px'
            }}>Hoy abierto</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '17px', fontWeight: '400',
              color: '#FDFAF5', lineHeight: 1.3,
              marginBottom: '3px'
            }}>11:30 am — 9:00 pm</div>
            <div style={{
              fontSize: '11px', fontWeight: '300',
              color: 'rgba(245,239,227,0.5)',
              letterSpacing: '0.04em'
            }}>Lunes a Miércoles</div>
          </div>
        </div>

        {/* RESERVAS */}
        <a href="tel:+573057497090"
          className="info-band-col info-band-col-3 
          info-band-reservas"
          style={{ textDecoration: 'none' }}>
          <div className="info-band-reservas-bar"/>
          <div style={{
            position: 'absolute',
            fontSize: '80px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '900',
            color: '#C9973A',
            opacity: 0.06,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', userSelect: 'none'
          }}>03</div>
          <div style={{
            padding: '12px',
            border: '1px solid rgba(201,151,58,0.6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(201,151,58,0.1)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#C9973A" strokeWidth="1">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79
                19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69
                12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1
                3.6 1.18h3a2 2 0 0 1 2 1.72c.13 1.05.39
                2.08.74 3.07a2 2 0 0 1-.45 2.11L7.91 8.8a16
                16 0 0 0 6 6l.38-.38a2 2 0 0 1 2.11-.45
                c.99.35 2.02.61 3.07.74A2 2 0 0 1 21 17z"/>
            </svg>
          </div>
          <div style={{
            width: '20px', height: '1px',
            backgroundColor: '#C9973A', opacity: 0.8
          }}/>
          <div>
            <div style={{
              fontSize: '9px', fontWeight: '600',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(201,151,58,0.7)',
              marginBottom: '6px'
            }}>Reservas</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '20px', fontWeight: '500',
              color: '#C9973A',
              letterSpacing: '0.04em',
              lineHeight: 1.2, marginBottom: '3px'
            }}>+57 305 749 7090</div>
            <div style={{
              fontSize: '11px', fontWeight: '300',
              color: 'rgba(201,151,58,0.6)',
              letterSpacing: '0.06em'
            }}>Llámanos · WhatsApp</div>
          </div>
        </a>

        {/* CALIDAD */}
        <div className="info-band-col info-band-col-4">
          <div style={{
            position: 'absolute',
            fontSize: '80px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '900',
            color: '#C9973A',
            opacity: 0.04,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', userSelect: 'none'
          }}>04</div>
          <div style={{
            padding: '12px',
            border: '1px solid rgba(201,151,58,0.35)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(201,151,58,0.05)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#C9973A" strokeWidth="1">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79
                3 .71-.71z"/>
            </svg>
          </div>
          <div style={{
            width: '20px', height: '1px',
            backgroundColor: '#C9973A', opacity: 0.5
          }}/>
          <div>
            <div style={{
              fontSize: '9px', fontWeight: '600',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(201,151,58,0.6)',
              marginBottom: '6px'
            }}>Calidad</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '17px', fontWeight: '400',
              color: '#FDFAF5', lineHeight: 1.3,
              marginBottom: '3px'
            }}>100% local</div>
            <div style={{
              fontSize: '11px', fontWeight: '300',
              color: 'rgba(245,239,227,0.5)',
              letterSpacing: '0.04em'
            }}>Ingredientes frescos · Al carbón</div>
          </div>
        </div>

      </div>

      {/* Línea dorada inferior decorativa */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background:
          'linear-gradient(90deg, transparent, #C9973A 20%, #C9973A 80%, transparent)',
        opacity: 0.6
      }}/>

    </div>
  );
}

function HistorySection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#FDFAF5]"
      style={{
        borderBottom: 'none',
        position: 'relative'
      }}>

      {/* Columna imagen */}
      <div className="relative group overflow-hidden h-[500px] md:h-auto md:min-h-[700px]">
        <Image
          src="/images/history.webp"
          alt="Parrilla La Carreta"
          fill
          className="object-cover object-[30%_70%] transition-transform duration-[10s] ease-out group-hover:scale-105"
        />
        {/* Gradiente sutil en bordes para blend elegante */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FDFAF5]/10 pointer-events-none" />
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-[#1C1410]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        {/* Badge */}
        <div className="absolute bottom-10 left-10 bg-[#5C1F0E] text-[#C9973A] text-[10px] font-medium tracking-[0.25em] uppercase px-5 py-2.5 border border-[rgba(201,151,58,0.3)] shadow-2xl">
          Desde 1987
        </div>
      </div>

      {/* Columna texto */}
      <div style={{
        padding: '0 72px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '700px',
        backgroundColor: '#FDFAF5',
        position: 'relative'
      }}>
        {/* Elemento decorativo esquina */}
        <div className="absolute top-16 right-16 w-12 h-12 border-t border-r border-[rgba(201,151,58,0.2)] pointer-events-none" />

        {/* Contenido */}
        <div style={{maxWidth: '460px'}}>
          
          {/* Eyebrow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '10px',
            fontWeight: '500',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9973A',
            marginBottom: '32px'
          }}>
            <span style={{
              width: '32px', 
              height: '1px', 
              backgroundColor: '#C9973A',
              display: 'block'
            }}/>
            Nuestra Historia
          </div>

          {/* Título */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(40px, 4.5vw, 64px)',
            fontWeight: '300',
            lineHeight: '1.05',
            color: '#1C1410',
            marginBottom: '32px'
          }}>
            Tradición que perdura{' '}
            <br />
            <em style={{
              fontStyle: 'italic',
              color: '#7A2E1E',
              fontWeight: '300'
            }}>
              en el tiempo
            </em>
          </h2>

          {/* Línea separadora decorativa */}
          <div style={{
            width: '48px',
            height: '1px',
            backgroundColor: '#C9973A',
            marginBottom: '32px',
            opacity: 0.5
          }}/>

          {/* Párrafos */}
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '15px',
            fontWeight: '300',
            lineHeight: '1.9',
            color: '#3D2B1F',
            marginBottom: '20px'
          }}>
            La Carreta nació de la pasión por rescatar 
            los sabores autóctonos de nuestra tierra. 
            Ubicados en el corazón de Zipaquirá, 
            ofrecemos una experiencia gastronómica que 
            honra las recetas de nuestras abuelas.
          </p>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '15px',
            fontWeight: '300',
            lineHeight: '1.9',
            color: '#3D2B1F',
            marginBottom: '48px'
          }}>
            Ingredientes frescos y locales, cocinados 
            a fuego lento. La verdadera esencia de 
            Colombia en cada bocado.
          </p>

          {/* CTA */}
          <a href="/reservas" 
            className="group inline-flex items-center transition-all duration-300 hover:gap-[20px]"
            style={{
              gap: '12px',
              fontSize: '11px',
              fontWeight: '500',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7A2E1E',
              textDecoration: 'none'
            }}
          >
            Conocer más
            <svg width="16" height="16" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="1.5"
              className="transition-transform duration-500 group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
      {/* Gradiente de transición hacia Horarios */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(28,20,16,0.04) 30%, rgba(28,20,16,0.12) 60%, rgba(28,20,16,0.3) 85%, rgba(28,20,16,0.5) 100%)',
        pointerEvents: 'none',
        zIndex: 10
      }}/>
    </section>
  );
}

function HorariosStrip() {
  return (
    <div style={{
      backgroundColor: '#1C1410',
      padding: '56px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '48px',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(201,151,58,0.2)'
    }}>

      {/* Watermark completo y bien posicionado */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(80px, 14vw, 160px)',
          fontWeight: '900',
          fontStyle: 'italic',
          color: '#C9973A',
          opacity: 0.045,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
          lineHeight: 1
        }}>
          La Carreta
        </span>
      </div>

      {/* Eyebrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '10px',
        fontWeight: '500',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(201,151,58,0.7)',
        zIndex: 1
      }}>
        <span style={{
          width: '32px',
          height: '1px',
          backgroundColor: 'rgba(201,151,58,0.7)',
          display: 'block'
        }}/>
        Horarios de atención
        <span style={{
          width: '32px',
          height: '1px',
          backgroundColor: 'rgba(201,151,58,0.7)',
          display: 'block'
        }}/>
      </div>

      {/* Grid horarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-[860px] relative z-10 border border-[#C9973A]/12 rounded-[2px]">

        <div className="flex flex-col items-center gap-[10px] py-8 px-6 border-b md:border-b-0 md:border-r border-[#C9973A]/12">
          <span style={{
            fontSize: '10px',
            fontWeight: '500',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(245,239,227,0.4)'
          }}>
            Lunes a Miércoles
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(20px, 2.5vw, 36px)',
            fontWeight: '300',
            color: '#FDFAF5',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            whiteSpace: 'nowrap'
          }}>
            11:30 am – 9:00 pm
          </span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(201,151,58,0.5)',
            letterSpacing: '0.1em'
          }}>
            Lun · Mar · Mié
          </span>
        </div>

        <div className="flex flex-col items-center gap-[10px] py-8 px-6 border-b md:border-b-0 md:border-r border-[#C9973A]/12 bg-[#C9973A]/[0.04]">
          <span style={{
            fontSize: '10px',
            fontWeight: '500',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(245,239,227,0.4)'
          }}>
            Jueves a Sábado
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(20px, 2.5vw, 36px)',
            fontWeight: '300',
            color: '#C9973A',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            whiteSpace: 'nowrap'
          }}>
            11:30 am – 10:00 pm
          </span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(201,151,58,0.6)',
            letterSpacing: '0.1em'
          }}>
            Jue · Vie · Sáb
          </span>
        </div>

        <div className="flex flex-col items-center gap-[10px] py-8 px-6">
          <span style={{
            fontSize: '10px',
            fontWeight: '500',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(245,239,227,0.4)'
          }}>
            Domingos y Festivos
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(20px, 2.5vw, 36px)',
            fontWeight: '300',
            color: '#FDFAF5',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            whiteSpace: 'nowrap'
          }}>
            11:30 am – 8:00 pm
          </span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(201,151,58,0.5)',
            letterSpacing: '0.1em'
          }}>
            Dom · Festivos
          </span>
        </div>
      </div>

      {/* CTA */}
      <a href="/reservas" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#C9973A',
        color: '#1C1410',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        padding: '14px 36px',
        zIndex: 1
      }}>
        Reservar una mesa
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>

    </div>
  );
}

interface FeaturedMenuSectionProps {
  items: Awaited<ReturnType<typeof getMenuByRestaurant>>;
}

function FeaturedMenuSection({ items }: FeaturedMenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-[#1C1410]">
      <div className="layout-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.22em] uppercase text-[rgba(201,151,58,0.8)] mb-4">
              <span className="w-6 h-px bg-[rgba(201,151,58,0.8)]" />
              Especialidades
            </div>
            <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(34px,4vw,52px)] font-light leading-[1.1] text-[#FDFAF5]">
              Lo mejor de <em className="italic text-[#C9973A]">nuestra cocina</em>
            </h2>
          </div>
          <a href="/menu" className="group inline-flex items-center gap-4 text-[12px] font-medium tracking-[0.2em] uppercase text-[#C9973A] no-underline transition-all duration-300 hover:gap-6">
            Ver Menú Completo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} restaurant={RESTAURANT_SLUG} variant="dark" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Structured Data ──────────────────────────────────────────────────────────

const RESTAURANT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "La Carreta",
  url: "https://lacarreta.co",
  telephone: "+573057497090",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cra. 6 # 3-26, Centro",
    addressLocality: "Zipaquirá",
    addressRegion: "Cundinamarca",
    addressCountry: "CO",
  },
  servesCuisine: "Colombian",
  priceRange: "$$",
  openingHours: "Mo-We 11:30-21:00, Th-Sa 11:30-22:00, Su 11:30-20:00",
} as const;

const FOOTER_HOURS = [
  { days: "Lunes a Miércoles", hours: "11:30 am - 9:00 pm" },
  { days: "Jueves a Sábado", hours: "11:30 am - 10:00 pm" },
  { days: "Domingos y Festivos", hours: "11:30 am - 8:00 pm" },
];

const FOOTER_LINKS = [
  { label: "Menú Digital", href: "/menu" },
  { label: "Hacer una Reserva", href: "/reservas" },
];

const NAV_LINKS = [
  { label: "INICIO", href: "/" },
  { label: "MENÚ", href: "/menu" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const menuItems = await getMenuByRestaurant(RESTAURANT_ID);
  const featuredItems = menuItems.slice(0, 3);

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar
        restaurant={RESTAURANT_SLUG}
        brandName="La Carreta"
        brandMark={
          <img
            src="/images/logo-la-carreta.png"
            alt="Restaurante La Carreta"
            className="h-full w-auto object-contain"
          />
        }
        links={NAV_LINKS}
        ctaLabel="RESERVAR MESA"
        ctaHref="/reservas"
      />

      <HeroSection
        restaurant={RESTAURANT_SLUG}
        title={
          <>
            Cocina<br />
            <em>tradicional</em><br />
            colombiana
          </>
        }
        subtitle="Sabores que cuentan historias. Rescatamos las recetas de nuestras abuelas para llevarlas a tu mesa."
        ctaLabel="Reservar mesa"
        ctaHref="/reservas"
        eyebrow="Zipaquirá, Cundinamarca"
        backgroundImage="/images/hero-bg2.webp"
      />

      <InfoBand />

      <HistorySection />

      <FeaturedMenuSection items={featuredItems} />

      <HorariosStrip />

      <Footer
        restaurant={RESTAURANT_SLUG}
        brandName="La Carreta"
        tagline="Cocina tradicional colombiana en el corazón de Zipaquirá, Cundinamarca."
        address="Cra. 6 # 3-26, Centro, Zipaquirá"
        whatsappNumber="+573057497090"
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