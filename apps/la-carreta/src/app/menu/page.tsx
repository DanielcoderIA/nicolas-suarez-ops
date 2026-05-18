import Image from "next/image";
import { Footer, NavBar } from "@repo/ui";
import { getMenuByRestaurant } from "@repo/database/queries/menu";
import { MenuContent } from "@/components/MenuContent";

export const revalidate = 5; // ISR revalidate every 5 seconds

const RESTAURANT_ID = "11111111-1111-1111-1111-111111111111";

export default async function MenuPage() {
  const menuItems = await getMenuByRestaurant(RESTAURANT_ID);

  /* Derive unique categories from data (preserving requested order) */
  const categoryOrder = [
    "entradas", "especialidades", "carnes-maduradas", "cortes-especiales",
    "platos-tipicos", "cremas-sopas", "pollo-cerdo", "pescados-mariscos",
    "ensaladas", "vegetarianos", "hamburguesas", "arroces", "guarniciones",
    "bebidas-frescas", "bebidas-calientes", "postres", "cocteles",
    "cervezas", "licores", "menu-infantil"
  ];
  
  const categories = categoryOrder.filter((cat) =>
    menuItems.some((item) => item.category === cat)
  );

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
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

      <main className="flex-1 pb-20">
        {/* Hero Section — Ajustado para mejor encuadre de la nueva foto */}
        <div className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden group">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/images/menu-hero-new.webp"
              alt="Nuestro Menú - La Carreta"
              fill
              sizes="100vw"
              quality={85}
              priority={true}
              className="object-cover brightness-[0.85] object-[center_30%] transition-transform duration-1000 group-hover:scale-105"
              aria-hidden="true"
            />
            {/* Overlay para legibilidad */}
            <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
          </div>

          <div className="layout-container-md text-center relative z-10 px-6">
            <h1 className="font-['Fraunces',serif] text-[48px] md:text-[72px] font-light text-[#f5ece0] mb-4 leading-tight drop-shadow-lg">
              Nuestro <span className="italic text-[#C4972A] font-normal">Menú</span>
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-[16px] md:text-[20px] text-[rgba(245,236,224,0.9)] max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Descubre la auténtica tradición colombiana en cada bocado
            </p>
          </div>
        </div>

        {/* Menu Content with Category Filter */}
        <div className="-mt-12 relative z-20">
          <MenuContent menuItems={menuItems} categories={categories} />
        </div>
      </main>

      <Footer
        restaurant="la-carreta"
        brandName="La Carreta"
        address="Cra. 6 # 3-26, Centro, Zipaquirá"
        whatsappNumber="+573057497090"
        hours={[
          { days: "Lunes a Miércoles", hours: "11:30 am - 9:00 pm" },
          { days: "Jueves a Sábado", hours: "11:30 am - 10:00 pm" },
          { days: "Domingos y Festivos", hours: "11:30 am - 8:00 pm" },
        ]}
      />
    </div>
  );
}
