import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { UserMenu } from "./user-menu";
import { HeaderCenter } from "./header-center";
import { PlusIcon, GlobeIcon, HeartIcon } from "@/components/ui/icons";

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
              <path d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z" fill="currentColor" />
              <circle cx="12" cy="10" r="2" fill="var(--background)" />
            </svg>
          </span>
          <span className="font-serif italic text-[22px] tracking-[-0.01em]">StayHub</span>
        </Link>

        {/* Center — nav pills on home, search pill elsewhere */}
        <HeaderCenter />

        {/* Right actions */}
        <div className="justify-self-end flex items-center gap-1">
          <Link
            href="/host-landing"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
          >
            <PlusIcon size={14} />
            Стати хостом
          </Link>

          <button
            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
            title="Мова та валюта"
            aria-label="Мова та валюта"
          >
            <GlobeIcon size={16} />
          </button>

          <Link
            href="/bookings"
            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-2)] no-underline transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]"
            title="Збережені"
          >
            <HeartIcon size={16} />
          </Link>

          <UserMenu user={user} signOutAction={SignOutAction} />
        </div>

      </div>
    </header>
  );
}
