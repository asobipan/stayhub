import { NextRequest, NextResponse } from "next/server";
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
