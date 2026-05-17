"use client";

import { useState } from "react";
import { ScrollReveal } from "@repo/ui";
import { MenuCategoryFilter } from "@/components/MenuCategoryFilter";
import { useCartStore } from "@/store/useCartStore";
import {
  MENU_ITEMS,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_SUBTITLES,
  CATEGORY_ICONS,
  CATEGORY_EXTRAS,
  type StaticMenuItem,
} from "@/lib/menu-data";

/* ─── Tokens ──────────────────────────────────────────────────────────────── */
const NAVY = "#041C2C";
const OCEAN = "#0A3D62";
const TEAL = "#1ABC9C";
const PEARL = "#F0F8FF";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

/* ─── Editorial Menu Item Row ─────────────────────────────────────────────── */
function MenuItemRow({ item }: { item: StaticMenuItem }) {
  const { addItem } = useCartStore();

  const handleAdd = (price: number, variant?: string) => {
    addItem({
      id: item.id,
      name: item.name,
      price: price,
      quantity: 1,
      variant: variant,
    });
  };

  return (
    <article className="group relative bg-transparent rounded-md transition-all duration-300 active:scale-[0.99] active:bg-[#0A3D62]/[0.03]">
      <div className="py-5 px-1 min-h-[56px]">
        {/* Title + Dotted Leader + Price + Add Button */}
        <div className="flex items-baseline w-full gap-3">
          <h3
            className="font-['Libre_Baskerville',serif] text-[17px] md:text-[18px] font-normal tracking-tight leading-snug transition-colors duration-300 max-w-[70%] group-hover:text-[#1ABC9C]"
            style={{ color: NAVY }}
          >
            {item.name}
          </h3>
          {/* Dotted leader */}
          <div
            className="flex-grow border-b-[2px] border-dotted min-w-[24px] translate-y-[-5px]"
            style={{ borderColor: "rgba(26,188,156,0.25)" }}
            aria-hidden="true"
          />
          <span
            className="font-['DM_Sans',sans-serif] text-[15px] flex-shrink-0 whitespace-nowrap font-semibold"
            style={{ color: OCEAN }}
          >
            {formatCOP(item.price)}
          </span>
          {(!item.priceVariants || item.priceVariants.length === 0) && (
            <button
              onClick={() => handleAdd(item.price)}
              className="ml-3 w-7 h-7 rounded-full border border-[#0A3D62]/10 flex items-center justify-center text-[#0A3D62]/40 hover:text-[#1ABC9C] hover:border-[#1ABC9C] transition-all duration-300 focus:outline-none flex-shrink-0 group/btn"
              aria-label={`Agregar ${item.name}`}
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
            </button>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p
            className="font-['DM_Sans',sans-serif] text-[13px] leading-[1.65] mt-2 line-clamp-2 max-w-[82%]"
            style={{ color: "rgba(10,61,98,0.55)" }}
          >
            {item.description}
          </p>
        )}

        {/* Price Variants (for fish by weight) */}
        {item.priceVariants && item.priceVariants.length > 0 && (
          <div className="flex flex-col gap-y-2 mt-3">
            {item.priceVariants.map((v) => (
              <div key={v.label} className="flex items-center justify-between border-b border-[#0A3D62]/5 pb-1 last:border-0">
                <span
                  className="font-['DM_Sans',sans-serif] text-[13px]"
                  style={{ color: "rgba(10,61,98,0.6)" }}
                >
                  <span className="font-medium" style={{ color: OCEAN }}>
                    {v.label}
                  </span>{" "}
                  — {formatCOP(v.price)}
                </span>
                <button
                  onClick={() => handleAdd(v.price, v.label)}
                  className="ml-3 w-6 h-6 rounded-full border border-[#0A3D62]/10 flex items-center justify-center text-[#0A3D62]/40 hover:text-[#1ABC9C] hover:border-[#1ABC9C] transition-all duration-300 focus:outline-none flex-shrink-0 group/btn"
                  aria-label={`Agregar ${item.name} - ${v.label}`}
                >
                  <svg className="w-3 h-3 transition-transform duration-300 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Extras Block ────────────────────────────────────────────────────────── */
function ExtrasBlock({ label, items }: { label: string; items: { name: string; price: number }[] }) {
  return (
    <div
      className="mt-6 rounded-lg px-5 py-4"
      style={{ backgroundColor: "rgba(26,188,156,0.04)", border: "1px solid rgba(26,188,156,0.12)" }}
    >
      <p
        className="font-['DM_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase mb-3"
        style={{ color: TEAL }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-1">
        {items.map((extra) => (
          <span
            key={extra.name}
            className="font-['DM_Sans',sans-serif] text-[13px]"
            style={{ color: "rgba(10,61,98,0.6)" }}
          >
            {extra.name}{" "}
            <span className="font-semibold" style={{ color: OCEAN }}>
              {formatCOP(extra.price)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export function MenuContent() {
  const [activeCategory, setActiveCategory] = useState("todos");

  /* Group items by category */
  const groupedMenu = CATEGORY_ORDER
    .map((category) => ({
      category,
      items: MENU_ITEMS.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  /* Tab behavior: Render only the selected category, or all if 'todos' */
  const visibleGroups = activeCategory === "todos"
    ? groupedMenu
    : groupedMenu.filter((g) => g.category === activeCategory);

  const categories = groupedMenu.map((g) => g.category);

  return (
    <>
      {/* Sticky Category Filter */}
      <MenuCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div id="menu-container" className="layout-container py-14 md:py-20 pb-28 min-h-[60vh]">
        {visibleGroups.map((group, i) => {
          const label = CATEGORY_LABELS[group.category] ?? group.category;
          const subtitle = CATEGORY_SUBTITLES[group.category];
          const icon = CATEGORY_ICONS[group.category];
          const extras = CATEGORY_EXTRAS[group.category];

          return (
            <ScrollReveal key={group.category} delay={Math.min(i * 80, 400)}>
              {/* Section divider — between sections */}
              {i > 0 && (
                <div className="flex items-center gap-5 my-14 md:my-18">
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(26,188,156,0.25), transparent)`,
                    }}
                  />
                  <span
                    className="text-[14px] tracking-[0.3em] font-['DM_Sans',sans-serif]"
                    style={{ color: "rgba(26,188,156,0.5)" }}
                  >
                    ✦
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(26,188,156,0.25), transparent)`,
                    }}
                  />
                </div>
              )}

              <section id={`category-${group.category}`} className="scroll-mt-40">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-2 md:mb-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      {icon && <span className="text-[22px]">{icon}</span>}
                      <h2
                        className="font-['Libre_Baskerville',serif] text-[28px] md:text-[34px] font-normal leading-tight tracking-tight"
                        style={{ color: NAVY }}
                      >
                        {label}
                      </h2>
                    </div>
                    <div
                      className="h-[2px] w-14 mt-3 rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${TEAL}, rgba(26,188,156,0.3))`,
                      }}
                    />
                  </div>
                </div>

                {/* Category subtitle */}
                {subtitle && (
                  <p
                    className="font-['DM_Sans',sans-serif] text-[12px] italic leading-relaxed mb-6 pl-1 max-w-[600px]"
                    style={{ color: "rgba(10,61,98,0.45)" }}
                  >
                    {subtitle}
                  </p>
                )}
                {!subtitle && <div className="mb-6" />}

                {/* Items grid — 2 columns on desktop for editorial feel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
                  {group.items.map((item) => (
                    <MenuItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Category-specific extras */}
                {extras && (
                  <ExtrasBlock label={extras.label} items={extras.items} />
                )}
              </section>
            </ScrollReveal>
          );
        })}

        {visibleGroups.length === 0 && (
          <div
            className="text-center py-24 rounded-lg"
            style={{
              backgroundColor: PEARL,
              border: "1px solid rgba(10,61,98,0.08)",
            }}
          >
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(26,188,156,0.06)",
                border: "1px solid rgba(26,188,156,0.15)",
              }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: TEAL }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p
              className="font-['DM_Sans',sans-serif] text-[15px] mb-4"
              style={{ color: "rgba(10,61,98,0.5)" }}
            >
              El menú se está actualizando. Vuelve pronto.
            </p>
            <a
              href="/"
              className="font-['DM_Sans',sans-serif] text-[13px] font-bold tracking-[0.1em] uppercase transition-colors"
              style={{ color: OCEAN }}
            >
              Volver al inicio
            </a>
          </div>
        )}
      </div>
    </>
  );
}
