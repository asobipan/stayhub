import Link from "next/link";
import { db } from "@/lib/db";
import { StarFillIcon } from "@/components/ui/icons";
import { ModerationQueue } from "@/components/admin/ModerationQueue";
import type { ListingStatus } from "@prisma/client";

const STATUS_CONFIG: Record<ListingStatus, { label: string; bg: string; color: string }> = {
  DRAFT:    { label: "Чернетка",    bg: "var(--bg-alt)",          color: "var(--ink-2)"             },
  PENDING:  { label: "На розгляді", bg: "oklch(0.95 0.06 80)",    color: "oklch(0.5 0.12 60)"       },
  ACTIVE:   { label: "Активне",     bg: "oklch(0.94 0.06 145)",   color: "oklch(0.4 0.12 145)"      },
  REJECTED: { label: "Відхилено",   bg: "oklch(0.95 0.05 20)",    color: "oklch(0.5 0.15 20)"       },
};

export default async function AdminListingsPage() {
  const [pending, all] = await Promise.all([
    db.listing.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true, title: true, city: true, country: true,
        price: true, bedrooms: true, maxGuests: true, createdAt: true,
        host: { select: { name: true, email: true } },
      },
    }),
    db.listing.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, city: true, price: true,
        isActive: true, status: true, avgRating: true, reviewCount: true,
        host: { select: { name: true, email: true } },
        _count: { select: { bookings: true } },
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
          Адміністрування · оголошення
        </p>
        <h1 className="font-serif text-[28px] leading-tight" style={{ color: "var(--ink)" }}>
          Оголошення
        </h1>
      </div>

      {/* Черга модерації */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-[20px]" style={{ color: "var(--ink)" }}>Черга модерації</h2>
          {pending.length > 0 && (
            <span
              className="px-2.5 py-0.5 rounded-full font-mono text-[11px]"
              style={{ background: "oklch(0.95 0.06 80)", color: "oklch(0.5 0.12 60)" }}
            >
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div
            className="py-10 text-center rounded-2xl border-2 border-dashed"
            style={{ borderColor: "var(--line)" }}
          >
            <p className="text-sm" style={{ color: "var(--sh-muted)" }}>Нових оголошень для перевірки немає</p>
          </div>
        ) : (
          <ModerationQueue listings={pending} />
        )}
      </section>

      {/* Всі оголошення */}
      <section>
        <h2 className="font-serif text-[20px] mb-4" style={{ color: "var(--ink)" }}>
          Всі оголошення
          <span className="ml-2 font-serif text-base" style={{ color: "var(--sh-muted)", fontStyle: "normal" }}>
            {all.length}
          </span>
        </h2>

        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Назва", "Хост", "Місто", "Ціна/ніч", "Бронювань", "Рейтинг", "Статус"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map((l, i) => (
                <tr
                  key={l.id}
                  className="transition-colors hover:bg-[var(--bg-alt)]"
                  style={{ borderBottom: i < all.length - 1 ? "1px solid var(--line)" : "none" }}
                >
                  <td className="px-5 py-4 max-w-[200px]">
                    <Link href={`/listings/${l.id}`} className="text-sm font-medium line-clamp-1 transition-colors hover:text-[var(--accent)]" style={{ color: "var(--ink)" }}>
                      {l.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ color: "var(--ink-2)" }}>{l.host.name}</p>
                    <p className="font-mono text-[10.5px]" style={{ color: "var(--sh-muted)" }}>{l.host.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--ink-2)" }}>{l.city}</td>
                  <td className="px-5 py-4">
                    <span className="font-serif text-[17px]" style={{ color: "var(--ink)" }}>${l.price}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>{l._count.bookings}</td>
                  <td className="px-5 py-4">
                    {l.reviewCount > 0 ? (
                      <span className="flex items-center gap-1 text-sm" style={{ color: "var(--ink-2)" }}>
                        <StarFillIcon size={11} className="text-[var(--accent)]" />
                        {l.avgRating.toFixed(1)}
                        <span className="font-mono text-[10px]" style={{ color: "var(--sh-muted)" }}>({l.reviewCount})</span>
                      </span>
                    ) : (
                      <span style={{ color: "var(--sh-muted)" }}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider"
                      style={{ background: STATUS_CONFIG[l.status].bg, color: STATUS_CONFIG[l.status].color }}
                    >
                      {STATUS_CONFIG[l.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
