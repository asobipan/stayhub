"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { UserRole } from "@prisma/client";
import {
  BedIcon, HeartIcon, CalIcon, HomeIcon,
  PlusIcon, SlidersIcon, ExitIcon, MedalIcon, ShieldIcon, ArrowURIcon,
} from "@/components/ui/icons";

interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
  } | null;
  signOutAction: () => Promise<void>;
}

const ROLE_LABEL: Record<UserRole, string> = {
  GUEST: "Гість",
  HOST: "Хост",
  ADMIN: "Адмін",
};

export function UserMenu({ user, signOutAction }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div ref={ref} className="relative ml-2">
      {/* Trigger pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-3 pr-[5px] py-[5px] border border-[var(--line)] rounded-full bg-[var(--surface)] text-[var(--ink-2)] text-[12px] transition-all hover:shadow-md hover:border-[var(--line-2)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MenuBurger />
        <span className="w-7 h-7 rounded-full bg-[var(--ink)] text-[var(--background)] flex items-center justify-center text-[12px] font-semibold overflow-hidden shrink-0">
          {user?.image
            ? <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
            : initials
          }
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+10px)] right-0 w-[296px] bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.14)] p-1.5 z-[200] anim-fade-in"
          style={{ transformOrigin: "top right" }}
        >
          <span className="absolute top-[-5px] right-5 w-2.5 h-2.5 bg-[var(--surface)] border-l border-t border-[var(--line)] rotate-45" />

          {user ? (
            <>
              {/* Head */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 border-b border-[var(--line)] mb-1.5">
                <span className="w-10 h-10 rounded-full bg-[var(--ink)] text-[var(--background)] flex items-center justify-center text-[16px] font-semibold overflow-hidden shrink-0">
                  {user.image
                    ? <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
                    : initials
                  }
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--ink)] text-[14px] truncate">{user.name}</p>
                  <p className="font-mono-sh text-[10.5px] text-[var(--sh-muted)] truncate">{user.email}</p>
                </div>
                {user.role && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-[var(--accent-soft)] text-[var(--sh-accent)] rounded-full font-mono-sh text-[9.5px] uppercase tracking-[0.06em] whitespace-nowrap">
                    <MedalIcon size={10} /> {ROLE_LABEL[user.role]}
                  </span>
                )}
              </div>

              {/* Section: Подорожі */}
              <div className="pb-1 mb-1 border-b border-[var(--line)]">
                <MenuItem href="/bookings" icon={<BedIcon />}>Мої подорожі</MenuItem>
                <MenuItem href="/saved" icon={<HeartIcon />}>Збережені</MenuItem>
                <MenuItem href="/bookings" icon={<CalIcon />}>Бронювання</MenuItem>
              </div>

              {/* Section: Хостинг */}
              {(user.role === "HOST" || user.role === "ADMIN") && (
                <div className="pb-1 mb-1 border-b border-[var(--line)]">
                  <p className="font-mono-sh text-[9.5px] uppercase tracking-[0.08em] text-[var(--sh-muted)] px-3 pt-2 pb-1">Хостинг</p>
                  <MenuItem href="/dashboard/listings" icon={<HomeIcon />}>Мої оголошення</MenuItem>
                  <MenuItem href="/dashboard/bookings" icon={<CalIcon />}>Бронювання гостей</MenuItem>
                  <MenuItem href="/dashboard/listings/new" icon={<PlusIcon />}>Нове оголошення</MenuItem>
                </div>
              )}

              {/* Section: Адмін */}
              {user.role === "ADMIN" && (
                <div className="pb-1 mb-1 border-b border-[var(--line)]">
                  <p className="font-mono-sh text-[9.5px] uppercase tracking-[0.08em] text-[var(--sh-muted)] px-3 pt-2 pb-1">Адміністрування</p>
                  <MenuItem href="/admin" icon={<SlidersIcon />}>Адмін-панель</MenuItem>
                </div>
              )}

              {/* Section: Налаштування */}
              <div className="pb-1 mb-1 border-b border-[var(--line)]">
                <MenuItem href="/profile" icon={<ShieldIcon />}>Мій профіль</MenuItem>
                <MenuItem href="/superhost" icon={<ArrowURIcon size={16} />}>Стати Superhost</MenuItem>
              </div>

              {/* Sign out */}
              <div className="pt-1 border-t border-[var(--line)]">
                <form action={async () => { await signOutAction(); window.location.href = "/"; }}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-[13px] text-[var(--sh-muted)] transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)] text-left"
                  >
                    <ExitIcon />
                    Вийти
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-[var(--ink)] no-underline transition-colors hover:bg-[var(--bg-alt)]">
                Увійти
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)]">
                Зареєструватись
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
    >
      <span className="text-[var(--sh-muted)] shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
    </Link>
  );
}

function MenuBurger() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
