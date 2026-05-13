import Link from "next/link";
import { Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { UserMenu } from "./user-menu";

async function SignOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <svg
              viewBox="0 0 32 32"
              className="w-8 h-8 fill-primary transition-transform group-hover:scale-110"
              aria-hidden
            >
              <path d="M16 1C10.925 1 6 5.59 6 11.5c0 3.83 2.05 7.01 4.44 9.77C12.83 24.04 16 27.5 16 27.5s3.17-3.46 5.56-6.23C23.95 18.51 26 15.33 26 11.5 26 5.59 21.075 1 16 1zm0 14a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
            </svg>
            <span
              className="text-primary font-bold text-xl tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              stayhub
            </span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full border border-border shadow-sm hover:shadow-md transition-shadow bg-white group">
              <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                Де?
              </span>
              <span className="w-px h-4 bg-border" />
              <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                Коли?
              </span>
              <span className="w-px h-4 bg-border" />
              <span className="text-sm text-muted-foreground flex-1 text-left">
                Гостей
              </span>
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Search className="w-3.5 h-3.5 text-white" />
              </span>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {(!user || user.role === "HOST" || user.role === "ADMIN") && (
              <Link
                href="/dashboard/listings/new"
                className="hidden md:block text-sm font-medium px-4 py-2 rounded-full hover:bg-muted transition-colors"
              >
                Здати житло
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hidden md:flex"
              aria-label="Мова"
            >
              <Globe className="w-4 h-4" />
            </Button>

            <UserMenu user={user} signOutAction={SignOutAction} />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-full border border-border shadow-sm bg-white">
          <Search className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm text-muted-foreground">
            Пошук оголошень...
          </span>
        </button>
      </div>
    </header>
  );
}
