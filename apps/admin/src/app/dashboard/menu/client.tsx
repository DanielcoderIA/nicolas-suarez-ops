"use client";

import { useState } from "react";
import type { MenuItem } from "@repo/database/types";
import { SearchX, Layers } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const RESTAURANT_NAMES: Record<string, string> = {
  "11111111-1111-1111-1111-111111111111": "La Carreta",
  "22222222-2222-2222-2222-222222222222": "Mar y Tierra",
  "33333333-3333-3333-3333-333333333333": "Delica",
};

const RESTAURANT_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  "11111111-1111-1111-1111-111111111111": { color: "var(--lc)", bg: "var(--lc-bg)", border: "var(--lc-border)" },
  "22222222-2222-2222-2222-222222222222": { color: "var(--mt)", bg: "var(--mt-bg)", border: "var(--mt-border)" },
  "33333333-3333-3333-3333-333333333333": { color: "var(--dl)", bg: "var(--dl-bg)", border: "var(--dl-border)" },
};

const CATEGORY_LABEL: Record<string, string> = {
  entradas: "Entradas",
  principales: "Principales",
  postres: "Postres",
  bebidas: "Bebidas",
  catas: "Catas",
  // ── La Carreta ──
  especialidades: "Especialidades",
  "carnes-maduradas": "Carnes Maduradas",
  "cortes-especiales": "Cortes Especiales",
  "platos-tipicos": "Platos Típicos",
  "cremas-sopas": "Cremas & Sopas",
  "pollo-cerdo": "Pollo & Cerdo",
  "pescados-mariscos": "Pescados & Mariscos",
  ensaladas: "Ensaladas",
  vegetarianos: "Vegetarianos",
  hamburguesas: "Hamburguesas",
  arroces: "Arroces",
  guarniciones: "Guarniciones",
  "bebidas-frescas": "Bebidas Frescas",
  "bebidas-calientes": "Bebidas Calientes",
  cocteles: "Cócteles",
  cervezas: "Cervezas",
  licores: "Licores",
  "menu-infantil": "Menú Infantil",
  // ── Mar y Tierra ──
  "pescados-fritos": "Pescados Fritos",
  "pescados-plancha": "A la Plancha",
  "pescados-marinera": "Salsa Marinera",
  "pescados-criolla": "Salsa Criolla",
  "cazuelas-sancochos": "Cazuelas & Sancochos",
  carnes: "Carnes",
  adiciones: "Adiciones",
  vinos: "Vinos",
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ═══════════════════════════════════════════════════════════
   MENU ITEM CARD
   ═══════════════════════════════════════════════════════════ */

function MenuItemCard({
  item,
  accentColor,
  accentBg,
  accentBorder,
  isUpdating,
  onToggle,
}: {
  item: MenuItem;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  isUpdating: string | null;
  onToggle: (id: string, restaurantId: string, current: boolean) => void;
}) {
  const isAvail = item.is_available;
  const isToggling = isUpdating === item.id;

  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface)",
        border: `1px solid ${isAvail ? "var(--border-soft)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast), opacity var(--dur-fast)",
        opacity: isAvail ? 1 : 0.65,
      }}
      className="hover:!border-[var(--border-strong)] hover:!shadow-[var(--shadow-2)] hover:!translate-y-[-1px] hover:!opacity-100"
    >
      {/* Top color bar — restaurant accent when available, danger when not */}
      <div
        style={{
          height: 2,
          background: isAvail ? accentColor : "var(--danger)",
          transition: "background var(--dur-normal)",
        }}
      />

      <div style={{ padding: "clamp(14px, 2vw, 18px)", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Name + price */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <h3
            style={{
              fontSize: "var(--text-md)",
              fontWeight: "var(--font-weight-semibold)",
              color: isAvail ? "var(--text)" : "var(--text-3)",
              lineHeight: 1.25,
              letterSpacing: "var(--tracking-tight)",
              flex: 1,
              minWidth: 0,
              transition: "color var(--dur-fast)",
            }}
          >
            {item.name}
          </h3>
          <span
            style={{
              flexShrink: 0,
              fontSize: "var(--text-xs)",
              fontFamily: '"DM Mono", monospace',
              fontWeight: "var(--font-weight-bold)",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              background: isAvail ? accentBg : "rgba(255,255,255,0.03)",
              color: isAvail ? accentColor : "var(--text-3)",
              border: `1px solid ${isAvail ? accentBorder : "var(--border)"}`,
              textDecoration: isAvail ? "none" : "line-through",
              letterSpacing: "0.02em",
              transition: "all var(--dur-fast)",
            }}
          >
            {formatPrice(Number(item.price))}
          </span>
        </div>

        {/* Description */}
        {item.description && (
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
            {item.description}
          </p>
        )}

        {/* Footer: status + toggle */}
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
          {/* Availability indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isAvail ? "var(--success)" : "var(--danger)",
                boxShadow: isAvail ? "0 0 0 2.5px var(--success-bg)" : "0 0 0 2.5px var(--danger-bg)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: "var(--font-weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
                color: isAvail ? "var(--success)" : "var(--danger)",
              }}
            >
              {isAvail ? "Disponible" : "Agotado"}
            </span>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => onToggle(item.id, item.restaurant_id, isAvail)}
            disabled={!!isUpdating}
            style={{
              height: 30,
              padding: "0 12px",
              borderRadius: "var(--radius-md)",
              fontSize: 10,
              fontWeight: "var(--font-weight-bold)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
              border: `1px solid ${isAvail ? "var(--danger-border)" : accentBorder}`,
              color: isAvail ? "var(--danger)" : accentColor,
              background: isAvail ? "var(--danger-bg)" : accentBg,
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating && !isToggling ? 0.4 : 1,
              transition: "all var(--dur-fast)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {isToggling ? "···" : isAvail ? "Agotar" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CLIENT
   ═══════════════════════════════════════════════════════════ */

export default function MenuClient({
  initialItems,
  restaurantIds,
}: {
  initialItems: MenuItem[];
  restaurantIds: string[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [filterRestaurant, setFilterRestaurant] = useState<string>(restaurantIds[0] ?? "all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  /* ── Toggle handler (lógica intacta) ── */
  const handleToggle = async (id: string, restaurantId: string, currentStatus: boolean) => {
    if (isUpdating) return;
    setIsUpdating(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_available: !currentStatus } : item))
    );
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId }),
      });
      if (!res.ok) throw new Error();
      fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidation-secret": process.env.NEXT_PUBLIC_REVALIDATION_SECRET ?? "",
        },
        body: JSON.stringify({ path: "/menu" }),
      }).catch(() => { });
    } catch {
      setItems([...items]);
    } finally {
      setIsUpdating(null);
    }
  };

  const filtered =
    filterRestaurant === "all"
      ? items
      : items.filter((i) => i.restaurant_id === filterRestaurant);

  const grouped = filtered.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  /* Accent del restaurante activo */
  const activeStyle = RESTAURANT_STYLE[filterRestaurant] ?? {
    color: "var(--dl)", bg: "var(--dl-bg)", border: "var(--dl-border)",
  };

  /* Conteo disponibles en vista actual */
  const availCount = filtered.filter((i) => i.is_available).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Restaurant tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: 6,
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          overflowX: "auto",
        }}
      >
        {restaurantIds.length > 1 && (
          <TabButton
            active={filterRestaurant === "all"}
            onClick={() => setFilterRestaurant("all")}
            dot={undefined}
          >
            <Layers size={13} />
            Todos
          </TabButton>
        )}
        {restaurantIds.map((id) => {
          const style = RESTAURANT_STYLE[id];
          return (
            <TabButton
              key={id}
              active={filterRestaurant === id}
              onClick={() => setFilterRestaurant(id)}
              dot={style?.color}
            >
              {RESTAURANT_NAMES[id] ?? id}
            </TabButton>
          );
        })}

        {/* Count pill a la derecha */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingRight: 4 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: "var(--font-weight-bold)",
              color: "var(--text-3)",
              padding: "3px 10px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-strong)",
              whiteSpace: "nowrap",
            }}
          >
            {availCount}/{filtered.length} disponibles
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      {Object.keys(grouped).length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(40px, 8vw, 72px) 24px",
            gap: 16,
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-soft)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-lg)",
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SearchX size={20} style={{ color: "var(--text-3)" }} />
          </div>
          <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-2)" }}>
            No hay platos en este restaurante
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <section key={category}>
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: activeStyle.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: "var(--font-weight-bold)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-wider)",
                    color: "var(--text-3)",
                  }}
                >
                  {CATEGORY_LABEL[category] ?? category}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--text-4)",
                    padding: "2px 7px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {categoryItems.filter((i) => i.is_available).length}/{categoryItems.length}
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {categoryItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    accentColor={activeStyle.color}
                    accentBg={activeStyle.bg}
                    accentBorder={activeStyle.border}
                    isUpdating={isUpdating}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB BUTTON — local helper
   ───────────────────────────────────────────────────────────── */
function TabButton({
  active,
  onClick,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        height: 32,
        padding: "0 12px",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--text-xs)",
        fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
        color: active ? "var(--text)" : "var(--text-3)",
        background: active ? "var(--surface-2)" : "transparent",
        border: active ? "1px solid var(--border-strong)" : "1px solid transparent",
        cursor: "pointer",
        transition: "all var(--dur-fast)",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: active ? dot : "rgba(255,255,255,0.15)",
            flexShrink: 0,
            transition: "background var(--dur-fast)",
          }}
        />
      )}
      {children}
    </button>
  );
}