import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { db } from "@/lib/db";

const FEATURED_CITIES = [
  { name: "Київ", country: "Україна", tag: "Столиця" },
  { name: "Львів", country: "Україна", tag: "Старе місто" },
  { name: "Одеса", country: "Україна", tag: "Море" },
  { name: "Відень", country: "Австрія", tag: "Культура" },
  { name: "Варшава", country: "Польща", tag: "Архітектура" },
  { name: "Барселона", country: "Іспанія", tag: "Пляж" },
];

async function getLatestListings() {
  return db.listing.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      price: true,
      images: true,
      avgRating: true,
      reviewCount: true,
      bedrooms: true,
      maxGuests: true,
    },
  });
}

async function getStats() {
  const [listingCount, userCount] = await Promise.all([
    db.listing.count({ where: { isActive: true } }),
    db.user.count(),
  ]);
  return { listingCount, userCount };
}

export default async function HomePage() {
  const [listings, stats] = await Promise.all([
    getLatestListings(),
    getStats(),
  ]);

  return (
    <>
      {/* Grain overlay — premium texture */}
      <div className='grain' aria-hidden />

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section
        className='relative overflow-hidden'
        style={{ background: "#0F0D2E", minHeight: "100svh" }}
      >
        {/* Ambient light blobs */}
        <div aria-hidden className='absolute inset-0 pointer-events-none'>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "-10%",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(49,46,129,0.55) 0%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-5%",
              right: "-5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            }}
          />
          {/* Fine grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-24 flex flex-col min-h-svh'>
          {/* Top meta row */}
          <div className='flex items-center justify-between mb-auto anim-fade-in'>
            <div className='flex items-center gap-3'>
              <span className='hero-rule' />
              <span
                className='section-eyebrow'
                style={{ color: "rgba(245,158,11,0.8)" }}
              >
                Оренда житла
              </span>
            </div>
            <span
              className='section-eyebrow'
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {new Date().getFullYear()}
            </span>
          </div>

          {/* Giant headline + photo */}
          <div className="flex-1 flex flex-row items-center justify-between gap-10 lg:gap-16 py-12">

            {/* Left: vertical stack */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h1
                className="anim-fade-up delay-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
                  lineHeight: 1.1,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#F8F6F2",
                  marginBottom: "1.25rem",
                }}
              >
                Знайди{" "}
                <em style={{ color: "#F59E0B", fontStyle: "italic" }}>ідеальне</em>
                <br />
                місце для відпочинку
              </h1>

              <p
                className="anim-fade-up delay-2"
                style={{
                  color: "rgba(248,246,242,0.5)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  maxWidth: 420,
                  marginBottom: "2rem",
                }}
              >
                Тисячі унікальних помешкань по всьому світу — від мінімалістичних апартаментів до розкішних вілл.
              </p>

              <div className="anim-fade-up delay-3">
                <Link
                  href="/listings"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 28px",
                    borderRadius: 50,
                    background: "#F59E0B",
                    color: "#0F0D2E",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  Переглянути всі оголошення
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: hero photo */}
            <div
              className="hidden lg:block shrink-0 anim-fade-in delay-2"
              style={{ width: "clamp(300px, 35vw, 480px)" }}
            >
              <Image
                src="/hero-right.webp"
                alt="Унікальні помешкання"
                width={920}
                height={1040}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 28,
                  display: "block",
                }}
              />
            </div>

          </div>{/* end flex-1 row */}

          {/* Bottom stats bar */}
          <div
            className='anim-fade-up delay-5 grid grid-cols-3 gap-px mt-auto'
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              { value: `${stats.listingCount}+`, label: "Активних оголошень" },
              { value: `${stats.userCount}+`, label: "Задоволених гостей" },
              { value: "80+", label: "Міст по всьому світу" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className='flex flex-col items-center py-5 px-3 text-center'
                style={{
                  background: "rgba(15,13,46,0.6)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    color: "#F59E0B",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 4,
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE CITIES ──────────────────────────────────── */}
      <section
        style={{
          background: "#1E1B4B",
          borderTop: "1px solid rgba(245,158,11,0.15)",
          overflow: "hidden",
          padding: "0",
        }}
      >
        <div className='marquee-track flex' style={{ width: "max-content" }}>
          {[
            ...FEATURED_CITIES,
            ...FEATURED_CITIES,
            ...FEATURED_CITIES,
            ...FEATURED_CITIES,
          ].map(({ name, tag }, i) => (
            <Link
              key={i}
              href={`/listings?city=${encodeURIComponent(name)}`}
              className='city-pill shrink-0 flex items-center gap-3 px-7 py-4'
              style={{
                borderRight: "1px solid rgba(255,255,255,0.07)",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.05rem",
                  color: "#F8F6F2",
                  fontWeight: 500,
                }}
              >
                {name}
              </span>
              <span
                className='city-pill-tag'
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </span>
              <span
                style={{
                  color: "rgba(245,158,11,0.4)",
                  fontSize: "0.75rem",
                  marginLeft: 2,
                }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED LISTINGS ───────────────────────────────── */}
      {listings.length > 0 && (
        <section style={{ background: "#FAFAF8" }} className='py-20 md:py-28'>
          <div className='max-w-7xl mx-auto px-6 sm:px-10 lg:px-16'>
            {/* Section header */}
            <div className='flex items-end justify-between mb-14'>
              <div>
                <p className='section-eyebrow mb-3'>Нові надходження</p>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "#0F0D2E",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Щойно додані
                  <br />
                  <em
                    style={{
                      color: "#78716C",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    помешкання
                  </em>
                </h2>
              </div>
              <Link
                href='/listings'
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  color: "#1E1B4B",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  paddingBottom: 2,
                  borderBottom: "1px solid #1E1B4B",
                }}
              >
                Всі оголошення
                <svg
                  viewBox='0 0 24 24'
                  width='14'
                  height='14'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M5 12h14M12 5l7 7-7 7' />
                </svg>
              </Link>
            </div>

            {/* Asymmetric grid */}
            <div className='grid grid-cols-1 md:grid-cols-12 gap-5'>
              {listings.map((listing, i) => {
                // First card — wide hero
                const isHero = i === 0;
                // Second card — tall
                const isTall = i === 1;
                const colSpan = isHero
                  ? "md:col-span-7"
                  : isTall
                    ? "md:col-span-5"
                    : "md:col-span-4";
                const aspectPad = isHero ? "66%" : isTall ? "110%" : "75%";

                return (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className={`listing-card group ${colSpan} block`}
                    style={{ textDecoration: "none" }}
                  >
                    {/* Image */}
                    <div
                      className='relative overflow-hidden'
                      style={{
                        paddingBottom: aspectPad,
                        borderRadius: 16,
                        background: "#E8E4DC",
                      }}
                    >
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          sizes='(max-width: 768px) 100vw, 60vw'
                          className='listing-img object-cover'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <svg
                            viewBox='0 0 24 24'
                            width='40'
                            height='40'
                            fill='none'
                            stroke='#C4BFBA'
                            strokeWidth='1'
                          >
                            <path d='M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z' />
                            <path d='M9 21V12h6v9' />
                          </svg>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div
                        className='absolute inset-0 opacity-0 group-hover:opacity-100'
                        style={{
                          background:
                            "linear-gradient(to top, rgba(15,13,46,0.5) 0%, transparent 50%)",
                          transition: "opacity 0.4s ease",
                          borderRadius: 16,
                        }}
                      />

                      {/* Index number — editorial touch */}
                      <div
                        className='absolute top-4 left-4'
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.9)",
                          background: "rgba(15,13,46,0.5)",
                          backdropFilter: "blur(6px)",
                          padding: "3px 8px",
                          borderRadius: 4,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      {/* Rating */}
                      {listing.reviewCount > 0 && (
                        <div
                          className='absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full'
                          style={{
                            background: "rgba(255,255,255,0.92)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <Star
                            width={11}
                            height={11}
                            style={{ fill: "#F59E0B", color: "#F59E0B" }}
                          />
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: "#1C1917",
                            }}
                          >
                            {listing.avgRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card info */}
                    <div className='pt-4 pb-1 flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <h3
                          className='line-clamp-1'
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: isHero ? "1.05rem" : "0.9rem",
                            color: "#0F0D2E",
                            fontWeight: 600,
                            marginBottom: 4,
                          }}
                        >
                          {listing.title}
                        </h3>
                        <div className='flex items-center gap-1.5'>
                          <MapPin
                            width={11}
                            height={11}
                            style={{ color: "#A8A29E", flexShrink: 0 }}
                          />
                          <span
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "0.75rem",
                              color: "#78716C",
                            }}
                          >
                            {listing.city}, {listing.country}
                          </span>
                          <span
                            style={{ color: "#D1CEC9", fontSize: "0.6rem" }}
                          >
                            ·
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "0.75rem",
                              color: "#A8A29E",
                            }}
                          >
                            {listing.bedrooms} кімн.
                          </span>
                        </div>
                      </div>
                      <div className='shrink-0 text-right'>
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "1rem",
                            color: "#1E1B4B",
                            fontWeight: 700,
                          }}
                        >
                          ${listing.price}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.7rem",
                            color: "#A8A29E",
                          }}
                        >
                          {" "}
                          /ніч
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── CITIES GRID ─────────────────────────────────────── */}
      <section style={{ background: "#0F0D2E" }} className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='flex items-end justify-between mb-14'>
            <div>
              <p
                className='section-eyebrow mb-3'
                style={{ color: "rgba(245,158,11,0.6)" }}
              >
                Напрямки
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#F8F6F2",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Популярні
                <br />
                <em style={{ color: "#F59E0B", fontStyle: "italic" }}>міста</em>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {FEATURED_CITIES.map(({ name, country, tag }) => (
              <Link
                key={name}
                href={`/listings?city=${encodeURIComponent(name)}`}
                className='city-pill group flex flex-col justify-between p-6'
                style={{
                  background: "rgba(15,13,46,0.8)",
                  textDecoration: "none",
                  minHeight: 140,
                }}
              >
                <span
                  className='city-pill-tag'
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {tag}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
                      color: "#F8F6F2",
                      fontWeight: 500,
                      lineHeight: 1.1,
                      marginBottom: 2,
                    }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOST CTA ────────────────────────────────────────── */}
      <section style={{ background: "#FAFAF8" }} className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-6 sm:px-10 lg:px-16'>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: "clamp(24px, 5vw, 80px)",
              background: "#1E1B4B",
              borderRadius: 20,
              padding: "clamp(32px, 5vw, 64px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* BG decoration */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: -60,
                top: -60,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "40%",
                bottom: -80,
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "1px solid rgba(245,158,11,0.1)",
              }}
            />

            <div className='relative z-10'>
              <p
                className='section-eyebrow mb-4'
                style={{ color: "rgba(245,158,11,0.7)" }}
              >
                Для орендодавців
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  color: "#F8F6F2",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                Маєш житло?
                <br />
                <em style={{ color: "#F59E0B", fontStyle: "italic" }}>
                  Заробляй
                </em>{" "}
                на ньому.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  color: "rgba(248,246,242,0.5)",
                  lineHeight: 1.7,
                  maxWidth: 400,
                }}
              >
                Розмісти оголошення безкоштовно і отримуй бронювання від
                перевірених гостей з усього світу.
              </p>
            </div>

            <Link
              href='/dashboard/listings/new'
              className='relative z-10 shrink-0 flex items-center gap-3 group'
              style={{ textDecoration: "none" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#F59E0B",
                  color: "#0F0D2E",
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox='0 0 24 24'
                  width='22'
                  height='22'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 5v14M5 12h14' />
                </svg>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  color: "rgba(248,246,242,0.6)",
                  letterSpacing: "0.06em",
                  display: "none",
                }}
                className='hidden lg:block'
              >
                Розмістити
                <br />
                оголошення
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
