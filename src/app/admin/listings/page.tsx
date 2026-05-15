import Link from "next/link";
import { db } from "@/lib/db";

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
      createdAt: true,
      host: { select: { name: true, email: true } },
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div className="anim-fade-up">
      <p className="section-eyebrow mb-2">Адміністрування</p>
      <h1
        className="text-3xl font-semibold mb-10"
        style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
      >
        Оголошення
        <span className="ml-3 text-lg font-normal" style={{ color: "#A8A29E" }}>
          {listings.length}
        </span>
      </h1>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "#E7E5E0", background: "#fff", boxShadow: "0 2px 16px rgba(30,27,75,0.06)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #F0EDE6", background: "#FAFAF8" }}>
              {["Назва", "Хост", "Місто", "Ціна/ніч", "Бронювань", "Рейтинг", "Статус"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "#78716C" }}
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
                style={{ borderBottom: i < listings.length - 1 ? "1px solid #F0EDE6" : "none" }}
                className="hover:bg-[#FAFAF8] transition-colors"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/listings/${l.id}`}
                    className="font-medium hover:underline"
                    style={{ color: "#1E1B4B" }}
                  >
                    {l.title}
                  </Link>
                </td>
                <td className="px-5 py-4" style={{ color: "#44403C" }}>
                  <p>{l.host.name}</p>
                  <p className="text-xs" style={{ color: "#A8A29E" }}>{l.host.email}</p>
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: "#78716C" }}>
                  {l.city}, {l.country}
                </td>
                <td className="px-5 py-4 font-medium" style={{ color: "#1C1917" }}>
                  ${l.price}
                </td>
                <td className="px-5 py-4" style={{ color: "#44403C" }}>
                  {l._count.bookings}
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: "#44403C" }}>
                  {l.reviewCount > 0 ? `★ ${l.avgRating.toFixed(1)} (${l.reviewCount})` : "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={
                      l.isActive
                        ? { background: "rgba(16,185,129,0.1)", color: "#059669" }
                        : { background: "rgba(168,162,158,0.12)", color: "#78716C" }
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
