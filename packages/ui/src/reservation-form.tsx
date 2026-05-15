"use client";

import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import {
  CheckCircle2,
  User,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Minus,
  Plus,
  ArrowRight,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReservationData {
  restaurantId: string;
  clientName: string;
  whatsapp: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
}

export interface ReservationFormProps {
  restaurantId: string;
  onSubmit?: (data: ReservationData) => Promise<void>;
  timeSlots?: string[];
  className?: string;
  whatsappNumber?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
  "19:00", "19:30", "20:00", "20:30",
];

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateDisplay(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

// ─── Step ─────────────────────────────────────────────────────────────────────

interface StepProps {
  number: number;
  label: string;
  icon: React.ReactNode;
  isComplete: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

function Step({ number, label, icon, isComplete, isLast = false, children }: StepProps) {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {/* Columna indicadora */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "2px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600,
            flexShrink: 0,
            transition: "all 0.4s ease",
            background: isComplete
              ? "var(--color-primary)"
              : "color-mix(in srgb, var(--color-primary) 8%, transparent)",
            border: isComplete
              ? "none"
              : "1.5px solid color-mix(in srgb, var(--color-primary) 22%, transparent)",
            color: isComplete
              ? "white"
              : "color-mix(in srgb, var(--color-primary) 55%, transparent)",
            boxShadow: isComplete
              ? "0 0 0 4px color-mix(in srgb, var(--color-primary) 10%, transparent)"
              : "none",
          }}
        >
          {isComplete ? <Check size={13} strokeWidth={2.5} /> : number}
        </div>

        {!isLast && (
          <div
            style={{
              width: "1px",
              flex: 1,
              marginTop: "10px",
              minHeight: "32px",
              transition: "background 0.6s ease",
              background: isComplete
                ? "linear-gradient(to bottom, var(--color-primary), color-mix(in srgb, var(--color-primary) 12%, transparent))"
                : "color-mix(in srgb, var(--color-border) 35%, transparent)",
            }}
          />
        )}
      </div>

      {/* Columna de contenido */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? "8px" : "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <span style={{ color: isComplete ? "var(--color-primary)" : "color-mix(in srgb, var(--color-primary) 40%, transparent)" }}>
            {icon}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: isComplete
                ? "var(--color-primary)"
                : "color-mix(in srgb, var(--color-primary) 40%, transparent)",
            }}
          >
            {label}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Underline Input ──────────────────────────────────────────────────────────

interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

function UnderlineInput({ error, style: styleProp, ...props }: UnderlineInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: `1.5px solid ${error ? "#c0392b"
              : focused ? "var(--color-primary)"
                : "color-mix(in srgb, var(--color-border) 60%, transparent)"
            }`,
          paddingBottom: "12px",
          paddingTop: "4px",
          fontSize: "15px",
          outline: "none",
          color: "var(--color-text-dark)",
          transition: "border-color 0.2s ease",
          ...styleProp,
        }}
      />
      {/* Línea animada de foco */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "1.5px",
          width: focused ? "100%" : "0%",
          background: "var(--color-primary)",
          transition: "width 0.3s ease",
        }}
      />
      {error && (
        <p style={{ marginTop: "6px", fontSize: "11px", color: "#c0392b" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Time Grid ────────────────────────────────────────────────────────────────

interface TimeGridProps {
  slots: string[];
  label: string;
  selected: string;
  onSelect: (t: string) => void;
}

function TimeGrid({ slots, label, selected, onSelect }: TimeGridProps) {
  if (slots.length === 0) return null;
  return (
    <div>
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          marginBottom: "12px",
          color: "color-mix(in srgb, var(--color-primary) 55%, transparent)",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {slots.map((t) => {
          const active = selected === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              style={{
                minHeight: "44px",
                padding: "0 18px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: active ? 700 : 500,
                letterSpacing: "0.02em",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                background: active
                  ? "var(--color-primary)"
                  : "color-mix(in srgb, var(--color-primary) 7%, transparent)",
                color: active
                  ? "white"
                  : "color-mix(in srgb, var(--color-primary) 85%, transparent)",
                border: active
                  ? "1.5px solid var(--color-primary)"
                  : "1.5px solid color-mix(in srgb, var(--color-primary) 28%, transparent)",
                boxShadow: active
                  ? "0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent)"
                  : "0 1px 3px rgba(0,0,0,0.04)",
                transform: active ? "translateY(-1px)" : "none",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Guest Stepper ────────────────────────────────────────────────────────────

interface GuestStepperProps {
  value: number;
  onChange: (n: number) => void;
}

function GuestStepper({ value, onChange }: GuestStepperProps) {
  // Estilos base compartidos entre ambos botones
  const btnBase: React.CSSProperties = {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
    flexShrink: 0,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {/* Botón − */}
      <button
        type="button"
        onClick={() => onChange(Math.max(MIN_GUESTS, value - 1))}
        disabled={value <= MIN_GUESTS}
        style={{
          ...btnBase,
          border: "1.5px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
          background: "color-mix(in srgb, var(--color-primary) 5%, transparent)",
          color: "var(--color-primary)",
          opacity: value <= MIN_GUESTS ? 0.2 : 1,
        }}
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>

      {/* Número */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "64px" }}>
        <span
          style={{
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1,
            fontFamily: "var(--font-display, 'Fraunces', serif)",
            color: "var(--color-text-dark)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "4px",
            color: "color-mix(in srgb, var(--color-text-dark) 35%, transparent)",
          }}
        >
          {value === 1 ? "persona" : "personas"}
        </span>
      </div>

      {/* Botón + — mismo tamaño que −, distinto color para indicar acción primaria */}
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_GUESTS, value + 1))}
        disabled={value >= MAX_GUESTS}
        style={{
          ...btnBase,
          border: "1.5px solid var(--color-primary)",
          background: "var(--color-primary)",
          color: "white",
          opacity: value >= MAX_GUESTS ? 0.2 : 1,
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>

      <p style={{ fontSize: "11px", marginLeft: "4px", color: "color-mix(in srgb, var(--color-text-dark) 30%, transparent)" }}>
        Máx. {MAX_GUESTS}
      </p>
    </div>
  );
}

// ─── Success View ─────────────────────────────────────────────────────────────

interface SuccessViewProps {
  data: ReservationData;
  onReset: () => void;
}

function SuccessView({ data, onReset }: SuccessViewProps) {
  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div style={{ height: "4px", background: "var(--color-primary)" }} />
      <div
        style={{
          padding: "56px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
            color: "var(--color-primary)",
          }}
        >
          <CheckCircle2 size={32} strokeWidth={1.5} />
        </div>

        <h2
          style={{
            fontSize: "30px",
            fontWeight: 300,
            marginBottom: "8px",
            fontFamily: "var(--font-display, 'Fraunces', serif)",
            color: "var(--color-text-dark)",
          }}
        >
          ¡Reserva confirmada!
        </h2>
        <p
          style={{
            fontSize: "13px",
            marginBottom: "40px",
            maxWidth: "280px",
            lineHeight: 1.6,
            color: "color-mix(in srgb, var(--color-text-dark) 50%, transparent)",
          }}
        >
          Te redirigimos a WhatsApp para finalizar. ¡Te esperamos!
        </p>

        {/* Resumen de la reserva */}
        <div
          style={{
            width: "100%",
            maxWidth: "280px",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
            marginBottom: "32px",
            background: "color-mix(in srgb, var(--color-primary) 4%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)",
          }}
        >
          {[
            { label: "Nombre", value: data.clientName },
            { label: "Fecha", value: formatDateDisplay(data.date) },
            { label: "Hora", value: data.time },
            { label: "Personas", value: `${data.guests} ${data.guests === 1 ? "persona" : "personas"}` },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "12px 0",
                borderBottom: i < arr.length - 1
                  ? "1px solid color-mix(in srgb, var(--color-primary) 8%, transparent)"
                  : "none",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "color-mix(in srgb, var(--color-primary) 50%, transparent)",
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-dark)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onReset}
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            paddingBottom: "2px",
            background: "none",
            border: "none",
            borderBottom: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
            color: "color-mix(in srgb, var(--color-primary) 55%, transparent)",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          Hacer otra reserva
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReservationForm({
  restaurantId,
  onSubmit,
  timeSlots = DEFAULT_TIME_SLOTS,
  className = "",
  whatsappNumber = "573001234567",
}: ReservationFormProps) {
  const [form, setForm] = useState<ReservationData>({
    restaurantId,
    clientName: "",
    whatsapp: "",
    date: "",
    time: "",
    guests: 2,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationData, string>>>({});

  const lunchSlots = useMemo(
    () => timeSlots.filter((t) => parseInt(t.split(":")[0] ?? "0") < 16),
    [timeSlots]
  );
  const dinnerSlots = useMemo(
    () => timeSlots.filter((t) => parseInt(t.split(":")[0] ?? "0") >= 16),
    [timeSlots]
  );

  const stepComplete = useMemo(
    () => ({
      contact: Boolean(form.clientName && form.whatsapp),
      date: Boolean(form.date),
      time: Boolean(form.time),
      guests: true,
    }),
    [form]
  );

  const set = <K extends keyof ReservationData>(key: K, value: ReservationData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const newErrors: Partial<Record<keyof ReservationData, string>> = {};
    if (!form.clientName.trim()) newErrors.clientName = "Nombre requerido";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp requerido";
    if (!form.date) newErrors.date = "Selecciona una fecha";
    if (!form.time) newErrors.time = "Selecciona una hora";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.(form);
      const lines = [
        `¡Hola! Quisiera confirmar una reserva:\n`,
        `👤 Nombre: ${form.clientName}`,
        `📱 WhatsApp: ${form.whatsapp}`,
        `📅 Fecha: ${formatDateDisplay(form.date)}`,
        `⏰ Hora: ${form.time}`,
        `👥 Personas: ${form.guests}`,
        form.notes ? `📝 Notas: ${form.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const waUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent(lines)}`;
      window.open(waUrl, "_blank");
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessView data={form} onReset={() => setSuccess(false)} />;
  }

  const completedCount = Object.values(stepComplete).filter(Boolean).length;

  return (
    /*
     * Wrapper externo: margin lateral fijo en px para que la card nunca
     * toque los bordes de pantalla en móvil.
     * No usa clases de padding de Tailwind — evita la dependencia de --spacing.
     */
    <div className={className} style={{ margin: "0 16px" }}>
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            /*
             * FIXED: padding inline fijo en px.
             * Ya no usa px-8 / pt-9 / pb-8 de Tailwind que dependen de --spacing.
             */
            padding: "36px 40px 32px",
            background: "var(--color-primary)",
            overflow: "hidden",
          }}
        >
          {/* Círculos decorativos de fondo */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", right: "-40px", top: "-40px",
              width: "176px", height: "176px", borderRadius: "50%",
              background: "rgba(255,255,255,0.06)", pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute", right: "96px", bottom: "-40px",
              width: "112px", height: "112px", borderRadius: "50%",
              background: "rgba(255,255,255,0.04)", pointerEvents: "none",
            }}
          />

          {/* Fila: título + badge WhatsApp */}
          <div
            style={{
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.24em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)", marginBottom: "8px",
              }}
            >
              Restaurante La Carreta
            </p>
            <h2
              style={{
                fontSize: "28px", fontWeight: 300,
                color: "white", lineHeight: 1.2,
                fontFamily: "var(--font-display, 'Fraunces', serif)",
              }}
            >
              Reserva tu mesa
            </h2>
          </div>

          {/* Barra de progreso */}
          <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ flex: 1, display: "flex", gap: "6px" }}>
              {Object.values(stepComplete).map((done, i) => (
                <div
                  key={i}
                  style={{
                    height: "3px", borderRadius: "999px",
                    flex: done ? 2 : 1,
                    background: done ? "white" : "rgba(255,255,255,0.2)",
                    transition: "all 0.5s ease",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: "10px", color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.05em", flexShrink: 0,
                marginLeft: "8px", fontVariantNumeric: "tabular-nums",
              }}
            >
              {completedCount} / 4
            </span>
          </div>
        </div>

        {/* ── Cuerpo del formulario ───────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          style={{
            /*
             * FIXED: padding inline fijo en px.
             * Ya no usa px-8 / pt-9 / pb-10 de Tailwind que dependen de --spacing.
             */
            padding: "36px 40px 40px",
          }}
        >
          {/* Step 1 — Datos de contacto */}
          <Step
            number={1}
            label="Tus datos"
            icon={<User size={12} />}
            isComplete={stepComplete.contact}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "24px",
              }}
            >
              <UnderlineInput
                type="text"
                placeholder="Juan Pérez"
                value={form.clientName}
                onChange={(e) => set("clientName", e.target.value)}
                error={errors.clientName}
                aria-label="Nombre completo"
              />
              <UnderlineInput
                type="tel"
                placeholder="300 123 4567"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                error={errors.whatsapp}
                aria-label="Número de WhatsApp"
              />
            </div>
          </Step>

          {/* Step 2 — Fecha */}
          <Step
            number={2}
            label="Selecciona el día"
            icon={<Calendar size={12} />}
            isComplete={stepComplete.date}
          >
            <div>
              <UnderlineInput
                type="date"
                min={todayISO()}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                error={errors.date}
                aria-label="Fecha de la reserva"
                style={{ colorScheme: "light" }}
              />
              {form.date && (
                <p
                  style={{
                    marginTop: "10px", fontSize: "12px",
                    textTransform: "capitalize",
                    color: "color-mix(in srgb, var(--color-primary) 65%, transparent)",
                  }}
                >
                  {formatDateDisplay(form.date)}
                </p>
              )}
            </div>
          </Step>

          {/* Step 3 — Hora */}
          <Step
            number={3}
            label="¿A qué hora?"
            icon={<Clock size={12} />}
            isComplete={stepComplete.time}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {errors.time && (
                <p style={{ fontSize: "11px", color: "#c0392b" }}>{errors.time}</p>
              )}
              <TimeGrid slots={lunchSlots} label="Almuerzo" selected={form.time} onSelect={(t) => set("time", t)} />
              <TimeGrid slots={dinnerSlots} label="Cena" selected={form.time} onSelect={(t) => set("time", t)} />
            </div>
          </Step>

          {/* Step 4 — Personas */}
          <Step
            number={4}
            label="¿Cuántos vendrán?"
            icon={<Users size={12} />}
            isComplete={stepComplete.guests}
            isLast
          >
            <GuestStepper value={form.guests} onChange={(n) => set("guests", n)} />
          </Step>

          {/* Divisor visual */}
          <div
            style={{
              height: "1px",
              margin: "32px 0",
              background: "color-mix(in srgb, var(--color-border) 45%, transparent)",
            }}
          />

          {/* Notas opcionales */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "20px",
                color: "color-mix(in srgb, var(--color-primary) 42%, transparent)",
              }}
            >
              <MessageSquare size={12} />
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Notas especiales{" "}
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal", opacity: 0.6 }}>
                  · opcional
                </span>
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="Alergias, cumpleaños, silla para bebé..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              style={{
                width: "100%",
                background: "color-mix(in srgb, var(--color-primary) 3%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-border) 45%, transparent)",
                borderRadius: "10px",
                resize: "none",
                fontSize: "14px",
                outline: "none",
                padding: "14px 16px",
                color: "var(--color-text-dark)",
                transition: "border-color 0.25s ease, background 0.25s ease",
                lineHeight: 1.6,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-primary) 35%, transparent)";
                e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 2%, white)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-border) 45%, transparent)";
                e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 3%, transparent)";
              }}
            />
          </div>

          {/* Trust banner — integrated into brand palette, no competing green */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px", marginBottom: "20px", padding: "12px 16px",
              borderRadius: "10px",
              background: "color-mix(in srgb, var(--color-primary) 5%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
            }}
          >
            <span
              style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "color-mix(in srgb, var(--color-primary) 45%, transparent)",
                flexShrink: 0, display: "inline-block",
              }}
            />
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.03em", color: "color-mix(in srgb, var(--color-text-dark) 50%, transparent)" }}>
              Recibirás confirmación por WhatsApp · Sin cargos
            </p>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="rsv-cta"
            style={{
              width: "100%",
              padding: "18px 24px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              border: "none",
              background: "var(--color-primary)",
              color: "white",
              fontFamily: "var(--font-display, 'Fraunces', serif)",
              boxShadow: "0 6px 24px color-mix(in srgb, var(--color-primary) 30%, transparent)",
              transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {loading ? (
              <span style={{ opacity: 0.7 }}>Procesando…</span>
            ) : (
              <>
                Confirmar reserva
                <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* Scoped hover/active styles for CTA */}
          <style>{`
            .rsv-cta:hover:not(:disabled) {
              filter: brightness(1.1);
              box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 40%, transparent) !important;
              transform: translateY(-1px);
            }
            .rsv-cta:active:not(:disabled) {
              transform: translateY(0);
              filter: brightness(0.95);
              box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 20%, transparent) !important;
            }
          `}</style>
        </form>
      </div>
    </div>
  );
}