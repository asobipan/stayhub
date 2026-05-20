import { db } from "@/lib/db";

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

  const fmt = (d: Date) =>
    d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

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

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              {["Оголошення", "Гість", "Дати", "Гостей", "Сума", "Статус"].map((h) => (
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
                  <p className="text-sm font-medium line-clamp-1" style={{ color: "var(--ink)" }}>
                    {b.listing.title}
                  </p>
                  <p className="font-mono text-[10.5px]" style={{ color: "var(--sh-muted)" }}>
                    {b.listing.city}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm" style={{ color: "var(--ink-2)" }}>{b.guest.name}</p>
                  <p className="font-mono text-[10.5px]" style={{ color: "var(--sh-muted)" }}>{b.guest.email}</p>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--ink-2)" }}>
                  {fmt(b.checkIn)} — {fmt(b.checkOut)}
                </td>
                <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                  {b.guests}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
