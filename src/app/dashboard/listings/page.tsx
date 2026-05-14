import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListingToggle } from "@/components/dashboard/ListingToggle";
import { ListingDelete } from "@/components/dashboard/ListingDelete";

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
      avgRating: true,
      reviewCount: true,
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
          >
            Мої оголошення
          </h1>
          <p className="text-sm" style={{ color: "#78716C" }}>
            {listings.length} {listings.length === 1 ? "оголошення" : listings.length < 5 ? "оголошення" : "оголошень"}
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#1E1B4B", color: "#fff" }}
        >
          <Plus className="w-4 h-4" />
          Нове оголошення
        </Link>
      </div>

      {listings.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "#E7E5E0" }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "#44403C" }}>
            У вас ще немає оголошень
          </p>
          <p className="text-sm mb-6" style={{ color: "#A8A29E" }}>
            Створіть перше оголошення, щоб почати приймати гостей
          </p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: "#1E1B4B", color: "#fff" }}
          >
            <Plus className="w-4 h-4" />
            Створити оголошення
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E7E5E0", background: "#fff" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #F0EDE6" }}>
                {["Назва", "Місто", "Ціна/ніч", "Рейтинг", "Бронювань", "Статус", ""].map((h) => (
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
              {listings.map((listing) => (
                <tr
                  key={listing.id}
                  style={{ borderBottom: "1px solid #F7F6F3" }}
                  className="hover:bg-[#FAFAF8] transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium" style={{ color: "#1C1917" }}>
                      {listing.title}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: "#78716C" }}>
                      {listing.city}, {listing.country}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold" style={{ color: "#1E1B4B" }}>
                      ${listing.price}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: "#78716C" }}>
                      {listing.reviewCount > 0
                        ? `★ ${listing.avgRating.toFixed(1)} (${listing.reviewCount})`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: "#78716C" }}>
                      {listing._count.bookings}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ListingToggle id={listing.id} isActive={listing.isActive} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="p-1.5 rounded-md transition-colors hover:bg-[#F5F4F0]"
                        title="Переглянути"
                        style={{ color: "#78716C" }}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/listings/${listing.id}/edit`}
                        className="p-1.5 rounded-md transition-colors hover:bg-[#F5F4F0]"
                        title="Редагувати"
                        style={{ color: "#78716C" }}
                      >
                        <Edit className="w-4 h-4" />
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
