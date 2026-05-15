import Link from "next/link";
import { Search } from "lucide-react";
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
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(0,0,0,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: "#1E1B4B" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#F59E0B">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span
              className="font-semibold text-lg tracking-wide"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#1E1B4B",
                letterSpacing: "0.03em",
              }}
            >
              StayHub
            </span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <button
              className="w-full flex items-center gap-2.5 px-4 py-2 rounded-md border transition-all duration-150 hover:border-indigo-800 hover:shadow-[0_0_0_3px_rgba(49,46,129,0.06)]"
              style={{
                borderColor: "#E7E5E0",
                background: "#fff",
              }}
            >
              <Search
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: "#312E81" }}
              />
              <span
                className="text-sm flex-1 text-left"
                style={{ color: "#A8A29E", fontFamily: "var(--font-sans)" }}
              >
                Місто, район, адреса...
              </span>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 shrink-0">
            {(!user || user.role === "HOST" || user.role === "ADMIN") && (
              <Link
                href="/dashboard/listings/new"
                className="hidden md:block text-sm font-medium px-4 py-2 rounded-md transition-colors duration-150 hover:bg-[#F5F4F0]"
                style={{ color: "#44403C" }}
              >
                Здати житло
              </Link>
            )}

            <UserMenu user={user} signOutAction={SignOutAction} />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <button
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-md border"
          style={{ borderColor: "#E7E5E0", background: "#fff" }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "#312E81" }} />
          <span className="text-sm" style={{ color: "#A8A29E" }}>
            Де шукаєте?
          </span>
        </button>
      </div>
    </header>
  );
}
