import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden
      >
        <span
          style={{
            fontSize: "clamp(200px, 38vw, 480px)",
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            color: "oklch(0.88 0.014 80)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          404
        </span>
      </div>

      <div className="relative text-center max-w-md anim-fade-up">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <span
            className="w-7 h-px"
            style={{ background: "var(--sh-accent)" }}
          />
          <span
            className="font-mono-sh text-[11px] uppercase tracking-[0.08em]"
            style={{ color: "var(--sh-muted)" }}
          >
            StayHub · Помилка
          </span>
          <span
            className="w-7 h-px"
            style={{ background: "var(--sh-accent)" }}
          />
        </div>

        <h1
          className="font-serif leading-[1.05] tracking-[-0.02em] mb-4"
          style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)", color: "var(--ink)" }}
        >
          Тут{" "}
          <em className="italic" style={{ color: "var(--sh-accent)" }}>
            нічого
          </em>{" "}
          немає
        </h1>

        <p
          className="text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--ink-2)" }}
        >
          Сторінка могла бути видалена, переміщена або ніколи не існувала.
          <br />
          Повернись на головну — там є що дивитись.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="sh-btn sh-btn-primary px-7 py-3.5 rounded-xl text-[13.5px]"
          >
            На головну
          </Link>
          <Link
            href="/listings"
            className="sh-btn sh-btn-outline px-7 py-3.5 rounded-xl text-[13.5px]"
          >
            Переглянути оголошення
          </Link>
        </div>
      </div>
    </div>
  );
}
