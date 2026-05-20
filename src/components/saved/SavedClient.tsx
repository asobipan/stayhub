"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarFillIcon, PinIcon, HeartFillIcon } from "@/components/ui/icons";

type Listing = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  avgRating: number;
  reviewCount: number;
};

type Props = {
  initialListings: Listing[];
  cityCount: number;
};

const SORT_OPTIONS = [
  { id: "saved",  label: "За датою збереження" },
  { id: "price",  label: "Дешевші спершу" },
  { id: "rating", label: "Найвищий рейтинг" },
  { id: "city",   label: "За містом" },
] as const;

type Sort = typeof SORT_OPTIONS[number]["id"];

export function SavedClient({ initialListings, cityCount }: Props) {
  const [listings, setListings] = useState(initialListings);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<Sort>("saved");
  const [, startTransition] = useTransition();

  const sorted = [...listings].sort((a, b) => {
    if (sort === "price")  return a.price - b.price;
    if (sort === "rating") return b.avgRating - a.avgRating;
    if (sort === "city")   return a.city.localeCompare(b.city);
    return 0;
  });

  const remove = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    startTransition(async () => {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
    });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
          <nav className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-widest mb-6" style={{ color: "var(--sh-muted)" }}>
            <Link href="/" style={{ color: "var(--sh-muted)" }} className="hover:text-[var(--ink)] transition-colors">StayHub</Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>Збережені</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
                Колекція · {listings.length} помешкань
              </p>
              <h1 className="font-serif leading-tight mb-3" style={{ fontSize: 38, color: "var(--ink)" }}>
                Місця, які ти<br/><em style={{ fontStyle: "italic" }}>відклав на потім</em>
              </h1>
              <p className="text-[15px] max-w-[480px]" style={{ color: "var(--ink-2)" }}>
                Натискай ♥ на будь-якому оголошенні — воно з'явиться тут. Повертайся, коли будеш готовий бронювати.
              </p>
            </div>

            {listings.length > 0 && (
              <div className="flex gap-8 shrink-0">
                <div className="text-center">
                  <p className="font-serif leading-none mb-1" style={{ fontSize: 40, color: "var(--ink)" }}>
                    {listings.length}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
                    помешкань
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-serif leading-none mb-1" style={{ fontSize: 40, color: "var(--ink)" }}>
                    {cityCount}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
                    міст
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {listings.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-[13.5px]" style={{ color: "var(--ink-2)" }}>
                <strong className="text-[var(--ink)] font-semibold">{sorted.length}</strong>{" "}
                {sorted.length === 1 ? "помешкання" : sorted.length < 5 ? "помешкання" : "помешкань"}
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="text-[13px] px-3 py-1.5 rounded-lg border appearance-none outline-none cursor-pointer"
                  style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                  <button
                    onClick={() => setView("grid")}
                    className="px-3 py-1.5 transition-colors"
                    style={view === "grid" ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--sh-muted)" }}
                    title="Сітка"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="px-3 py-1.5 transition-colors"
                    style={view === "list" ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--sh-muted)" }}
                    title="Список"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".5" fill="currentColor"/><circle cx="3.5" cy="12" r=".5" fill="currentColor"/><circle cx="3.5" cy="18" r=".5" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                {sorted.map((l, i) => (
                  <SavedGridCard key={l.id} listing={l} index={i} onRemove={() => remove(l.id)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: 1 }}>
                {sorted.map((l, i) => (
                  <SavedListRow key={l.id} listing={l} index={i} onRemove={() => remove(l.id)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SavedGridCard({ listing: l, index, onRemove }: { listing: Listing; index: number; onRemove: () => void }) {
  const hue = (index * 35) % 360;

  return (
    <div className="flex flex-col group">
      <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden mb-3" style={{ background: "var(--bg-alt)" }}>
        {l.images[0] ? (
          <Image src={l.images[0]} alt={l.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, oklch(0.62 0.08 ${hue}) 0%, oklch(0.45 0.08 ${hue + 20}) 100%)` }} />
        )}
        <button
          onClick={onRemove}
          aria-label="Видалити зі збережених"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: "white" }}
        >
          <HeartFillIcon size={16} className="text-[var(--accent)]" />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/listings/${l.id}`}
            className="font-serif text-[19px] font-normal leading-[1.15] line-clamp-2 flex-1 hover:text-[var(--accent)] transition-colors"
            style={{ color: "var(--ink)" }}
          >
            {l.title}
          </Link>
          {l.reviewCount > 0 && (
            <span className="flex items-center gap-1 text-[13px] font-medium shrink-0 mt-0.5" style={{ color: "var(--ink)" }}>
              <StarFillIcon size={11} className="text-[var(--accent)]" />
              {l.avgRating.toFixed(2)}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-[12.5px] truncate" style={{ color: "var(--sh-muted)" }}>
          <PinIcon size={11} />
          {l.city}, {l.country}
          <span className="text-[9px]">·</span>
          {l.bedrooms} {l.bedrooms === 1 ? "спальня" : "спальні"}
        </p>
        <p className="text-[14px] mt-1" style={{ color: "var(--ink)" }}>
          <span className="font-semibold">${l.price}</span>
          <span className="text-[12.5px]" style={{ color: "var(--sh-muted)" }}> /ніч</span>
        </p>
      </div>
    </div>
  );
}

function SavedListRow({ listing: l, index, onRemove }: { listing: Listing; index: number; onRemove: () => void }) {
  const hue = (index * 35) % 360;

  return (
    <div
      className="flex items-center gap-5 py-4 px-5 rounded-2xl transition-colors hover:bg-[var(--bg-alt)]"
      style={{ background: "var(--surface)", marginBottom: 2 }}
    >
      <span className="font-mono text-[11px] w-6 shrink-0" style={{ color: "var(--sh-muted)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--bg-alt)" }}>
        {l.images[0] ? (
          <Image src={l.images[0]} alt={l.title} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, oklch(0.62 0.08 ${hue}) 0%, oklch(0.45 0.08 ${hue + 20}) 100%)` }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/listings/${l.id}`}
          className="font-serif text-[17px] leading-tight line-clamp-1 hover:text-[var(--accent)] transition-colors"
          style={{ color: "var(--ink)" }}
        >
          {l.title}
        </Link>
        <p className="flex items-center gap-1 text-[12px] mt-0.5 truncate" style={{ color: "var(--sh-muted)" }}>
          <PinIcon size={10} />
          {l.city}, {l.country}
          <span className="mx-1 text-[9px]">·</span>
          {l.bedrooms} {l.bedrooms === 1 ? "спальня" : "спальні"}
          <span className="mx-1 text-[9px]">·</span>
          до {l.maxGuests} гостей
        </p>
      </div>
      {l.reviewCount > 0 && (
        <span className="flex items-center gap-1 text-[13px] font-medium shrink-0" style={{ color: "var(--ink)" }}>
          <StarFillIcon size={11} className="text-[var(--accent)]" />
          {l.avgRating.toFixed(1)}
        </span>
      )}
      <div className="shrink-0 text-right">
        <span className="font-serif text-[18px]" style={{ color: "var(--ink)" }}>${l.price}</span>
        <span className="text-[11px] block" style={{ color: "var(--sh-muted)" }}>/ніч</span>
      </div>
      <button
        onClick={onRemove}
        aria-label="Видалити зі збережених"
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-alt)]"
        style={{ color: "var(--accent)" }}
      >
        <HeartFillIcon size={15} />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-24">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "var(--bg-alt)" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--sh-muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <h2 className="font-serif mb-3" style={{ fontSize: 28, color: "var(--ink)" }}>
        Поки нічого не збережено
      </h2>
      <p className="text-[14px] mb-8 max-w-[360px]" style={{ color: "var(--ink-2)" }}>
        Шукай помешкання і натискай ♥ на карточці — вони з'являться тут.
      </p>
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium transition-colors"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
        </svg>
        Знайти помешкання
      </Link>
    </div>
  );
}
