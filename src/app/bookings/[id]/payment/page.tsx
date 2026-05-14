import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PaymentClient } from "./PaymentClient";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id, guestId: session.user.id },
    include: {
      listing: {
        select: { title: true, city: true, country: true, images: true, price: true },
      },
    },
  });

  if (!booking) notFound();
  if (booking.status !== "PENDING") redirect("/bookings");

  const nights = Math.round(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <PaymentClient
      booking={{
        id: booking.id,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        nights,
        listing: booking.listing,
      }}
    />
  );
}
