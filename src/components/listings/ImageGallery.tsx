"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, LayoutGrid } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="sh-gallery" style={{ gridTemplateColumns: "1fr", height: 420, borderRadius: 16, overflow: "hidden", background: "var(--surface-2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <svg viewBox="0 0 24 24" style={{ width: 56, height: 56, color: "var(--line-2)" }} fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </div>
      </div>
    );
  }

  const main = images[0];
  const side = images.slice(1, 5);

  return (
    <>
      <div className="sh-gallery">
        {/* Main image */}
        <div className="sh-gallery-main" onClick={() => setLightboxIndex(0)} style={{ cursor: "pointer" }}>
          <Image src={main} alt={title} fill style={{ objectFit: "cover" }} />
          <div className="sh-gallery-counter">{images.length} фото</div>
        </div>

        {/* Side thumbnails */}
        <div className="sh-gallery-side">
          {side.map((img, i) => (
            <button
              key={i}
              className={`sh-gal-thumb ${i === 0 ? "active" : ""}`}
              onClick={() => setLightboxIndex(i + 1)}
            >
              <Image src={img} alt={`${title} ${i + 2}`} fill style={{ objectFit: "cover" }} />
              {i === 3 && images.length > 5 && (
                <span className="sh-gal-thumb-more">+{images.length - 5}</span>
              )}
            </button>
          ))}

          {/* Fill empty slots */}
          {side.length < 4 &&
            Array.from({ length: 4 - side.length }).map((_, i) => (
              <div key={`empty-${i}`} style={{ background: "var(--surface-2)", borderRadius: 8 }} />
            ))}

          <button className="sh-gal-all" onClick={() => setLightboxIndex(0)}>
            <LayoutGrid size={13} strokeWidth={1.8} />
            Всі {images.length} фото
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.94)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            style={{
              position: "absolute", top: 20, right: 20,
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}
            onClick={() => setLightboxIndex(null)}
          >
            <X size={18} />
          </button>

          <button
            style={{
              position: "absolute", left: 20,
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i! > 0 ? i! - 1 : images.length - 1));
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            style={{ position: "relative", width: "min(90vw, 1100px)", height: "min(80vh, 720px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} ${lightboxIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <button
            style={{
              position: "absolute", right: 20,
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i! < images.length - 1 ? i! + 1 : 0));
            }}
          >
            <ChevronRight size={20} />
          </button>

          <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
