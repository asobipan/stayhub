"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Home, CalendarDays, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard/listings", label: "Оголошення", icon: Home },
  { href: "/dashboard/bookings", label: "Бронювання", icon: CalendarDays },
];

const adminLinks = [
  { href: "/admin", label: "Адмін панель", icon: ShieldCheck },
];

export function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 border-r min-h-screen py-8 px-4"
      style={{ background: "#fff", borderColor: "#EEECE6" }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <div
          className="w-6 h-6 rounded-sm flex items-center justify-center"
          style={{ background: "#1E1B4B" }}
        >
          <LayoutGrid className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
        </div>
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B", letterSpacing: "0.03em" }}
        >
          Dashboard
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "#1E1B4B" : "transparent",
                color: active ? "#fff" : "#44403C",
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {role === "ADMIN" && (
          <>
            <div className="my-3 border-t" style={{ borderColor: "#EEECE6" }} />
            {adminLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    background: active ? "#1E1B4B" : "transparent",
                    color: active ? "#fff" : "#44403C",
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
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
        className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors hover:bg-[#F5F4F0]"
        style={{ color: "#A8A29E" }}
      >
        ← На сайт
      </Link>
    </aside>
  );
}
