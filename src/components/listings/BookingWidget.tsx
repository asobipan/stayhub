"use client";

import { useState, useRef, useEffect } from "react";
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
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCal) return;
    const onClick = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCal(false);
    };
    setTimeout(() => document.addEventListener("mousedown", onClick), 0);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showCal]);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  const subtotal = nights * price;
  const cleaningFee = 35;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee;

  function fmt(d: Date | null) {
    if (!d) return "Додати дату";
    return d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
  }

  function handlePick(d: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d);
      setCheckOut(null);
    } else if (d > checkIn) {
      setCheckOut(d);
      setShowCal(false);
    } else {
      setCheckIn(d);
    }
  }

  async function handleBook() {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!checkIn || !checkOut) { toast.error("Оберіть дати заїзду та виїзду"); return; }
    if (nights <= 0) { toast.error("Дата виїзду має бути після дати заїзду"); return; }

    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          guests,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Помилка бронювання"); return; }
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

        {/* Dates + guests */}
        <div className="sh-booking-form">
          <div className="sh-booking-dates">
            <button
              className="sh-booking-date"
              style={{ borderRight: "1px solid var(--line)", textAlign: "left" }}
              onClick={() => setShowCal(true)}
            >
              <label>Заїзд</label>
              <span style={{ color: checkIn ? "var(--ink)" : "var(--muted)", fontSize: 13 }}>
                {fmt(checkIn)}
              </span>
            </button>
            <button
              className="sh-booking-date"
              style={{ textAlign: "left" }}
              onClick={() => setShowCal(true)}
            >
              <label>Виїзд</label>
              <span style={{ color: checkOut ? "var(--ink)" : "var(--muted)", fontSize: 13 }}>
                {fmt(checkOut)}
              </span>
            </button>
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

        {/* Calendar inline */}
        {showCal && (
          <div ref={calRef} className="sh-booking-calendar-inline">
            <CalendarMini
              price={price}
              checkIn={checkIn}
              checkOut={checkOut}
              onPick={handlePick}
            />
          </div>
        )}

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

        {nights > 0 && (
          <ul className="sh-booking-breakdown">
            <li>
              <span><u>${price}</u> × {nights} {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}</span>
              <span>${subtotal}</span>
            </li>
            <li><span>Прибирання</span><span>${cleaningFee}</span></li>
            <li><span>Сервісний збір</span><span>${serviceFee}</span></li>
            <li className="sh-booking-total"><span>Разом</span><span>${total}</span></li>
          </ul>
        )}
      </div>

      <div className="sh-rare-note">
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c1 5 5 6 5 11a5 5 0 01-10 0c0-4 4-5 6-8z" />
          <path d="M12 12v4M12 18h.01" />
        </svg>
        <p>
          <strong>Рідко вільне.</strong> Це помешкання дуже популярне в цьому сезоні.
        </p>
      </div>
    </div>
  );
}

// ── Calendar mini ─────────────────────────────────────────────
function CalendarMini({
  price,
  checkIn,
  checkOut,
  onPick,
}: {
  price: number;
  checkIn: Date | null;
  checkOut: Date | null;
  onPick: (d: Date) => void;
}) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const monthName = month.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });
  const startDay = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Simple surge/deal simulation based on day of week
  function dayMeta(d: number) {
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    const dow = date.getDay();
    const surge = dow === 5 || dow === 6;
    const deal = dow === 1 || dow === 2;
    const p = surge ? Math.round(price * 1.2) : deal ? Math.round(price * 0.9) : price;
    return { price: p, surge, deal };
  }

  function isInRange(d: number) {
    if (!checkIn || !checkOut) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    return date > checkIn && date < checkOut;
  }

  function isSel(d: number) {
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    return (
      (checkIn != null && date.toDateString() === checkIn.toDateString()) ||
      (checkOut != null && date.toDateString() === checkOut.toDateString())
    );
  }

  function prevMonth() {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }
  function nextMonth() {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  }

  return (
    <div className="sh-cal">
      <div className="sh-cal-head">
        <button onClick={prevMonth} aria-label="Попередній місяць">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <strong>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</strong>
        <button onClick={nextMonth} aria-label="Наступний місяць">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="sh-cal-dow">
        {["пн", "вт", "ср", "чт", "пт", "сб", "нд"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="sh-cal-grid">
        {cells.map((d, i) => {
          if (d == null) return <span key={i} className="sh-cal-cell empty" />;
          const date = new Date(month.getFullYear(), month.getMonth(), d);
          const past = date < today;
          const { price: p, surge, deal } = dayMeta(d);
          const sel = isSel(d);
          const range = isInRange(d);

          return (
            <button
              key={i}
              className={[
                "sh-cal-cell",
                past ? "past" : "",
                sel ? "sel" : "",
                range ? "range" : "",
                !sel && surge ? "surge" : "",
                !sel && deal ? "deal" : "",
              ].filter(Boolean).join(" ")}
              disabled={past}
              onClick={() => onPick(date)}
            >
              <span className="sh-cal-day">{d}</span>
              <span className="sh-cal-price">${p}</span>
            </button>
          );
        })}
      </div>

      <div className="sh-cal-legend">
        <span><span className="sh-legend-dot surge" /> Пік сезону</span>
        <span><span className="sh-legend-dot deal" /> Знижка</span>
        <span><span className="sh-legend-dot normal" /> Звичайна ціна</span>
      </div>
    </div>
  );
}
