import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "oklch(0.99 0.003 85)" }}
    >
      <div style={{ height: 3, background: "linear-gradient(90deg, #1E1B4B 0%, #F59E0B 100%)", position: "fixed", top: 0, left: 0, right: 0 }} />

      <div className="text-center max-w-md anim-fade-up">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(30,27,75,0.06)" }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: "#1E1B4B" }} />
          </div>
        </div>

        {/* Golden rule */}
        <div className="flex justify-center mb-6">
          <span className="hero-rule" />
        </div>

        <h1
          className="text-4xl font-semibold mb-4"
          style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
        >
          Оплата успішна!
        </h1>

        <p className="text-base mb-2 leading-relaxed" style={{ color: "#44403C" }}>
          Ваше бронювання підтверджено.
        </p>
        <p className="text-sm mb-10 leading-relaxed" style={{ color: "#78716C" }}>
          Деталі надіслано на вашу електронну пошту. Господар побачить запит і зв'яжеться з вами.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/bookings"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: "#1E1B4B",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(30,27,75,0.25)",
            }}
          >
            Мої бронювання
          </Link>
          <Link
            href="/listings"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors"
            style={{ borderColor: "#E7E5E0", color: "#44403C" }}
          >
            Продовжити пошук
          </Link>
        </div>
      </div>
    </div>
  );
}
