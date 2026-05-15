"use client";

import {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type TabItem = { category: string; label: string };

/* ─────────────────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
  todos: "Todo",
  entradas: "Entradas",
  especialidades: "Especialidades",
  "carnes-maduradas": "Carnes Maduradas",
  "cortes-especiales": "Cortes Especiales",
  "platos-tipicos": "Platos Típicos",
  "cremas-sopas": "Cremas & Sopas",
  "pollo-cerdo": "Pollo & Cerdo",
  "pescados-mariscos": "Pescados & Mariscos",
  ensaladas: "Ensaladas",
  vegetarianos: "Vegetarianos",
  hamburguesas: "Hamburguesas",
  arroces: "Arroces",
  guarniciones: "Guarniciones",
  "bebidas-frescas": "Bebidas Frescas",
  "bebidas-calientes": "Bebidas Calientes",
  postres: "Postres",
  cocteles: "Cócteles",
  cervezas: "Cervezas",
  licores: "Licores",
  "menu-infantil": "Menú Infantil",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Helper — build flat tab list (no zone chips, no separators)
───────────────────────────────────────────────────────────────────────────── */
function buildTabItems(categories: string[]): TabItem[] {
  const items: TabItem[] = [
    { category: "todos", label: CATEGORY_LABELS["todos"] ?? "Todo" },
  ];

  for (const cat of categories) {
    items.push({
      category: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
    });
  }

  return items;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
interface MenuCategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  className?: string;
}

export function MenuCategoryFilter({
  categories,
  activeCategory,
  onSelect,
  className = "",
}: MenuCategoryFilterProps) {
  /* ── Refs ──────────────────────────────────────────────────────────────── */
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  /**
   * Guards the scroll-spy from overriding a click-triggered navigation.
   * Set true on handleSelect, cleared after ~1.2 s (covers any smooth scroll).
   */
  const isProgrammaticScroll = useRef(false);
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* ── State ─────────────────────────────────────────────────────────────── */
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [hasBouncedOnce, setHasBouncedOnce] = useState(false);

  /* ── Derived data ──────────────────────────────────────────────────────── */
  const tabItems = useMemo(() => buildTabItems(categories), [categories]);

  /* ── Cleanup programmatic scroll timer on unmount ───────────────────── */
  useEffect(() => {
    return () => {
      clearTimeout(programmaticScrollTimer.current);
    };
  }, []);

  /* ── Sticky detection ──────────────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Ribbon scroll-state (arrow visibility) ────────────────────────────── */
  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  /* ── Micro-bounce hint — only when ribbon actually overflows ───────────── */
  useEffect(() => {
    if (hasBouncedOnce) return;
    const el = scrollRef.current;
    if (!el) return;

    let bounceTimer: ReturnType<typeof setTimeout>;
    let returnTimer: ReturnType<typeof setTimeout>;

    const rafId = requestAnimationFrame(() => {
      if (el.scrollWidth <= el.clientWidth) {
        setHasBouncedOnce(true);
        return;
      }

      bounceTimer = setTimeout(() => {
        el.scrollTo({ left: 72, behavior: "smooth" });
        returnTimer = setTimeout(() => {
          el.scrollTo({ left: 0, behavior: "smooth" });
          setHasBouncedOnce(true);
        }, 420);
      }, 900);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(bounceTimer);
      clearTimeout(returnTimer);
    };
  }, [hasBouncedOnce]);

  /* ── Scroll-spy — disabled during programmatic scroll ─────────────────── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((cat) => {
      const sectionEl = document.getElementById(`category-${cat}`);
      if (!sectionEl) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && !isProgrammaticScroll.current) {
            onSelect(cat);
          }
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );

      obs.observe(sectionEl);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  /* ── Auto-center active tab ────────────────────────────────────────────── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const btn = container.querySelector(
      `[data-category="${activeCategory}"]`
    ) as HTMLElement | null;

    if (btn) {
      const target =
        btn.offsetLeft - container.clientWidth / 2 + btn.offsetWidth / 2;
      container.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [activeCategory]);

  /* ── Arrow scroll ──────────────────────────────────────────────────────── */
  const scrollByAmount = useCallback((dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  }, []);

  /* ── Click / select handler ────────────────────────────────────────────── */
  const handleSelect = useCallback(
    (category: string) => {
      isProgrammaticScroll.current = true;
      clearTimeout(programmaticScrollTimer.current);
      programmaticScrollTimer.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1200);

      onSelect(category);

      if (category === "todos") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const sectionEl = document.getElementById(`category-${category}`);
      if (sectionEl) {
        const RIBBON_OFFSET = 130;
        const top =
          sectionEl.getBoundingClientRect().top +
          window.scrollY -
          RIBBON_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [onSelect]
  );

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <nav
      className={`mcf-root sticky top-14 z-30 ${className}`}
      role="tablist"
      aria-label="Navegación del menú"
      data-sticky={isSticky ? "true" : undefined}
    >
      <div className="mcf-track-wrapper relative group/nav">
        {/* ── Left fade + arrow ───────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="mcf-fade mcf-fade--left pointer-events-none absolute left-0 inset-y-0 w-14 z-10"
        />
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            aria-label="Ver categorías anteriores"
            className="mcf-arrow hidden md:flex absolute left-0 inset-y-0 z-20 w-14 items-center justify-start pl-3 opacity-0 group-hover/nav:opacity-100"
          >
            <span className="mcf-arrow__icon" aria-hidden="true">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>
        )}

        {/* ── Right fade + arrow ──────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="mcf-fade mcf-fade--right pointer-events-none absolute right-0 inset-y-0 w-14 z-10"
        />
        {canScrollRight && (
          <button
            onClick={() => scrollByAmount("right")}
            aria-label="Ver más categorías"
            className="mcf-arrow hidden md:flex absolute right-0 inset-y-0 z-20 w-14 items-center justify-end pr-3 opacity-0 group-hover/nav:opacity-100"
          >
            <span className="mcf-arrow__icon" aria-hidden="true">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        )}

        {/* ── Scrollable tab strip ─────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="mcf-ribbon flex items-center overflow-x-auto"
          role="presentation"
        >
          {/* Inner container with consistent padding */}
          <div className="mcf-ribbon__inner flex items-center gap-1 px-5 md:px-8">
            {tabItems.map((item) => {
              const isActive = activeCategory === item.category;

              return (
                <button
                  key={item.category}
                  ref={isActive ? activeTabRef : undefined}
                  data-category={item.category}
                  data-active={isActive ? "true" : undefined}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={
                    item.category === "todos"
                      ? undefined
                      : `category-${item.category}`
                  }
                  onClick={() => handleSelect(item.category)}
                  className="mcf-tab flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4972A]/40 focus-visible:ring-offset-1"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <span className="mcf-tab__label">{item.label}</span>
                  <span aria-hidden="true" className="mcf-tab__indicator" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom accent line ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="mcf-border-bottom" />

      {/* ─────────────────────────────────────────────────────────────────────
          Scoped CSS — all styles namespaced under .mcf-* to avoid leaking
      ───────────────────────────────────────────────────────────────────── */}
      <style>{`
        /* ── Root nav ───────────────────────────────────────────────────── */
        .mcf-root {
          background: rgba(253, 246, 236, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition:
            background      0.5s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow      0.5s cubic-bezier(0.22, 1, 0.36, 1),
            border-color    0.5s cubic-bezier(0.22, 1, 0.36, 1),
            backdrop-filter  0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mcf-root[data-sticky] {
          background: rgba(253, 246, 236, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: rgba(212, 196, 168, 0.3);
          box-shadow:
            0 1px 0 rgba(212, 196, 168, 0.15),
            0 4px 20px rgba(26, 15, 10, 0.04);
        }

        /* ── Ribbon scroll container ────────────────────────────────────── */
        .mcf-ribbon {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
        }
        .mcf-ribbon::-webkit-scrollbar { display: none; }

        .mcf-ribbon__inner {
          padding-top: 4px;
          padding-bottom: 4px;
        }

        /* ── Edge fade masks ────────────────────────────────────────────── */
        .mcf-fade--left  {
          background: linear-gradient(to right, rgba(253, 246, 236, 0.95) 30%, transparent);
        }
        .mcf-fade--right {
          background: linear-gradient(to left, rgba(253, 246, 236, 0.95) 30%, transparent);
        }
        .mcf-root[data-sticky] .mcf-fade--left {
          background: linear-gradient(to right, rgba(253, 246, 236, 0.92) 30%, transparent);
        }
        .mcf-root[data-sticky] .mcf-fade--right {
          background: linear-gradient(to left, rgba(253, 246, 236, 0.92) 30%, transparent);
        }

        /* ── Arrow buttons ──────────────────────────────────────────────── */
        .mcf-arrow {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .mcf-arrow__icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a6e56;
          background: rgba(253, 246, 236, 0.9);
          border: 1px solid rgba(212, 196, 168, 0.5);
          transition:
            border-color 0.2s ease,
            background   0.2s ease,
            color        0.2s ease,
            transform    0.2s ease;
        }
        .mcf-arrow:hover .mcf-arrow__icon {
          border-color: rgba(196, 151, 42, 0.5);
          background: rgba(253, 246, 236, 1);
          color: #6B1700;
          transform: scale(1.05);
        }

        /* ── Tab — base ─────────────────────────────────────────────────── */
        .mcf-tab {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 14px 12px;
          min-height: 44px;
          border: none;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.2s ease;
          border-radius: 6px;
        }

        .mcf-tab__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 450;
          letter-spacing: 0.01em;
          color: #8a6e56;
          white-space: nowrap;
          transition:
            color       0.25s cubic-bezier(0.22, 1, 0.36, 1),
            font-weight 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* ── Tab — indicator (underline) ────────────────────────────────── */
        .mcf-tab__indicator {
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 2px;
          border-radius: 2px 2px 0 0;
          background: #C4972A;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: center;
          transition:
            opacity   0.3s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* ── Tab — hover (inactive only) ────────────────────────────────── */
        .mcf-tab:not([data-active]):hover {
          background: rgba(196, 151, 42, 0.05);
        }
        .mcf-tab:not([data-active]):hover .mcf-tab__label {
          color: #5a3f2a;
        }
        .mcf-tab:not([data-active]):hover .mcf-tab__indicator {
          opacity: 0.35;
          transform: scaleX(0.6);
        }

        /* ── Tab — active state ─────────────────────────────────────────── */
        .mcf-tab[data-active] .mcf-tab__label {
          color: #1a0f0a;
          font-weight: 600;
        }
        .mcf-tab[data-active] .mcf-tab__indicator {
          opacity: 1;
          transform: scaleX(1);
          left: 14%;
          right: 14%;
          height: 2.5px;
          background: linear-gradient(90deg, #C4972A, #d4a73a);
        }

        /* Active tab subtle glow for depth */
        .mcf-tab[data-active]::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 10%;
          right: 10%;
          height: 6px;
          background: radial-gradient(ellipse at center, rgba(196, 151, 42, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Bottom border ──────────────────────────────────────────────── */
        .mcf-border-bottom {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent 5%,
            rgba(212, 196, 168, 0.3) 30%,
            rgba(212, 196, 168, 0.3) 70%,
            transparent 95%
          );
        }

        /* ── Reduced motion ─────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .mcf-root,
          .mcf-tab,
          .mcf-tab__label,
          .mcf-tab__indicator,
          .mcf-arrow__icon {
            transition-duration: 0.01ms !important;
          }
        }

        /* ── Mobile refinements ─────────────────────────────────────────── */
        @media (max-width: 768px) {
          .mcf-tab {
            padding: 8px 12px 10px;
          }
          .mcf-tab__label {
            font-size: 12.5px;
          }
          .mcf-ribbon__inner {
            padding-left: 16px;
            padding-right: 16px;
            gap: 2px;
          }
        }
      `}</style>
    </nav>
  );
}