import Link from "next/link";
import { db } from "@/lib/db";
import { StarFillIcon } from "@/components/ui/icons";

export default async function AdminListingsPage() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      price: true,
      isActive: true,
      avgRating: true,
      reviewCount: true,
      host: { select: { name: true, email: true } },
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
        Адміністрування · оголошення
      </p>
      <h1 className="font-serif text-[28px] leading-tight mb-8" style={{ color: "var(--ink)" }}>
        Оголошення
        <span className="ml-3 font-serif text-lg" style={{ color: "var(--sh-muted)", fontStyle: "normal" }}>
          {listings.length}
        </span>
      </h1>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              {["Назва", "Хост", "Місто", "Ціна/ніч", "Бронювань", "Рейтинг", "Статус"].map((h) => (
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
            {listings.map((l, i) => (
              <tr
                key={l.id}
                className="transition-colors hover:bg-[var(--bg-alt)]"
                style={{ borderBottom: i < listings.length - 1 ? "1px solid var(--line)" : "none" }}
              >
                <td className="px-5 py-4 max-w-[200px]">
                  <Link
                    href={`/listings/${l.id}`}
                    className="text-sm font-medium line-clamp-1 transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--ink)" }}
                  >
                    {l.title}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm" style={{ color: "var(--ink-2)" }}>{l.host.name}</p>
                  <p className="font-mono text-[10.5px]" style={{ color: "var(--sh-muted)" }}>{l.host.email}</p>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--ink-2)" }}>
                  {l.city}
                </td>
                <td className="px-5 py-4">
                  <span className="font-serif text-[17px]" style={{ color: "var(--ink)" }}>
                    ${l.price}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                  {l._count.bookings}
                </td>
                <td className="px-5 py-4">
                  {l.reviewCount > 0 ? (
                    <span className="flex items-center gap-1 text-sm" style={{ color: "var(--ink-2)" }}>
                      <StarFillIcon size={11} className="text-[var(--accent)]" />
                      {l.avgRating.toFixed(1)}
                      <span className="font-mono text-[10px]" style={{ color: "var(--sh-muted)" }}>
                        ({l.reviewCount})
                      </span>
                    </span>
                  ) : (
                    <span style={{ color: "var(--sh-muted)" }}>—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium"
                    style={
                      l.isActive
                        ? { background: "oklch(0.92 0.05 145)", color: "oklch(0.35 0.10 150)" }
                        : { background: "var(--bg-alt)", color: "var(--sh-muted)" }
                    }
                  >
                    {l.isActive ? "Активне" : "Приховане"}
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
