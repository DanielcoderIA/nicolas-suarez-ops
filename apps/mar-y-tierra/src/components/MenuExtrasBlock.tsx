import { formatCOP } from "@/lib/format";

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const TEAL = "#1ABC9C";
const OCEAN = "#0A3D62";

type ExtraItem = { name: string; price: number };

/**
 * MenuExtrasBlock — Teal-tinted box showing category-specific add-ons.
 * e.g. "Adiciones para carnes: Maracuyá $7.000 | Encebollado $6.000"
 */
export function MenuExtrasBlock({ label, items }: { label: string; items: ExtraItem[] }) {
  return (
    <div
      className="mt-6 rounded-lg px-5 py-4"
      style={{ backgroundColor: "rgba(26,188,156,0.04)", border: "1px solid rgba(26,188,156,0.12)" }}
    >
      <p
        className="font-['DM_Sans',sans-serif] text-[11px] font-semibold tracking-[0.12em] uppercase mb-3"
        style={{ color: TEAL }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-1">
        {items.map((extra) => (
          <span
            key={extra.name}
            className="font-['DM_Sans',sans-serif] text-[13px]"
            style={{ color: "rgba(10,61,98,0.6)" }}
          >
            {extra.name}{" "}
            <span className="font-semibold" style={{ color: OCEAN }}>
              {formatCOP(extra.price)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
