"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: Date;
  _count: { bookings: number; listings: number };
};

const ROLE_LABELS: Record<string, string> = { GUEST: "Гість", HOST: "Хост", ADMIN: "Адмін" };
const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  GUEST: { bg: "var(--bg-alt)",            color: "var(--ink-2)"          },
  HOST:  { bg: "oklch(0.94 0.06 145)",     color: "oklch(0.4 0.12 145)"   },
  ADMIN: { bg: "oklch(0.94 0.07 75)",      color: "oklch(0.42 0.13 60)"   },
};

const TABS = [
  { key: "ALL",   label: "Всі"     },
  { key: "GUEST", label: "Гості"   },
  { key: "HOST",  label: "Хости"   },
  { key: "ADMIN", label: "Адміни"  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function exportCSV(users: User[]) {
  const header = ["ID", "Ім'я", "Email", "Роль", "Заблоковано", "Бронювань", "Оголошень", "Зареєстрований"];
  const rows = users.map((u) => [
    u.id,
    u.name ?? "",
    u.email,
    u.role,
    u.isBlocked ? "Так" : "Ні",
    u._count.bookings,
    u._count.listings,
    new Date(u.createdAt).toLocaleDateString("uk-UA"),
  ]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stayhub-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<TabKey>("ALL");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      ALL:   users.length,
      GUEST: users.filter((u) => u.role === "GUEST").length,
      HOST:  users.filter((u) => u.role === "HOST").length,
      ADMIN: users.filter((u) => u.role === "ADMIN").length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    let list = tab === "ALL" ? users : users.filter((u) => u.role === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, tab, search]);

  async function patchUser(id: string, patch: Partial<{ role: string; isBlocked: boolean }>) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) { toast.error("Помилка оновлення"); return; }
      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
      if ("role" in patch) toast.success("Роль оновлено");
      if ("isBlocked" in patch) toast.success(patch.isBlocked ? "Користувача заблоковано" : "Блокування знято");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Tabs */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
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
                    : { background: "var(--bg-alt)", color: "var(--muted)" }
                }
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Spacer */}
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
            placeholder="Ім'я або email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              width: 200,
            }}
          />
        </div>

        {/* CSV export */}
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--bg-alt)]"
          style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
        >
          <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
            <path d="M8 1v9M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          CSV
        </button>
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
                {["Користувач", "Роль", "Бронювань", "Оголошень", "Зареєстрований", "Дії"].map((h) => (
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
              {filtered.map((user, i) => {
                const isLast = i === filtered.length - 1;
                const rs = ROLE_STYLES[user.role] ?? ROLE_STYLES.GUEST;
                const busy = loadingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-[var(--bg-alt)]"
                    style={{
                      borderBottom: isLast ? "none" : "1px solid var(--line)",
                      opacity: user.isBlocked ? 0.55 : 1,
                    }}
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name ?? ""}
                            width={32}
                            height={32}
                            className="rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                            style={{ background: "var(--ink)", color: "var(--bg)" }}
                          >
                            {user.name?.[0] ?? "?"}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                              {user.name ?? "—"}
                            </p>
                            {user.isBlocked && (
                              <span
                                className="px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider"
                                style={{ background: "oklch(0.93 0.05 20)", color: "oklch(0.45 0.15 20)" }}
                              >
                                Заблоковано
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[10.5px]" style={{ color: "var(--ink-2)" }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role select */}
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={busy}
                        onChange={(e) => patchUser(user.id, { role: e.target.value })}
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer transition-all"
                        style={{ background: rs.bg, color: rs.color }}
                      >
                        <option value="GUEST">{ROLE_LABELS.GUEST}</option>
                        <option value="HOST">{ROLE_LABELS.HOST}</option>
                        <option value="ADMIN">{ROLE_LABELS.ADMIN}</option>
                      </select>
                    </td>

                    {/* Stats */}
                    <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                      {user._count.bookings}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                      {user._count.listings}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 font-mono text-[11px]" style={{ color: "var(--ink-2)" }}>
                      {new Date(user.createdAt).toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <button
                        disabled={busy}
                        onClick={() => patchUser(user.id, { isBlocked: !user.isBlocked })}
                        className="px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all disabled:opacity-40"
                        style={
                          user.isBlocked
                            ? { background: "oklch(0.94 0.06 145)", color: "oklch(0.4 0.12 145)", border: "none" }
                            : { background: "oklch(0.95 0.05 20)", color: "oklch(0.45 0.15 20)", border: "none" }
                        }
                      >
                        {busy ? "…" : user.isBlocked ? "Розблокувати" : "Заблокувати"}
                      </button>
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
