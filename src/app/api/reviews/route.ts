import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, rating, comment } = await req.json();

  if (!bookingId || !rating || !comment?.trim()) {
    return NextResponse.json({ error: "Відсутні обов'язкові поля" }, { status: 400 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Рейтинг має бути від 1 до 5" }, { status: 400 });
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId, guestId: session.user.id },
    include: { review: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Бронювання не знайдено" }, { status: 404 });
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json({ error: "Відгук можна залишити тільки після завершення поїздки" }, { status: 400 });
  }

  if (booking.review) {
    return NextResponse.json({ error: "Ви вже залишили відгук на це бронювання" }, { status: 409 });
  }

  // Create review + update listing avgRating in one transaction
  const [review] = await db.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId,
        listingId: booking.listingId,
        authorId: session.user.id,
        rating,
        comment: comment.trim(),
      },
    });

    const agg = await tx.review.aggregate({
      where: { listingId: booking.listingId },
      _avg: { rating: true },
      _count: true,
    });

    await tx.listing.update({
      where: { id: booking.listingId },
      data: {
        avgRating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    });

    return [review];
  });

  return NextResponse.json(review, { status: 201 });
}
