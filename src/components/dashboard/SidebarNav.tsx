"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, CalIcon, ShieldIcon, ArrowIcon } from "@/components/ui/icons";

const LINKS = [
  { href: "/dashboard/listings", label: "Оголошення", Icon: HomeIcon },
  { href: "/dashboard/bookings", label: "Бронювання",  Icon: CalIcon  },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Адмін панель", Icon: ShieldIcon },
];

export function SidebarNav({ role }: { role: string }) {
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
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--surface)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-7h6v7" />
          </svg>
        </div>
        <span
          className="text-[15px] tracking-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontStyle: "italic" }}
        >
          Dashboard
        </span>
      </div>

      {/* Section label */}
      <p
        className="px-3 mb-2 font-mono text-[9.5px] uppercase tracking-widest"
        style={{ color: "var(--sh-muted)" }}
      >
        Хостинг
      </p>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
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

        {role === "ADMIN" && (
          <>
            <div className="my-3 mx-3 border-t" style={{ borderColor: "var(--line)" }} />
            <p
              className="px-3 mb-2 font-mono text-[9.5px] uppercase tracking-widest"
              style={{ color: "var(--sh-muted)" }}
            >
              Адміністрування
            </p>
            {ADMIN_LINKS.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href);
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
          </>
        )}
      </nav>

      {/* Back to site */}
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--bg-alt)]"
        style={{ color: "var(--sh-muted)" }}
      >
        <ArrowIcon size={11} className="rotate-180" />
        На сайт
      </Link>
    </aside>
  );
}
