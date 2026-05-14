import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { Calendar, MapPin, Users } from "lucide-react";
import { CancelBookingButton } from "@/components/bookings/CancelBookingButton";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookings = await db.booking.findMany({
    where: { guestId: session.user.id },
    include: {
      listing: {
        select: { id: true, title: true, city: true, country: true, images: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const fmt = (date: Date) =>
    date.toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.99 0.003 85)" }}>
      <div style={{ height: 3, background: "linear-gradient(90deg, #1E1B4B 0%, #F59E0B 100%)" }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 anim-fade-up">
          <p className="section-eyebrow mb-2">Ваші поїздки</p>
          <h1
            className="text-4xl font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
          >
            Мої бронювання
          </h1>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-24 anim-fade-in">
            <p className="text-5xl mb-6">🏡</p>
            <p
              className="text-xl font-medium mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
            >
              Ще немає бронювань
            </p>
            <p className="text-sm mb-8" style={{ color: "#78716C" }}>
              Знайдіть своє ідеальне місце для відпочинку
            </p>
            <Link
              href="/listings"
              className="inline-flex px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#1E1B4B", color: "#fff" }}
            >
              Переглянути оголошення
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => {
              const nights = Math.round(
                (b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={b.id}
                  className="rounded-2xl border overflow-hidden flex flex-col sm:flex-row anim-fade-up"
                  style={{
                    borderColor: "#E7E5E0",
                    background: "#fff",
                    boxShadow: "0 2px 16px rgba(30,27,75,0.06)",
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-44 sm:h-auto shrink-0 overflow-hidden">
                    {b.listing.images[0] ? (
                      <Image
                        src={b.listing.images[0]}
                        alt={b.listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: "#F5F4F0" }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Link
                          href={`/listings/${b.listing.id}`}
                          className="font-semibold text-base leading-snug hover:underline"
                          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
                        >
                          {b.listing.title}
                        </Link>
                        <BookingStatusBadge status={b.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#78716C" }}>
                          <MapPin className="w-3.5 h-3.5" style={{ color: "#1E1B4B" }} />
                          {b.listing.city}, {b.listing.country}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#78716C" }}>
                          <Calendar className="w-3.5 h-3.5" style={{ color: "#1E1B4B" }} />
                          {fmt(b.checkIn)} — {fmt(b.checkOut)}
                          <span style={{ color: "#A8A29E" }}>
                            ({nights} {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"})
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#78716C" }}>
                          <Users className="w-3.5 h-3.5" style={{ color: "#1E1B4B" }} />
                          {b.guests} {b.guests === 1 ? "гість" : b.guests < 5 ? "гості" : "гостей"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "#F0EDE6" }}>
                      <span className="font-semibold text-sm" style={{ color: "#1E1B4B" }}>
                        ${b.totalPrice}{" "}
                        <span className="font-normal text-xs" style={{ color: "#A8A29E" }}>разом</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {b.status === "PENDING" && (
                          <>
                            <Link
                              href={`/bookings/${b.id}/payment`}
                              className="px-4 py-2 rounded-lg text-xs font-semibold"
                              style={{ background: "#1E1B4B", color: "#fff" }}
                            >
                              Оплатити
                            </Link>
                            <CancelBookingButton bookingId={b.id} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
