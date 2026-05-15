import { db } from "@/lib/db";
import { Users, Home, CalendarDays, DollarSign } from "lucide-react";

export default async function AdminPage() {
  const [userCount, listingCount, bookingCount, revenue] = await Promise.all([
    db.user.count(),
    db.listing.count({ where: { isActive: true } }),
    db.booking.count(),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  const stats = [
    {
      label: "Користувачів",
      value: userCount,
      icon: Users,
      format: (v: number) => v.toString(),
    },
    {
      label: "Активних оголошень",
      value: listingCount,
      icon: Home,
      format: (v: number) => v.toString(),
    },
    {
      label: "Бронювань",
      value: bookingCount,
      icon: CalendarDays,
      format: (v: number) => v.toString(),
    },
    {
      label: "Виручка (USD)",
      value: revenue._sum.amount ?? 0,
      icon: DollarSign,
      format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
    },
  ];

  return (
    <div className="anim-fade-up">
      <p className="section-eyebrow mb-2">Адміністрування</p>
      <h1
        className="text-3xl font-semibold mb-10"
        style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
      >
        Огляд платформи
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, format }, i) => (
          <div
            key={label}
            className="rounded-2xl p-6 anim-fade-up"
            style={{
              background: "#1E1B4B",
              boxShadow: "0 8px 32px rgba(30,27,75,0.18)",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                {label}
              </p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.15)" }}
              >
                <Icon className="w-4 h-4" style={{ color: "#F59E0B" }} />
              </div>
            </div>
            <p
              className="text-4xl font-semibold"
              style={{ fontFamily: "var(--font-heading)", color: "#fff" }}
            >
              {format(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
