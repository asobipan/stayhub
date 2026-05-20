import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { UserMenu } from "./user-menu";

async function SignOutAction() {
  "use server";
  await signOut({ redirect: false });
}

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] backdrop-header bg-[color-mix(in_oklab,var(--background)_86%,transparent)]">
      <div className="max-w-[1440px] mx-auto px-8 py-[14px] grid grid-cols-[1fr_auto_1fr] items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline text-[var(--ink)]">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--ink)] text-[var(--background)] shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z"
                fill="currentColor"
              />
              <circle cx="12" cy="10" r="2" fill="var(--background)" />
            </svg>
          </span>
          <span className="font-serif italic text-[22px] tracking-[-0.01em]">StayHub</span>
        </Link>

        {/* Center — pill nav (always show on desktop) */}
        <nav className="justify-self-center flex gap-1 bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] border border-[var(--line)] rounded-full p-1">
          <Link
            href="/listings"
            className="px-[18px] py-2 text-[13px] font-medium rounded-full text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
          >
            Помешкання
          </Link>
          <Link
            href="/dashboard/listings/new"
            className="px-[18px] py-2 text-[13px] font-medium rounded-full text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
          >
            Стати хостом
          </Link>
        </nav>

        {/* Right actions */}
        <div className="justify-self-end flex items-center gap-1">
          {/* Host shortcut */}
          <Link
            href="/dashboard/listings/new"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Розмістити
          </Link>

          {/* Saved */}
          <Link
            href="/bookings"
            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
            title="Мої бронювання"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" />
            </svg>
          </Link>

          {/* User pill + dropdown */}
          <UserMenu user={user} signOutAction={SignOutAction} />
        </div>

      </div>
    </header>
  );
}
