import { db } from "@/lib/db";
import { BookingsClient } from "@/components/admin/BookingsClient";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      checkIn: true,
      checkOut: true,
      guests: true,
      totalPrice: true,
      status: true,
      listing: { select: { title: true, city: true } },
      guest: { select: { name: true, email: true } },
    },
  });

  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
        Адміністрування · бронювання
      </p>
      <h1 className="font-serif text-[28px] leading-tight mb-8" style={{ color: "var(--ink)" }}>
        Бронювання
        <span className="ml-3 font-serif text-lg" style={{ color: "var(--sh-muted)", fontStyle: "normal" }}>
          {bookings.length}
        </span>
      </h1>

      <BookingsClient initialBookings={bookings} />
    </div>
  );
}
