"use client";

import * as React from "react";
import type { BrandTheme } from "./button";
import { CustomImage } from "./custom-image";

/**
 * @repo/ui — MenuCard Component
 * Displays a menu item with WebP photo, name, price, and availability dot.
 * Applies brand tokens via .theme-${restaurant} on root.
 */

export interface MenuItem {
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

export type MenuCardRestaurant = Exclude<BrandTheme, "admin">;

export interface MenuCardProps {
  item: MenuItem;
  restaurant: MenuCardRestaurant;
  variant?: "light" | "dark";
  onAdd?: (item: MenuItem) => void;
  onClick?: (item: MenuItem) => void;
  className?: string;
}

const cardBase: Record<MenuCardRestaurant, string> = {
  "la-carreta": "relative group aspect-[3/4] bg-[#1C1410] overflow-hidden transition-all duration-500",
  "mar-y-tierra": "bg-white rounded-[10px] border border-[rgba(10,61,98,0.08)] shadow-[0_2px_8px_rgba(10,61,98,0.08),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(10,61,98,0.12),0_2px_4px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden",
  delica: "bg-[#1e100a] rounded-[2px] border border-[rgba(141,106,50,0.1)] shadow-[0_2px_12px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative",
};

const imagePlaceholder: Record<MenuCardRestaurant, string> = {
  "la-carreta": "bg-[#fcf8f2] border-b border-[#ede8df]",
  "mar-y-tierra": "bg-[#f4f9fd] border-b border-[#e8f4fd]",
  delica: "bg-[#180c08] border-b border-[#2C1810]",
};

const placeholderIconColor: Record<MenuCardRestaurant, string> = {
  "la-carreta": "text-[#e8dcc4]",
  "mar-y-tierra": "text-[#c8e8f5]",
  delica: "text-[#2C1810]",
};

const nameStyles: Record<MenuCardRestaurant, string> = {
  "la-carreta": "font-['Fraunces',serif] text-[15px] font-semibold text-[#2a1a0f] leading-snug",
  "mar-y-tierra": "font-['Libre_Baskerville',serif] text-[14px] font-bold text-[#1a2e3d] leading-snug",
  delica: "font-['Cormorant_Garamond',serif] text-[15px] font-semibold text-[#f0e8d8] leading-snug",
};

const priceStyles: Record<MenuCardRestaurant, string> = {
  "la-carreta": "font-['DM_Sans',sans-serif] text-[14px] font-bold text-[#6B1700]",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[14px] font-bold text-[#0A3D62]",
  delica: "font-['Cormorant_Garamond',serif] text-[18px] font-semibold text-[#8D6A32]",
};

const descStyles: Record<MenuCardRestaurant, string> = {
  "la-carreta": "font-['DM_Sans',sans-serif] text-[11px] text-[#2a1a0f]/60 leading-[1.5] mt-1",
  "mar-y-tierra": "font-['DM_Sans',sans-serif] text-[11px] text-[var(--color-text-muted)] leading-snug mt-0.5",
  delica: "font-['DM_Sans',sans-serif] text-[11px] text-[rgba(240,232,216,0.35)] leading-[1.55] mt-1",
};

const addButtonStyles: Record<MenuCardRestaurant, string> = {
  "la-carreta": "w-[26px] h-[26px] rounded-full bg-[#6B1700] text-[#C4972A] text-[18px] leading-none flex items-center justify-center shadow-[0_2px_6px_rgba(107,23,0,0.3)] hover:scale-110 transition-transform duration-200 cursor-pointer border-none focus-visible:outline-none",
  "mar-y-tierra": "w-[26px] h-[26px] rounded-full bg-[#1ABC9C] text-white text-[18px] leading-none flex items-center justify-center shadow-[0_2px_6px_rgba(26,188,156,0.3)] hover:scale-110 transition-transform duration-200 cursor-pointer border-none focus-visible:outline-none",
  delica: "w-[26px] h-[26px] rounded-[1px] border border-[rgba(141,106,50,0.4)] text-[#8D6A32] text-[16px] leading-none flex items-center justify-center bg-transparent hover:bg-[rgba(141,106,50,0.06)] transition-all duration-200 cursor-pointer focus-visible:outline-none",
};

const dotPosition: Record<MenuCardRestaurant, string> = {
  "la-carreta": "absolute bottom-2 left-2",
  "mar-y-tierra": "absolute bottom-2 right-2",
  delica: "hidden",
};

const dotSizeClass: Record<MenuCardRestaurant, string> = {
  "la-carreta": "w-1.5 h-1.5 border-[1.5px] border-white/60",
  "mar-y-tierra": "w-2 h-2 border-[1.5px] border-white",
  delica: "",
};

function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function MenuCard({ item, restaurant, variant = "light", onAdd, onClick, className = "" }: MenuCardProps) {
  const isSoldOut = !item.is_available;

  if (restaurant === "la-carreta") {
    // ── Editorial layout when NO photo ───────────────────────────────────
    // Premium typographic design: no boxes, no borders. Pure whitespace
    // and type hierarchy create separation. Inspired by fine-dining menus.
    if (!item.photo_url) {
      const isDark = variant === "dark";
      return (
        <article
          className={`theme-la-carreta group relative bg-transparent cursor-pointer rounded-md transition-all duration-300 active:scale-[0.99] ${isDark ? "active:bg-[#FDFAF5]/[0.03]" : "active:bg-[#1a0f0a]/[0.03]"} ${isSoldOut ? "opacity-50" : ""} ${className}`}
          aria-label={item.name}
          onClick={() => onClick?.(item)}
        >
          <div className="py-6 px-1 min-h-[64px]">
            {/* ── Title + Dotted Leader + Price ──────────────────────── */}
            <div className="flex items-baseline w-full gap-3">
              <h3 className={`font-['Fraunces',serif] text-[18px] font-medium tracking-tight leading-snug transition-colors duration-300 max-w-[70%] ${isDark ? "text-[#FDFAF5] group-hover:text-[#C9973A]" : "text-[#1a0f0a] group-hover:text-[#6B1700]"}`}>
                {item.name}
              </h3>
              {/* Dotted leader — connects name to price like a fine-dining menu */}
              <div className={`flex-grow border-b-[2px] border-dotted min-w-[24px] translate-y-[-5px] ${isDark ? "border-[#C9973A]/40" : "border-[#d8c8b0]"}`} aria-hidden="true" />
              <span
                className={`font-['DM_Sans',sans-serif] text-[15px] flex-shrink-0 whitespace-nowrap ${
                  isSoldOut
                    ? (isDark ? "line-through text-white/40" : "line-through text-[#b5a898]")
                    : (isDark ? "font-semibold text-[#C9973A]" : "font-semibold text-[#4a3625]")
                }`}
              >
                {formatCOP(item.price)}
                {/* Chevron affordance — tells mobile users "tap for more" */}
                <span className={`ml-1.5 text-[14px] font-light inline-block transition-all duration-300 group-hover:translate-x-0.5 ${isDark ? "text-[#C9973A]/60 group-hover:text-[#C9973A]" : "text-[#c4aa82] group-hover:text-[#C4972A]"}`} aria-hidden="true">›</span>
              </span>
            </div>

            {/* ── Description ────────────────────────────────────────── */}
            {item.description && (
              <p className={`font-['DM_Sans',sans-serif] text-[13px] leading-[1.65] mt-2.5 line-clamp-2 max-w-[82%] ${isDark ? "text-[#FDFAF5]/60" : "text-[#7a6a58]"}`}>
                {item.description}
              </p>
            )}

            {/* ── Sold out badge (only when unavailable) ─────────────── */}
            {isSoldOut && (
              <span className={`inline-block mt-3 font-['DM_Sans',sans-serif] text-[9px] font-semibold tracking-[0.14em] uppercase ${isDark ? "text-[#c44a3f]" : "text-[#c44a3f]/80"}`}>
                Agotado
              </span>
            )}
          </div>
        </article>
      );
    }

    // ── Photo layout ──────────────────────────────────────────────────────
    return (
      <article
        className={`theme-la-carreta ${cardBase[restaurant]} ${isSoldOut ? "opacity-60" : ""} ${className}`}
        aria-label={item.name}
        onClick={() => onClick?.(item)}
      >
        <div className="absolute inset-0 z-0">
          <CustomImage
            src={item.photo_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.75] saturate-[0.9] group-hover:brightness-[0.6] group-hover:saturate-[1]"
          />
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(28,20,16,0.98)] via-[rgba(28,20,16,0.4)] to-transparent translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out flex flex-col justify-end p-6">
          <h3 className="font-['Cormorant_Garamond',serif] text-[24px] font-light text-[#FDFAF5] leading-[1.1] mb-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="font-['DM_Sans',sans-serif] text-[11px] text-[rgba(245,239,227,0.6)] leading-relaxed mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="font-['Jost',sans-serif] text-[13px] font-light text-[rgba(245,239,227,0.45)] tracking-wide group-hover:text-[rgba(245,239,227,0.7)] transition-colors">
            {formatCOP(item.price)}
          </div>
          {!isSoldOut && (
            <span className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full bg-[#C9973A] shadow-[0_0_15px_rgba(201,151,58,0.5)]" />
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`theme-${restaurant} ${cardBase[restaurant]} ${isSoldOut && restaurant !== "delica" ? "opacity-55" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
      aria-label={item.name}
      onClick={() => onClick?.(item)}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(item);
        }
      }}
    >
      <div className={`relative ${restaurant === 'mar-y-tierra' ? 'aspect-[4/3] w-full' : 'h-[90px]'} overflow-hidden border-b border-[var(--color-border)]`}>
        {item.photo_url ? (
          <CustomImage
            src={item.photo_url}
            alt={item.name}
            width={600}
            aspectRatio={restaurant === 'mar-y-tierra' ? "4/3" : "4/1"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${imagePlaceholder[restaurant]}`} aria-hidden="true">
            <svg 
              className={`w-8 h-8 ${placeholderIconColor[restaurant]}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M12 12v9" />
              <path d="M8 12h8" />
            </svg>
          </div>
        )}

        <span
          className={`${dotPosition[restaurant]} ${dotSizeClass[restaurant]} rounded-full ${
            isSoldOut
              ? "bg-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.15)]"
              : "bg-[#22c55e] shadow-[0_0_0_2px_rgba(34,197,94,0.15)]"
          }`}
          role="status"
          aria-label={isSoldOut ? "Agotado" : "Disponible"}
        />
      </div>

      <div className={`p-4 flex flex-col gap-1.5 ${isSoldOut && restaurant === "delica" ? "opacity-55" : ""}`}>
        <h3 className={nameStyles[restaurant]}>{item.name}</h3>

        {item.description && (
          <p className={descStyles[restaurant]} aria-label="Descripción">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span
            className={`${priceStyles[restaurant]} ${isSoldOut ? "line-through text-[#aaa]" : ""}`}
            aria-label={`Precio: ${formatCOP(item.price)}`}
          >
            {formatCOP(item.price)}
          </span>

          {onAdd && !isSoldOut && (
            <button
              className={addButtonStyles[restaurant]}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
              }}
              aria-label={`Agregar ${item.name}`}
            >
              +
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
