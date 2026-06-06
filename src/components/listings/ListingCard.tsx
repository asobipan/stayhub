"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  HeartIcon,
  HeartFillIcon,
  StarFillIcon,
  PinIcon,
} from "@/components/ui/icons";

export interface ListingCardProps {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms?: number;
  maxGuests?: number;
  avgRating: number;
  reviewCount: number;
  index?: number;
  layoutClass?: string;
  aspectClass?: string;
  superhost?: boolean;
  instantBook?: boolean;
  initialSaved?: boolean;
}

export function ListingCard({
  id,
  title,
  city,
  country,
  price,
  images,
  bedrooms,
  avgRating,
  reviewCount,
  index,
  layoutClass = "",
  aspectClass = "aspect-[4/3]",
  superhost,
  instantBook,
  initialSaved = false,
}: ListingCardProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [liked, setLiked] = useState(initialSaved);
  const photoCount = images.length;

  const toggleSaved = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const next = !liked;
      setLiked(next);
      try {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: id }),
        });
        if (!res.ok) throw new Error();
        toast.success(next ? "Додано до збережених" : "Видалено зі збережених");
      } catch {
        setLiked(!next);
        toast.error("Помилка. Спробуйте ще раз");
      }
    },
    [id, liked],
  );

  const navPhoto = (e: React.MouseEvent, dir: number) => {
    e.preventDefault();
    setPhotoIdx((p) => (p + dir + photoCount) % photoCount);
  };

  const hue = ((index ?? 0) * 35) % 360;

  return (
    <Link
      href={`/listings/${id}`}
      className={`group flex flex-col no-underline ${layoutClass}`}
    >
      <div
        className={`relative ${aspectClass} rounded-[14px] overflow-hidden bg-[var(--bg-alt)] mb-3 card-img-zoom`}
      >
        {images[photoIdx] ? (
          <Image
            src={images[photoIdx]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, oklch(0.62 0.08 ${hue}) 0%, oklch(0.45 0.08 ${hue + 20}) 100%)`,
            }}
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          {superhost && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--ink)] text-[var(--sh-accent)] rounded-full text-[10.5px] font-semibold">
              Superhost
            </span>
          )}
          {!superhost && instantBook && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--sh-accent)] text-[var(--accent-ink)] rounded-full text-[10.5px] font-semibold">
              Миттєве
            </span>
          )}
          {index != null && (
            <span className="font-mono-sh text-[10px] tracking-[0.06em] px-2 py-0.5 bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] backdrop-blur-md rounded-md text-[var(--ink)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        <button
          onClick={toggleSaved}
          aria-label="Зберегти"
          className={[
            "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
            liked
              ? "bg-white text-[var(--sh-accent)]"
              : "bg-black/25 backdrop-blur-md text-white",
          ].join(" ")}
        >
          {liked ? <HeartFillIcon size={16} /> : <HeartIcon size={16} />}
        </button>

        {photoCount > 1 && (
          <>
            <button
              onClick={(e) => navPhoto(e, -1)}
              aria-label="Попереднє фото"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              onClick={(e) => navPhoto(e, +1)}
              aria-label="Наступне фото"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={[
                    "block rounded-full transition-all",
                    i === photoIdx
                      ? "w-3.5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50",
                  ].join(" ")}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-[19px] font-normal leading-[1.15] tracking-[-0.01em] text-[var(--ink)] line-clamp-2 flex-1">
            {title}
          </h3>
          {reviewCount > 0 && (
            <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--ink)] shrink-0 mt-0.5">
              <StarFillIcon size={11} className="text-[var(--sh-accent)]" />
              {avgRating.toFixed(2)}
            </span>
          )}
        </div>

        <p className="flex items-center gap-1 text-[12.5px] text-[var(--sh-muted)] truncate">
          <PinIcon size={11} />
          {city}, {country}
          <span className="text-[9px]">·</span>
          {bedrooms} {bedrooms === 1 ? "спальня" : "спальні"}
        </p>

        <p className="text-[14px] text-[var(--ink)] mt-1">
          <span className="font-semibold">${price}</span>
          <span className="text-[12.5px] text-[var(--sh-muted)]"> /ніч</span>
        </p>
      </div>
    </Link>
  );
}
