import { db } from "@/lib/db";

export interface ListingsQuery {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

const LIMIT = 12;

export async function getListings(query: ListingsQuery) {
  const page = Math.max(1, parseInt(query.page ?? "1"));
  const skip = (page - 1) * LIMIT;

  const checkInDate = query.checkIn ? new Date(query.checkIn) : undefined;
  const checkOutDate = query.checkOut ? new Date(query.checkOut) : undefined;

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
    ...(query.city && { city: { contains: query.city, mode: "insensitive" as const } }),
    ...(query.guests && { maxGuests: { gte: parseInt(query.guests) } }),
    ...(query.minPrice && { price: { gte: parseFloat(query.minPrice) } }),
    ...(query.maxPrice && { price: { lte: parseFloat(query.maxPrice) } }),
    ...(excludedListingIds.length > 0 && { id: { notIn: excludedListingIds } }),
  };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: [{ avgRating: "desc" }, { createdAt: "desc" }],
      skip,
      take: LIMIT,
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

  return { listings, total, pages: Math.ceil(total / LIMIT), page };
}
