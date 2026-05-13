import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, image: true, createdAt: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}
