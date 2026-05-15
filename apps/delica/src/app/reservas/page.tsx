"use client";

import { useState } from "react";
import { ReservationForm, NavBar, Footer } from "@repo/ui";
import type { ReservationData } from "@repo/ui";

const RESTAURANT_ID = "33333333-3333-3333-3333-333333333333";

export default function ReservasPage() {
  const [isSuccess, setIsSuccess] = useState(false);
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

      setIsSuccess(true);
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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <NavBar
        restaurant="delica"
        brandName="Delica"
        links={[
          { label: "Inicio", href: "/" },
          { label: "Menú", href: "/menu" },
          { label: "Catas", href: "/catas" },
        ]}
      />

      <main className="flex-1 flex flex-col items-center justify-center py-section-lg px-6 relative z-10 mb-24 md:mb-40">
        <div className="max-w-xl w-full">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-[10px] mb-4">
              <span className="block w-7 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
              <span className="w-1.5 h-1.5 bg-[rgba(141,106,50,0.3)] rotate-45 rounded-[1px]" aria-hidden="true" />
              <span className="block w-7 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
            </div>
            <h1 className="font-['Cormorant_Garamond',serif] text-[38px] font-light italic text-[#2C1810] mb-3">
              Reservar experiencia
            </h1>
            <p className="font-['Cormorant_Garamond',serif] text-[16px] font-light text-[rgba(44,24,16,0.5)] italic">
              Confirma tu lugar en nuestra próxima cata o reserva una mesa exclusiva.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-[#1e100a] p-10 rounded-[2px] border border-[rgba(141,106,50,0.15)] shadow-[0_8px_32px_rgba(0,0,0,0.38)] text-center">
              <div className="flex items-center justify-center gap-[10px] mb-6">
                <span className="block w-5 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
                <span className="w-1 h-1 bg-[#22c55e] rotate-45 rounded-[1px]" aria-hidden="true" />
                <span className="block w-5 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
              </div>
              <h2 className="font-['Cormorant_Garamond',serif] text-[26px] font-light italic text-[#f0e8d8] mb-2">
                Reserva confirmada
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-[13px] text-[rgba(240,232,216,0.4)] mb-8 leading-relaxed">
                Hemos registrado tu solicitud. Te contactaremos por WhatsApp para confirmar los detalles de tu experiencia.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="border border-[rgba(141,106,50,0.4)] text-[#8D6A32] px-5 py-[9px] rounded-[1px] font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.1em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] transition-all duration-300"
              >
                Nueva reserva
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 md:p-10 rounded-[2px] border border-[rgba(141,106,50,0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-[2px] text-[13px] font-['DM_Sans',sans-serif]">
                  {errorMsg}
                </div>
              )}
              <ReservationForm
                restaurantId={RESTAURANT_ID}
                onSubmit={handleSubmit}
                timeSlots={["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]}
                className="!rounded-[2px]"
              />
            </div>
          )}
        </div>
      </main>

      <Footer
        restaurant="delica"
        brandName="Delica"
        address="Calle 4 # 6-20, Centro Histórico, Zipaquirá"
        whatsappNumber="+573005556789"
        hours={[
          { days: "Viernes y Sábado", hours: "6:00 pm - 11:00 pm" },
          { days: "Domingos", hours: "12:00 pm - 5:00 pm" },
        ]}
      />
    </div>
  );
}
