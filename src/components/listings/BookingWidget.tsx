"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface BookingWidgetProps {
  listingId: string;
  price: number;
  maxGuests: number;
  avgRating: number;
  reviewCount: number;
  isAuthenticated: boolean;
}

export function BookingWidget({
  listingId,
  price,
  maxGuests,
  avgRating,
  reviewCount,
  isAuthenticated,
}: BookingWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const subtotal = nights * price;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  async function handleBook() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Оберіть дати заїзду та виїзду");
      return;
    }

    if (nights <= 0) {
      toast.error("Дата виїзду має бути після дати заїзду");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, checkIn, checkOut, guests }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Помилка бронювання");
        return;
      }

      router.push(`/bookings/${data.id}/payment`);
    } catch {
      toast.error("Помилка мережі. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="sticky top-24 rounded-2xl border p-6"
      style={{
        background: "#fff",
        borderColor: "#E7E5E0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}
    >
      {/* Price header */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
          >
            ${price}
          </span>
          <span className="text-sm ml-1" style={{ color: "#78716C" }}>
            / ніч
          </span>
        </div>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
            <span className="text-sm font-semibold" style={{ color: "#1C1917" }}>
              {avgRating.toFixed(1)}
            </span>
            <span className="text-xs" style={{ color: "#A8A29E" }}>
              ({reviewCount})
            </span>
          </div>
        )}
      </div>

      {/* Date pickers */}
      <div
        className="grid grid-cols-2 rounded-xl border overflow-hidden mb-3"
        style={{ borderColor: "#E7E5E0" }}
      >
        <div
          className="px-4 py-3 border-r"
          style={{ borderColor: "#E7E5E0" }}
        >
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#44403C" }}>
            Заїзд
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#312E81" }} />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) setCheckOut("");
              }}
              className="text-sm w-full outline-none bg-transparent cursor-pointer"
              style={{ color: checkIn ? "#1C1917" : "#A8A29E" }}
            />
          </div>
        </div>
        <div className="px-4 py-3">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#44403C" }}>
            Виїзд
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#312E81" }} />
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-sm w-full outline-none bg-transparent cursor-pointer"
              style={{ color: checkOut ? "#1C1917" : "#A8A29E" }}
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl border mb-4"
        style={{ borderColor: "#E7E5E0" }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: "#312E81" }} />
          <span className="text-sm font-medium" style={{ color: "#44403C" }}>
            Гості
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-colors hover:bg-[#F5F4F0]"
            style={{ borderColor: "#E7E5E0", color: "#44403C" }}
          >
            −
          </button>
          <span className="text-sm font-semibold w-4 text-center" style={{ color: "#1C1917" }}>
            {guests}
          </span>
          <button
            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
            className="w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-colors hover:bg-[#F5F4F0]"
            style={{ borderColor: "#E7E5E0", color: "#44403C" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Book button */}
      <button
        onClick={handleBook}
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 mb-4"
        style={{
          background: isLoading ? "#312E81cc" : "#1E1B4B",
          color: "#fff",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) (e.target as HTMLButtonElement).style.background = "#312E81";
        }}
        onMouseLeave={(e) => {
          if (!isLoading) (e.target as HTMLButtonElement).style.background = "#1E1B4B";
        }}
      >
        {isLoading
          ? "Обробка..."
          : !isAuthenticated
          ? "Увійдіть для бронювання"
          : !checkIn || !checkOut
          ? "Оберіть дати"
          : "Забронювати"}
      </button>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="space-y-2 text-sm border-t pt-4" style={{ borderColor: "#F0EDE6" }}>
          <div className="flex justify-between" style={{ color: "#44403C" }}>
            <span>
              ${price} × {nights} {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}
            </span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between" style={{ color: "#44403C" }}>
            <span>Сервісний збір</span>
            <span>${serviceFee}</span>
          </div>
          <div
            className="flex justify-between font-semibold pt-2 border-t"
            style={{ borderColor: "#F0EDE6", color: "#1C1917" }}
          >
            <span>Разом</span>
            <span>${total}</span>
          </div>
        </div>
      )}

      <p className="text-xs text-center mt-3" style={{ color: "#A8A29E" }}>
        З вас не стягнеться плата до підтвердження
      </p>
    </div>
  );
}
