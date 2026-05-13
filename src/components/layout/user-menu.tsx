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
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:shadow-md transition-shadow bg-white outline-none">
        <Menu className="w-4 h-4 text-foreground/80" />
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
          <AvatarFallback className="text-xs bg-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1">
        {user ? (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onSelect={() => signOutAction()}
            >
              Вийти
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem render={<Link href="/login" />} className="font-medium">
              Увійти
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/login" />}>
              Зареєструватися
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/listings/new" />}>
              Здати житло
            </DropdownMenuItem>
            <DropdownMenuItem>Допомога</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
