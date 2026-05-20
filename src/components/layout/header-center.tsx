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
      <span className="sh-search-pill-div" />
      <span>Будь-коли</span>
      <span className="sh-search-pill-div" />
      <span style={{ color: "var(--ink-2)" }}>2 гості</span>
      <span className="sh-search-pill-go">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
    </Link>
  );
}
