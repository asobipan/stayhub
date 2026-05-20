"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  function search() {
    const params = new URLSearchParams();
    if (city.trim())    params.set("city", city.trim());
    if (checkIn)        params.set("checkIn", checkIn);
    if (checkOut)       params.set("checkOut", checkOut);
    if (guests > 0)     params.set("guests", String(guests));
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <>
      {/* Search block */}
      <div
        className="grid items-end gap-0 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] mb-5"
        style={{ gridTemplateColumns: "1.4fr 1fr 1fr auto" }}
      >
        {/* Куди */}
        <div className="px-5 py-3 border-r border-[var(--line)]">
          <label className="block font-mono-sh text-[10px] uppercase tracking-[0.08em] text-[var(--sh-muted)] mb-1">Куди</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Київ, Львів, Барселона…"
            className="w-full text-[14px] font-medium text-[var(--ink)] bg-transparent outline-none placeholder:text-[color-mix(in_oklab,var(--ink)_35%,transparent)]"
          />
        </div>

        {/* Коли — два date inputs */}
        <div className="px-5 py-3 border-r border-[var(--line)]">
          <label className="block font-mono-sh text-[10px] uppercase tracking-[0.08em] text-[var(--sh-muted)] mb-1">Коли</label>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-[13px] font-medium text-[var(--ink)] bg-transparent outline-none w-full"
              style={{ colorScheme: "light" }}
            />
            <span className="text-[var(--sh-muted)] text-[11px] shrink-0">—</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-[13px] font-medium text-[var(--ink)] bg-transparent outline-none w-full"
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        {/* Гостей — stepper */}
        <div className="px-5 py-3 border-r border-[var(--line)]">
          <label className="block font-mono-sh text-[10px] uppercase tracking-[0.08em] text-[var(--sh-muted)] mb-1">Гостей</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-6 h-6 rounded-full border border-[var(--line-2)] flex items-center justify-center text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--bg-alt)] text-[14px] leading-none"
            >
              −
            </button>
            <span className="text-[14px] font-medium text-[var(--ink)] min-w-[20px] text-center">{guests}</span>
            <button
              onClick={() => setGuests((g) => Math.min(16, g + 1))}
              className="w-6 h-6 rounded-full border border-[var(--line-2)] flex items-center justify-center text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--bg-alt)] text-[14px] leading-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Кнопка */}
        <button
          onClick={search}
          className="m-1 flex items-center gap-2 px-[22px] py-[14px] bg-[var(--ink)] text-[var(--background)] rounded-xl text-[13px] font-semibold transition-transform hover:-translate-y-px"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          Шукати
        </button>
      </div>

      {/* Popular pills */}
      <div className="flex items-center flex-wrap gap-2 text-[12px]">
        <span className="text-[var(--sh-muted)]">Популярне:</span>
        {["Біля моря", "Гори", "Лофт у центрі", "З басейном", "Для роботи"].map((t) => (
          <Link
            key={t}
            href={`/listings?city=${encodeURIComponent(t)}`}
            className="px-3 py-1.5 border border-[var(--line)] rounded-full text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--surface)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            {t}
          </Link>
        ))}
      </div>
    </>
  );
}
