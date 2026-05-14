import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { BookingActions } from "@/components/dashboard/BookingActions";

export default async function DashboardBookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookings = await db.booking.findMany({
    where: { listing: { hostId: session.user.id } },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true } },
      guest: { select: { name: true, email: true } },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
        >
          Бронювання
        </h1>
        <p className="text-sm" style={{ color: "#78716C" }}>
          Запити на бронювання ваших оголошень
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "#E7E5E0" }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "#44403C" }}>
            Бронювань поки немає
          </p>
          <p className="text-sm" style={{ color: "#A8A29E" }}>
            Вони з'являться тут, коли гості забронюють ваші оголошення
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E7E5E0", background: "#fff" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EDE6" }}>
                {["Оголошення", "Гість", "Дати", "Сума", "Статус", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#A8A29E", letterSpacing: "0.08em" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const checkIn = new Date(booking.checkIn).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
                const checkOut = new Date(booking.checkOut).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });

                return (
                  <tr
                    key={booking.id}
                    style={{ borderBottom: "1px solid #F7F6F3" }}
                    className="hover:bg-[#FAFAF8] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium line-clamp-1" style={{ color: "#1C1917", maxWidth: 200 }}>
                        {booking.listing.title}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium" style={{ color: "#1C1917" }}>{booking.guest.name}</p>
                      <p className="text-xs" style={{ color: "#A8A29E" }}>{booking.guest.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm" style={{ color: "#78716C" }}>
                        {checkIn} — {checkOut}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold" style={{ color: "#1E1B4B" }}>
                        ${booking.totalPrice}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-5 py-4">
                      {booking.status === "PENDING" && (
                        <BookingActions bookingId={booking.id} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
