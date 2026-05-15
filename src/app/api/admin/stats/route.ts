import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, listings, bookings, revenue] = await Promise.all([
    db.user.count(),
    db.listing.count({ where: { isActive: true } }),
    db.booking.count(),
    db.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    users,
    listings,
    bookings,
    revenue: revenue._sum.amount ?? 0,
  });
}
