import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Мій профіль — StayHub",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, bookingCount, reviewCount] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, bio: true, phone: true, role: true, createdAt: true },
    }),
    db.booking.count({ where: { guestId: session.user.id, status: { in: ["CONFIRMED", "COMPLETED"] } } }),
    db.review.count({ where: { authorId: session.user.id } }),
  ]);

  if (!user) redirect("/login");

  const profile = {
    ...user,
    role: user.role as "GUEST" | "HOST" | "ADMIN",
    createdAt: user.createdAt.toISOString(),
    bookingCount,
    reviewCount,
  };

  return <ProfileClient profile={profile} />;
}
