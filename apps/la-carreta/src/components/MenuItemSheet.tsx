"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Utensils, X } from "lucide-react";
import type { MenuItem } from "@repo/ui/menu-card";

interface MenuItemSheetProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function MenuItemSheet({ item, isOpen, onClose }: MenuItemSheetProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  
  // Touch swipe handling
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small delay to allow DOM to render before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = "";
      }, 300); // match transition duration
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0]!.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const y = e.touches[0]!.clientY;
    if (y > startY) {
      setCurrentY(y - startY);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  if (!isRendered) return null;

  const isSoldOut = !item.is_available;
  const sheetTransform = currentY > 0 ? `translateY(${currentY}px)` : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Modal */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={`
          relative w-full md:max-w-[480px] bg-[#FDF6EC] 
          rounded-t-[20px] md:rounded-[16px] overflow-hidden
          flex flex-col shadow-2xl
          max-h-[85vh] md:max-h-[90vh]
          transform transition-transform duration-300 ease-out
          ${isVisible ? "translate-y-0 scale-100" : "translate-y-full md:translate-y-8 md:scale-95 opacity-0"}
        `}
        style={{ transform: sheetTransform || undefined }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile handle bar */}
        <div className="w-full flex justify-center py-3 md:hidden absolute top-0 left-0 right-0 z-10">
          <div className="w-12 h-1.5 rounded-full bg-black/20" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Cerrar detalle"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Image Area */}
          <div className="w-full aspect-video relative bg-[#fcf8f2] border-b border-[#ede8df]">
            {item.photo_url ? (
              <Image
                src={item.photo_url}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fcf8f2] to-[#f5ece0]">
                <Utensils className="w-12 h-12 text-[#e8dcc4]" strokeWidth={1} />
              </div>
            )}
            
            {/* Availability Badge inside image area */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {isSoldOut ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/90 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Agotado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/90 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  Disponible
                </span>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div>
              <h2 id="sheet-title" className="font-['Fraunces',serif] text-[24px] font-semibold text-[#2a1a0f] leading-tight mb-2">
                {item.name}
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-[20px] font-bold text-[#C4972A]">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(item.price)}
              </p>
            </div>

            {item.description && (
              <div className="mt-2 border-t border-[rgba(196,151,42,0.2)] pt-4">
                <p className="font-['DM_Sans',sans-serif] text-[14px] text-[#2a1a0f]/80 leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Action Area */}
        <div className="p-4 md:p-6 border-t border-[#ede8df] bg-[#FDF6EC] shrink-0">
          <a
            href="/reservas"
            className={`
              block w-full text-center py-[14px] rounded-[4px]
              font-['DM_Sans',sans-serif] text-[13px] font-semibold tracking-[0.04em] uppercase
              transition-all duration-200 focus-visible:outline-none
              ${isSoldOut 
                ? "bg-[#ede8df] text-[#2a1a0f]/40 cursor-not-allowed pointer-events-none" 
                : "bg-[#6B1700] text-[#C4972A] shadow-[0_4px_16px_rgba(107,23,0,0.12)] hover:shadow-[0_8px_24px_rgba(107,23,0,0.18)] hover:-translate-y-0.5"
              }
            `}
          >
            Reservar mesa
          </a>
        </div>
      </div>
    </div>
  );
}
