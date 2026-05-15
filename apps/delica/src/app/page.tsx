import { HeroSection, CataCard, Footer, NavBar } from "@repo/ui";
import { getMenuByRestaurant } from "@repo/database/queries/menu";
import { getPublishedExperiences } from "@repo/database/queries/experiences";

const RESTAURANT_ID = "33333333-3333-3333-3333-333333333333";

export const revalidate = 5;

export default async function HomePage() {
  const [menuItems, experiences] = await Promise.all([
    getMenuByRestaurant(RESTAURANT_ID),
    getPublishedExperiences(RESTAURANT_ID),
  ]);

  const featuredItems = menuItems.slice(0, 3);
  const upcomingCatas = experiences.slice(0, 3);

  return (
    <main className="bg-[var(--dl-surface, #FAFAF8)]">
      <NavBar
        restaurant="delica"
        brandName="Delica"
        links={[
          { label: "Experiencias", href: "/catas" },
          { label: "Menú", href: "/menu" },
          { label: "Reservar", href: "/reservas" },
        ]}
      />
      <HeroSection
        restaurant="delica"
        title={
          <>
            Experiencias gastronómicas <em>de autor</em>
          </>
        }
        subtitle="Catas exclusivas, menú de temporada y la filosofía culinaria de un Chef Ejecutivo."
        ctaLabel="Explorar experiencias"
        ctaHref="/catas"
        eyebrow="Delica · Zipaquirá"
      />

      {/* Próximas Catas Section */}
      {upcomingCatas.length > 0 && (
        <section className="py-section px-6 bg-[#1e100a]">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12">
              <div className="flex items-center gap-[10px] mb-4">
                <span className="block w-7 h-px bg-[rgba(141,106,50,0.5)]" aria-hidden="true" />
                <p className="font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-[0.18em] uppercase text-[rgba(141,106,50,0.6)]">
                  Próximas experiencias
                </p>
                <span className="block w-7 h-px bg-[rgba(141,106,50,0.5)]" aria-hidden="true" />
              </div>
              <h2 className="font-['Cormorant_Garamond',serif] text-[34px] font-light italic text-[#f0e8d8] leading-tight">
                Catas seleccionadas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingCatas.map((exp) => (
                <CataCard key={exp.id} experience={exp} />
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="/catas"
                className="border border-[rgba(141,106,50,0.4)] text-[#8D6A32] px-6 py-[11px] rounded-[1px] font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.12em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] hover:border-[#8D6A32] transition-all duration-300 no-underline inline-block"
              >
                Ver todas las experiencias →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Featured Menu Section */}
      {featuredItems.length > 0 && (
        <section className="py-section px-6 bg-[var(--dl-surface, #FAFAF8)]">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <div className="flex items-center gap-[10px] mb-3">
                  <span className="block w-7 h-px bg-[rgba(141,106,50,0.5)]" aria-hidden="true" />
                  <p className="font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-[0.18em] uppercase text-[rgba(141,106,50,0.6)]">
                    Menú de temporada
                  </p>
                </div>
                <h2 className="font-['Cormorant_Garamond',serif] text-[28px] font-light text-[#2C1810]">
                  Selección del Chef
                </h2>
              </div>
              <a
                href="/menu"
                className="text-[#8D6A32] text-[11px] font-['DM_Sans',sans-serif] font-semibold tracking-[0.08em] uppercase hover:text-[#2C1810] transition-colors"
              >
                Ver carta completa →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[rgba(141,106,50,0.08)] rounded-[2px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                >
                  <h3 className="font-['Cormorant_Garamond',serif] text-[18px] font-semibold text-[#2C1810] mb-1">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="font-['DM_Sans',sans-serif] text-[11px] text-[rgba(44,24,16,0.5)] leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="font-['Cormorant_Garamond',serif] text-[20px] font-semibold text-[#8D6A32]">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Storytelling — Philosophy Section */}
      <section className="py-section-lg px-6 bg-[#1e100a] border-t border-[rgba(141,106,50,0.08)]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-[10px] mb-6">
            <span className="block w-10 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
            <span className="w-1.5 h-1.5 bg-[rgba(141,106,50,0.3)] rotate-45 rounded-[1px]" aria-hidden="true" />
            <span className="block w-10 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] text-[36px] font-light italic text-[#f0e8d8] leading-tight mb-6">
            La gastronomía como experiencia
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[14px] text-[rgba(240,232,216,0.4)] leading-[1.8] max-w-2xl mx-auto">
            Delica nace de la convicción de que comer puede ser un acto transformador.
            Cada cata es un viaje sensorial: desde la selección de los granos de café
            de las montañas del Huila hasta los maridajes con chocolate de Tumaco,
            cada detalle está diseñado para que el visitante no solo pruebe,
            sino que comprenda y sienta la historia detrás de cada sabor colombiano.
          </p>
        </div>
      </section>

      <Footer
        restaurant="delica"
        brandName="Delica"
        address="Calle 4 # 6-20, Centro Histórico, Zipaquirá"
        whatsappNumber="+573005556789"
        hours={[
          { days: "Viernes y Sábado", hours: "6:00 pm - 11:00 pm" },
          { days: "Domingos", hours: "12:00 pm - 5:00 pm" },
          { days: "Catas con reserva previa", hours: "Según agenda" },
        ]}
        links={[
          { label: "Experiencias", href: "/catas" },
          { label: "Menú", href: "/menu" },
          { label: "Reservar", href: "/reservas" },
        ]}
      />
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Delica",
            url: "https://delicazipa.co",
            telephone: "+573005556789",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Calle 4 # 6-20, Centro Histórico",
              addressLocality: "Zipaquirá",
              addressRegion: "Cundinamarca",
              addressCountry: "CO",
            },
            servesCuisine: "Contemporary",
            priceRange: "$$$",
            openingHours: "Fr-Sa 18:00-23:00, Su 12:00-17:00",
          }),
        }}
      />
    </main>
  );
}
