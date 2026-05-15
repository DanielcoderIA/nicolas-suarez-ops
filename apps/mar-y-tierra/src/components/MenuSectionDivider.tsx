/**
 * MenuSectionDivider — Decorative ✦ separator between menu categories.
 */
export function MenuSectionDivider() {
  return (
    <div className="flex items-center gap-5 my-14 md:my-18">
      <div
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(26,188,156,0.25), transparent)",
        }}
      />
      <span
        className="text-[14px] tracking-[0.3em] font-['DM_Sans',sans-serif]"
        style={{ color: "rgba(26,188,156,0.5)" }}
      >
        ✦
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(26,188,156,0.25), transparent)",
        }}
      />
    </div>
  );
}
