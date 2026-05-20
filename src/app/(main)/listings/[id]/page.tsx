import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { AmenitiesList } from "@/components/listings/AmenitiesList";
import { BookingWidget } from "@/components/listings/BookingWidget";
import { LeaveReviewButton } from "@/components/reviews/LeaveReviewButton";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  StarFillIcon,
  PinIcon,
  BedIcon,
  PeopleIcon,
  ArrowIcon,
} from "@/components/ui/icons";

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

const RATING_CATEGORIES = [
  { label: "Чистота",        val: 4.95 },
  { label: "Точність опису", val: 4.91 },
  { label: "Зв'язок",        val: 4.98 },
  { label: "Локація",        val: 4.93 },
  { label: "Заїзд",          val: 4.96 },
  { label: "Цінність",       val: 4.86 },
];


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
          include: { author: { select: { name: true, image: true } } },
        },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const relatedSameCity = await db.listing.findMany({
    where: { id: { not: id }, isActive: true, city: listing.city },
    take: 4,
    orderBy: { avgRating: "desc" },
    select: {
      id: true, title: true, city: true, country: true, price: true,
      images: true, bedrooms: true, avgRating: true, reviewCount: true,
    },
  });
  const related = relatedSameCity.length >= 4 ? relatedSameCity : await db.listing.findMany({
    where: { id: { not: id }, isActive: true },
    take: 4,
    orderBy: { avgRating: "desc" },
    select: {
      id: true, title: true, city: true, country: true, price: true,
      images: true, bedrooms: true, avgRating: true, reviewCount: true,
    },
  });

  const isOwner = session?.user?.id === listing.hostId;
  const isAuthenticated = !!session?.user;

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
    <div className="sh-detail">
      <div className="sh-container">

        {/* Breadcrumb row */}
        <div className="sh-crumb">
          <Link href="/listings" className="sh-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Назад до каталогу
          </Link>
          <div className="sh-crumb-actions">
            {isOwner && (
              <Link
                href={`/dashboard/listings/${id}/edit`}
                className="sh-icon-btn sh-icon-btn-ghost"
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Редагувати</span>
              </Link>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="sh-detail-head">
          <h1 className="sh-detail-title">{listing.title}</h1>
          <div className="sh-detail-head-meta">
            {listing.reviewCount > 0 && (
              <>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <StarFillIcon size={14} className="text-[var(--accent)]" />
                  <strong style={{ color: "var(--ink)" }}>{listing.avgRating.toFixed(2)}</strong>
                  <span style={{ color: "var(--ink-2)" }}>· {listing.reviewCount} відгуків</span>
                </span>
                <span className="sh-muted">·</span>
              </>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <PinIcon size={13} />
              {listing.city}, {listing.country}
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div style={{ marginBottom: 48 }}>
          <ImageGallery images={listing.images} title={listing.title} />
        </div>

        {/* Two-column layout */}
        <div className="sh-detail-grid">

          {/* LEFT: content */}
          <div className="sh-detail-content">

            {/* Host block */}
            <section className="sh-block sh-host-block">
              <div>
                <p className="sh-eyebrow-text">
                  Хост · {memberSince} рік на StayHub
                </p>
                <h3>
                  Господар: <em>{listing.host.name}</em>
                </h3>
                <div className="sh-host-trust">
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 9px", borderRadius: 999,
                    background: "var(--accent-soft)", color: "var(--accent)",
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>
                    Перевірений
                  </span>
                </div>
              </div>
              <div className="sh-host-avatar">
                {listing.host.image ? (
                  <Image
                    src={listing.host.image}
                    alt={listing.host.name ?? "Хост"}
                    width={72}
                    height={72}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span>{listing.host.name?.[0] ?? "?"}</span>
                )}
              </div>
            </section>

            {/* Quick facts */}
            <section className="sh-facts sh-block">
              <div className="sh-fact">
                <BedIcon size={20} />
                <div>
                  <strong>{listing.bedrooms}</strong>
                  <span>спальн.</span>
                </div>
              </div>
              <div className="sh-fact">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M5 12a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2 2M5 12v7m14-7v7m-9-7v7m4-7v7" />
                </svg>
                <div>
                  <strong>{listing.bathrooms}</strong>
                  <span>ванн.</span>
                </div>
              </div>
              <div className="sh-fact">
                <PeopleIcon size={20} />
                <div>
                  <strong>{listing.maxGuests}</strong>
                  <span>гостей</span>
                </div>
              </div>
              <div className="sh-fact">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-7h6v7" />
                </svg>
                <div>
                  <strong>Житло</strong>
                  <span>тип</span>
                </div>
              </div>
            </section>

            {/* About */}
            <section className="sh-block">
              <h3 className="sh-block-title">Про це помешкання</h3>
              <p className="sh-prose" style={{ whiteSpace: "pre-line" }}>
                {listing.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="sh-block">
              <AmenitiesList amenities={listing.amenities} />
            </section>

            {/* Reviews */}
            <section className="sh-block">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 className="sh-block-title" style={{ marginBottom: 0 }}>
                  {listing.reviewCount > 0 && (
                    <>
                      <StarFillIcon size={16} className="text-[var(--accent)]" />
                      <span>
                        {listing.avgRating.toFixed(2)} · {listing.reviewCount}{" "}
                        {listing.reviewCount === 1 ? "відгук" : listing.reviewCount < 5 ? "відгуки" : "відгуків"}
                      </span>
                    </>
                  )}
                  {listing.reviewCount === 0 && "Відгуки"}
                </h3>
                {completedBookingWithoutReview && (
                  <LeaveReviewButton
                    bookingId={completedBookingWithoutReview.id}
                    listingTitle={listing.title}
                  />
                )}
              </div>

              {/* Rating bars */}
              {listing.reviewCount > 0 && (
                <div className="sh-review-bars">
                  {RATING_CATEGORIES.map((r) => (
                    <div key={r.label} className="sh-review-bar">
                      <span>{r.label}</span>
                      <div className="sh-review-bar-track">
                        <div className="sh-review-bar-fill" style={{ width: `${(r.val / 5) * 100}%` }} />
                      </div>
                      <strong>{r.val.toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews grid */}
              {listing.reviews.length > 0 && (
                <div className="sh-reviews-grid">
                  {listing.reviews.map((review) => (
                    <article key={review.id} className="sh-review">
                      <header>
                        {review.author.image ? (
                          <Image
                            src={review.author.image}
                            alt={review.author.name ?? ""}
                            width={36}
                            height={36}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            className="sh-review-avatar"
                          />
                        ) : (
                          <span className="sh-review-avatar">
                            {review.author.name?.[0] ?? "?"}
                          </span>
                        )}
                        <div>
                          <strong>{review.author.name}</strong>
                          <span>{new Date(review.createdAt).toLocaleDateString("uk-UA", { month: "long", year: "numeric" })}</span>
                        </div>
                        <div className="sh-review-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarFillIcon
                              key={i}
                              size={10}
                              className={i < review.rating ? "text-[var(--accent)]" : "text-[var(--line)]"}
                            />
                          ))}
                        </div>
                      </header>
                      <p>{review.comment}</p>
                    </article>
                  ))}
                </div>
              )}

              {listing.reviewCount > 8 && (
                <button className="sh-btn sh-btn-outline" style={{ marginTop: 24 }}>
                  Показати всі {listing.reviewCount} відгуків
                </button>
              )}
            </section>

            {/* Location */}
            <section className="sh-block sh-loc-block" style={{ borderBottom: "none", marginBottom: 0 }}>
              <h3 className="sh-block-title">Де ви опинитеся</h3>
              <p className="sh-muted" style={{ marginBottom: 18, fontSize: 14 }}>
                {listing.address}, {listing.city}, {listing.country} · Точна адреса доступна після бронювання
              </p>
              {listing.latitude && listing.longitude && (
                <div className="sh-mini-map">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: 16 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${listing.latitude},${listing.longitude}&z=14&output=embed`}
                  />
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: sticky booking widget */}
          <aside>
            <BookingWidget
              listingId={listing.id}
              price={listing.price}
              maxGuests={listing.maxGuests}
              avgRating={listing.avgRating}
              reviewCount={listing.reviewCount}
              isAuthenticated={isAuthenticated}
            />
          </aside>
        </div>

        {/* Related listings */}
        {related.length > 0 && (
          <section className="sh-block sh-related" style={{ borderBottom: "none", marginBottom: 0 }}>
            <div className="sh-section-head">
              <h3 className="sh-section-title-sm">
                Схожі помешкання<br />
                <em>поруч</em>
              </h3>
              <Link href="/listings" className="sh-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                Всі поблизу <ArrowIcon size={13} />
              </Link>
            </div>
            <div className="sh-results-grid wide">
              {related.map((item, i) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  city={item.city}
                  country={item.country}
                  price={item.price}
                  images={item.images}
                  bedrooms={item.bedrooms}
                  avgRating={item.avgRating}
                  reviewCount={item.reviewCount}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
