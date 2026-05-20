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
  const body = await req.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  if ("role" in body) {
    if (!["GUEST", "HOST", "ADMIN"].includes(body.role)) {
      return NextResponse.json({ error: "Невірна роль" }, { status: 400 });
    }
    data.role = body.role;
  }

  if ("isBlocked" in body) {
    data.isBlocked = Boolean(body.isBlocked);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Нема даних для оновлення" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id },
    data,
    select: { id: true, role: true, isBlocked: true },
  });

  return NextResponse.json(updated);
}
