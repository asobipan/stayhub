import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, bio: true, phone: true, role: true, createdAt: true },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, bio, phone, image } = await req.json();

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return NextResponse.json({ error: "Ім'я не може бути порожнім" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(name  !== undefined && { name:  name.trim()  }),
      ...(bio   !== undefined && { bio:   bio.trim()   }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(image !== undefined && { image }),
    },
    select: { id: true, name: true, email: true, image: true, bio: true, phone: true, role: true },
  });

  return NextResponse.json(updated);
}
