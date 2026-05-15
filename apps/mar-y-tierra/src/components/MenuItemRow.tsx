import type { StaticMenuItem } from "@/lib/menu-data";
import { formatCOP } from "@/lib/format";

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const NAVY = "#041C2C";
const OCEAN = "#0A3D62";

/**
 * MenuItemRow — Single editorial menu item with dotted leader.
 * Typography-driven: name ··· price, description below, price variants for fish.
 */
export function MenuItemRow({ item }: { item: StaticMenuItem }) {
  return (
    <article className="group relative bg-transparent rounded-md transition-all duration-300 active:scale-[0.99] active:bg-[#0A3D62]/[0.03]">
      <div className="py-5 px-1 min-h-[56px]">
        {/* Title + Dotted Leader + Price */}
        <div className="flex items-baseline w-full gap-3">
          <h3
            className="font-['Libre_Baskerville',serif] text-[17px] md:text-[18px] font-normal tracking-tight leading-snug transition-colors duration-300 max-w-[70%] group-hover:text-[#1ABC9C]"
            style={{ color: NAVY }}
          >
            {item.name}
          </h3>
          {/* Dotted leader */}
          <div
            className="flex-grow border-b-[2px] border-dotted min-w-[24px] translate-y-[-5px]"
            style={{ borderColor: "rgba(26,188,156,0.25)" }}
            aria-hidden="true"
          />
          <span
            className="font-['DM_Sans',sans-serif] text-[15px] flex-shrink-0 whitespace-nowrap font-semibold"
            style={{ color: OCEAN }}
          >
            {formatCOP(item.price)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p
            className="font-['DM_Sans',sans-serif] text-[13px] leading-[1.65] mt-2 line-clamp-2 max-w-[82%]"
            style={{ color: "rgba(10,61,98,0.55)" }}
          >
            {item.description}
          </p>
        )}

        {/* Price Variants (for fish by weight) */}
        {item.priceVariants && item.priceVariants.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5">
            {item.priceVariants.map((v) => (
              <span
                key={v.label}
                className="font-['DM_Sans',sans-serif] text-[12px]"
                style={{ color: "rgba(10,61,98,0.5)" }}
              >
                <span className="font-medium" style={{ color: OCEAN }}>
                  {v.label}:
                </span>{" "}
                {formatCOP(v.price)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
