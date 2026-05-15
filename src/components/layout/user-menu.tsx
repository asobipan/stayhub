"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@prisma/client";

interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
  } | null;
  signOutAction: () => Promise<void>;
}

export function UserMenu({ user, signOutAction }: UserMenuProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border outline-none transition-all duration-150"
        style={{ borderColor: "#E7E5E0", background: "#fff" }}
      >
        <Menu className="w-3.5 h-3.5" style={{ color: "#44403C" }} />
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
          <AvatarFallback
            className="text-xs font-medium"
            style={{ background: "#1E1B4B", color: "#fff" }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 mt-1.5 p-1 shadow-lg border rounded-md"
        style={{ borderColor: "#E7E5E0", background: "#fff" }}
      >
        {user ? (
          <>
            <div
              className="px-3 py-2 mb-1 rounded-sm"
              style={{ background: "#F5F4F0" }}
            >
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "#1C1917", fontFamily: "var(--font-heading)" }}
              >
                {user.name}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: "#78716C" }}>
                {user.email}
              </p>
            </div>
            <DropdownMenuItem render={<Link href="/bookings" />}>
              Мої бронювання
            </DropdownMenuItem>
            {(user.role === "HOST" || user.role === "ADMIN") && (
              <DropdownMenuItem render={<Link href="/dashboard/listings" />}>
                Мої оголошення
              </DropdownMenuItem>
            )}
            {user.role === "ADMIN" && (
              <DropdownMenuItem render={<Link href="/admin" />}>
                Адмін панель
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator style={{ background: "#F0EFE9" }} />
            <DropdownMenuItem
              render={
                <form
                  action={async () => {
                    await signOutAction();
                    window.location.href = "/";
                  }}
                >
                  <button type="submit" className="w-full text-left" style={{ color: "#DC2626" }}>
                    Вийти
                  </button>
                </form>
              }
            />
          </>
        ) : (
          <>
            <DropdownMenuItem
              render={<Link href="/login" />}
              className="font-medium"
            >
              Увійти
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/login" />}>
              Зареєструватись
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
