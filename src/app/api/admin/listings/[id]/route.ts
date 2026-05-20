import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action, reason } = await req.json();

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  if (action === "reject" && !reason?.trim()) {
    return NextResponse.json({ error: "Причина відхилення обов'язкова" }, { status: 400 });
  }

  const listing = await db.listing.update({
    where: { id },
    data:
      action === "approve"
        ? { status: "ACTIVE", isActive: true, rejectedReason: null }
        : { status: "REJECTED", isActive: false, rejectedReason: reason.trim() },
    select: { id: true, title: true, status: true },
  });

  return NextResponse.json(listing);
}
