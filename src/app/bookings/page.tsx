import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookings = await db.booking.findMany({
    where: { guestId: session.user.id },
    include: {
      listing: {
        select: { id: true, title: true, city: true, country: true, images: true },
      },
      review: { select: { id: true } },
    },
    orderBy: { checkIn: "asc" },
  });

  const serialized = bookings.map((b) => ({
    id: b.id,
    checkIn:    b.checkIn.toISOString().slice(0, 10),
    checkOut:   b.checkOut.toISOString().slice(0, 10),
    guests:     b.guests,
    totalPrice: b.totalPrice,
    status:     b.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
    createdAt:  b.createdAt.toISOString(),
    listing:    b.listing,
    hasReview:  !!b.review,
  }));

  return (
    <div className="sh-bookings">
      <BookingsTabs bookings={serialized} />
    </div>
  );
}
