"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Grid2X2 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div
        className="w-full rounded-2xl flex items-center justify-center"
        style={{ height: 400, background: "#F0EDE6" }}
      >
        <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="#C4BFBA" strokeWidth="1">
          <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          <path d="M9 21V12h6v9" />
        </svg>
      </div>
    );
  }

  const main = images[0];
  const side = images.slice(1, 5);

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden" style={{ height: 460 }}>
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => setLightboxIndex(0)}
        >
          <Image src={main} alt={title} fill className="object-cover group-hover:brightness-95 transition-all" />
        </div>

        {/* Side images */}
        {side.map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer group"
            onClick={() => setLightboxIndex(i + 1)}
          >
            <Image src={img} alt={`${title} ${i + 2}`} fill className="object-cover group-hover:brightness-95 transition-all" />

            {/* Show more button on last visible image */}
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.9)", color: "#1C1917" }}
                >
                  <Grid2X2 className="w-4 h-4" />
                  +{images.length - 5}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Fill empty slots */}
        {side.length < 4 &&
          Array.from({ length: 4 - side.length }).map((_, i) => (
            <div key={`empty-${i}`} style={{ background: "#F0EDE6" }} />
          ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <button
            className="absolute left-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i! > 0 ? i! - 1 : images.length - 1));
            }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div
            className="relative"
            style={{ width: "min(90vw, 1000px)", height: "min(80vh, 700px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            className="absolute right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i! < images.length - 1 ? i! + 1 : 0));
            }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-4 text-white text-sm opacity-60">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
