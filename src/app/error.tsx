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
      style={{ background: "var(--bg)" }}
    >
      {/* Background number */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden
      >
        <span
          style={{
            fontSize: "clamp(120px, 25vw, 320px)",
            fontFamily: "var(--font-heading)",
            color: "var(--line)",
            lineHeight: 1,
          }}
        >
          500
        </span>
      </div>

      <div className="relative text-center max-w-md" style={{ animation: "sh-fade-up 0.5s ease both" }}>
        <p
          className="font-mono text-[11px] uppercase tracking-widest mb-4"
          style={{ color: "var(--accent)" }}
        >
          Щось пішло не так
        </p>

        <h1
          className="font-serif leading-tight mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--ink)" }}
        >
          Помилка сервера
        </h1>

        <p className="text-[15px] leading-relaxed mb-10" style={{ color: "var(--ink-2)" }}>
          Виникла неочікувана помилка. Спробуйте ще раз або поверніться на головну.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="sh-btn sh-btn-primary px-6"
          >
            Спробувати знову
          </button>
          <a
            href="/"
            className="sh-btn px-6"
            style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
          >
            На головну
          </a>
        </div>
      </div>
    </div>
  );
}
