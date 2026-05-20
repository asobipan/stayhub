import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getListings } from "@/lib/listings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const result = await getListings({
    city: searchParams.get("city")?.trim() ?? undefined,
    checkIn: searchParams.get("checkIn") ?? undefined,
    checkOut: searchParams.get("checkOut") ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, address, city, country, price, bedrooms, bathrooms, maxGuests, amenities, images } = body;

  if (!title || !description || !address || !city || !country || !price || !bedrooms || !bathrooms || !maxGuests) {
    return NextResponse.json({ error: "Відсутні обов'язкові поля" }, { status: 400 });
  }

  const listing = await db.listing.create({
    data: {
      title,
      description,
      address,
      city,
      country,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      maxGuests: parseInt(maxGuests),
      amenities: amenities ?? [],
      images: images ?? [],
      hostId: session.user.id,
      status: "PENDING",
      isActive: false,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
