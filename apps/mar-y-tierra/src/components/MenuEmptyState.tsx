/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const TEAL = "#1ABC9C";
const OCEAN = "#0A3D62";
const PEARL = "#F0F8FF";

/**
 * MenuEmptyState — Shown when no menu items match the active filter.
 */
export function MenuEmptyState() {
  return (
    <div
      className="text-center py-24 rounded-lg"
      style={{
        backgroundColor: PEARL,
        border: "1px solid rgba(10,61,98,0.08)",
      }}
    >
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "rgba(26,188,156,0.06)",
          border: "1px solid rgba(26,188,156,0.15)",
        }}
      >
        <svg
          className="w-7 h-7"
          style={{ color: TEAL }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p
        className="font-['DM_Sans',sans-serif] text-[15px] mb-4"
        style={{ color: "rgba(10,61,98,0.5)" }}
      >
        El menú se está actualizando. Vuelve pronto.
      </p>
      <a
        href="/"
        className="font-['DM_Sans',sans-serif] text-[13px] font-bold tracking-[0.1em] uppercase transition-colors"
        style={{ color: OCEAN }}
      >
        Volver al inicio
      </a>
    </div>
  );
}
