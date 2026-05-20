"use client";

import { useState, useMemo } from "react";

type Booking = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: string;
  listing: { title: string; city: string };
  guest: { name: string | null; email: string };
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: "Очікує",       bg: "oklch(0.94 0.07 75)",  color: "oklch(0.42 0.13 60)"  },
  CONFIRMED: { label: "Підтверджено", bg: "oklch(0.92 0.05 145)", color: "oklch(0.35 0.10 150)" },
  COMPLETED: { label: "Завершено",    bg: "var(--bg-alt)",        color: "var(--ink-2)"          },
  CANCELLED: { label: "Скасовано",    bg: "oklch(0.93 0.01 30)",  color: "oklch(0.50 0.04 30)"  },
};

const TABS = [
  { key: "ALL",       label: "Всі"          },
  { key: "PENDING",   label: "Очікують"     },
  { key: "CONFIRMED", label: "Підтверджені" },
  { key: "COMPLETED", label: "Завершені"    },
  { key: "CANCELLED", label: "Скасовані"   },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const fmt = (d: Date) =>
  new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

export function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [tab, setTab] = useState<TabKey>("ALL");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      ALL:       initialBookings.length,
      PENDING:   initialBookings.filter((b) => b.status === "PENDING").length,
      CONFIRMED: initialBookings.filter((b) => b.status === "CONFIRMED").length,
      COMPLETED: initialBookings.filter((b) => b.status === "COMPLETED").length,
      CANCELLED: initialBookings.filter((b) => b.status === "CANCELLED").length,
    }),
    [initialBookings]
  );

  const filtered = useMemo(() => {
    let list = tab === "ALL" ? initialBookings : initialBookings.filter((b) => b.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.listing.title.toLowerCase().includes(q) ||
          b.listing.city.toLowerCase().includes(q) ||
          b.guest.name?.toLowerCase().includes(q) ||
          b.guest.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialBookings, tab, search]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Tabs */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl flex-wrap"
          style={{ background: "var(--surface-2)" }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-all"
              style={
                tab === key
                  ? { background: "var(--ink)", color: "var(--bg)" }
                  : { color: "var(--ink-2)" }
              }
            >
              {label}
              <span
                className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                style={
                  tab === key
                    ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }
                    : { background: "var(--bg-alt)", color: "var(--ink-2)" }
                }
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width={13} height={13} viewBox="0 0 16 16" fill="none"
            style={{ color: "var(--muted)" }}
          >
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Оголошення, гість, місто…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              width: 220,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>Нічого не знайдено</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Оголошення", "Гість", "Дати", "Гостей", "Сума", "Статус"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <tr
                    key={b.id}
                    className="transition-colors hover:bg-[var(--bg-alt)]"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--line)" : "none" }}
                  >
                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="text-sm font-medium line-clamp-1" style={{ color: "var(--ink)" }}>
                        {b.listing.title}
                      </p>
                      <p className="font-mono text-[10.5px]" style={{ color: "var(--ink-2)" }}>
                        {b.listing.city}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm" style={{ color: "var(--ink-2)" }}>{b.guest.name}</p>
                      <p className="font-mono text-[10.5px]" style={{ color: "var(--ink-2)" }}>{b.guest.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--ink-2)" }}>
                      {fmt(b.checkIn)} — {fmt(b.checkOut)}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                      {b.guests}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-serif text-[17px]" style={{ color: "var(--ink)" }}>
                        ${b.totalPrice}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
