"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldIcon, UserIcon, HomeIcon, CalIcon, ArrowIcon } from "@/components/ui/icons";

const LINKS = [
  { href: "/admin",          label: "Огляд",        Icon: ShieldIcon, exact: true },
  { href: "/admin/users",    label: "Користувачі",  Icon: UserIcon },
  { href: "/admin/listings", label: "Оголошення",   Icon: HomeIcon },
  { href: "/admin/bookings", label: "Бронювання",   Icon: CalIcon },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 min-h-screen py-8 px-3"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--line)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10 px-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--ink)" }}
        >
          <ShieldIcon size={13} className="text-[var(--accent-soft)]" />
        </div>
        <span
          className="text-[15px] tracking-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontStyle: "italic" }}
        >
          Admin
        </span>
      </div>

      <p className="px-3 mb-2 font-mono text-[9.5px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
        Панель
      </p>

      <nav className="flex flex-col gap-0.5 flex-1">
        {LINKS.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors"
              style={{
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--bg)" : "var(--ink-2)",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-0.5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--bg-alt)]"
          style={{ color: "var(--sh-muted)" }}
        >
          <ArrowIcon size={11} className="rotate-180" /> Dashboard
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--bg-alt)]"
          style={{ color: "var(--sh-muted)" }}
        >
          <ArrowIcon size={11} className="rotate-180" /> На сайт
        </Link>
      </div>
    </aside>
  );
}
