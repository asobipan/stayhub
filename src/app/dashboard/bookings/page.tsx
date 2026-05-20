import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingActions } from "@/components/dashboard/BookingActions";

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-[oklch(0.94_0.07_75)] text-[oklch(0.42_0.13_60)]",
  CONFIRMED: "bg-[oklch(0.92_0.05_145)] text-[oklch(0.35_0.10_150)]",
  COMPLETED: "bg-[var(--bg-alt)] text-[var(--ink-2)]",
  CANCELLED: "bg-[oklch(0.93_0.01_30)] text-[oklch(0.50_0.04_30)]",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:   "Очікує",
  CONFIRMED: "Підтверджено",
  COMPLETED: "Завершено",
  CANCELLED: "Скасовано",
};

export default async function DashboardBookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookings = await db.booking.findMany({
    where: { listing: { hostId: session.user.id } },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true } },
      guest:   { select: { name: true, email: true } },
    },
  });

  const fmt = (d: Date) =>
    d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
          Хостинг · бронювання
        </p>
        <h1 className="font-serif text-[28px] leading-tight mb-1" style={{ color: "var(--ink)" }}>
          Бронювання
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-2)" }}>
          Запити на бронювання ваших оголошень
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          className="text-center py-24 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--line)" }}
        >
          <p className="text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
            Бронювань поки немає
          </p>
          <p className="text-sm" style={{ color: "var(--ink-2)" }}>
            Вони з&apos;являться тут, коли гості забронюють ваші оголошення
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Оголошення", "Гість", "Дати", "Сума", "Статус", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--sh-muted)" }}
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
                  className="transition-colors hover:bg-[var(--bg-alt)]"
                  style={{ borderBottom: i < bookings.length - 1 ? "1px solid var(--line)" : "none" }}
                >
                  <td className="px-5 py-4 max-w-[200px]">
                    <span className="text-sm font-medium line-clamp-1" style={{ color: "var(--ink)" }}>
                      {b.listing.title}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{b.guest.name}</p>
                    <p className="font-mono text-[10.5px]" style={{ color: "var(--sh-muted)" }}>{b.guest.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: "var(--ink-2)" }}>
                      {fmt(b.checkIn)} — {fmt(b.checkOut)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-serif text-[17px]" style={{ color: "var(--ink)" }}>
                      ${b.totalPrice}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium ${STATUS_STYLES[b.status] ?? ""}`}
                    >
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {b.status === "PENDING" && <BookingActions bookingId={b.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
