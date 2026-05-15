import { MenuCard, Footer, NavBar } from "@repo/ui";
import { getMenuByRestaurant } from "@repo/database/queries/menu";

export const revalidate = 5;

const RESTAURANT_ID = "33333333-3333-3333-3333-333333333333";

/** Format COP price for display */
function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export default async function MenuPage() {
  const menuItems = await getMenuByRestaurant(RESTAURANT_ID);

  // Delica includes "catas" as a visible category
  const categories = ["entradas", "principales", "postres", "bebidas", "catas"];

  const groupedMenu = categories
    .map((category) => ({
      category,
      items: menuItems.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

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

      <main className="flex-1 pb-32 md:pb-40">
        <div className="bg-[#1e100a] pt-24 md:pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-['Cormorant_Garamond',serif] text-[38px] font-light italic text-[#f0e8d8] mb-3">
              La Carta
            </h1>
            <p className="font-['Cormorant_Garamond',serif] text-[16px] font-light text-[rgba(240,232,216,0.55)] italic">
              Menú de temporada · Ingredientes seleccionados
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 -mt-12 relative z-10">
          {groupedMenu.map((group) => (
            <section key={group.category} className="mb-16 last:mb-0">
              <div className="flex items-center gap-[10px] mb-6">
                <span className="block w-7 h-px bg-[rgba(141,106,50,0.3)]" aria-hidden="true" />
                <h2 className="font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.14em] uppercase text-[#8D6A32]">
                  {group.category}
                </h2>
                <span className="flex-1 h-px bg-[rgba(141,106,50,0.1)]" aria-hidden="true" />
              </div>

              {group.category === "catas" ? (
                /* Catas rendered as elegant text list */
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-baseline gap-4 py-3 border-b border-[rgba(141,106,50,0.06)]"
                    >
                      <div className="flex-1">
                        <h3 className="font-['Cormorant_Garamond',serif] text-[20px] font-semibold text-[#2C1810]">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="font-['DM_Sans',sans-serif] text-[11px] text-[rgba(44,24,16,0.45)] mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="font-['Cormorant_Garamond',serif] text-[20px] font-semibold text-[#8D6A32] whitespace-nowrap">
                        {formatCOP(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((item) => (
                    <MenuCard key={item.id} item={item} restaurant="delica" />
                  ))}
                </div>
              )}
            </section>
          ))}

          {groupedMenu.length === 0 && (
            <div className="text-center py-20">
              <p className="font-['Cormorant_Garamond',serif] text-[18px] text-[rgba(44,24,16,0.4)] italic">
                El menú de temporada se está preparando.
              </p>
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
