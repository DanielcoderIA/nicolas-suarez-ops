"use client";

import { useState } from "react";
import { 
  ReservationForm, 
  NavBar, 
  Footer, 
  SectionHeader, 
  ScrollReveal 
} from "@repo/ui";
import type { ReservationData } from "@repo/ui";

const RESTAURANT_ID = "22222222-2222-2222-2222-222222222222";

export default function ReservasPage() {
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (data: ReservationData) => {
    setErrorMsg("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Has excedido el límite de reservas. Intenta más tarde.");
        }
        const err = await response.json();
        throw new Error(err.error || "Error al procesar la reserva.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Error inesperado al conectar con el servidor.");
      }
      throw err;
    }
  };

  return (
    <div className="theme-mar-y-tierra min-h-screen flex flex-col" style={{ backgroundColor: '#041C2C' }}>
      <NavBar
        restaurant="mar-y-tierra"
        brandName="Mar y Tierra Zipa"
        brandMark={
          <img
            src="/images/logo-mar-y-tierra.png"
            alt="Restaurante Mar y Tierra"
            className="h-full w-auto object-contain"
          />
        }
        links={[
          { label: "INICIO", href: "/" },
          { label: "MENÚ", href: "/menu" },
        ]}
        ctaLabel="RESERVAR MESA"
        ctaHref="/reservas"
      />

      <main className="flex-1 relative flex flex-col items-center justify-start py-12 md:py-20 px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% -20%, #0A3D62 0%, #041C2C 70%)' }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm54 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM10 10c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm80 80c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM30 30c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm40 40c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM20 70c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm70-20c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231ABC9C' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Header */}
          <div className="w-full max-w-2xl mx-auto text-center mb-10 px-4">
            <div className="inline-flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#1ABC9C' }}>
              <span className="w-8 h-px" style={{ backgroundColor: '#1ABC9C' }} />
              Reservaciones
              <span className="w-8 h-px" style={{ backgroundColor: '#1ABC9C' }} />
            </div>
            <h1 className="font-['Libre_Baskerville',serif] text-[clamp(32px,5vw,52px)] font-normal text-white leading-tight mb-4 mx-auto">
              Asegura tu <em className="italic" style={{ color: '#1ABC9C' }}>experiencia</em>
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-[15px] text-white/60 font-light max-w-lg mx-auto leading-relaxed">
              Del Pacífico a tu mesa — un viaje gastronómico inolvidable entre el mar y la montaña.
            </p>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-[540px] mx-auto px-4">
            <ScrollReveal delay={200}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full" style={{ backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-[13px] font-medium font-['DM_Sans',sans-serif]">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errorMsg}
                    </div>
                  </div>
                )}
                
                <div className="p-1">
                  <ReservationForm
                    restaurantId={RESTAURANT_ID}
                    onSubmit={handleSubmit}
                    whatsappNumber="573213359659"
                    className="!bg-transparent !shadow-none"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Footer Info */}
          <div className="w-full max-w-2xl mx-auto px-4">
            <ScrollReveal delay={400}>
              <div className="mt-12 flex flex-col items-center gap-4 text-center">
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-[0.2em]">
                  ¿Tienes un evento especial o grupal?
                </p>
                <a 
                  href="https://wa.me/573213359659" 
                  className="group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300"
                  style={{ border: '1px solid rgba(26,188,156,0.3)', backgroundColor: 'rgba(26,188,156,0.05)', color: '#1ABC9C' }}
                >
                  <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Hablar con un anfitrión</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer
        restaurant="mar-y-tierra"
        brandName="Mar y Tierra Zipa"
        address="Cra. 6 #1-17, Centro, Zipaquirá"
        whatsappNumber="+573213359659"
        hours={[
          { days: "Lunes a Domingo", hours: "11:00 am - 7:00 pm" },
        ]}
      />
    </div>
  );
}
