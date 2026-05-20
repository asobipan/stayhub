import { db } from "@/lib/db";
import { ListingsClient } from "@/components/admin/ListingsClient";

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
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
        Адміністрування · оголошення
      </p>
      <h1 className="font-serif text-[28px] leading-tight mb-8" style={{ color: "var(--ink)" }}>
        Оголошення
        <span className="ml-3 font-serif text-lg" style={{ color: "var(--sh-muted)", fontStyle: "normal" }}>
          {all.length}
        </span>
      </h1>

      <ListingsClient allListings={all} pendingListings={pending} />
    </div>
  );
}
