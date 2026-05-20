"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StarFillIcon } from "@/components/ui/icons";

type Listing = {
  id: string;
  title: string;
  city: string;
  price: number;
  isActive: boolean;
  status: "DRAFT" | "PENDING" | "ACTIVE" | "REJECTED";
  avgRating: number;
  reviewCount: number;
  host: { name: string | null; email: string | null };
  _count: { bookings: number };
};

type PendingListing = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  bedrooms: number;
  maxGuests: number;
  createdAt: Date;
  host: { name: string | null; email: string | null };
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT:    { label: "Чернетка",    bg: "var(--bg-alt)",        color: "var(--ink-2)"          },
  PENDING:  { label: "На розгляді", bg: "oklch(0.95 0.06 80)",  color: "oklch(0.42 0.13 60)"   },
  ACTIVE:   { label: "Активне",     bg: "oklch(0.92 0.06 145)", color: "oklch(0.35 0.12 145)"  },
  REJECTED: { label: "Відхилено",   bg: "oklch(0.95 0.05 20)",  color: "oklch(0.45 0.15 20)"   },
};

const TABS = [
  { key: "ALL",      label: "Всі"          },
  { key: "PENDING",  label: "На розгляді"  },
  { key: "ACTIVE",   label: "Активні"      },
  { key: "REJECTED", label: "Відхилені"    },
  { key: "DRAFT",    label: "Чернетки"     },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ListingsClient({
  allListings,
  pendingListings,
}: {
  allListings: Listing[];
  pendingListings: PendingListing[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("ALL");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      ALL:      allListings.length,
      PENDING:  allListings.filter((l) => l.status === "PENDING").length,
      ACTIVE:   allListings.filter((l) => l.status === "ACTIVE").length,
      REJECTED: allListings.filter((l) => l.status === "REJECTED").length,
      DRAFT:    allListings.filter((l) => l.status === "DRAFT").length,
    }),
    [allListings]
  );

  const filtered = useMemo(() => {
    let list = tab === "ALL" ? allListings : allListings.filter((l) => l.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.host.name?.toLowerCase().includes(q) ||
          l.host.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allListings, tab, search]);

  const showQueue = tab === "PENDING" && !search.trim();

  async function moderate(id: string, action: "approve" | "reject", rejectReason?: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: rejectReason }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Помилка");
        return;
      }
      toast.success(action === "approve" ? "Оголошення схвалено" : "Оголошення відхилено");
      setRejectId(null);
      setReason("");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
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
            placeholder="Назва, місто, хост…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              width: 210,
            }}
          />
        </div>
      </div>

      {/* Moderation queue cards — shown when PENDING tab is active without search */}
      {showQueue && (
        <div className="mb-8">
          {pendingListings.length === 0 ? (
            <div
              className="py-12 text-center rounded-2xl border-2 border-dashed"
              style={{ borderColor: "var(--line)" }}
            >
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                Нових оголошень для перевірки немає
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingListings.map((l) => (
                <div
                  key={l.id}
                  className="rounded-2xl border p-5 flex items-center gap-5"
                  style={{ borderColor: "var(--line)", background: "var(--surface)" }}
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/listings/${l.id}`}
                      target="_blank"
                      className="font-medium text-[15px] truncate block transition-colors hover:text-[var(--accent)]"
                      style={{ color: "var(--ink)" }}
                    >
                      {l.title}
                    </Link>
                    <p className="text-[13px] mt-0.5 mb-1.5" style={{ color: "var(--ink-2)" }}>
                      {l.city}, {l.country} · ${l.price}/ніч · {l.bedrooms} спальн. · до {l.maxGuests} гостей
                    </p>
                    <p className="font-mono text-[11px]" style={{ color: "var(--ink-2)" }}>
                      {l.host.name} · {l.host.email} · {new Date(l.createdAt).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => moderate(l.id, "approve")}
                      disabled={loading === l.id}
                      className="px-4 py-2 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-40"
                      style={{ background: "oklch(0.92 0.06 145)", color: "oklch(0.35 0.12 145)" }}
                    >
                      {loading === l.id ? "…" : "Схвалити"}
                    </button>
                    <button
                      onClick={() => { setRejectId(l.id); setReason(""); }}
                      disabled={loading === l.id}
                      className="px-4 py-2 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-40"
                      style={{ background: "oklch(0.95 0.05 20)", color: "oklch(0.45 0.15 20)" }}
                    >
                      Відхилити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                {["Назва", "Хост", "Місто", "Ціна/ніч", "Бронювань", "Рейтинг", "Статус"].map((h) => (
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
              {filtered.map((l, i) => {
                const sc = STATUS_CONFIG[l.status] ?? STATUS_CONFIG.DRAFT;
                return (
                  <tr
                    key={l.id}
                    className="transition-colors hover:bg-[var(--bg-alt)]"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--line)" : "none" }}
                  >
                    <td className="px-5 py-4 max-w-[200px]">
                      <Link
                        href={`/listings/${l.id}`}
                        target="_blank"
                        className="text-sm font-medium line-clamp-1 transition-colors hover:text-[var(--accent)]"
                        style={{ color: "var(--ink)" }}
                      >
                        {l.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm" style={{ color: "var(--ink-2)" }}>{l.host.name}</p>
                      <p className="font-mono text-[10.5px]" style={{ color: "var(--ink-2)" }}>{l.host.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--ink-2)" }}>{l.city}</td>
                    <td className="px-5 py-4">
                      <span className="font-serif text-[17px]" style={{ color: "var(--ink)" }}>${l.price}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                      {l._count.bookings}
                    </td>
                    <td className="px-5 py-4">
                      {l.reviewCount > 0 ? (
                        <span className="flex items-center gap-1 text-sm" style={{ color: "var(--ink-2)" }}>
                          <StarFillIcon size={11} className="text-[var(--accent)]" />
                          {l.avgRating.toFixed(1)}
                          <span className="font-mono text-[10px]" style={{ color: "var(--ink-2)" }}>
                            ({l.reviewCount})
                          </span>
                        </span>
                      ) : (
                        <span style={{ color: "var(--ink-2)" }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider"
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

      {/* Reject reason modal */}
      {rejectId && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRejectId(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 mx-4"
            style={{ background: "var(--surface)" }}
          >
            <h3 className="font-serif text-[20px]" style={{ color: "var(--ink)" }}>
              Причина відхилення
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Опишіть, чому оголошення відхиляється…"
              className="w-full rounded-xl border px-4 py-3 text-[14px] resize-none outline-none"
              style={{ background: "var(--bg-alt)", borderColor: "var(--line)", color: "var(--ink)" }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectId(null)}
                className="px-4 py-2 rounded-xl text-[13px]"
                style={{ color: "var(--ink-2)" }}
              >
                Скасувати
              </button>
              <button
                onClick={() => moderate(rejectId, "reject", reason)}
                disabled={!reason.trim() || loading === rejectId}
                className="px-5 py-2 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-40"
                style={{ background: "oklch(0.95 0.05 20)", color: "oklch(0.45 0.15 20)" }}
              >
                {loading === rejectId ? "…" : "Відхилити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
