import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { role } = await req.json();

  if (!["GUEST", "HOST", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Невірна роль" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id },
    data: { role },
    select: { id: true, role: true },
  });

  return NextResponse.json(updated);
}
