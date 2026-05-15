"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function CartWidget() {
  const { getTotalItems, getTotalPrice, setIsOpen } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (totalItems > 0) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [totalItems]);

  if (!mounted || totalItems === 0) return null;

  const formatCOP = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-6 pointer-events-none transition-all duration-[600ms] cubic-bezier(0.22, 1, 0.36, 1) ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <button
        onClick={() => setIsOpen(true)}
        className="group pointer-events-auto relative flex items-center justify-between w-full max-w-[400px] bg-[#0A3D62] text-white rounded-lg px-6 py-4 transition-all duration-500 ease-out hover:bg-[#041C2C] hover:shadow-[0_20px_40px_-15px_rgba(10,61,98,0.5)] active:scale-[0.98]"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/10 text-white w-7 h-7 rounded-full flex items-center justify-center font-['DM_Sans',sans-serif] font-medium text-[13px] tracking-wide backdrop-blur-sm border border-white/20">
            {totalItems}
          </div>
          <span className="font-['Libre_Baskerville',serif] italic text-[15px] tracking-wide text-white/90 group-hover:text-white transition-colors">
            Ver mi pedido
          </span>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="font-['DM_Sans',sans-serif] font-semibold text-[15px] tracking-[0.02em] text-white">
            {formatCOP(totalPrice)}
          </span>
          <svg 
            className="w-4 h-4 text-[#1ABC9C] group-hover:translate-x-1 transition-transform duration-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </button>
    </div>
  );
}
