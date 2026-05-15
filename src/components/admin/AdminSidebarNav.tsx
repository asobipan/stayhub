"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Home, CalendarDays, ShieldCheck } from "lucide-react";

const links = [
  { href: "/admin", label: "Огляд", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Користувачі", icon: Users },
  { href: "/admin/listings", label: "Оголошення", icon: Home },
  { href: "/admin/bookings", label: "Бронювання", icon: CalendarDays },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 border-r min-h-screen py-8 px-4"
      style={{ background: "#fff", borderColor: "#EEECE6" }}
    >
      <div className="flex items-center gap-2 mb-10 px-2">
        <div
          className="w-6 h-6 rounded-sm flex items-center justify-center"
          style={{ background: "#1E1B4B" }}
        >
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
        </div>
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B", letterSpacing: "0.03em" }}
        >
          Admin
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
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
      </nav>

      <div className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors hover:bg-[#F5F4F0]"
          style={{ color: "#A8A29E" }}
        >
          ← Dashboard
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors hover:bg-[#F5F4F0]"
          style={{ color: "#A8A29E" }}
        >
          ← На сайт
        </Link>
      </div>
    </aside>
  );
}
