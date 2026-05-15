"use client";

import { useState } from "react";
import type { Experience } from "@repo/database/types";
import { ImageUploader } from "@repo/ui/image-uploader";
import { createBrowserClient } from "@supabase/ssr";
import {
  Plus, Eye, EyeOff, Edit, Trash2,
  Calendar, Users, DollarSign, BookOpen,
  Save, X, Clock,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-CO", {
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(price);
}

/* ═══════════════════════════════════════════════════════════
   FIELD — form label wrapper
   ═══════════════════════════════════════════════════════════ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: "var(--font-weight-bold)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wider)",
          color: "var(--text-3)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE CARD
   ═══════════════════════════════════════════════════════════ */

function ExperienceCard({
  exp,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  exp: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (exp: Experience) => void;
  onTogglePublish: (exp: Experience) => void;
}) {
  const occupancy = exp.capacity > 0 ? Math.round((exp.booked / exp.capacity) * 100) : 0;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast)",
      }}
      className="hover:!border-[var(--border-strong)] hover:!shadow-[var(--shadow-3)] hover:!translate-y-[-1px]"
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", height: 148, background: "var(--bg-3)", flexShrink: 0, overflow: "hidden" }}>
        {exp.photos?.[0] ? (
          <img
            src={exp.photos[0]}
            alt={exp.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform var(--dur-slow)" }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={32} style={{ color: "var(--text-4)" }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, var(--surface) 0%, transparent 60%)",
          }}
        />

        {/* Dl accent bar top */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "var(--dl)",
          }}
        />

        {/* Status badge */}
        <button
          onClick={() => onTogglePublish(exp)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: "var(--radius-full)",
            fontSize: 10,
            fontWeight: "var(--font-weight-bold)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider)",
            border: "1px solid",
            cursor: "pointer",
            transition: "all var(--dur-fast)",
            backdropFilter: "blur(8px)",
            ...(exp.is_published
              ? {
                background: "rgba(46,213,115,0.15)",
                color: "var(--success)",
                borderColor: "var(--success-border)",
              }
              : {
                background: "rgba(8,9,10,0.6)",
                color: "var(--text-3)",
                borderColor: "var(--border-strong)",
              }),
          }}
        >
          {exp.is_published ? <Eye size={11} /> : <EyeOff size={11} />}
          {exp.is_published ? "Publicado" : "Borrador"}
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "clamp(14px, 2vw, 18px)", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3
          style={{
            fontSize: "var(--text-md)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--text)",
            lineHeight: 1.25,
            letterSpacing: "var(--tracking-tight)",
            marginBottom: 6,
          }}
        >
          {exp.title}
        </h3>

        {exp.description && (
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-3)",
              lineHeight: "var(--leading-normal)",
              marginBottom: 14,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {exp.description}
          </p>
        )}

        {/* Meta chips */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {[
            { icon: <Calendar size={11} />, value: formatDate(exp.date) },
            { icon: <Clock size={11} />, value: formatTime(exp.date) },
            { icon: <Users size={11} />, value: `${exp.booked}/${exp.capacity} cupos` },
            { icon: <DollarSign size={11} />, value: formatPrice(exp.price) },
          ].map(({ icon, value }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 8px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                fontSize: "var(--text-xs)",
                color: i === 3 ? "var(--dl)" : "var(--text-2)",
              }}
            >
              <span style={{ color: "var(--dl)", flexShrink: 0 }}>{icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Occupancy bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)" }}>
              Ocupación
            </span>
            <span style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", color: occupancy >= 80 ? "var(--warning)" : "var(--text-3)", fontVariantNumeric: "tabular-nums" }}>
              {occupancy}%
            </span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${occupancy}%`,
                background: occupancy >= 80 ? "var(--warning)" : "var(--dl)",
                borderRadius: "var(--radius-full)",
                transition: "width var(--dur-slow) var(--ease-smooth)",
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <button
            onClick={() => onEdit(exp)}
            className="btn-action btn-ghost"
            style={{ height: 32, fontSize: 10, letterSpacing: "var(--tracking-wider)", textTransform: "uppercase" }}
          >
            <Edit size={12} />
            Editar
          </button>
          <button
            onClick={() => onDelete(exp)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-3)",
              cursor: "pointer",
              transition: "all var(--dur-fast)",
            }}
            className="hover:!border-[var(--danger-border)] hover:!text-[var(--danger)] hover:!bg-[var(--danger-bg)]"
            title="Eliminar"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CLIENT
   ═══════════════════════════════════════════════════════════ */

export default function ContenidoClient({
  initialExperiences,
  restaurantId,
}: {
  initialExperiences: Experience[];
  restaurantId: string;
}) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [price, setPrice] = useState(150000);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /* ── Form helpers ── */
  const openForm = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setTitle(exp.title);
      setDescription(exp.description ?? "");
      setDate(exp.date.substring(0, 16));
      setCapacity(exp.capacity);
      setPrice(exp.price);
      setPhotoFile(null);
      setPhotoPreview(exp.photos?.[0] ?? null);
    } else {
      setEditingExp(null);
      setTitle(""); setDescription(""); setDate("");
      setCapacity(10); setPrice(150000);
      setPhotoFile(null); setPhotoPreview(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => { setIsFormOpen(false); setEditingExp(null); };

  /* ── Actions (lógica intacta) ── */
  const handleTogglePublish = async (exp: Experience) => {
    try {
      const res = await fetch(`/api/experiences/${exp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: restaurantId, is_published: !exp.is_published }),
      });
      if (!res.ok) throw new Error();
      const { data } = await res.json() as { data: Experience };
      setExperiences((prev) => prev.map((e) => (e.id === exp.id ? data : e)));
      fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-revalidation-secret": process.env.NEXT_PUBLIC_REVALIDATION_SECRET ?? "" },
        body: JSON.stringify({ path: "/catas", domains: ["https://delicazipa.co"] }),
      }).catch(() => { });
    } catch {
      alert("Error actualizando la cata");
    }
  };

  const handleDelete = async (exp: Experience) => {
    if (!confirm(`¿Eliminar "${exp.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/experiences/${exp.id}?restaurantId=${restaurantId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
    } catch {
      alert("Error eliminando la cata");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalPhotoUrls: string[] = editingExp?.photos ?? [];
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const fileName = `${restaurantId}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(fileName, photoFile);
        if (uploadError) {
          alert("Error subiendo imagen. Guardando sin ella.");
        } else {
          const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
          finalPhotoUrls = [urlData.publicUrl];
        }
      }
      const payload = {
        restaurant_id: restaurantId, title, description,
        date: new Date(date).toISOString(),
        capacity, price, photos: finalPhotoUrls,
        is_published: editingExp ? editingExp.is_published : false,
      };
      if (editingExp) {
        const res = await fetch(`/api/experiences/${editingExp.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const { data } = await res.json() as { data: Experience };
        setExperiences((prev) => prev.map((e) => (e.id === editingExp.id ? data : e)));
      } else {
        const res = await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const { data } = await res.json() as { data: Experience };
        setExperiences([data, ...experiences]);
      }
      closeForm();
    } catch {
      alert("Ocurrió un error guardando la cata.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Render ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => openForm()}
          className="btn-action btn-primary"
          style={{ height: 38, gap: 7 }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Nueva experiencia
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL
          ══════════════════════════════════════════════════ */}
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0 0 0 0",
          }}
          className="sm:!items-center sm:!p-4"
        >
          {/* Backdrop */}
          <div
            onClick={closeForm}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(8,9,10,0.88)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Sheet */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: 520,
              maxHeight: "94dvh",
              overflowY: "auto",
              background: "var(--bg-2)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
              boxShadow: "var(--shadow-5)",
            }}
            className="sm:!rounded-[var(--radius-2xl)]"
          >
            {/* Modal header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                background: "rgba(14,16,19,0.85)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-md)",
                    background: "var(--dl-bg)",
                    border: "1px solid var(--dl-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--dl)",
                  }}
                >
                  <BookOpen size={15} />
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--text)", lineHeight: 1.2 }}>
                    {editingExp ? "Editar experiencia" : "Nueva experiencia"}
                  </p>
                  <p style={{ fontSize: 10, fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-4)", marginTop: 2 }}>
                    CMS · Delica
                  </p>
                </div>
              </div>
              <button
                onClick={closeForm}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-3)",
                  cursor: "pointer",
                  transition: "all var(--dur-fast)",
                }}
                className="hover:!text-[var(--text)] hover:!bg-white/5"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{ padding: "20px 20px 32px", display: "flex", flexDirection: "column", gap: 18 }}
            >
              <Field label="Título de la experiencia">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Cata de Varietales Exóticos"
                  className="admin-input"
                  style={{ height: 38, fontSize: "var(--text-sm)" }}
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe la experiencia..."
                  className="admin-input"
                  style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)", paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Fecha y hora">
                  <input
                    required
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="admin-input"
                    style={{ height: 38, fontSize: "var(--text-sm)", colorScheme: "dark" }}
                  />
                </Field>
                <Field label="Cupos">
                  <div style={{ position: "relative" }}>
                    <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                    <input
                      required
                      type="number"
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="admin-input"
                      style={{ height: 38, fontSize: "var(--text-sm)", paddingLeft: 30 }}
                    />
                  </div>
                </Field>
              </div>

              <Field label="Precio por persona (COP)">
                <div style={{ position: "relative" }}>
                  <DollarSign size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input
                    required
                    type="number"
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="admin-input"
                    style={{ height: 38, fontSize: "var(--text-sm)", paddingLeft: 30, fontFamily: '"DM Mono", monospace' }}
                  />
                </div>
              </Field>

              <Field label="Fotografía de portada">
                <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-strong)", background: "rgba(255,255,255,0.02)" }}>
                  <ImageUploader
                    restaurant="admin"
                    onFile={(file, preview) => { setPhotoFile(file); setPhotoPreview(preview); }}
                  />
                </div>
                {photoPreview && !photoFile && (
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--info)", marginTop: 4 }}>
                    Imagen actual preservada. Sube otra para reemplazar.
                  </p>
                )}
              </Field>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="btn-action btn-ghost"
                  style={{ flex: 1, justifyContent: "center", height: 40 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-action btn-primary"
                  style={{ flex: 1, justifyContent: "center", height: 40, opacity: isSubmitting ? 0.6 : 1 }}
                >
                  {isSubmitting ? "···" : <Save size={14} />}
                  {isSubmitting ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          EXPERIENCE GRID / EMPTY STATE
          ══════════════════════════════════════════════════ */}
      {experiences.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(40px, 8vw, 80px) 24px",
            gap: 20,
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-soft)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "var(--radius-lg)",
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={22} style={{ color: "var(--text-3)" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-2)", marginBottom: 6 }}>
              No hay experiencias
            </p>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-3)", maxWidth: 260, lineHeight: "var(--leading-normal)" }}>
              Comienza creando tu primera cata exclusiva.
            </p>
          </div>
          <button onClick={() => openForm()} className="btn-action btn-primary" style={{ height: 36 }}>
            <Plus size={13} />
            Nueva experiencia
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "clamp(10px, 1.5vw, 16px)",
          }}
        >
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              onEdit={openForm}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
}