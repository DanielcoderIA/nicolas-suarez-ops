"use client";

import Image from "next/image";
import { ReservationForm, NavBar, Footer } from "@repo/ui";
import { MapPin, Clock, Phone, CheckCircle2, MessageCircle } from "lucide-react";

const RESTAURANT_ID = "la-carreta-uuid";
const WHATSAPP_NUMBER = "+573001234567";

export default function ReservasPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <NavBar
        restaurant="la-carreta"
        brandName="La Carreta"
        brandMark={
          <img
            src="/images/logo-la-carreta.png"
            alt="Restaurante La Carreta"
            className="h-full w-auto object-contain"
          />
        }
        links={[
          { label: "Inicio", href: "/" },
          { label: "Menú", href: "/menu" },
        ]}
        ctaLabel="Reservar mesa"
        ctaHref="/reservas"
      />

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <section className="pt-24 md:pt-32 pb-10 md:pb-14 relative overflow-hidden">
          {/* Subtle decorative background */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#6b2c1a]/[0.03] to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#c9a96e]/[0.04] to-transparent" />
          </div>

          <div className="layout-container relative z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#c9a96e]" />
              <span className="font-['DM_Sans',sans-serif] text-[10px] font-bold text-[#c9a96e] uppercase tracking-[0.3em]">
                Reservaciones
              </span>
            </div>

            {/* Title */}
            <h1 className="font-['Fraunces',serif] text-[42px] md:text-[56px] text-[#1a0f0a] leading-[1.08] mb-5 font-light max-w-[700px]">
              Asegura tu lugar en{" "}
              <br className="hidden md:block" />
              <span className="italic text-[#6B1700]">nuestra mesa</span>
            </h1>

            <p className="font-['DM_Sans',sans-serif] text-[16px] md:text-[17px] text-[#5a4b3a]/70 max-w-[520px] leading-relaxed mb-10">
              Vive la auténtica experiencia de la cocina tradicional colombiana.
              Reserva ahora y déjanos prepararte algo especial.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { icon: MessageCircle, text: "Confirmación por WhatsApp" },
                { icon: CheckCircle2, text: "Sin cargos adicionales" },
                { icon: Clock, text: "Respuesta inmediata" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} className="text-[#c9a96e]" />
                  <span className="font-['DM_Sans',sans-serif] text-[12px] text-[#5a4b3a]/55 font-medium">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main Content ────────────────────────────────────────── */}
        <section style={{ paddingBottom: "160px" }}>
          <div className="layout-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start max-w-[1100px] mx-auto">

              {/* Form Column */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <ReservationForm
                  restaurantId={RESTAURANT_ID}
                  whatsappNumber={WHATSAPP_NUMBER}
                />
              </div>

              {/* Sidebar — sticky on desktop */}
              <aside className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">

                {/* Restaurant Image */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] shadow-[0_8px_40px_rgba(26,15,10,0.12)] group">
                  <Image
                    src="/images/reservas.png"
                    alt="Interior de La Carreta — ambiente colonial en Zipaquirá"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/75 via-[#1a0f0a]/15 to-transparent" />
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-['Fraunces',serif] text-[20px] font-medium text-white leading-tight">
                      Ambiente Colonial
                    </p>
                    <p className="font-['DM_Sans',sans-serif] text-[11px] text-white/60 uppercase tracking-[0.15em] mt-1.5">
                      Zipaquirá · Centro Histórico
                    </p>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-7 border border-[#e8dfd0]/60 space-y-6">

                  {/* Horarios */}
                  <div className="flex items-start gap-3.5">
                    <Clock size={17} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-['Fraunces',serif] text-[15px] text-[#1a0f0a] mb-2.5 font-semibold">
                        Horarios
                      </h3>
                      <div className="font-['DM_Sans',sans-serif] text-[13px] text-[#5a4b3a]/70 space-y-1.5">
                        <p className="flex justify-between">
                          <span>Lun – Jue</span>
                          <span className="font-medium text-[#1a0f0a]/80">12:00 – 21:00</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Vie – Sáb</span>
                          <span className="font-medium text-[#1a0f0a]/80">12:00 – 22:00</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Dom · Festivos</span>
                          <span className="font-medium text-[#1a0f0a]/80">12:00 – 20:00</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#e8dfd0] to-transparent" />

                  {/* Ubicación */}
                  <div className="flex items-start gap-3.5">
                    <MapPin size={17} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-['Fraunces',serif] text-[15px] text-[#1a0f0a] mb-1.5 font-semibold">
                        Ubicación
                      </h3>
                      <p className="font-['DM_Sans',sans-serif] text-[13px] text-[#5a4b3a]/70 leading-relaxed">
                        Calle 5 # 7-45, Centro Histórico<br />
                        Zipaquirá, Cundinamarca
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#e8dfd0] to-transparent" />

                  {/* Contacto */}
                  <div className="flex items-start gap-3.5">
                    <Phone size={17} className="text-[#c9a96e] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-['Fraunces',serif] text-[15px] text-[#1a0f0a] mb-1.5 font-semibold">
                        Contacto directo
                      </h3>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-['DM_Sans',sans-serif] text-[13px] text-[#6b2c1a] font-medium hover:text-[#C4972A] transition-colors inline-flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] inline-block" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Events note */}
                  <div className="pt-5 border-t border-[#e8dfd0]/60">
                    <p className="font-['DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b2c1a]/40 text-center">
                      Reservas para eventos disponibles
                    </p>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </section>
      </main>

      <Footer
        restaurant="la-carreta"
        brandName="La Carreta"
        address="Calle 5 # 7-45, Centro Histórico, Zipaquirá"
        whatsappNumber={WHATSAPP_NUMBER}
        hours={[
          { days: "Lunes a Jueves", hours: "12:00 pm - 9:00 pm" },
          { days: "Viernes y Sábado", hours: "12:00 pm - 10:00 pm" },
          { days: "Domingos y Festivos", hours: "12:00 pm - 8:00 pm" },
        ]}
      />
    </div>
  );
}