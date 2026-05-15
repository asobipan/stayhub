"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#1E1B4B" }}
    >
      {/* Background text */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden
      >
        <span
          style={{
            fontSize: "clamp(120px, 25vw, 320px)",
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.04)",
            lineHeight: 1,
          }}
        >
          500
        </span>
      </div>

      <div className="relative text-center max-w-md anim-fade-up">
        <div className="flex justify-center mb-8">
          <span className="hero-rule" />
        </div>

        <p
          className="section-eyebrow mb-4"
          style={{ color: "rgba(245,158,11,0.7)" }}
        >
          Щось пішло не так
        </p>

        <h1
          className="text-4xl font-semibold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-heading)", color: "#fff" }}
        >
          Помилка сервера
        </h1>

        <p
          className="text-base mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Виникла неочікувана помилка. Спробуйте ще раз або поверніться на головну.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: "#F59E0B",
              color: "#1E1B4B",
              boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
            }}
          >
            Спробувати знову
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
          >
            На головну
          </a>
        </div>
      </div>
    </div>
  );
}
