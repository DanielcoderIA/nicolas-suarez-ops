"use client";

import { useState } from "react";
import { MenuCard, ScrollReveal } from "@repo/ui";
import { MenuCategoryFilter } from "@/components/MenuCategoryFilter";
import { MenuItemSheet } from "@/components/MenuItemSheet";

/** Menu item shape — mirrors @repo/ui MenuCard's MenuItem interface */
interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  category: string;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Human-readable category labels */
const CATEGORY_LABELS: Record<string, string> = {
  entradas: "Entradas",
  especialidades: "Especialidades",
  "carnes-maduradas": "Carnes Maduradas",
  "cortes-especiales": "Cortes Especiales",
  "platos-tipicos": "Platos Típicos",
  "cremas-sopas": "Cremas y Sopas",
  "pollo-cerdo": "Pollo & Cerdo",
  "pescados-mariscos": "Pescados & Mariscos",
  ensaladas: "Ensaladas",
  vegetarianos: "Vegetarianos",
  hamburguesas: "Hamburguesas",
  arroces: "Arroces",
  guarniciones: "Guarniciones",
  "bebidas-frescas": "Bebidas Frescas",
  "bebidas-calientes": "Bebidas Calientes",
  postres: "Postres",
  cocteles: "Cócteles",
  cervezas: "Cervezas",
  licores: "Licores",
  "menu-infantil": "Menú Infantil",
};

interface MenuContentProps {
  menuItems: MenuItem[];
  categories: string[];
}

export function MenuContent({ menuItems, categories }: MenuContentProps) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  /* Group items by category */
  const groupedMenu = categories
    .map((category) => ({
      category,
      items: menuItems.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  /* Filter visible groups */
  const visibleGroups =
    activeCategory === "todos"
      ? groupedMenu
      : groupedMenu.filter((g) => g.category === activeCategory);

  return (
    <>
      {/* Sticky Category Filter */}
      <MenuCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="layout-container py-14 md:py-20 pb-28">
        {visibleGroups.map((group, i) => {
          const label = CATEGORY_LABELS[group.category] ?? group.category;
          const hasPhotos = group.items.some((item) => item.photo_url);

          return (
            <ScrollReveal key={group.category} delay={Math.min(i * 80, 400)}>
              {/* Section divider — only between sections, not before the first */}
              {i > 0 && (
                <div className="flex items-center gap-5 my-16 md:my-20">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4c4a8]/60 to-transparent" />
                  <span className="text-[#C4972A]/70 text-[12px] tracking-[0.3em] font-['DM_Sans',sans-serif]">✦</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4c4a8]/60 to-transparent" />
                </div>
              )}

              <section
                id={`category-${group.category}`}
                className="scroll-mt-40"
              >
                {/* Section header */}
                <div className="flex items-center gap-4 mb-10 md:mb-12">
                  <div className="flex flex-col">
                    <h2 className="font-['Fraunces',serif] text-[30px] md:text-[36px] font-light text-[#1a0f0a] leading-tight tracking-tight">
                      {label}
                    </h2>
                    <div className="h-[2px] w-14 bg-gradient-to-r from-[#6B1700] to-[#C4972A] mt-3 rounded-full" />
                  </div>
                </div>

                {/* Grid — photo cards use 3/4 aspect, editorial cards use auto height */}
                <div className={
                  hasPhotos
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-0"
                }>
                  {group.items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      restaurant="la-carreta"
                      onClick={(i) => setSelectedItem(i)}
                    />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          );
        })}

        {visibleGroups.length === 0 && (
          <div className="text-center py-24 bg-[#FEFAF4] rounded-sm border border-[#e8dfd0]">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FDF6EC] flex items-center justify-center border border-[#e8dfd0]">
              <svg className="w-7 h-7 text-[#C4972A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-['DM_Sans',sans-serif] text-[15px] text-[#2a1a0f]/60 mb-4">
              El menú se está actualizando. Vuelve pronto.
            </p>
            <a
              href="/"
              className="font-['DM_Sans',sans-serif] text-[13px] font-bold tracking-[0.1em] uppercase text-[#6B1700] hover:text-[#C4972A] transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        )}
      </div>

      {/* Item Detail Sheet/Modal */}
      {selectedItem && (
        <MenuItemSheet
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
