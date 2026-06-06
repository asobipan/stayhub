"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, X } from "lucide-react";

interface ReviewFormProps {
  bookingId: string;
  listingTitle: string;
  onClose: () => void;
}

export function ReviewForm({
  bookingId,
  listingTitle,
  onClose,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const displayed = hovered || rating;

  const labels: Record<number, string> = {
    1: "Погано",
    2: "Нижче середнього",
    3: "Нормально",
    4: "Добре",
    5: "Чудово!",
  };

  async function handleSubmit() {
    if (!rating) {
      toast.error("Оберіть оцінку");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Напишіть хоча б кілька слів");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Помилка відправки");
        return;
      }

      toast.success("Дякуємо за відгук!");
      onClose();
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,8,30,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 32px 80px rgba(30,27,75,0.25)",
        }}
      >
        <div
          style={{
            height: 4,
            background:
              "linear-gradient(90deg, #1E1B4B 0%, #312E81 60%, #F59E0B 100%)",
          }}
        />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[#F5F4F0]"
            style={{ color: "#A8A29E" }}
          >
            <X className="w-4 h-4" />
          </button>

          <p className="section-eyebrow mb-2">Ваш досвід</p>
          <h2
            className="text-2xl font-semibold mb-1 leading-tight pr-8"
            style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
          >
            Залишити відгук
          </h2>
          <p className="text-sm mb-8" style={{ color: "#78716C" }}>
            {listingTitle}
          </p>

          <div className="mb-8">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "#44403C" }}
            >
              Оцінка
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform duration-100 hover:scale-110 active:scale-95"
                  aria-label={`${s} зірок`}
                >
                  <Star
                    className="w-10 h-10"
                    style={{
                      fill: s <= displayed ? "#F59E0B" : "transparent",
                      color: s <= displayed ? "#F59E0B" : "#D6D3D1",
                      filter:
                        s <= displayed
                          ? "drop-shadow(0 2px 6px rgba(245,158,11,0.4))"
                          : "none",
                      transition: "all 0.15s ease",
                    }}
                  />
                </button>
              ))}
              {displayed > 0 && (
                <span
                  className="ml-3 text-sm font-medium"
                  style={{
                    color: "#F59E0B",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {labels[displayed]}
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#44403C" }}
            >
              Коментар
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Розкажіть про своє перебування — що сподобалось, що можна покращити..."
              rows={4}
              className="w-full rounded-xl border px-4 py-3 text-sm resize-none outline-none transition-colors"
              style={{
                borderColor: "#E7E5E0",
                color: "#1C1917",
                background: "#FAFAF8",
                fontFamily: "var(--font-sans)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#312E81")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E0")}
            />
            <p
              className="text-xs mt-1.5 text-right"
              style={{ color: "#A8A29E" }}
            >
              {comment.length} символів
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors"
              style={{ borderColor: "#E7E5E0", color: "#78716C" }}
            >
              Скасувати
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !rating}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  !rating || isLoading ? "rgba(30,27,75,0.4)" : "#1E1B4B",
                color: "#fff",
                boxShadow:
                  !rating || isLoading
                    ? "none"
                    : "0 4px 16px rgba(30,27,75,0.25)",
              }}
            >
              {isLoading ? "Відправка..." : "Опублікувати"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
