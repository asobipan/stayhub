"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StarFillIcon, PinIcon, ArrowIcon, CalIcon, SlidersIcon } from "@/components/ui/icons";

// ─── Review Modal ────────────────────────────────────────────────
function ReviewModal({
  bookingId,
  listingTitle,
  onClose,
  onSuccess,
}: {
  bookingId: string;
  listingTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!rating) { toast.error("Оберіть рейтинг"); return; }
    if (!comment.trim()) { toast.error("Напишіть відгук"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Помилка");
        return;
      }
      toast.success("Відгук збережено — дякуємо!");
      onSuccess();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setLoading(false);
    }
  }

  const active = hovered || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 flex flex-col gap-5"
        style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "var(--sh-muted)" }}>
              Ваш відгук
            </p>
            <h2 className="font-serif text-[20px] leading-snug" style={{ color: "var(--ink)" }}>
              {listingTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-alt)]"
            style={{ color: "var(--sh-muted)" }}
            aria-label="Закрити"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stars */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider mb-2.5" style={{ color: "var(--sh-muted)" }}>
            Загальна оцінка
          </p>
          <div className="flex items-center gap-1.5" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                className="transition-transform hover:scale-110"
                aria-label={`${n} зірок`}
              >
                <StarFillIcon
                  size={28}
                  className={n <= active ? "text-[var(--accent)]" : "text-[var(--line)]"}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--ink-2)" }}>
                {["", "Погано", "Задовільно", "Добре", "Дуже добре", "Відмінно"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--sh-muted)" }}>
            Розкажіть про перебування
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Що вам сподобалось? Що можна покращити?"
            className="w-full rounded-xl border px-4 py-3 text-[14px] leading-relaxed resize-none outline-none transition-colors"
            style={{
              background: "var(--bg-alt)",
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          />
          <p className="text-right font-mono text-[10px] mt-1" style={{ color: "var(--sh-muted)" }}>
            {comment.length}/1000
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-colors hover:bg-[var(--bg-alt)]"
            style={{ borderColor: "var(--line)", color: "var(--ink-2)" }}
          >
            Скасувати
          </button>
          <button
            onClick={submit}
            disabled={loading || !rating || !comment.trim()}
            className="flex-1 sh-btn sh-btn-primary"
            style={{ opacity: loading || !rating || !comment.trim() ? 0.5 : 1 }}
          >
            {loading ? "Надсилаю..." : "Відправити відгук"}
          </button>
        </div>
      </div>
    </div>
  );
}

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface BookingItem {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    city: string;
    country: string;
    images: string[];
  };
  hasReview: boolean;
}

const TABS = [
  { id: "upcoming",  label: "Майбутні"  },
  { id: "current",   label: "Поточні"   },
  { id: "past",      label: "Минулі"    },
  { id: "cancelled", label: "Скасовані" },
] as const;

type TabId = typeof TABS[number]["id"];

const STATUS_META: Record<BookingStatus, { label: string; classes: string }> = {
  PENDING:   { label: "Очікує оплати", classes: "bg-[oklch(0.94_0.07_75)] text-[oklch(0.42_0.13_60)]" },
  CONFIRMED: { label: "Підтверджено",  classes: "bg-[oklch(0.92_0.05_145)] text-[oklch(0.35_0.10_150)]" },
  COMPLETED: { label: "Завершено",     classes: "bg-[var(--bg-alt)] text-[var(--ink-2)]" },
  CANCELLED: { label: "Скасовано",     classes: "bg-[oklch(0.93_0.01_30)] text-[oklch(0.50_0.04_30)]" },
};

const MONTHS_UK = ["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру"];

function fmtShort(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_UK[d.getMonth()]}`;
}

function nightsWord(n: number) {
  if (n === 1) return "ніч";
  if (n < 5)   return "ночі";
  return "ночей";
}

function nightsCount(a: string, b: string) {
  return Math.round(
    (new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86400000
  );
}

function bucketOf(b: BookingItem): TabId {
  if (b.status === "CANCELLED") return "cancelled";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ci = new Date(b.checkIn  + "T00:00:00");
  const co = new Date(b.checkOut + "T00:00:00");
  if (today >= ci && today < co) return "current";
  if (today < ci) return "upcoming";
  return "past";
}

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + "T00:00:00").getTime() - today.getTime()) / 86400000);
}

// ─── Cancel button ──────────────────────────────────────────────
function CancelBtn({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle() {
    if (!confirm("Скасувати бронювання?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Помилка скасування");
        return;
      }
      toast.success("Бронювання скасовано");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--bg-alt)]"
      style={{ borderColor: "var(--line-2)", color: "var(--ink-2)" }}
    >
      {loading ? "..." : "Скасувати"}
    </button>
  );
}

// ─── Booking card ────────────────────────────────────────────────
function BookingCard({ b, index }: { b: BookingItem; index: number }) {
  const router = useRouter();
  const bucket = bucketOf(b);
  const meta   = STATUS_META[b.status];
  const nights = nightsCount(b.checkIn, b.checkOut);
  const days   = daysUntil(b.checkIn);
  const showCountdown = bucket === "upcoming" && days > 0 && days <= 90;
  const isPaid = b.status === "CONFIRMED" || b.status === "COMPLETED";
  const [showReview, setShowReview] = useState(false);
  const [reviewed, setReviewed] = useState(b.hasReview);

  return (
    <article
      className="grid rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        gridTemplateColumns: "280px 1fr",
        background: "var(--surface)",
        borderColor: "var(--line)",
      }}
    >
      {/* Photo */}
      <Link href={`/listings/${b.listing.id}`} className="relative block min-h-[220px] overflow-hidden">
        {b.listing.images[0] ? (
          <Image src={b.listing.images[0]} alt={b.listing.title} fill style={{ objectFit: "cover" }} />
        ) : (
          <div className="absolute inset-0" style={{ background: "var(--surface-2)" }} />
        )}

        {/* Index badge */}
        <span
          className="absolute top-3 left-3 px-2 py-1 rounded-md text-white text-[11px] font-mono tracking-wide"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Countdown */}
        {showCountdown && (
          <div
            className="absolute bottom-3 left-3 flex items-baseline gap-2 rounded-xl px-3 py-2"
            style={{ background: "var(--surface)", boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }}
          >
            <span
              className="font-serif text-[28px] leading-none"
              style={{ color: "var(--accent)" }}
            >
              {days}
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-wider leading-tight"
              style={{ color: "var(--sh-muted)" }}
            >
              {days === 1 ? "день" : days < 5 ? "дні" : "днів"}<br />до заїзду
            </span>
          </div>
        )}

        {/* Current badge */}
        {bucket === "current" && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Зараз тут
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-5">
        {/* Top row */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-mono text-[10px] tracking-wider"
            style={{ color: "var(--sh-muted)" }}
          >
            #{b.id.slice(-8)} · заброньовано {fmtShort(b.createdAt.slice(0, 10))}
          </span>
          <span
            className={`inline-flex px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium whitespace-nowrap ${meta.classes}`}
          >
            {meta.label}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/listings/${b.listing.id}`}
          className="font-serif text-[19px] leading-snug transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--ink)" }}
        >
          {b.listing.title}
        </Link>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "var(--sh-muted)" }}>
          <PinIcon size={11} />
          {b.listing.city}, {b.listing.country}
        </p>

        {/* Facts row */}
        <div
          className="grid items-start gap-x-5 rounded-xl px-4 py-3.5 mt-1"
          style={{
            gridTemplateColumns: "auto auto auto 1px auto auto",
            background: "var(--bg-alt)",
          }}
        >
          {/* Check-in */}
          <FactCell label="Заїзд" val={fmtShort(b.checkIn)} meta="з 15:00" />

          {/* Arrow + nights */}
          <div className="flex flex-col items-center gap-1 pt-3.5" style={{ color: "var(--sh-muted)" }}>
            <ArrowIcon size={14} className="text-[var(--accent)]" />
            <span className="font-mono text-[9px] uppercase tracking-wider">
              {nights} {nightsWord(nights)}
            </span>
          </div>

          {/* Check-out */}
          <FactCell label="Виїзд" val={fmtShort(b.checkOut)} meta="до 11:00" />

          {/* Divider */}
          <div className="w-px h-8 self-center" style={{ background: "var(--line-2)" }} />

          {/* Guests */}
          <FactCell label="Гостей" val={String(b.guests)} />

          {/* Price */}
          <FactCell
            label="Сума"
            val={`$${b.totalPrice.toLocaleString()}`}
            meta={isPaid ? "оплачено" : "до оплати"}
            accent
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {b.status === "PENDING" && (
            <>
              <Link
                href={`/bookings/${b.id}/payment`}
                className="sh-btn sh-btn-primary sh-btn-sm"
              >
                Оплатити ${b.totalPrice}
              </Link>
              <CancelBtn bookingId={b.id} />
            </>
          )}

          {b.status === "CONFIRMED" && (
            <Link
              href={`/listings/${b.listing.id}`}
              className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--bg-alt)]"
              style={{ borderColor: "var(--line-2)", color: "var(--ink-2)" }}
            >
              Деталі помешкання
            </Link>
          )}

          {b.status === "COMPLETED" && !reviewed && (
            <>
              <button
                onClick={() => setShowReview(true)}
                className="sh-btn sh-btn-primary sh-btn-sm flex items-center gap-1.5"
              >
                <StarFillIcon size={12} />
                Залишити відгук
              </button>
              <Link
                href={`/listings/${b.listing.id}`}
                className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--bg-alt)]"
                style={{ borderColor: "var(--line-2)", color: "var(--ink-2)" }}
              >
                Переглянути знову
              </Link>
            </>
          )}

          {b.status === "COMPLETED" && reviewed && (
            <div
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px]"
              style={{ background: "var(--bg-alt)", color: "var(--ink-2)" }}
            >
              <StarFillIcon size={11} className="text-[var(--accent)]" />
              Відгук залишено
            </div>
          )}

          {b.status === "CANCELLED" && (
            <Link
              href="/listings"
              className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--bg-alt)]"
              style={{ borderColor: "var(--line-2)", color: "var(--ink-2)" }}
            >
              Знайти схоже
            </Link>
          )}

          <div className="flex-1" />

          <Link
            href={`/listings/${b.listing.id}`}
            className="flex items-center gap-1 text-[12.5px] font-medium transition-colors hover:text-[var(--ink)]"
            style={{ color: "var(--sh-muted)" }}
          >
            Деталі <ArrowIcon size={11} />
          </Link>
        </div>
      </div>

      {showReview && (
        <ReviewModal
          bookingId={b.id}
          listingTitle={b.listing.title}
          onClose={() => setShowReview(false)}
          onSuccess={() => {
            setShowReview(false);
            setReviewed(true);
            router.refresh();
          }}
        />
      )}
    </article>
  );
}

function FactCell({
  label, val, meta, accent,
}: {
  label: string; val: string; meta?: string; accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>
        {label}
      </span>
      <span
        className="font-serif text-[18px] leading-tight"
        style={{ color: accent ? "var(--accent)" : "var(--ink)" }}
      >
        {val}
      </span>
      {meta && (
        <span className="text-[10.5px]" style={{ color: "var(--sh-muted)" }}>{meta}</span>
      )}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────
const EMPTY_COPY: Record<TabId, { eyebrow: string; title: string; sub: string }> = {
  upcoming:  { eyebrow: "01 · Заплануй", title: "Поки що жодних майбутніх поїздок",  sub: "Час щось забронювати. Колекція літа 2026 чекає — від Карпат до Лісабона." },
  current:   { eyebrow: "02 · Подорож",  title: "Зараз ти не в дорозі",              sub: "Коли в тебе буде активне бронювання — покажемо чек-ін і контакт хоста." },
  past:      { eyebrow: "03 · Архів",    title: "Минулих поїздок поки немає",        sub: "Тут зʼявиться історія твоїх стейів — фото, відгуки, «забронювати знову»." },
  cancelled: { eyebrow: "04 · Архів",    title: "Жодних скасувань",                  sub: "І це чудово. Скасовані бронювання зберігаються тут на випадок суперечок." },
};

function Empty({ tab }: { tab: TabId }) {
  const c = EMPTY_COPY[tab];
  return (
    <div className="flex flex-col items-center text-center py-20 px-6 max-w-md mx-auto gap-4">
      <p className="sh-eyebrow-text">{c.eyebrow}</p>
      <h3 className="font-serif text-2xl leading-snug" style={{ color: "var(--ink)" }}>{c.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>{c.sub}</p>
      <Link href="/listings" className="sh-btn sh-btn-primary mt-2">
        Знайти помешкання
      </Link>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────
export function BookingsTabs({ bookings }: { bookings: BookingItem[] }) {
  const [tab, setTab] = useState<TabId>("upcoming");

  const enriched = bookings.map((b) => ({ ...b, bucket: bucketOf(b) }));

  const counts = enriched.reduce<Record<string, number>>((acc, b) => {
    acc[b.bucket] = (acc[b.bucket] || 0) + 1;
    return acc;
  }, {});

  const visible = enriched.filter((b) => b.bucket === tab);

  const totalNights = enriched
    .filter((b) => b.status !== "CANCELLED")
    .reduce((s, b) => s + nightsCount(b.checkIn, b.checkOut), 0);
  const totalSpent = enriched
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((s, b) => s + b.totalPrice, 0);
  const uniqueCities = new Set(
    enriched.filter((b) => b.status !== "CANCELLED").map((b) => b.listing.city)
  ).size;

  return (
    <>
      {/* ── Head with stats ───────────────────────────── */}
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="sh-container">
          {/* Crumbs */}
          <div className="flex items-center gap-2 pt-5 mb-7 font-mono text-[11px]" style={{ color: "var(--sh-muted)" }}>
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[var(--ink)]">
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              StayHub
            </Link>
            <span style={{ color: "var(--line-2)" }}>/</span>
            <span style={{ color: "var(--ink)" }}>Мої бронювання</span>
          </div>

          {/* Head grid */}
          <div className="grid gap-12 pb-12" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-4 font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
                <span className="block w-7 h-px" style={{ background: "var(--accent)" }} />
                Особистий кабінет · {TABS.find((t) => t.id === tab)!.label.toLowerCase()}
              </div>

              <h1
                className="font-serif leading-[1.1] tracking-tight mb-3.5"
                style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--ink)" }}
              >
                Мої <em style={{ fontStyle: "italic", color: "var(--accent)" }}>поїздки</em>
              </h1>
              <p className="text-[15px] leading-relaxed max-w-[440px]" style={{ color: "var(--ink-2)" }}>
                Усі бронювання в одному місці — від наступного вікенду
                в Карпатах до того тижня в Барселоні навесні.
              </p>
            </div>

            {/* Stats 2×2 */}
            <div
              className="grid gap-px rounded-2xl overflow-hidden border"
              style={{ gridTemplateColumns: "1fr 1fr", background: "var(--line)", borderColor: "var(--line)" }}
            >
              {[
                { num: enriched.length, lbl: "всього\nбронювань" },
                { num: totalNights,     lbl: "ночей\nу дорозі" },
                { num: uniqueCities,    lbl: "різних\nміст" },
                { num: `$${totalSpent.toLocaleString()}`, lbl: "витрачено\nчерез StayHub" },
              ].map(({ num, lbl }) => (
                <div key={lbl} className="flex flex-col gap-1.5 px-5 py-4" style={{ background: "var(--surface)" }}>
                  <span
                    className="font-serif leading-none tracking-tight"
                    style={{ fontSize: 36, color: "var(--ink)" }}
                  >
                    {num}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider leading-[1.4] whitespace-pre-line"
                    style={{ color: "var(--sh-muted)" }}
                  >
                    {lbl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky tabs ───────────────────────────────── */}
      <section
        className="sticky z-40 border-b"
        style={{
          top: 60,
          background: "color-mix(in oklab, var(--bg) 90%, transparent)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--line)",
        }}
      >
        <div className="sh-container">
          <div className="flex items-stretch gap-1 py-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors"
                style={{
                  background: tab === t.id ? "var(--ink)" : "transparent",
                  color: tab === t.id ? "var(--bg)" : "var(--sh-muted)",
                }}
              >
                {t.label}
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: tab === t.id ? "rgba(255,255,255,0.15)" : "var(--bg-alt)",
                    color: tab === t.id ? "var(--bg)" : "var(--sh-muted)",
                  }}
                >
                  {counts[t.id] || 0}
                </span>
              </button>
            ))}

            <div className="flex-1" />

            <div className="flex gap-1">
              <button className="sh-icon-btn sh-icon-btn-ghost">
                <CalIcon size={14} /><span>Календар</span>
              </button>
              <button className="sh-icon-btn sh-icon-btn-ghost">
                <SlidersIcon size={14} /><span>Фільтр</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── List ──────────────────────────────────────── */}
      <section className="py-8 pb-20">
        <div className="sh-container">
          {visible.length === 0 ? (
            <Empty tab={tab} />
          ) : (
            <div className="flex flex-col gap-4">
              {visible.map((b, i) => (
                <BookingCard key={b.id} b={b} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
