import { db } from "@/lib/db";
import { UserIcon, HomeIcon, CalIcon } from "@/components/ui/icons";

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
      value: userCount.toString(),
      Icon: UserIcon,
    },
    {
      label: "Активних оголошень",
      value: listingCount.toString(),
      Icon: HomeIcon,
    },
    {
      label: "Бронювань",
      value: bookingCount.toString(),
      Icon: CalIcon,
    },
    {
      label: "Виручка (USD)",
      value: `$${(revenue._sum.amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      Icon: null,
    },
  ];

  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
        Адміністрування · огляд
      </p>
      <h1 className="font-serif text-[28px] leading-tight mb-8" style={{ color: "var(--ink)" }}>
        Панель <em style={{ fontStyle: "italic", color: "var(--accent)" }}>керування</em>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--ink)" }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
                {label}
              </p>
              {Icon && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Icon size={14} className="opacity-60 text-[var(--accent-soft)]" />
                </div>
              )}
            </div>
            <p className="font-serif leading-none" style={{ fontSize: 40, color: "#fff" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--sh-muted)" }}>
          Швидкий доступ
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/admin/users",    label: "Управління користувачами" },
            { href: "/admin/listings", label: "Модерація оголошень" },
            { href: "/admin/bookings", label: "Всі бронювання" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-center transition-colors hover:bg-[var(--bg-alt)]"
              style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
