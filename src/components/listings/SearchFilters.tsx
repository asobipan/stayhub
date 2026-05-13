"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

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
  const [showFilters, setShowFilters] = useState(false);

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
    <div className='mb-8'>
      {/* Main search bar */}
      <div
        className='flex items-center gap-2 p-2 rounded-xl border mb-3'
        style={{
          background: "#fff",
          borderColor: "#E7E5E0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div className='flex-1 flex items-center gap-3 px-3'>
          <Search className='w-4 h-4 shrink-0' style={{ color: "#312E81" }} />
          <input
            type='text'
            value={filters.city}
            onChange={(e) => setFilters({ city: e.target.value || null })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder='Місто або район...'
            className='flex-1 text-sm outline-none bg-transparent'
            style={{ color: "#1C1917", fontFamily: "var(--font-sans)" }}
          />
          {filters.city && (
            <button onClick={() => setFilters({ city: null })}>
              <X className='w-3.5 h-3.5' style={{ color: "#A8A29E" }} />
            </button>
          )}
        </div>

        <div
          className='hidden md:flex items-center gap-1 border-l pl-3'
          style={{ borderColor: "#E7E5E0" }}
        >
          <input
            type='date'
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
            className='text-sm outline-none bg-transparent cursor-pointer'
            style={{
              color: filters.checkIn ? "#1C1917" : "#A8A29E",
              fontFamily: "var(--font-sans)",
            }}
          />
          <span className='text-xs' style={{ color: "#C4BFBA" }}>
            →
          </span>
          <input
            type='date'
            value={filters.checkOut}
            min={filters.checkIn}
            onChange={(e) => setFilters({ checkOut: e.target.value || null })}
            className='text-sm outline-none bg-transparent cursor-pointer'
            style={{
              color: filters.checkOut ? "#1C1917" : "#A8A29E",
              fontFamily: "var(--font-sans)",
            }}
          />
        </div>

        <div
          className='hidden md:flex items-center gap-1 border-l pl-3'
          style={{ borderColor: "#E7E5E0" }}
        >
          <input
            type='number'
            value={filters.guests || ""}
            onChange={(e) =>
              setFilters({
                guests: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            placeholder='Гості'
            min='1'
            className='w-16 text-sm outline-none bg-transparent'
            style={{ color: "#1C1917", fontFamily: "var(--font-sans)" }}
          />
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='p-2.5 rounded-lg transition-colors'
            style={{
              background: showFilters ? "#F0EDE6" : "transparent",
              color: "#44403C",
            }}
          >
            <SlidersHorizontal className='w-4 h-4' />
          </button>

          <button
            onClick={applyFilters}
            disabled={isPending}
            className='px-5 py-2.5 rounded-lg text-sm font-medium transition-colors'
            style={{
              background: "#1E1B4B",
              color: "#fff",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "..." : "Пошук"}
          </button>
        </div>
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div
          className='flex flex-wrap items-end gap-4 p-4 rounded-xl border'
          style={{ background: "#FAFAF8", borderColor: "#E7E5E0" }}
        >
          <div className='md:hidden flex items-center gap-2'>
            <FilterField label='Заїзд'>
              <input
                type='date'
                value={filters.checkIn}
                onChange={(e) =>
                  setFilters({ checkIn: e.target.value || null })
                }
                className='text-sm outline-none bg-transparent w-full'
                style={{ color: "#1C1917" }}
              />
            </FilterField>
            <FilterField label='Виїзд'>
              <input
                type='date'
                value={filters.checkOut}
                min={filters.checkIn}
                onChange={(e) =>
                  setFilters({ checkOut: e.target.value || null })
                }
                className='text-sm outline-none bg-transparent w-full'
                style={{ color: "#1C1917" }}
              />
            </FilterField>
          </div>

          <FilterField label='Мін. ціна / ніч'>
            <input
              type='number'
              value={filters.minPrice || ""}
              onChange={(e) =>
                setFilters({
                  minPrice: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder='$0'
              min='0'
              className='text-sm outline-none bg-transparent w-full'
              style={{ color: "#1C1917" }}
            />
          </FilterField>

          <FilterField label='Макс. ціна / ніч'>
            <input
              type='number'
              value={filters.maxPrice || ""}
              onChange={(e) =>
                setFilters({
                  maxPrice: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder='$9999'
              min='0'
              className='text-sm outline-none bg-transparent w-full'
              style={{ color: "#1C1917" }}
            />
          </FilterField>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors hover:bg-red-50'
              style={{ borderColor: "#E7E5E0", color: "#78716C" }}
            >
              <X className='w-3.5 h-3.5' />
              Скинути
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='min-w-30'>
      <label
        className='block text-xs font-medium mb-1.5'
        style={{ color: "#78716C" }}
      >
        {label}
      </label>
      <div
        className='px-3 py-2 rounded-lg border'
        style={{ background: "#fff", borderColor: "#E7E5E0" }}
      >
        {children}
      </div>
    </div>
  );
}
