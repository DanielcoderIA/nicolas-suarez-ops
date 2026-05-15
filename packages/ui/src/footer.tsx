/**
 * @repo/ui — Footer Component v5
 * Brand-themed footer · SSG-safe · Mobile-first
 *
 * Fixes v5:
 *  - Copyright La Carreta mobile: eliminado opacity-* extra sobre color ya semitransparente
 *  - Navegar Mar y Tierra: color de label más visible, tracking corregido
 *  - Línea blanca: eliminado el div h-px separador, reemplazado por border-t
 *    con color correcto usando currentColor approach
 *  - Bottom bar divider: mismo fix
 */

import type { BrandTheme } from "./button";

export type FooterRestaurant = BrandTheme | "chef";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterHours {
  days: string;
  hours: string;
}

export interface FooterProps {
  restaurant: FooterRestaurant;
  brandName: string;
  tagline?: string;
  address?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  hours?: FooterHours[];
  links?: FooterLink[];
  legalLinks?: FooterLink[];
  copyright?: string;
  className?: string;
}

/* ══════════════════════════════════════════════════════════════
   STYLE TOKENS
   ══════════════════════════════════════════════════════════════ */

const footerBg: Record<FooterRestaurant, string> = {
  "la-carreta": "bg-[#160C08]",
  "mar-y-tierra": "bg-[#0A3D62]",
  delica: "bg-[#1e100a]",
  chef: "bg-[#1e100a]",
  admin: "bg-[#0b0d0f]",
};

const brandNameStyles: Record<FooterRestaurant, string> = {
  "la-carreta": "font-['Cormorant_Garamond',serif] text-[28px] font-light text-[#FDFAF5] mb-2",
  "mar-y-tierra": "font-['Libre_Baskerville',serif]  text-[15px] font-bold    text-[#e8f4fd]",
  delica: "font-['Cormorant_Garamond',serif] text-[22px] font-light   italic text-[#8D6A32] tracking-[0.06em]",
  chef: "font-['Cormorant_Garamond',serif] text-[20px] font-light   italic text-[#8D6A32] tracking-[0.06em]",
  admin: "font-['DM_Sans',sans-serif]       text-[13px] font-semibold text-[#e8eaed]",
};

const sectionLabelStyles: Record<FooterRestaurant, string> = {
  "la-carreta": "font-['Jost',sans-serif] text-[10px] font-medium tracking-[0.18em] uppercase text-[#C8932A] mb-4",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[10px] font-medium tracking-[0.18em] uppercase text-[#C8932A] mb-4",
  delica: "font-['DM_Sans',sans-serif] text-[10px] font-medium tracking-[0.18em] uppercase text-[#C8932A] mb-4",
  chef: "font-['DM_Sans',sans-serif] text-[10px] font-medium tracking-[0.18em] uppercase text-[#C8932A] mb-4",
  admin: "font-['DM_Sans',sans-serif] text-[10px] font-medium tracking-[0.18em] uppercase text-[#C8932A] mb-4",
};

const textStyles: Record<FooterRestaurant, string> = {
  "la-carreta": "font-['Jost',sans-serif] text-[13px] font-light leading-[1.8] text-[rgba(245,239,227,0.45)]",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[12px] leading-[1.8]  text-[rgba(232,244,253,0.65)]",
  delica: "font-['DM_Sans',sans-serif] text-[12px] leading-[1.8]  text-[rgba(240,232,216,0.50)]",
  chef: "font-['DM_Sans',sans-serif] text-[12px] leading-[1.8]  text-[rgba(240,232,216,0.50)]",
  admin: "font-['DM_Sans',sans-serif] text-[12px] leading-[1.8]  text-[#9aa0ac]",
};

/* Copyright — mismo color que textStyles pero un poco más tenue */
const copyrightStyles: Record<FooterRestaurant, string> = {
  "la-carreta": "font-['Jost',sans-serif] text-[11px] text-[rgba(245,239,227,0.28)] tracking-[0.06em]",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[11px] leading-relaxed text-[rgba(232,244,253,0.70)]",
  delica: "font-['DM_Sans',sans-serif] text-[11px] leading-relaxed text-[rgba(240,232,216,0.60)]",
  chef: "font-['DM_Sans',sans-serif] text-[11px] leading-relaxed text-[rgba(240,232,216,0.60)]",
  admin: "font-['DM_Sans',sans-serif] text-[11px] leading-relaxed text-[#9aa0ac]",
};

const linkStyles: Record<FooterRestaurant, string> = {
  "la-carreta": "font-['Jost',sans-serif] text-[13px] font-light text-[rgba(245,239,227,0.5)] hover:text-[#FDFAF5] no-underline transition-colors duration-200",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[12px] text-[rgba(232,244,253,0.60)] hover:text-[#e8f4fd]               no-underline transition-colors duration-150",
  delica: "font-['DM_Sans',sans-serif] text-[12px] text-[rgba(240,232,216,0.45)] hover:text-[rgba(240,232,216,0.85)] no-underline transition-colors duration-200",
  chef: "font-['DM_Sans',sans-serif] text-[12px] text-[rgba(240,232,216,0.45)] hover:text-[rgba(240,232,216,0.85)] no-underline transition-colors duration-200",
  admin: "font-['DM_Sans',sans-serif] text-[12px] text-[#9aa0ac]                hover:text-[#e8eaed]                no-underline transition-colors duration-100",
};

const waButtonStyles: Record<FooterRestaurant, string> = {
  "la-carreta":
    "inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-[4px] font-['DM_Sans',sans-serif] text-[12px] font-semibold no-underline hover:bg-[#20c05a] active:bg-[#1aad52] transition-colors duration-200 focus-visible:outline-none",
  "mar-y-tierra":
    "inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full font-['DM_Sans',sans-serif] text-[12px] font-semibold no-underline hover:bg-[#20c05a] active:bg-[#1aad52] transition-colors duration-200 focus-visible:outline-none",
  delica:
    "inline-flex items-center gap-2 border border-[rgba(141,106,50,0.40)] text-[#8D6A32] px-4 py-2.5 rounded-[1px] font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.08em] uppercase no-underline hover:bg-[rgba(141,106,50,0.08)] hover:border-[rgba(141,106,50,0.7)] transition-all duration-200 focus-visible:outline-none",
  chef:
    "inline-flex items-center gap-2 border border-[rgba(141,106,50,0.40)] text-[#8D6A32] px-4 py-2.5 rounded-[1px] font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.08em] uppercase no-underline hover:bg-[rgba(141,106,50,0.08)] hover:border-[rgba(141,106,50,0.7)] transition-all duration-200 focus-visible:outline-none",
  admin:
    "inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-[5px] font-['DM_Sans',sans-serif] text-[12px] font-semibold no-underline hover:bg-[#20c05a] active:bg-[#1aad52] transition-colors duration-100 focus-visible:outline-none",
};

/* ══════════════════════════════════════════════════════════════
   WHATSAPP ICON
   ══════════════════════════════════════════════════════════════ */
function WhatsAppIcon({ luxury = false }: { luxury?: boolean }) {
  if (luxury) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.21 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.13 1.05.39 2.08.74 3.07a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.47-1.47a2 2 0 012.11-.45c.99.35 2.02.61 3.07.74A2 2 0 0122 16.92z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   FOOTER COMPONENT
   ══════════════════════════════════════════════════════════════ */
export function Footer({
  restaurant,
  brandName,
  tagline,
  address,
  whatsappNumber,
  whatsappMessage = "Hola, me gustaría hacer una reserva",
  hours = [],
  links = [],
  legalLinks = [],
  copyright,
  className = "",
}: FooterProps) {
  const isLuxury = restaurant === "delica" || restaurant === "chef";

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
    : undefined;

  const year = new Date().getFullYear();

  return (
    <footer
      className={`theme-${restaurant} ${footerBg[restaurant]} mt-auto leading-[1.9] ${className}`}
      aria-label="Pie de página"
    >
      <div className="layout-container py-18 md:py-[72px]">

        {/*
          Grid principal
          mobile:  1 col → Brand, Contacto apilados full-width
                   sub-grid 2 cols → Horario + Navegar side-by-side
          desktop: 4 cols iguales (lg:grid-cols-4)
                   lg:contents disuelve el sub-grid en el padre
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-14">

          {/* Col 1 — Marca */}
          <div className="flex flex-col gap-3">
            <p className={brandNameStyles[restaurant]}>{brandName}</p>
            {tagline && (
              <p className={textStyles[restaurant]}>{tagline}</p>
            )}
          </div>

          {/* Col 2 — Contacto */}
          <div className="flex flex-col">
            <span className={`${sectionLabelStyles[restaurant]} block`}>
              Contacto
            </span>
            {address && (
              <address className={`${textStyles[restaurant]} not-italic`}>
                {address}
              </address>
            )}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  border: '1px solid rgba(245,239,227,0.15)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  marginTop: '16px',
                  transition: 'border-color 0.2s ease',
                  width: 'fit-content'
                }}
              >
                {/* Logo oficial WhatsApp SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" 
                  fill="#25D366" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '13px',
                  fontWeight: '300',
                  color: 'rgba(245,239,227,0.75)',
                  letterSpacing: '0.03em'
                }}>
                  Escríbenos por WhatsApp
                </span>
              </a>
            )}
          </div>

          {/*
            Sub-grid cols 3+4
            mobile  → grid-cols-2, Horario y Navegar lado a lado
            desktop → lg:contents disuelve este wrapper, cada hijo
                      ocupa su propia col en el grid padre de 4 cols
          */}
          <div className="grid grid-cols-2 gap-6 lg:contents">

            {/* Col 3 — Síguenos */}
            <div className="flex flex-col">
              <span className={`${sectionLabelStyles[restaurant]} block`}>
                Síguenos
              </span>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                <li>
                  <a href="https://instagram.com" 
                     className={linkStyles[restaurant]}
                     target="_blank" rel="noopener noreferrer">
                    Instagram →
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" 
                     className={linkStyles[restaurant]}
                     target="_blank" rel="noopener noreferrer">
                    Facebook →
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" 
                     className={linkStyles[restaurant]}
                     target="_blank" rel="noopener noreferrer">
                    TikTok →
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 — Navegar */}
            {links.length > 0 && (
              <div className="flex flex-col">
                <span className={`${sectionLabelStyles[restaurant]} block`}>
                  Navegar
                </span>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={linkStyles[restaurant]}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-white/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className={copyrightStyles[restaurant]}>
            {copyright ?? `© ${year} ${brandName}. Todos los derechos reservados.`}
          </p>
          
          {legalLinks.length > 0 && (
            <ul className="list-none p-0 m-0 flex gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`${linkStyles[restaurant]} text-[11px]`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className={`${copyrightStyles[restaurant]} sm:text-right`}>
            Diseñado con ♥ en Colombia
          </p>
        </div>



      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </footer>
  );
}