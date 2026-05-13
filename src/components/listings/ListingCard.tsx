import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  avgRating: number;
  reviewCount: number;
}

export function ListingCard({
  id,
  title,
  city,
  country,
  price,
  images,
  bedrooms,
  maxGuests,
  avgRating,
  reviewCount,
}: ListingCardProps) {
  const img = images[0] ?? null;

  return (
    <Link
      href={`/listings/${id}`}
      className="group block"
      style={{ textDecoration: "none" }}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-xl mb-3"
        style={{ aspectRatio: "4/3", background: "#F0EDE6" }}
      >
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10"
              fill="none"
              stroke="#C4BFBA"
              strokeWidth="1.5"
            >
              <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </div>
        )}

        {/* Rating badge */}
        {reviewCount > 0 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}
          >
            <Star className="w-3 h-3" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
            <span className="text-xs font-semibold" style={{ color: "#1C1917" }}>
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-1 flex-1"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#1C1917",
            }}
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1 mb-1.5">
          <MapPin className="w-3 h-3 shrink-0" style={{ color: "#A8A29E" }} />
          <span className="text-xs" style={{ color: "#78716C" }}>
            {city}, {country}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#A8A29E" }}>
            <span>{bedrooms} кімн.</span>
            <span>·</span>
            <span>до {maxGuests} гостей</span>
          </div>
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: "#1E1B4B", fontFamily: "var(--font-heading)" }}
            >
              ${price}
            </span>
            <span className="text-xs ml-0.5" style={{ color: "#A8A29E" }}>
              /ніч
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
