import { Suspense } from "react";
import { db } from "@/lib/db";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ListingGridSkeleton } from "@/components/listings/ListingCardSkeleton";
import { SearchFilters } from "@/components/listings/SearchFilters";
import { PaginationControls } from "@/components/listings/PaginationControls";

interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

async function ListingsResult({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const checkInDate = searchParams.checkIn ? new Date(searchParams.checkIn) : undefined;
  const checkOutDate = searchParams.checkOut ? new Date(searchParams.checkOut) : undefined;

  let excludedListingIds: string[] = [];
  if (checkInDate && checkOutDate) {
    const conflicting = await db.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
      select: { listingId: true },
    });
    excludedListingIds = conflicting.map((b) => b.listingId);
  }

  const where = {
    isActive: true,
    ...(searchParams.city && {
      city: { contains: searchParams.city, mode: "insensitive" as const },
    }),
    ...(searchParams.guests && { maxGuests: { gte: parseInt(searchParams.guests) } }),
    ...(searchParams.minPrice && { price: { gte: parseFloat(searchParams.minPrice) } }),
    ...(searchParams.maxPrice && { price: { lte: parseFloat(searchParams.maxPrice) } }),
    ...(excludedListingIds.length > 0 && { id: { notIn: excludedListingIds } }),
  };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: [{ avgRating: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        price: true,
        images: true,
        bedrooms: true,
        bathrooms: true,
        maxGuests: true,
        avgRating: true,
        reviewCount: true,
      },
    }),
    db.listing.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <>
      <div className="mb-4 text-sm" style={{ color: "#78716C" }}>
        {total > 0 ? (
          <>
            <span className="font-semibold" style={{ color: "#1C1917" }}>
              {total}
            </span>{" "}
            {total === 1 ? "оголошення" : total < 5 ? "оголошення" : "оголошень"}
            {searchParams.city && (
              <span> в «{searchParams.city}»</span>
            )}
          </>
        ) : null}
      </div>

      <ListingGrid listings={listings} />

      {pages > 1 && (
        <div className="mt-10">
          <PaginationControls page={page} pages={pages} />
        </div>
      )}
    </>
  );
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1
          className="text-3xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
        >
          Оголошення
        </h1>
        <p className="text-sm" style={{ color: "#78716C" }}>
          Знаходьте унікальні місця для проживання по всьому світу
        </p>
      </div>

      <SearchFilters />

      <Suspense fallback={<ListingGridSkeleton />}>
        <ListingsResult searchParams={params} />
      </Suspense>
    </div>
  );
}
