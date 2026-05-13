import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn || (role !== "HOST" && role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/bookings")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/bookings/:path*", "/admin/:path*"],
};
