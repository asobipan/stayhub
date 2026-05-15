import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, BedDouble, Bath, Calendar, Edit } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { AmenitiesList } from "@/components/listings/AmenitiesList";
import { BookingWidget } from "@/components/listings/BookingWidget";
import { LeaveReviewButton } from "@/components/reviews/LeaveReviewButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await db.listing.findUnique({
    where: { id },
    select: { title: true, description: true, city: true, country: true, images: true },
  });

  if (!listing) return { title: "Не знайдено" };

  return {
    title: `${listing.title} — StayHub`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.images[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const [listing, session] = await Promise.all([
    db.listing.findUnique({
      where: { id, isActive: true },
      include: {
        host: { select: { id: true, name: true, image: true, createdAt: true } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            author: { select: { name: true, image: true } },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const isOwner = session?.user?.id === listing.hostId;
  const isAuthenticated = !!session?.user;

  // Check if current user has a COMPLETED booking without a review
  let completedBookingWithoutReview: { id: string } | null = null;
  if (session?.user?.id && !isOwner) {
    completedBookingWithoutReview = await db.booking.findFirst({
      where: {
        listingId: id,
        guestId: session.user.id,
        status: "COMPLETED",
        review: null,
      },
      select: { id: true },
    });
  }

  const memberSince = new Date(listing.host.createdAt).getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title row */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h1
            className="text-3xl font-semibold mb-2 leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
          >
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "#78716C" }}>
            {listing.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
                <span className="font-semibold" style={{ color: "#1C1917" }}>
                  {listing.avgRating.toFixed(1)}
                </span>
                <span>({listing.reviewCount} відгуків)</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {listing.city}, {listing.country}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <Link
            href={`/dashboard/listings/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:bg-[#F5F4F0] shrink-0"
            style={{ borderColor: "#E7E5E0", color: "#44403C" }}
          >
            <Edit className="w-4 h-4" />
            Редагувати
          </Link>
        )}
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <ImageGallery images={listing.images} title={listing.title} />
      </div>

      {/* Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 pb-8 border-b" style={{ borderColor: "#F0EDE6" }}>
            <Stat icon={<BedDouble className="w-5 h-5" />} label={`${listing.bedrooms} кімнат`} />
            <Stat icon={<Bath className="w-5 h-5" />} label={`${listing.bathrooms} санвузлів`} />
            <Stat icon={<Users className="w-5 h-5" />} label={`до ${listing.maxGuests} гостей`} />
          </div>

          {/* Host info */}
          <div className="flex items-center gap-4 pb-8 border-b" style={{ borderColor: "#F0EDE6" }}>
            <div className="relative">
              {listing.host.image ? (
                <Image
                  src={listing.host.image}
                  alt={listing.host.name ?? "Хост"}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold text-white"
                  style={{ background: "#1E1B4B" }}
                >
                  {listing.host.name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "#1C1917", fontFamily: "var(--font-heading)" }}>
                Хост: {listing.host.name}
              </p>
              <p className="text-sm" style={{ color: "#78716C" }}>
                На StayHub з {memberSince} р.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="pb-8 border-b" style={{ borderColor: "#F0EDE6" }}>
            <h2
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
            >
              Про це місце
            </h2>
            <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: "#44403C", lineHeight: 1.75 }}>
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="pb-8 border-b" style={{ borderColor: "#F0EDE6" }}>
            <AmenitiesList amenities={listing.amenities} />
          </div>

          {/* Location */}
          <div>
            <h2
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
            >
              Розташування
            </h2>
            <p className="text-sm mb-4" style={{ color: "#78716C" }}>
              {listing.address}, {listing.city}, {listing.country}
            </p>
            {listing.latitude && listing.longitude && (
              <div
                className="w-full rounded-xl overflow-hidden"
                style={{ height: 240, background: "#F0EDE6" }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${listing.latitude},${listing.longitude}&z=14&output=embed`}
                />
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="pt-8 border-t" style={{ borderColor: "#F0EDE6" }}>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
                >
                  {listing.reviewCount > 0
                    ? `${listing.avgRating.toFixed(1)} · ${listing.reviewCount} ${listing.reviewCount === 1 ? "відгук" : listing.reviewCount < 5 ? "відгуки" : "відгуків"}`
                    : "Відгуки"}
                </h2>
              </div>
              {completedBookingWithoutReview && (
                <LeaveReviewButton
                  bookingId={completedBookingWithoutReview.id}
                  listingTitle={listing.title}
                />
              )}
            </div>
            {listing.reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listing.reviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-center gap-3 mb-2">
                      {review.author.image ? (
                        <Image
                          src={review.author.image}
                          alt={review.author.name ?? ""}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                          style={{ background: "#312E81" }}
                        >
                          {review.author.name?.[0] ?? "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#1C1917" }}>
                          {review.author.name}
                        </p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3"
                              style={{
                                fill: i < review.rating ? "#F59E0B" : "#E7E5E0",
                                color: i < review.rating ? "#F59E0B" : "#E7E5E0",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#44403C" }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking widget */}
        <div className="lg:col-span-1">
          <BookingWidget
            listingId={listing.id}
            price={listing.price}
            maxGuests={listing.maxGuests}
            avgRating={listing.avgRating}
            reviewCount={listing.reviewCount}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl border"
      style={{ borderColor: "#E7E5E0", background: "#FAFAF8" }}
    >
      <span style={{ color: "#312E81" }}>{icon}</span>
      <span className="text-sm font-medium" style={{ color: "#44403C" }}>
        {label}
      </span>
    </div>
  );
}
