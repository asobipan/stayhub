import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CategoryTabs } from "@/components/listings/CategoryTabs";
import { ListingCard } from "@/components/listings/ListingCard";
import { HeroSearch } from "@/components/home/HeroSearch";

/* ─── Data ──────────────────────────────────────────────────── */
const CITIES = [
  { name: "Київ",      country: "Україна",    count: 142, hue: 28  },
  { name: "Львів",     country: "Україна",    count:  97, hue: 35  },
  { name: "Одеса",     country: "Україна",    count:  68, hue: 200 },
  { name: "Відень",    country: "Австрія",    count:  54, hue: 145 },
  { name: "Варшава",   country: "Польща",     count:  41, hue: 320 },
  { name: "Барселона", country: "Іспанія",    count:  88, hue: 55  },
  { name: "Прага",     country: "Чехія",      count:  47, hue: 12  },
  { name: "Лісабон",   country: "Португалія", count:  39, hue: 175 },
];

const STRIP = [
  { n: "01", title: "Куратовано редакцією",   body: "Кожне оголошення проходить ручний відбір. Жодних шумних «студій за €30» з обкладинками з фотобанку." },
  { n: "02", title: "Прозорі ціни",           body: "Усе включено в підсумкову суму до бронювання — без сюрпризів на чек-аут і прихованих сервісних зборів." },
  { n: "03", title: "Підтримка 24/7",         body: "Українською, англійською або польською — відповідаємо в чаті протягом години у будь-який час доби." },
  { n: "04", title: "Гарантія заїзду",        body: "Якщо щось піде не так на місці — переселимо у житло того ж рівня або повернемо кошти за лічені години." },
];

async function getListings() {
  return db.listing.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true, title: true, city: true, country: true,
      price: true, images: true, avgRating: true,
      reviewCount: true, bedrooms: true,
    },
  });
}

/* ─── Layout slot per editorial pattern ─────────────────────── */
function editorialSlot(i: number) {
  const slot = i % 8;
  if (slot === 0) return { col: "col-span-editorial-hero", aspect: "aspect-hero-card" };
  if (slot === 1) return { col: "col-span-editorial-tall", aspect: "aspect-tall-card" };
  if (slot === 2) return { col: "col-span-editorial-wide", aspect: "aspect-wide-card" };
  if (slot === 6) return { col: "col-span-editorial-wide", aspect: "aspect-wide-card" };
  return { col: "col-span-editorial-norm", aspect: "aspect-[4/3]" };
}

/* ─── Page ───────────────────────────────────────────────────── */
export default async function HomePage() {
  const listings = await getListings();
  const heroListing = listings[0];

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="bg-[var(--background)] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-[1.15fr_1fr] gap-14 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-px bg-[var(--sh-accent)]" />
              <span className="font-mono-sh text-[11px] uppercase tracking-[0.08em] text-[var(--sh-muted)]">
                StayHub · 2026 · Літня колекція
              </span>
            </div>

            <h1 className="font-serif text-[clamp(2.8rem,5.8vw,5.4rem)] leading-[0.97] tracking-[-0.025em] text-[var(--ink)] mb-6">
              Помешкання
              <br />з <em className="italic text-[var(--sh-accent)]">характером</em>
              <br />для людей з{" "}
              <span className="relative inline-block">
                планами
                <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden className="absolute bottom-[-8px] left-0 w-full h-3">
                  <path d="M2 8C40 2 80 10 120 6S180 4 198 8" fill="none" stroke="var(--sh-accent)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-[16px] leading-[1.55] text-[var(--ink-2)] max-w-[520px] mb-8">
              Понад 580 житл, обраних редакцією: лофти, вілли, кабіни та апартаменти
              у 8 країнах Європи. Без масовки, з характером.
            </p>

            <HeroSearch />
          </div>

          {/* Right — hero card stack */}
          <div className="relative aspect-hero-stack">
            {/* Main card */}
            <div className="absolute top-0 right-0 w-[78%] h-[78%] rounded-[20px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-10 bg-[var(--bg-alt)]">
              {heroListing?.images[0] ? (
                <Image
                  src={heroListing.images[0]}
                  alt={heroListing.title}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[oklch(0.62_0.08_28)] to-[oklch(0.45_0.08_48)]" />
              )}
              {/* Tag */}
              <span className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1.5 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] backdrop-blur-md rounded-full font-mono-sh text-[10px] uppercase tracking-[0.06em] text-[var(--ink)] z-10">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>
                </svg>
                {heroListing?.city ?? "Київ"}
              </span>
              {/* Bottom info */}
              {heroListing && (
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent z-10 text-white">
                  <p className="font-serif text-[22px] leading-[1.1] mb-2">{heroListing.title}</p>
                  <div className="flex items-center gap-1.5 text-[12px] opacity-90">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--sh-accent)" stroke="none">
                      <path d="M12 2l3 6.5 7 1-5 4.5 1.5 7L12 17l-6.5 4 1.5-7-5-4.5 7-1L12 2z"/>
                    </svg>
                    <span>{heroListing.avgRating.toFixed(2)}</span>
                    <span className="opacity-60">·</span>
                    <span>${heroListing.price}/ніч</span>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary card */}
            <div className="absolute bottom-0 left-0 w-[56%] h-[48%] rounded-[20px] overflow-hidden z-20 border-[6px] border-[var(--background)] bg-[var(--bg-alt)] shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              {listings[1]?.images[0] ? (
                <Image src={listings[1].images[0]} alt={listings[1].title} fill sizes="25vw" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[oklch(0.55_0.08_155)] to-[oklch(0.38_0.08_175)]" />
              )}
            </div>

            {/* Stat 1 */}
            <div className="absolute bottom-[-8px] right-[-8px] z-30 flex flex-col bg-[var(--ink)] text-[var(--background)] rounded-2xl px-[18px] py-4 w-[140px] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <span className="font-serif text-[36px] leading-none text-[var(--sh-accent)] mb-1.5">580+</span>
              <span className="font-mono-sh text-[9.5px] uppercase tracking-[0.06em] text-[color-mix(in_oklab,var(--background)_70%,transparent)] leading-[1.3]">
                помешкань<br />у каталозі
              </span>
            </div>

            {/* Stat 2 */}
            <div className="absolute top-6 left-[-40px] z-30 flex flex-col bg-[var(--surface)] text-[var(--ink)] rounded-2xl px-[18px] py-4 w-[124px] shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
              <span className="font-serif text-[30px] leading-none text-[var(--ink)] mb-1.5">4.91</span>
              <span className="font-mono-sh text-[9.5px] uppercase tracking-[0.06em] text-[var(--sh-muted)] leading-[1.3] flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--sh-accent)" stroke="none">
                  <path d="M12 2l3 6.5 7 1-5 4.5 1.5 7L12 17l-6.5 4 1.5-7-5-4.5 7-1L12 2z"/>
                </svg>
                середня оцінка
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY TABS ─────────────────────────────────────── */}
      <CategoryTabs />

      {/* ─── EDITORIAL LISTINGS ────────────────────────────────── */}
      {listings.length > 0 && (
        <section className="py-16 md:py-20 bg-[var(--background)]">
          <div className="max-w-[1320px] mx-auto px-8">
            {/* Section head */}
            <div className="flex items-end justify-between gap-8 mb-14">
              <div>
                <p className="font-mono-sh text-[11px] uppercase tracking-[0.08em] text-[var(--sh-muted)] mb-2.5">
                  Редакторський вибір · {listings.length} з 580
                </p>
                <h2 className="font-serif font-normal text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-0.02em] text-[var(--ink)]">
                  Помешкання, які
                  <br /><em className="italic text-[var(--sh-accent)]">варто побачити</em>
                </h2>
              </div>
              <Link
                href="/listings"
                className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ink)] no-underline border-b border-[var(--ink)] pb-0.5 transition-colors hover:text-[var(--sh-accent)] hover:border-[var(--sh-accent)] shrink-0 mb-1"
              >
                Весь каталог
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </Link>
            </div>

            {/* Editorial grid */}
            <div className="grid grid-cols-12-editorial gap-5">
              {listings.map((listing, i) => {
                const { col, aspect } = editorialSlot(i);
                return (
                  <ListingCard
                    key={listing.id}
                    {...listing}
                    index={i}
                    layoutClass={col}
                    aspectClass={aspect}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── DESTINATIONS ──────────────────────────────────────── */}
      <section className="bg-[var(--ink)] py-[72px]">
        <div className="max-w-[1320px] mx-auto px-8">
          <div className="flex items-end justify-between gap-8 mb-14">
            <div>
              <p className="font-mono-sh text-[11px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--background)_50%,transparent)] mb-2.5">
                Напрямки · 08 столиць
              </p>
              <h2 className="font-serif font-normal text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-0.02em] text-[var(--background)]">
                Куди тобі
                <br /><em className="italic text-[var(--sh-accent)]">тягне</em> цього сезону?
              </h2>
            </div>
            <div className="text-right">
              <span className="block font-serif text-[56px] leading-[0.95] text-[var(--sh-accent)]">580+</span>
              <span className="font-mono-sh text-[10px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--background)_40%,transparent)] leading-[1.3]">
                активних<br />оголошень
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {CITIES.map((city, i) => (
              <Link
                key={city.name}
                href={`/listings?city=${encodeURIComponent(city.name)}`}
                className="relative h-[220px] rounded-[14px] overflow-hidden flex flex-col justify-between p-[22px] text-white no-underline transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Gradient bg */}
                <div
                  className="absolute inset-0 transition-[filter] duration-300 group-hover:saturate-[1.1]"
                  style={{ background: `linear-gradient(160deg, oklch(0.65 0.12 ${city.hue}) 0%, oklch(0.35 0.10 ${city.hue + 30}) 100%)` }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-black/50" />

                <span className="relative z-10 font-mono-sh text-[11px] uppercase tracking-[0.12em] opacity-85">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative z-10">
                  <h3 className="font-serif text-[32px] font-normal leading-none tracking-[-0.01em] mb-1">
                    {city.name}
                  </h3>
                  <p className="text-[12px] opacity-85">{city.country}</p>
                </div>
                <div className="relative z-10 flex items-center justify-between font-mono-sh text-[11px] tracking-[0.04em] opacity-90">
                  <span>{city.count} помешкань</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M9 7h8v8"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE STRIP ──────────────────────────────────── */}
      <section className="py-16 bg-[var(--bg-alt)]">
        <div className="max-w-[1320px] mx-auto px-8">
          <div className="grid grid-cols-4 gap-0">
            {STRIP.map((item, i) => (
              <div
                key={item.n}
                className={`pr-7 ${i < STRIP.length - 1 ? "border-r border-[var(--line-2)]" : ""}`}
              >
                <span className="inline-block font-mono-sh text-[11px] text-[var(--sh-accent)] tracking-[0.1em] mb-5">
                  {item.n}
                </span>
                <h4 className="font-serif text-[22px] font-normal leading-[1.15] mb-2 text-[var(--ink)]">
                  {item.title}
                </h4>
                <p className="text-[13.5px] text-[var(--ink-2)] leading-[1.55]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOST CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-[1320px] mx-auto px-8">
          <div className="relative bg-[var(--ink)] rounded-3xl p-14 overflow-hidden text-[var(--background)]">
            {/* Blobs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-250px] right-[-180px] w-[500px] h-[500px] rounded-full opacity-[0.12]"
                style={{ background: "radial-gradient(circle, var(--sh-accent) 0%, transparent 70%)" }} />
              <div className="absolute bottom-[-180px] left-[30%] w-[360px] h-[360px] rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, var(--sh-accent) 0%, transparent 70%)" }} />
              <svg viewBox="0 0 600 400" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <path d="M0 200 Q150 100 300 200 T600 200" stroke="var(--sh-accent)" strokeOpacity="0.18" strokeWidth="1" fill="none"/>
                <path d="M0 240 Q150 140 300 240 T600 240" stroke="var(--sh-accent)" strokeOpacity="0.12" strokeWidth="1" fill="none"/>
              </svg>
            </div>

            <div className="relative grid grid-cols-[1.3fr_1fr] gap-12 items-center">
              <div>
                <p className="font-mono-sh text-[11px] uppercase tracking-[0.08em] text-[var(--sh-accent)] mb-3">
                  Для орендодавців · Реєстрація · 8 хв
                </p>
                <h2 className="font-serif font-normal text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.02em] mb-4">
                  Маєш простір,<br />який{" "}
                  <em className="italic text-[var(--sh-accent)]">чекає гостей</em>?
                </h2>
                <p className="text-[14.5px] leading-[1.6] max-w-[440px] mb-7 text-[color-mix(in_oklab,var(--background)_70%,transparent)]">
                  Розмісти оголошення безкоштовно. Допоможемо з фотозйомкою,
                  описом і ціноутворенням. У середньому хости заробляють
                  ₴32&thinsp;000–84&thinsp;000 на місяць.
                </p>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Link
                    href="/dashboard/listings/new"
                    className="flex items-center gap-2 px-[22px] py-[14px] bg-[var(--sh-accent)] text-[var(--accent-ink)] rounded-full text-[13.5px] font-semibold no-underline transition-transform hover:-translate-y-px"
                  >
                    Стати хостом
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col">
                {[
                  { val: "₴52K", lbl: "Середній дохід\nхоста / міс" },
                  { val: "8 хв", lbl: "Створити\nоголошення" },
                  { val: "0%",   lbl: "Комісія\nза реєстрацію" },
                ].map(({ val, lbl }, i, arr) => (
                  <div
                    key={val}
                    className={`grid grid-cols-[auto_1fr] items-end gap-5 py-[22px] ${i < arr.length - 1 ? "border-b border-[color-mix(in_oklab,var(--background)_15%,transparent)]" : ""}`}
                  >
                    <span className="font-serif text-[52px] leading-[0.9] text-[var(--sh-accent)]">{val}</span>
                    <span className="font-mono-sh text-[11px] uppercase tracking-[0.06em] text-[color-mix(in_oklab,var(--background)_60%,transparent)] leading-[1.4] text-right whitespace-pre-line">
                      {lbl}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
