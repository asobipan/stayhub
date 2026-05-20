"use client";

import { useState } from "react";
import Link from "next/link";

const CITY_MULTIPLIERS: Record<string, number> = {
  "Київ": 1.10, "Львів": 0.85, "Одеса": 0.95,
  "Відень": 1.55, "Барселона": 1.80, "Прага": 1.35,
  "Варшава": 1.05, "Лісабон": 1.40, "Будапешт": 1.20,
};

const TYPE_BASE: Record<string, number> = {
  apartment: 60, studio: 45, loft: 75, villa: 145, cabin: 95, penthouse: 175,
};

const TYPES = [
  { id: "apartment", label: "Апартаменти" },
  { id: "studio",    label: "Студія" },
  { id: "loft",      label: "Лофт" },
  { id: "villa",     label: "Вілла" },
  { id: "cabin",     label: "Будиночок" },
  { id: "penthouse", label: "Пентхаус" },
];

const OCCUPANCY = 0.62;
const UAH_RATE  = 41;

const uah = (usd: number) => Math.round((usd * UAH_RATE) / 100) * 100;
const fmt = (n: number) => n.toLocaleString("uk-UA");

export function IncomeCalculator() {
  const [city, setCity]         = useState("Київ");
  const [type, setType]         = useState("apartment");
  const [bedrooms, setBedrooms] = useState(2);

  const basePerNight = (TYPE_BASE[type] ?? 60) * (CITY_MULTIPLIERS[city] ?? 1) * (0.65 + bedrooms * 0.18);
  const nightsBooked = Math.round(OCCUPANCY * 30);
  const monthly      = Math.round(basePerNight * nightsBooked);
  const fee          = Math.round(monthly * 0.12);
  const takeHome     = monthly - fee;

  return (
    <section id="calc" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Калькулятор · {Math.round(OCCUPANCY * 100)}% завантаженості
            </p>
            <h2 className="font-serif leading-tight" style={{ fontSize: 34, color: "var(--ink)" }}>
              Скільки заробиш<br/><em style={{ fontStyle: "italic" }}>саме ти</em>?
            </h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-serif leading-none" style={{ fontSize: 48, color: "var(--ink)" }}>580+</span>
            <span className="font-mono text-[10px] uppercase tracking-widest pb-1" style={{ color: "var(--sh-muted)" }}>
              реальних<br/>даних хостів
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="flex flex-col gap-8 p-8 rounded-2xl border" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            {/* City */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-3 block" style={{ color: "var(--sh-muted)" }}>
                Місто
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(CITY_MULTIPLIERS).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors"
                    style={city === c
                      ? { background: "var(--ink)", color: "var(--bg)" }
                      : { background: "var(--bg-alt)", color: "var(--ink-2)", border: "1px solid var(--line)" }
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-3 block" style={{ color: "var(--sh-muted)" }}>
                Тип житла
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className="py-3 px-2 rounded-xl text-[12.5px] font-medium transition-colors text-center"
                    style={type === t.id
                      ? { background: "var(--ink)", color: "var(--bg)" }
                      : { background: "var(--bg-alt)", color: "var(--ink-2)", border: "1px solid var(--line)" }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-3 block" style={{ color: "var(--sh-muted)" }}>
                Спалень
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
                  <button
                    onClick={() => setBedrooms((b) => Math.max(1, b - 1))}
                    className="w-10 h-10 flex items-center justify-center text-xl transition-colors hover:bg-[var(--bg-alt)]"
                    style={{ color: "var(--ink)" }}
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-serif text-[22px]" style={{ color: "var(--ink)" }}>
                    {bedrooms}
                  </span>
                  <button
                    onClick={() => setBedrooms((b) => Math.min(8, b + 1))}
                    className="w-10 h-10 flex items-center justify-center text-xl transition-colors hover:bg-[var(--bg-alt)]"
                    style={{ color: "var(--ink)" }}
                  >
                    +
                  </button>
                </div>
                <span className="text-[13px]" style={{ color: "var(--sh-muted)" }}>
                  {bedrooms === 1 ? "спальня" : bedrooms < 5 ? "спальні" : "спалень"} · до {bedrooms * 2 + 1} гостей
                </span>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col p-8 rounded-2xl" style={{ background: "var(--ink)" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
              Орієнтовний дохід / міс
            </p>
            <p className="font-serif leading-none mb-1" style={{ fontSize: 52, color: "#fff" }}>
              ₴{fmt(uah(takeHome))}
            </p>
            <p className="text-[13px] mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              За середньої завантаженості {Math.round(OCCUPANCY * 100)}%
            </p>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {[
                { label: "Ціна за ніч",            value: `₴${fmt(uah(basePerNight))}`,   minus: false },
                { label: "Зайнято в середньому",    value: `${nightsBooked} ночей`,         minus: false },
                { label: "Дохід брутто / міс",      value: `₴${fmt(uah(monthly))}`,        minus: false },
                { label: "Сервісний збір StayHub 12%", value: `−₴${fmt(uah(fee))}`,        minus: true  },
              ].map(({ label, value, minus }) => (
                <li key={label} className="flex items-center justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
                  <span style={{ color: minus ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)" }}>{value}</span>
                </li>
              ))}
              <li className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="text-[14px] font-medium" style={{ color: "#fff" }}>На картку / міс</span>
                <span className="font-serif text-[22px]" style={{ color: "#fff" }}>₴{fmt(uah(takeHome))}</span>
              </li>
              <li className="flex items-center justify-between text-[13px]">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>За рік</span>
                <span style={{ color: "rgba(255,255,255,0.75)" }}>₴{fmt(uah(takeHome * 12))}</span>
              </li>
            </ul>

            <p className="text-[11.5px] mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
              Розрахунок базується на середньому за останні 90 днів. Реальний дохід залежить від сезону, локації та якості оголошення.
            </p>

            <Link
              href="/dashboard/listings/new"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Створити оголошення
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
