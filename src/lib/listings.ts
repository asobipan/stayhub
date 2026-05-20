import { db } from "@/lib/db";

export interface ListingsQuery {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  superhost?: string;
  instantBook?: string;
  amenities?: string;
  sort?: string;
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

  const minPrice = query.minPrice ? parseFloat(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : undefined;
  const bedroomsMin = query.bedrooms ? parseInt(query.bedrooms) : undefined;
  const amenityList = query.amenities ? query.amenities.split(",").filter(Boolean) : [];

  const where = {
    isActive: true,
    ...(query.city && {
      OR: [
        { city: { contains: query.city, mode: "insensitive" as const } },
        { title: { contains: query.city, mode: "insensitive" as const } },
        { country: { contains: query.city, mode: "insensitive" as const } },
      ],
    }),
    ...(query.guests && { maxGuests: { gte: parseInt(query.guests) } }),
    ...(minPrice && { price: { gte: minPrice } }),
    ...(maxPrice && { price: { lte: maxPrice } }),
    ...(bedroomsMin && { bedrooms: { gte: bedroomsMin } }),
    ...(query.superhost === "1" && { host: { role: "HOST" as const } }),
    ...(amenityList.length > 0 && { amenities: { hasEvery: amenityList } }),
    ...(excludedListingIds.length > 0 && { id: { notIn: excludedListingIds } }),
  };

  const orderBy =
    query.sort === "price-asc"  ? [{ price: "asc" as const }] :
    query.sort === "price-desc" ? [{ price: "desc" as const }] :
    query.sort === "rating"     ? [{ avgRating: "desc" as const }] :
    [{ avgRating: "desc" as const }, { createdAt: "desc" as const }];

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
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
