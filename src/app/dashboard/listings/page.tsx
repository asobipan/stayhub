import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListingDelete } from "@/components/dashboard/ListingDelete";
import { PlusIcon, ArrowURIcon, StarFillIcon } from "@/components/ui/icons";
import type { ListingStatus } from "@prisma/client";

const STATUS_CONFIG: Record<ListingStatus, { label: string; bg: string; color: string }> = {
  DRAFT:    { label: "Чернетка",    bg: "var(--bg-alt)",     color: "var(--ink-2)"  },
  PENDING:  { label: "На розгляді", bg: "oklch(0.95 0.06 80)", color: "oklch(0.5 0.12 60)" },
  ACTIVE:   { label: "Активне",     bg: "oklch(0.94 0.06 145)", color: "oklch(0.4 0.12 145)" },
  REJECTED: { label: "Відхилено",   bg: "oklch(0.95 0.05 20)", color: "oklch(0.5 0.15 20)" },
};

export default async function DashboardListingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const listings = await db.listing.findMany({
    where: { hostId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      price: true,
      isActive: true,
      status: true,
      rejectedReason: true,
      avgRating: true,
      reviewCount: true,
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
            Хостинг · оголошення
          </p>
          <h1
            className="font-serif text-[28px] leading-tight mb-1"
            style={{ color: "var(--ink)" }}
          >
            Мої оголошення
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-2)" }}>
            {listings.length} {listings.length === 1 ? "оголошення" : listings.length < 5 ? "оголошення" : "оголошень"}
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="sh-btn sh-btn-primary flex items-center gap-2"
        >
          <PlusIcon size={15} />
          Нове оголошення
        </Link>
      </div>

      {listings.length === 0 ? (
        <div
          className="text-center py-24 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--line)" }}
        >
          <p className="text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
            У вас ще немає оголошень
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--ink-2)" }}>
            Створіть перше, щоб почати приймати гостей
          </p>
          <Link href="/dashboard/listings/new" className="sh-btn sh-btn-primary inline-flex items-center gap-2">
            <PlusIcon size={15} />
            Створити оголошення
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Назва", "Місто", "Ціна/ніч", "Рейтинг", "Бронювань", "Статус", ""].map((h) => (
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
              {listings.map((listing, i) => (
                <tr
                  key={listing.id}
                  className="transition-colors hover:bg-[var(--bg-alt)]"
                  style={{ borderBottom: i < listings.length - 1 ? "1px solid var(--line)" : "none" }}
                >
                  <td className="px-5 py-4 max-w-[220px]">
                    <span className="text-sm font-medium line-clamp-1" style={{ color: "var(--ink)" }}>
                      {listing.title}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: "var(--ink-2)" }}>
                      {listing.city}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-serif text-[17px]" style={{ color: "var(--ink)" }}>
                      ${listing.price}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {listing.reviewCount > 0 ? (
                      <span className="flex items-center gap-1 text-sm" style={{ color: "var(--ink-2)" }}>
                        <StarFillIcon size={11} className="text-[var(--accent)]" />
                        {listing.avgRating.toFixed(1)}
                        <span className="font-mono text-[10px]" style={{ color: "var(--sh-muted)" }}>
                          ({listing.reviewCount})
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: "var(--sh-muted)" }}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                      {listing._count.bookings}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider w-fit"
                        style={{
                          background: STATUS_CONFIG[listing.status].bg,
                          color: STATUS_CONFIG[listing.status].color,
                        }}
                      >
                        {STATUS_CONFIG[listing.status].label}
                      </span>
                      {listing.status === "REJECTED" && listing.rejectedReason && (
                        <span className="text-[11px] max-w-[160px] line-clamp-2" style={{ color: "var(--sh-muted)" }}>
                          {listing.rejectedReason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-alt)]"
                        title="Переглянути"
                        style={{ color: "var(--ink-2)" }}
                      >
                        <ArrowURIcon size={13} />
                      </Link>
                      <Link
                        href={`/dashboard/listings/${listing.id}/edit`}
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-alt)] text-xs font-medium"
                        style={{ color: "var(--ink-2)" }}
                      >
                        Ред.
                      </Link>
                      <ListingDelete id={listing.id} />
                    </div>
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
