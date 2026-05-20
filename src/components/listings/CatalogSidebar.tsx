"use client";

import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useTransition, useRef, useEffect, useState, useCallback } from "react";

const AMENITIES = [
  { id: "wifi",    label: "Wi-Fi",         icon: "M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" },
  { id: "kitchen", label: "Кухня",         icon: "M3 2h18v7a4 4 0 01-4 4H7a4 4 0 01-4-4V2zm0 7h18M12 13v9M8 22h8" },
  { id: "parking", label: "Парковка",      icon: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M13 21h8M13 13h8m-8 4h4" },
  { id: "pool",    label: "Басейн",        icon: "M2 12h20M2 16h20M2 8a5 5 0 005-5 5 5 0 005 5 5 5 0 005-5 5 5 0 005 5" },
  { id: "ac",      label: "Кондиціонер",   icon: "M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4V2m8 2V2M8 4h8" },
  { id: "washer",  label: "Пральня",       icon: "M3 3h18v18H3zM12 8a4 4 0 100 8 4 4 0 000-8zm0 0v1m0 6v1m-3-3H8m8 0h1" },
  { id: "tv",      label: "Телевізор",     icon: "M21 3H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zM8 21h8m-4-4v4" },
  { id: "workspace", label: "Робоче місце", icon: "M2 3h20v14H2zM8 21h8m-4-4v4" },
];

const parsers = {
  minPrice:    parseAsInteger.withDefault(0),
  maxPrice:    parseAsInteger.withDefault(0),
  bedrooms:    parseAsInteger.withDefault(0),
  superhost:   parseAsString.withDefault(""),
  instantBook: parseAsString.withDefault(""),
  amenities:   parseAsString.withDefault(""),
  sort:        parseAsString.withDefault(""),
  page:        parseAsInteger.withDefault(1),
};

export function CatalogSidebar() {
  const [filters, setFilters] = useQueryStates(parsers, { history: "push", shallow: false });
  const [, startTransition] = useTransition();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 20,
    filters.maxPrice || 500,
  ]);

  const activeAmenities = new Set(filters.amenities ? filters.amenities.split(",").filter(Boolean) : []);

  function apply(patch: Partial<typeof filters>) {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
    });
  }

  function reset() {
    setPriceRange([20, 500]);
    startTransition(() => {
      setFilters(null);
    });
  }

  function applyPrice() {
    apply({
      minPrice: priceRange[0] === 20 ? 0 : priceRange[0],
      maxPrice: priceRange[1] === 500 ? 0 : priceRange[1],
    });
  }

  function toggleAmenity(id: string) {
    const next = new Set(activeAmenities);
    if (next.has(id)) next.delete(id); else next.add(id);
    apply({ amenities: next.size > 0 ? [...next].join(",") : "" });
  }

  const hasFilters = filters.minPrice > 0 || filters.maxPrice > 0 || filters.bedrooms > 0 ||
    filters.superhost || filters.instantBook || filters.amenities;

  return (
    <aside className="sh-filters">
      <div className="sh-filters-inner">
        <h3 className="sh-filters-head">
          <span>Фільтри</span>
          {hasFilters && (
            <button className="sh-filters-reset" onClick={reset}>Скинути</button>
          )}
        </h3>

        {/* Price range */}
        <div className="sh-filter-block">
          <div className="sh-filter-lbl">
            <span>Ціна за ніч</span>
            <span className="sh-filter-val">${priceRange[0]} — ${priceRange[1]}{priceRange[1] === 500 ? "+" : ""}</span>
          </div>
          <RangeSlider min={20} max={500} step={5} value={priceRange} onChange={setPriceRange} onRelease={applyPrice} />
          <div className="sh-filter-range-meta">
            <span>$20</span>
            <span>$500+</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="sh-filter-block">
          <div className="sh-filter-lbl"><span>Спальні</span></div>
          <div className="sh-pill-row">
            {([0, 1, 2, 3, 4] as const).map((n) => (
              <button
                key={n}
                className={`sh-pill ${filters.bedrooms === n ? "active" : ""}`}
                onClick={() => apply({ bedrooms: n })}
              >
                {n === 0 ? "Будь-яка" : `${n}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="sh-filter-block">
          <div className="sh-filter-lbl"><span>Зручності</span></div>
          <div className="sh-amenity-grid">
            {AMENITIES.map((a) => (
              <button
                key={a.id}
                className={`sh-amenity ${activeAmenities.has(a.id) ? "active" : ""}`}
                onClick={() => toggleAmenity(a.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={a.icon} />
                </svg>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Superhost toggle */}
        <div className="sh-filter-block">
          <ToggleRow
            checked={filters.superhost === "1"}
            onChange={(v) => apply({ superhost: v ? "1" : "" })}
            title="Тільки Superhost"
            sub="Хости з 95%+ підтверджених броні"
          />
          <ToggleRow
            checked={filters.instantBook === "1"}
            onChange={(v) => apply({ instantBook: v ? "1" : "" })}
            title="Миттєве бронювання"
            sub="Без очікування підтвердження"
          />
        </div>
      </div>
    </aside>
  );
}

// ── Dual-handle range slider ──────────────────────────────
function RangeSlider({
  min, max, step, value, onChange, onRelease,
}: {
  min: number; max: number; step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  onRelease: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<"lo" | "hi" | null>(null);
  const [v1, v2] = value;
  const pct = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max]);

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      if (drag === "lo") onChange([Math.min(snapped, v2 - step), v2]);
      else onChange([v1, Math.max(snapped, v1 + step)]);
    };
    const onUp = () => { setDrag(null); onRelease(); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [drag, v1, v2, min, max, step, onChange, onRelease]);

  return (
    <div className="sh-slider" ref={trackRef}>
      <div className="sh-slider-track" />
      <div className="sh-slider-fill" style={{ left: `${pct(v1)}%`, right: `${100 - pct(v2)}%` }} />
      <button
        className="sh-slider-handle"
        style={{ left: `${pct(v1)}%` }}
        onMouseDown={(e) => { e.preventDefault(); setDrag("lo"); }}
        onTouchStart={(e) => { e.preventDefault(); setDrag("lo"); }}
        aria-label="Мінімальна ціна"
      />
      <button
        className="sh-slider-handle"
        style={{ left: `${pct(v2)}%` }}
        onMouseDown={(e) => { e.preventDefault(); setDrag("hi"); }}
        onTouchStart={(e) => { e.preventDefault(); setDrag("hi"); }}
        aria-label="Максимальна ціна"
      />
    </div>
  );
}

// ── Toggle row ───────────────────────────────────────────
function ToggleRow({ checked, onChange, title, sub }: {
  checked: boolean; onChange: (v: boolean) => void; title: string; sub: string;
}) {
  return (
    <button className="sh-toggle-row" onClick={() => onChange(!checked)}>
      <div className="sh-toggle-row-l">
        <div>
          <h4>{title}</h4>
          <p>{sub}</p>
        </div>
      </div>
      <span className={`sh-switch ${checked ? "on" : ""}`}><span /></span>
    </button>
  );
}
