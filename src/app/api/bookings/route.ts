import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { listingId, checkIn, checkOut, guests } = body;

  if (!listingId || !checkIn || !checkOut || !guests) {
    return NextResponse.json({ error: "Відсутні обов'язкові поля" }, { status: 400 });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    return NextResponse.json({ error: "Дата виїзду має бути після дати заїзду" }, { status: 400 });
  }

  const listing = await db.listing.findUnique({
    where: { id: listingId, isActive: true },
    select: { id: true, price: true, maxGuests: true, hostId: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Оголошення не знайдено" }, { status: 404 });
  }

  if (listing.hostId === session.user.id) {
    return NextResponse.json({ error: "Не можна бронювати власне оголошення" }, { status: 400 });
  }

  if (guests > listing.maxGuests) {
    return NextResponse.json({ error: `Максимум ${listing.maxGuests} гостей` }, { status: 400 });
  }

  const conflict = await db.booking.findFirst({
    where: {
      listingId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: checkOutDate },
      checkOut: { gt: checkInDate },
    },
  });

  if (conflict) {
    return NextResponse.json({ error: "Ці дати вже заброньовані" }, { status: 409 });
  }

  const nights = Math.round(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const subtotal = nights * listing.price;
  const serviceFee = Math.round(subtotal * 0.12);
  const totalPrice = subtotal + serviceFee;

  const booking = await db.booking.create({
    data: {
      listingId,
      guestId: session.user.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: "PENDING",
    },
    select: { id: true, totalPrice: true, checkIn: true, checkOut: true, status: true },
  });

  return NextResponse.json(booking, { status: 201 });
}
