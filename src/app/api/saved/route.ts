import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 200 });

  const saved = await db.savedListing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      listing: {
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
      },
    },
  });

  return NextResponse.json(saved);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await req.json();
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

  const existing = await db.savedListing.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } },
  });

  if (existing) {
    await db.savedListing.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await db.savedListing.create({ data: { userId: session.user.id, listingId } });
  return NextResponse.json({ saved: true });
}
