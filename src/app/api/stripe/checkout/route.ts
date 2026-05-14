import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await req.json();
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId, guestId: session.user.id },
    include: {
      listing: { select: { title: true, images: true } },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "PENDING") {
    return NextResponse.json({ error: "Booking is not pending" }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/bookings/${bookingId}/payment?cancelled=true`,
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `StayHub: ${booking.listing.title}`,
            images: booking.listing.images.slice(0, 1),
          },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
      userId: session.user.id,
    },
  });

  await db.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalPrice,
      currency: "usd",
      status: "PENDING",
      stripeSessionId: checkoutSession.id,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
