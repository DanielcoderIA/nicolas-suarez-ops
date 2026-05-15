import { CataCard, NavBar, Footer } from "@repo/ui";
import { getPublishedExperiences } from "@repo/database/queries/experiences";

export const revalidate = 5;

const RESTAURANT_ID = "33333333-3333-3333-3333-333333333333";

export default async function CatasPage() {
  const experiences = await getPublishedExperiences(RESTAURANT_ID);

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
        ctaLabel="Reservar"
        ctaHref="/reservas"
      />

      <main className="flex-1">
        {/* Hero header */}
        <div className="bg-[#1e100a] pt-24 md:pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-[10px] mb-6">
              <span className="block w-10 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
              <span className="w-1.5 h-1.5 bg-[rgba(141,106,50,0.3)] rotate-45 rounded-[1px]" aria-hidden="true" />
              <span className="block w-10 h-px bg-[rgba(141,106,50,0.4)]" aria-hidden="true" />
            </div>
            <h1 className="font-['Cormorant_Garamond',serif] text-[42px] font-light italic text-[#f0e8d8] mb-4">
              Experiencias Delica
            </h1>
            <p className="font-['Cormorant_Garamond',serif] text-[16px] font-light text-[rgba(240,232,216,0.5)] italic max-w-lg mx-auto leading-relaxed">
              Cada cata es un viaje sensorial diseñado para explorar las raíces
              del café, el chocolate y los sabores de Colombia.
            </p>
          </div>
        </div>

        {/* Experiences list */}
        <div className="max-w-5xl mx-auto px-5 -mt-12 relative z-10 pb-32 md:pb-40">
          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {experiences.map((exp) => {
                const availableSpots = exp.capacity - exp.booked;
                return (
                  <CataCard
                    key={exp.id}
                    experience={exp}
                    onBook={
                      availableSpots > 0
                        ? undefined /* SSG: can't pass client functions from RSC */
                        : undefined
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="flex items-center justify-center gap-[10px] mb-6">
                <span className="block w-7 h-px bg-[rgba(141,106,50,0.3)]" aria-hidden="true" />
                <span className="w-1 h-1 bg-[rgba(141,106,50,0.2)] rotate-45 rounded-[1px]" aria-hidden="true" />
                <span className="block w-7 h-px bg-[rgba(141,106,50,0.3)]" aria-hidden="true" />
              </div>
              <p className="font-['Cormorant_Garamond',serif] text-[22px] text-[rgba(44,24,16,0.4)] italic">
                Próximamente nuevas experiencias
              </p>
              <p className="font-['DM_Sans',sans-serif] text-[12px] text-[rgba(44,24,16,0.3)] mt-2">
                Sigue nuestras redes para enterarte primero.
              </p>
            </div>
          )}

          {/* CTA to reserve */}
          {experiences.some((e) => e.capacity - e.booked > 0) && (
            <div className="text-center mt-12 pt-8 border-t border-[rgba(141,106,50,0.08)]">
              <p className="font-['Cormorant_Garamond',serif] text-[18px] text-[#2C1810] italic mb-4">
                ¿Listo para vivir la experiencia?
              </p>
              <a
                href="/reservas"
                className="border border-[rgba(141,106,50,0.5)] text-[#8D6A32] px-8 py-3 rounded-[1px] font-['DM_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase bg-transparent hover:bg-[rgba(141,106,50,0.06)] hover:border-[#8D6A32] transition-all duration-300 no-underline inline-block"
              >
                Reservar experiencia
              </a>
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
