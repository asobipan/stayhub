import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city")?.trim() || undefined;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const checkInDate = checkIn ? new Date(checkIn) : undefined;
  const checkOutDate = checkOut ? new Date(checkOut) : undefined;

  // Find listings that overlap with requested dates
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
    ...(city && { city: { contains: city, mode: "insensitive" as const } }),
    ...(guests && { maxGuests: { gte: parseInt(guests) } }),
    ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
    ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
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
        host: { select: { name: true, image: true } },
      },
    }),
    db.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}
