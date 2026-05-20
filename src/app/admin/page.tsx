import { db } from "@/lib/db";
import { UserIcon, HomeIcon, CalIcon } from "@/components/ui/icons";

function calcDelta(current: number, prev: number): { pct: number; up: boolean } | null {
  if (prev === 0) return current > 0 ? { pct: 100, up: true } : null;
  const pct = Math.round(((current - prev) / prev) * 100);
  return { pct: Math.abs(pct), up: pct >= 0 };
}

export default async function AdminPage() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    userCount,
    listingCount,
    bookingCount,
    revenue,
    usersThisWeek,
    usersPrevWeek,
    bookingsThisWeek,
    bookingsPrevWeek,
    revenueThisWeek,
    revenuePrevWeek,
    listingsThisWeek,
    listingsPrevWeek,
  ] = await Promise.all([
    db.user.count(),
    db.listing.count({ where: { isActive: true } }),
    db.booking.count(),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    db.user.count({ where: { createdAt: { gte: weekAgo } } }),
    db.user.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
    db.booking.count({ where: { createdAt: { gte: weekAgo } } }),
    db.booking.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
    db.payment.aggregate({ where: { status: "PAID", createdAt: { gte: weekAgo } }, _sum: { amount: true } }),
    db.payment.aggregate({ where: { status: "PAID", createdAt: { gte: twoWeeksAgo, lt: weekAgo } }, _sum: { amount: true } }),
    db.listing.count({ where: { isActive: true, createdAt: { gte: weekAgo } } }),
    db.listing.count({ where: { isActive: true, createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
  ]);

  const stats = [
    {
      label: "Користувачів",
      value: userCount.toLocaleString("uk-UA"),
      subtext: `+${usersThisWeek} цього тижня`,
      delta: calcDelta(usersThisWeek, usersPrevWeek),
      Icon: UserIcon,
    },
    {
      label: "Активних оголошень",
      value: listingCount.toLocaleString("uk-UA"),
      subtext: `+${listingsThisWeek} цього тижня`,
      delta: calcDelta(listingsThisWeek, listingsPrevWeek),
      Icon: HomeIcon,
    },
    {
      label: "Бронювань",
      value: bookingCount.toLocaleString("uk-UA"),
      subtext: `+${bookingsThisWeek} цього тижня`,
      delta: calcDelta(bookingsThisWeek, bookingsPrevWeek),
      Icon: CalIcon,
    },
    {
      label: "Виручка (USD)",
      value: `$${(revenue._sum.amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      subtext: `$${((revenueThisWeek._sum.amount ?? 0)).toLocaleString("en-US", { minimumFractionDigits: 0 })} цього тижня`,
      delta: calcDelta(
        Math.round(revenueThisWeek._sum.amount ?? 0),
        Math.round(revenuePrevWeek._sum.amount ?? 0)
      ),
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
        {stats.map(({ label, value, subtext, delta, Icon }) => (
          <div
            key={label}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "var(--ink)" }}
          >
            {/* Top row: label + icon */}
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

            {/* Value */}
            <p className="font-serif leading-none" style={{ fontSize: 40, color: "#fff" }}>
              {value}
            </p>

            {/* Bottom row: subtext + delta badge */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {subtext}
              </p>
              {delta !== null && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-medium shrink-0"
                  style={{
                    background: delta.up
                      ? "oklch(0.35 0.10 145 / 0.35)"
                      : "oklch(0.45 0.12 20 / 0.35)",
                    color: delta.up
                      ? "oklch(0.80 0.12 145)"
                      : "oklch(0.80 0.12 20)",
                  }}
                >
                  {delta.up ? "↑" : "↓"}{delta.pct}%
                </span>
              )}
            </div>
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
