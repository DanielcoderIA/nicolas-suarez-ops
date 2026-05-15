"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   Paleta oscura marina con acento teal. Todos los valores en un
   solo objeto para facilitar theming y evitar magic strings.
───────────────────────────────────────────────────────────────── */
const C = {
  // Superficies
  bgDeep: "#060f18",
  bgBase: "linear-gradient(170deg, #0c1e2e 0%, #060f18 100%)",
  surface: "rgba(255,255,255,0.055)",
  surfaceHover: "rgba(255,255,255,0.085)",
  surfaceCard: "rgba(255,255,255,0.035)",

  // Bordes
  border: "rgba(255,255,255,0.09)",
  borderStrong: "rgba(255,255,255,0.16)",
  borderFocus: "rgba(29,233,182,0.60)",

  // Acento
  teal: "#1de9b6",
  tealDark: "#13c49a",
  tealDim: "rgba(29,233,182,0.10)",
  tealGlow: "rgba(29,233,182,0.26)",
  tealText: "rgba(29,233,182,0.80)",

  // Tipografía
  text: "#f0f4f8",
  textMid: "rgba(240,244,248,0.58)",
  textDim: "rgba(240,244,248,0.35)",
  textHint: "rgba(240,244,248,0.26)",

  // Peligro / destructivo
  danger: "#ff5252",
  dangerDim: "rgba(255,82,82,0.12)",

  // Fondo opaco del botón CTA (para texto legible)
  ctaText: "#021a10",

  // Métodos de pago — iconos inline SVG
  paymentIcons: {
    "Efectivo (Pago al recibir)": "💵",
    "Nequi": "💜",
    "Daviplata": "🔴",
    "Datáfono al recibir": "💳",
  } as Record<string, string>,
} as const;

/* Tipografías cargadas vía next/font o <link>. Aquí asumimos que
   el proyecto ya tiene Libre Baskerville + DM Sans en globals.css.
   Si no, agregar en <head>:
   https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=DM+Sans:wght@400;500;600;700;900&display=swap
*/
const F = {
  display: "'Libre Baskerville', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
} as const;

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
interface FormData {
  name: string;
  address: string;
  neighborhood: string;
  paymentMethod: string;
}

const PAYMENT_OPTIONS = [
  "Efectivo (Pago al recibir)",
  "Nequi",
  "Daviplata",
  "Datáfono al recibir",
] as const;

const EMPTY_FORM: FormData = {
  name: "", address: "", neighborhood: "",
  paymentMethod: PAYMENT_OPTIONS[0],
};

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", minimumFractionDigits: 0,
  }).format(n);

const randomOrderId = () =>
  `MT-${Math.floor(1000 + Math.random() * 9000)}`;

/* ─────────────────────────────────────────────────────────────────
   CHECKOUT SHEET — componente principal
───────────────────────────────────────────────────────────────── */
export function CheckoutSheet() {
  const {
    items, isOpen, setIsOpen,
    removeItem, updateQuantity,
    getTotalPrice, clearCart,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // Scroll-fade: sentinel en la parte inferior del listado
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Trap focus dentro del drawer cuando está abierto
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Bloquear scroll del body y manejar Escape
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Foco automático al primer input
    const first = drawerRef.current?.querySelector<HTMLElement>(
      "input, select, button:not([aria-label='Cerrar carrito'])"
    );
    first?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setIsOpen]);

  // IntersectionObserver para el fade-scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setAtBottom(entry?.isIntersecting ?? false),
      { root: scrollAreaRef.current, threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [items]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(p => ({ ...p, [name]: value }));
      if (submitError) setSubmitError(null);
    },
    [submitError],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || isSubmitting) return;

    // Validación cliente
    const { name, address, neighborhood } = formData;
    if (!name.trim() || !address.trim() || !neighborhood.trim()) {
      setSubmitError("Por favor completa todos los campos antes de continuar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.name.trim(),
          clientAddress: formData.address.trim(),
          clientNeighborhood: formData.neighborhood.trim(),
          paymentMethod: formData.paymentMethod,
          items,
          totalPrice: getTotalPrice(),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const orderId = data.orderId ?? randomOrderId();
      window.location.href = generateWhatsAppLink(
        orderId, items, getTotalPrice(), formData,
      );
      setTimeout(() => { clearCart(); setIsOpen(false); }, 1200);
    } catch {
      // Fallback sin orderId del servidor
      const id = randomOrderId();
      window.location.href = generateWhatsAppLink(
        id, items, getTotalPrice(), formData,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = getTotalPrice();
  const hasItems = items.length > 0;

  return (
    <>
      {/* ── Autofill & Floating Label CSS ─────────────────────────────────────────── */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
          -webkit-box-shadow: 0 0 0 100px #081521 inset !important;
          -webkit-text-fill-color: #f0f4f8 !important;
          caret-color: #1de9b6 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Input con padding forzado para evitar bugs de JIT */
        .floating-input {
          padding: 28px 20px 12px 20px !important;
        }

        /* Label flotante default (Lifted state) */
        .floating-label {
          top: 10px !important;
          transform: none !important;
          font-size: 11px !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          color: rgba(240,244,248,0.5) !important;
        }

        /* Label cuando está vacío (Placeholder shown) */
        input:placeholder-shown + .floating-label {
          top: 50% !important;
          transform: translateY(-50%) !important;
          font-size: 15px !important;
          letter-spacing: normal !important;
          text-transform: none !important;
          font-weight: 400 !important;
          color: rgba(240,244,248,0.4) !important;
        }

        /* Label cuando está enfocado */
        input:focus + .floating-label {
          top: 10px !important;
          transform: none !important;
          font-size: 11px !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          color: #1de9b6 !important;
        }

        /* Label cuando es autocompletado por Chrome */
        input:-webkit-autofill + .floating-label {
          top: 10px !important;
          transform: none !important;
          font-size: 11px !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          color: rgba(240,244,248,0.5) !important;
        }
      `}</style>

      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        aria-hidden
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{
          background: "rgba(2,8,16,0.78)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* ── Drawer ───────────────────────────────────────────── */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        className={`fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-[480px]
          transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: C.bgBase,
          boxShadow: "-24px 0 80px rgba(0,0,0,0.65), inset 1px 0 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Línea de acento superior */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none z-10"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              ${C.teal} 35%,
              #00d4f5 65%,
              transparent 100%)`,
          }}
        />

        {/* ── HEADER ─────────────────────────────────────────── */}
        <header 
          className="flex-none flex items-center justify-between"
          style={{ padding: '36px 40px 24px 40px' }}
        >
          <div>
            <p
              className="text-[10px] font-semibold tracking-[0.30em] uppercase mb-1.5 select-none"
              style={{ color: C.teal, fontFamily: F.body }}
            >
              Mar y Tierra
            </p>
            <h2
              className="flex items-center gap-2.5 leading-none"
              style={{
                fontFamily: F.display,
                fontSize: "clamp(20px, 5vw, 26px)",
                fontWeight: 700,
                color: C.text,
              }}
            >
              Tu Pedido
              {totalQty > 0 && (
                <span
                  aria-label={`${totalQty} ${totalQty === 1 ? "ítem" : "ítems"}`}
                  className="inline-flex items-center justify-center rounded-full
                    text-[11px] font-black leading-none select-none"
                  style={{
                    width: "22px", height: "22px",
                    background: C.teal,
                    color: C.ctaText,
                    fontFamily: F.body,
                  }}
                >
                  {totalQty}
                </span>
              )}
            </h2>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
            className="flex items-center justify-center w-9 h-9 rounded-full
              transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.tealDim;
              e.currentTarget.style.borderColor = C.borderFocus;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = C.surface;
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            <svg
              className="w-3.5 h-3.5"
              style={{ color: C.textMid }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <Divider />

        {/* ── CUERPO scrollable ───────────────────────────────── */}
        <div className="relative flex-1 min-h-0">
          <div
            ref={scrollAreaRef}
            className="h-full overflow-y-auto overscroll-contain"
            style={{ scrollbarWidth: "none" }}
          >
            <div 
              className="flex flex-col"
              style={{ padding: '32px 40px', gap: '32px' }}
            >

              {/* ── ESTADO VACÍO ─────────────────────────────── */}
              {!hasItems ? (
                <EmptyState />
              ) : (
                <>
                  {/* ── LISTA DE ÍTEMS ─────────────────────── */}
                  <section aria-label="Ítems en tu pedido" className="flex-shrink">
                    <ul className="space-y-0" role="list">
                      {items.map((item, i) => (
                        <li key={`${item.id}-${item.variant ?? ""}`}>
                          {i > 0 && (
                            <div
                              className="h-px my-6"
                              style={{ background: "rgba(255,255,255,0.08)" }}
                            />
                          )}
                          <CartItem
                            item={item}
                            onRemove={removeItem}
                            onUpdate={updateQuantity}
                            formatCOP={formatCOP}
                          />
                        </li>
                      ))}
                    </ul>

                    <div ref={sentinelRef} className="h-px" aria-hidden />
                  </section>

                  {/* ── FORMULARIO ──────────────────────────── */}
                  <section
                    aria-label="Detalles de envío"
                    className="rounded-2xl flex flex-col flex-shrink-0"
                    style={{
                      padding: '32px',
                      gap: '32px',
                      background: C.surfaceCard,
                      border: `1px solid ${C.border}`,
                      minHeight: 'fit-content'
                    }}
                  >
                    <SectionLabel>Detalles de envío</SectionLabel>

                    {/* Error de validación */}
                    {submitError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5"
                        style={{
                          background: C.dangerDim,
                          border: `1px solid rgba(255,82,82,0.22)`,
                        }}
                      >
                        <svg
                          className="w-4 h-4 flex-none mt-0.5"
                          style={{ color: C.danger }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <p
                          className="text-[12.5px] leading-snug"
                          style={{ color: "#ff8a80", fontFamily: F.body }}
                        >
                          {submitError}
                        </p>
                      </div>
                    )}

                    <form id="checkout-form" onSubmit={handleSubmit} noValidate>
                      <div className="flex flex-col" style={{ gap: '24px' }}>
                        {/* Nombre */}
                        <FloatingField
                          label="Nombre completo"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInput}
                          autoComplete="name"
                          required
                        />

                        {/* Dirección + Barrio en misma fila */}
                        <div className="flex" style={{ gap: '16px' }}>
                          <div className="flex-1 min-w-0">
                            <FloatingField
                              label="Dirección"
                              name="address"
                              type="text"
                              value={formData.address}
                              onChange={handleInput}
                              autoComplete="street-address"
                              required
                            />
                          </div>
                          <div style={{ width: "104px", flexShrink: 0 }}>
                            <FloatingField
                              label="Barrio"
                              name="neighborhood"
                              type="text"
                              value={formData.neighborhood}
                              onChange={handleInput}
                              required
                            />
                          </div>
                        </div>

                        {/* Método de pago — payment cards */}
                        <PaymentSelector
                          value={formData.paymentMethod}
                          onChange={(val) =>
                            setFormData(p => ({ ...p, paymentMethod: val }))
                          }
                        />
                      </div>
                    </form>
                  </section>

                  {/* Nota de entrega estimada */}
                  <DeliveryNote />

                  {/* Espaciador dinámico para evitar solapamiento con la barra de WhatsApp fija */}
                  <div className="h-32" />
                </>
              )}
            </div>
          </div>

          {/* Fade-scroll inferior */}
          {hasItems && (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 inset-x-0 h-16
                transition-opacity duration-300"
              style={{
                background: `linear-gradient(to top, ${C.bgDeep} 0%, transparent 100%)`,
                opacity: atBottom ? 0 : 1,
              }}
            />
          )}
        </div>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        {hasItems && (
          <footer
            className="flex-none"
            style={{ 
              borderTop: `1px solid ${C.border}`,
              padding: '24px 40px 40px 40px'
            }}
          >
            {/* Total */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: C.textDim, fontFamily: F.body }}
                >
                  Total estimado
                </p>
                <p
                  className="text-[11px] italic mt-0.5"
                  style={{ color: C.textHint, fontFamily: F.body }}
                >
                  + envío calculado en WhatsApp
                </p>
              </div>

              <span
                className="font-black tabular-nums leading-none flex-none"
                style={{
                  fontFamily: F.body,
                  fontSize: "clamp(20px, 5vw, 28px)",
                  background: `linear-gradient(135deg, #ffffff 10%, ${C.teal} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {formatCOP(totalPrice)}
              </span>
            </div>

            {/* CTA */}
            <SubmitButton isSubmitting={isSubmitting} />
          </footer>
        )}
      </aside>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CART ITEM — extrae lógica para legibilidad y performance
───────────────────────────────────────────────────────────────── */
interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
    notes?: string;
  };
  onRemove: (id: string, variant?: string) => void;
  onUpdate: (id: string, variant: string | undefined, delta: number) => void;
  formatCOP: (n: number) => string;
}

function CartItem({ item, onRemove, onUpdate, formatCOP }: CartItemProps) {
  return (
    /*
      Layout en 2 filas:
      Fila 1 — nombre del plato (full width, sin truncar precio)
      Fila 2 — precio a la izquierda, stepper a la derecha
      Así nunca hay conflicto de espacio horizontal.
    */
    <div className="flex flex-col gap-3.5">
      {/* Fila 1 — nombre + variante + notas */}
      <div className="min-w-0">
        <p
          className="text-[14.5px] font-semibold leading-snug"
          style={{ color: C.text, fontFamily: F.body }}
          title={item.name}
        >
          {item.name}
        </p>

        {item.variant && (
          <p
            className="text-[12px] italic mt-0.5"
            style={{ color: C.textDim, fontFamily: F.body }}
          >
            {item.variant}
          </p>
        )}

        {item.notes && (
          <p
            className="text-[11px] mt-0.5 flex items-center gap-1"
            style={{ color: C.tealText, fontFamily: F.body }}
          >
            <svg className="w-3 h-3 flex-none" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {item.notes}
          </p>
        )}
      </div>

      {/* Fila 2 — precio a la izq, stepper a la der */}
      <div className="flex items-center justify-between gap-3">
        {/* Precio — siempre visible, nunca cortado */}
        <span
          className="font-bold tabular-nums"
          style={{
            fontFamily: F.body,
            fontSize: "15px",
            color: C.text,
          }}
        >
          {formatCOP(item.price * item.quantity)}
        </span>

        {/* Stepper */}
        <div
          role="group"
          aria-label={`Cantidad de ${item.name}`}
          className="flex items-center h-8 rounded-lg overflow-hidden flex-none"
          style={{ border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.04)" }}
        >
          <StepBtn
            aria-label={item.quantity === 1 ? `Eliminar ${item.name}` : `Quitar uno de ${item.name}`}
            onClick={() =>
              item.quantity === 1
                ? onRemove(item.id, item.variant)
                : onUpdate(item.id, item.variant, -1)
            }
            isDestructive={item.quantity === 1}
          >
            {item.quantity === 1 ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                     L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : "−"}
          </StepBtn>

          <span
            aria-live="polite"
            className="w-7 text-center text-[13px] font-bold tabular-nums select-none"
            style={{
              color: item.quantity > 1 ? C.teal : C.textMid,
              fontFamily: F.body,
            }}
          >
            {item.quantity}
          </span>

          <StepBtn
            aria-label={`Agregar otro ${item.name}`}
            onClick={() => onUpdate(item.id, item.variant, 1)}
          >
            +
          </StepBtn>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAYMENT SELECTOR — cards visibles en lugar de <select> oculto
───────────────────────────────────────────────────────────────── */
function PaymentSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  /*
    Layout: lista vertical de 4 opciones.
    Cada opción = fila con emoji a la izq + texto completo + check a la der.
    Más legible que el grid 2x2 donde el texto se cortaba.
  */
  return (
    <fieldset>
      <legend
        className="block text-[11px] font-semibold tracking-[0.25em] uppercase"
        style={{ color: C.textDim, fontFamily: F.body, marginBottom: '20px' }}
      >
        Medio de pago
      </legend>
      <div className="flex flex-col" style={{ gap: '16px' }}>
        {PAYMENT_OPTIONS.map(opt => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt)}
              className="flex items-center gap-4 px-5 py-4 rounded-xl text-left
                transition-all duration-200 outline-none w-full
                focus-visible:ring-2 focus-visible:ring-teal-400"
              style={{
                background: active ? C.tealDim : C.surface,
                border: `1px solid ${active ? C.borderFocus : C.border}`,
                boxShadow: active ? `0 0 0 1px ${C.borderFocus}` : "none",
              }}
            >
              {/* Emoji */}
              <span className="text-[16px] leading-none select-none flex-none" aria-hidden>
                {C.paymentIcons[opt] ?? "💳"}
              </span>

              {/* Texto — siempre completo */}
              <span
                className="flex-1 text-[14.5px] leading-none"
                style={{
                  color: active ? C.teal : C.textMid,
                  fontFamily: F.body,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {opt}
              </span>

              {/* Check al estar seleccionado */}
              <span
                className="flex-none transition-all duration-200"
                style={{ opacity: active ? 1 : 0 }}
                aria-hidden
              >
                <svg className="w-4 h-4" style={{ color: C.teal }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DELIVERY NOTE — llena el espacio vacío con info útil
───────────────────────────────────────────────────────────────── */
function DeliveryNote() {
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{
        background: C.tealDim,
        border: `1px dashed rgba(29,233,182,0.28)`,
      }}
    >
      <span className="text-lg leading-none mt-0.5 select-none" aria-hidden>🛵</span>
      <div style={{ fontFamily: F.body }}>
        <p
          className="text-[13px] font-semibold mb-0.5"
          style={{ color: C.teal }}
        >
          Entrega estimada: 25 – 40 min
        </p>
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: C.textDim }}
        >
          El costo de envío se coordina directamente por WhatsApp según tu zona.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh]
      text-center select-none">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: C.tealDim,
          border: "1px dashed rgba(29,233,182,0.30)",
        }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: "rgba(29,233,182,0.55)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184
               1.707.707 1.707H17M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0
               100-2 1 1 0 000 2z" />
        </svg>
      </div>
      <p
        className="text-[16px] font-medium mb-1.5"
        style={{ color: C.textMid, fontFamily: F.display }}
      >
        La mesa está vacía
      </p>
      <p
        className="text-[13px]"
        style={{ color: C.textDim, fontFamily: F.body }}
      >
        Agrega platos desde el menú para comenzar
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SUBMIT BUTTON — shimmer + spinner
───────────────────────────────────────────────────────────────── */
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      form="checkout-form"
      disabled={isSubmitting}
      className="group relative w-full overflow-hidden rounded-xl py-[14px]
        text-[13px] font-bold tracking-[0.14em] uppercase
        transition-all duration-300 active:scale-[0.98]
        disabled:opacity-60 disabled:pointer-events-none
        outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-teal-400"
      style={{
        background: `linear-gradient(135deg, ${C.teal} 0%, #00c8d4 100%)`,
        color: C.ctaText,
        fontFamily: F.body,
        boxShadow: `0 6px 28px ${C.tealGlow}`,
      }}
      onMouseEnter={e => {
        if (isSubmitting) return;
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(29,233,182,0.40)";
        e.currentTarget.style.filter = "brightness(1.06)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `0 6px 28px ${C.tealGlow}`;
        e.currentTarget.style.filter = "";
      }}
    >
      {/* Shimmer */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full
          transition-transform duration-700 ease-in-out pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
        }}
      />

      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {isSubmitting ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none" viewBox="0 0 24 24" aria-hidden
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            Procesando…
          </>
        ) : (
          <>
            {/* Logo WhatsApp inline SVG (más semántico que emoji) */}
            <svg
              className="w-4 h-4 flex-none"
              viewBox="0 0 24 24" fill="currentColor" aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148
                -.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255
                -.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606
                .134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025
                -.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008
                -.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479
                0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306
                1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719
                2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.099 1.51 5.824L.057
                23.859l6.206-1.629A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12
                S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.031-1.384l-.36-.214
                -3.686.967.983-3.592-.235-.371A9.818 9.818 0 012.182 12C2.182
                6.567 6.567 2.182 12 2.182S21.818 6.567 21.818 12
                17.433 21.818 12 21.818z" />
            </svg>
            Enviar pedido por WhatsApp
            <svg
              className="w-4 h-4 flex-none group-hover:translate-x-1 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLOATING FIELD — label flotante accesible
   Contraste de placeholder: 0.42 (pasa WCAG AA sobre #0c1e2e)
───────────────────────────────────────────────────────────────── */
interface FloatingFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
}

function FloatingField({
  label, name, type, value, onChange, autoComplete, required,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const id = `field-${name}`;

  return (
    <div className="relative">
      <input
        id={id}
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        placeholder=" "
        aria-label={label}
        className="floating-input w-full text-[15px] rounded-xl outline-none transition-all duration-200"
        style={{
          background: C.surface,
          border: `1px solid ${focused ? C.borderFocus : C.border}`,
          color: C.text,
          fontFamily: F.body,
          caretColor: C.teal,
          // Glow sutil al enfocar
          boxShadow: focused ? `0 0 0 3px ${C.tealDim}` : "none",
        }}
      />

      <label
        htmlFor={id}
        className="floating-label pointer-events-none absolute left-5 transition-all duration-200 font-['DM_Sans',sans-serif]"
      >
        {label}
      </label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   UTILIDADES PEQUEÑAS
───────────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div
      className="flex-none mx-6 h-px"
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="w-[3px] h-4 rounded-full flex-none"
        style={{ background: C.teal }}
      />
      <span
        className="text-[10px] font-semibold tracking-[0.22em] uppercase"
        style={{ color: C.textDim, fontFamily: F.body }}
      >
        {children}
      </span>
    </div>
  );
}

function StepBtn({
  children,
  onClick,
  "aria-label": ariaLabel,
  isDestructive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  "aria-label": string;
  isDestructive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const hoverColor = isDestructive ? C.danger : C.teal;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-7 h-full flex items-center justify-center
        transition-colors duration-150 outline-none"
      style={{
        color: hovered ? hoverColor : C.textDim,
        fontFamily: F.body,
        fontSize: "15px",
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}