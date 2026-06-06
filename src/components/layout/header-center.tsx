"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderCenter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <nav className="justify-self-center flex gap-1 bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] border border-[var(--line)] rounded-full p-1">
        <Link
          href="/listings"
          className="sh-nav-pill active"
        >
          Помешкання
        </Link>
        <Link
          href="/host-landing"
          className="sh-nav-pill"
        >
          Стати хостом
        </Link>
      </nav>
    );
  }

  return (
    <Link href="/listings" className="sh-search-pill justify-self-center">
      <span>Будь-куди</span>
      <span className="w-px h-5 bg-[var(--line)] shrink-0" />
      <span>Будь-коли</span>
      <span className="w-px h-5 bg-[var(--line)] shrink-0" />
      <span style={{ color: "var(--ink-2)" }}>2 гості</span>
      <span className="flex items-center justify-center w-10 h-10 min-w-[40px] bg-[var(--accent)] text-[var(--accent-ink)] rounded-full shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
    </Link>
  );
}
