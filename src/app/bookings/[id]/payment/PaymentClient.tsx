"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Calendar, Users, MapPin, Shield, ArrowLeft } from "lucide-react";

interface BookingData {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  nights: number;
  listing: {
    title: string;
    city: string;
    country: string;
    images: string[];
    price: number;
  };
}

export function PaymentClient({ booking }: { booking: BookingData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = booking.listing.price * booking.nights;
  const serviceFee = booking.totalPrice - subtotal;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  async function handlePay() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Помилка оплати");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Помилка мережі. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.99 0.003 85)" }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #1E1B4B 0%, #F59E0B 100%)" }} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm mb-10 transition-colors hover:opacity-70"
          style={{ color: "#78716C", fontFamily: "var(--font-sans)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад до оголошення
        </button>

        {/* Heading */}
        <div className="mb-10">
          <p className="section-eyebrow mb-2">Крок 2 з 2</p>
          <h1
            className="text-4xl font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
          >
            Підтвердження та оплата
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Trip info */}
            <section>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
              >
                Деталі поїздки
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "#F5F4F0" }}>
                  <Calendar className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#1E1B4B" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#78716C" }}>Дати</p>
                    <p className="text-sm font-medium" style={{ color: "#1C1917" }}>
                      {fmt(booking.checkIn)} — {fmt(booking.checkOut)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#A8A29E" }}>
                      {booking.nights} {booking.nights === 1 ? "ніч" : booking.nights < 5 ? "ночі" : "ночей"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "#F5F4F0" }}>
                  <Users className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#1E1B4B" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#78716C" }}>Гості</p>
                    <p className="text-sm font-medium" style={{ color: "#1C1917" }}>
                      {booking.guests} {booking.guests === 1 ? "гість" : booking.guests < 5 ? "гості" : "гостей"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "#F5F4F0" }}>
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#1E1B4B" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#78716C" }}>Місцезнаходження</p>
                    <p className="text-sm font-medium" style={{ color: "#1C1917" }}>
                      {booking.listing.city}, {booking.listing.country}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Price breakdown */}
            <section>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
              >
                Розбивка вартості
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm" style={{ color: "#44403C" }}>
                  <span>
                    ${booking.listing.price} × {booking.nights}{" "}
                    {booking.nights === 1 ? "ніч" : booking.nights < 5 ? "ночі" : "ночей"}
                  </span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "#44403C" }}>
                  <span>Сервісний збір (12%)</span>
                  <span>${serviceFee}</span>
                </div>
                <div
                  className="flex justify-between font-semibold pt-3 border-t text-base"
                  style={{ borderColor: "#E7E5E0", color: "#1C1917" }}
                >
                  <span>Разом до сплати</span>
                  <span style={{ color: "#1E1B4B" }}>${booking.totalPrice}</span>
                </div>
              </div>
            </section>

            {/* Security note */}
            <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ borderColor: "#E7E5E0" }}>
              <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
              <p className="text-xs leading-relaxed" style={{ color: "#78716C" }}>
                Платіж обробляється безпечно через{" "}
                <span style={{ color: "#1E1B4B", fontWeight: 600 }}>Stripe</span>.
                Ваші платіжні дані ніколи не зберігаються на наших серверах.
              </p>
            </div>
          </div>

          {/* Right — listing card + pay button */}
          <div className="lg:col-span-2">
            <div
              className="sticky top-24 rounded-2xl overflow-hidden border"
              style={{ borderColor: "#E7E5E0", boxShadow: "0 8px 40px rgba(30,27,75,0.10)" }}
            >
              {/* Listing image */}
              {booking.listing.images[0] && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={booking.listing.images[0]}
                    alt={booking.listing.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(30,27,75,0.4) 0%, transparent 60%)" }}
                  />
                </div>
              )}

              <div className="p-6">
                <h3
                  className="font-semibold text-base mb-1 leading-snug"
                  style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
                >
                  {booking.listing.title}
                </h3>
                <p className="text-sm mb-6" style={{ color: "#78716C" }}>
                  {booking.listing.city}, {booking.listing.country}
                </p>

                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200"
                  style={{
                    background: isLoading
                      ? "rgba(30,27,75,0.6)"
                      : "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
                    color: "#fff",
                    boxShadow: isLoading ? "none" : "0 4px 20px rgba(30,27,75,0.3)",
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                      />
                      Перенаправлення...
                    </span>
                  ) : (
                    `Оплатити $${booking.totalPrice}`
                  )}
                </button>

                <p className="text-xs text-center mt-3" style={{ color: "#A8A29E" }}>
                  Безпечна оплата через Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
