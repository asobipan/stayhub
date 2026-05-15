import { db } from "@/lib/db";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";

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
      createdAt: true,
      listing: { select: { title: true, city: true } },
      guest: { select: { name: true, email: true } },
    },
  });

  const fmt = (d: Date) =>
    d.toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="anim-fade-up">
      <p className="section-eyebrow mb-2">Адміністрування</p>
      <h1
        className="text-3xl font-semibold mb-10"
        style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
      >
        Бронювання
        <span className="ml-3 text-lg font-normal" style={{ color: "#A8A29E" }}>
          {bookings.length}
        </span>
      </h1>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "#E7E5E0", background: "#fff", boxShadow: "0 2px 16px rgba(30,27,75,0.06)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #F0EDE6", background: "#FAFAF8" }}>
              {["Оголошення", "Гість", "Дати", "Гостей", "Сума", "Статус"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "#78716C" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr
                key={b.id}
                style={{ borderBottom: i < bookings.length - 1 ? "1px solid #F0EDE6" : "none" }}
                className="hover:bg-[#FAFAF8] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-medium" style={{ color: "#1C1917" }}>{b.listing.title}</p>
                  <p className="text-xs" style={{ color: "#A8A29E" }}>{b.listing.city}</p>
                </td>
                <td className="px-5 py-4" style={{ color: "#44403C" }}>
                  <p>{b.guest.name}</p>
                  <p className="text-xs" style={{ color: "#A8A29E" }}>{b.guest.email}</p>
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: "#78716C" }}>
                  {fmt(b.checkIn)} — {fmt(b.checkOut)}
                </td>
                <td className="px-5 py-4" style={{ color: "#44403C" }}>
                  {b.guests}
                </td>
                <td className="px-5 py-4 font-medium" style={{ color: "#1C1917" }}>
                  ${b.totalPrice}
                </td>
                <td className="px-5 py-4">
                  <BookingStatusBadge
                    status={b.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
