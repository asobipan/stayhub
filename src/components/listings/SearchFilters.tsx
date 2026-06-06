"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { useTransition } from "react";
import { SearchIcon } from "@/components/ui/icons";

const filterParsers = {
  city: parseAsString.withDefault(""),
  checkIn: parseAsString.withDefault(""),
  checkOut: parseAsString.withDefault(""),
  guests: parseAsInteger.withDefault(0),
  minPrice: parseAsInteger.withDefault(0),
  maxPrice: parseAsInteger.withDefault(0),
};

export function SearchFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: "push",
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  function applyFilters() {
    startTransition(() => {
      setFilters({ ...filters });
    });
  }

  function clearFilters() {
    startTransition(() => {
      setFilters(null);
    });
  }

  const hasFilters =
    filters.city ||
    filters.checkIn ||
    filters.checkOut ||
    filters.guests > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice > 0;

  return (
    <div className="flex items-center gap-0 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center gap-2.5 flex-1 px-5 py-3 border-r border-[var(--line)]">
        <SearchIcon size={15} className="text-[var(--sh-muted)] shrink-0" />
        <input
          type="text"
          value={filters.city}
          onChange={(e) => setFilters({ city: e.target.value || null })}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Місто або район…"
          className="flex-1 text-[13.5px] text-[var(--ink)] bg-transparent outline-none placeholder:text-[var(--sh-muted)]"
        />
        {filters.city && (
          <button
            onClick={() => setFilters({ city: null })}
            className="text-[var(--sh-muted)] hover:text-[var(--ink)] transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2 px-5 py-3 border-r border-[var(--line)]">
        <label className="block font-mono-sh text-[10px] uppercase tracking-[0.08em] text-[var(--sh-muted)] sr-only">
          Заїзд
        </label>
        <input
          type="date"
          value={filters.checkIn}
          onChange={(e) =>
            setFilters({
              checkIn: e.target.value || null,
              checkOut:
                filters.checkOut && e.target.value >= filters.checkOut
                  ? null
                  : filters.checkOut || null,
            })
          }
          className="text-[13px] text-[var(--ink)] bg-transparent outline-none cursor-pointer"
        />
        <span className="text-[var(--line-2)]">→</span>
        <input
          type="date"
          value={filters.checkOut}
          min={filters.checkIn}
          onChange={(e) => setFilters({ checkOut: e.target.value || null })}
          className="text-[13px] text-[var(--ink)] bg-transparent outline-none cursor-pointer"
        />
      </div>

      <div className="hidden md:flex items-center px-5 py-3 border-r border-[var(--line)]">
        <input
          type="number"
          value={filters.guests || ""}
          onChange={(e) =>
            setFilters({
              guests: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          placeholder="Гості"
          min="1"
          className="w-16 text-[13px] text-[var(--ink)] bg-transparent outline-none placeholder:text-[var(--sh-muted)]"
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2">
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-xl text-[13px] text-[var(--sh-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-alt)] transition-colors"
          >
            Скинути
          </button>
        )}
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--background)] text-[13px] font-medium transition-opacity disabled:opacity-60"
        >
          <SearchIcon size={13} />
          {isPending ? "…" : "Пошук"}
        </button>
      </div>
    </div>
  );
}
