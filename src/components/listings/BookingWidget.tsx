"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StarFillIcon } from "@/components/ui/icons";

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
  const cleaningFee = 35;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee;

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

  const btnLabel = isLoading
    ? "Обробка..."
    : !isAuthenticated
    ? "Увійдіть для бронювання"
    : !checkIn || !checkOut
    ? "Оберіть дати"
    : "Забронювати";

  return (
    <div className="sh-booking-wrap">
      <div className="sh-booking">
        {/* Price + rating */}
        <div className="sh-booking-head">
          <div>
            <span className="sh-booking-price">${price}</span>
            <span className="sh-booking-unit"> / ніч</span>
          </div>
          {reviewCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
              <StarFillIcon size={13} className="text-[var(--accent)]" />
              <strong style={{ color: "var(--ink)" }}>{avgRating.toFixed(2)}</strong>
              <span style={{ color: "var(--muted)" }}>· {reviewCount}</span>
            </div>
          )}
        </div>

        {/* Dates + guests form */}
        <div className="sh-booking-form">
          <div className="sh-booking-dates">
            <div className="sh-booking-date" style={{ borderRight: "1px solid var(--line)" }}>
              <label>Заїзд</label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut("");
                }}
                style={{
                  fontSize: 13,
                  color: checkIn ? "var(--ink)" : "var(--muted)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div className="sh-booking-date">
              <label>Виїзд</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{
                  fontSize: 13,
                  color: checkOut ? "var(--ink)" : "var(--muted)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div className="sh-booking-guests">
            <label>Гості</label>
            <div className="sh-stepper">
              <button onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span>{guests} {guests === 1 ? "гість" : "гост."}</span>
              <button onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="sh-btn sh-btn-primary sh-btn-block"
          onClick={handleBook}
          disabled={isLoading}
          style={{ marginBottom: 12 }}
        >
          {btnLabel}
        </button>

        <p className="sh-booking-note">Вас не спишуть до підтвердження.</p>

        {/* Price breakdown */}
        {nights > 0 && (
          <ul className="sh-booking-breakdown">
            <li>
              <span>
                <u>${price}</u> × {nights} {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}
              </span>
              <span>${subtotal}</span>
            </li>
            <li>
              <span>Прибирання</span>
              <span>${cleaningFee}</span>
            </li>
            <li>
              <span>Сервісний збір</span>
              <span>${serviceFee}</span>
            </li>
            <li className="sh-booking-total">
              <span>Разом</span>
              <span>${total}</span>
            </li>
          </ul>
        )}
      </div>

      <div className="sh-rare-note">
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c2 3 6 4 6 8a6 6 0 01-12 0c0-4 4-5 6-8z" />
          <path d="M12 12v4M12 18h.01" />
        </svg>
        <p>
          <strong>Рідко вільне.</strong> Це помешкання дуже популярне в цьому сезоні.
        </p>
      </div>
    </div>
  );
}
