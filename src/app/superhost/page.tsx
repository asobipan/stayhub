import Link from "next/link";
import { StarFillIcon } from "@/components/ui/icons";

const CRITERIA = [
  {
    n: "01",
    label: "Середня оцінка",
    target: "4.8+",
    range: "з 5.00",
    desc: "Враховуються відгуки за останні 365 днів. Якщо щось пішло не так — гість часто залишає 5 з 5, якщо ти швидко відреагував.",
    you: 4.92,
    max: 5,
    format: (v: number) => v.toFixed(2),
    inverted: false,
  },
  {
    n: "02",
    label: "Завершених поїздок",
    target: "10+",
    range: "за рік",
    desc: "Жодних «довгих» договорів — рахуємо тільки поїздки до 30 ночей. Бронювання на 60+ ночей зараховуються як 2 поїздки.",
    you: 14,
    max: 15,
    format: (v: number) => String(v),
    inverted: false,
  },
  {
    n: "03",
    label: "Відсоток скасувань",
    target: "<1%",
    range: "за рік",
    desc: "Тобто не більше 1 скасування на 100 бронювань. Гостеві важливо, що ти не передумаєш за 3 дні до заїзду.",
    you: 0.4,
    max: 1,
    format: (v: number) => v.toFixed(1) + "%",
    inverted: true,
  },
  {
    n: "04",
    label: "Швидкість відповіді",
    target: "90%+",
    range: "за 1 годину",
    desc: "Відповіді на запит про бронювання, повідомлення та запити на побачення помешкання. 24/7 — ні, але ⩽ 60 хв у активний час.",
    you: 96,
    max: 100,
    format: (v: number) => v + "%",
    inverted: false,
  },
];

const BENEFITS = [
  {
    n: "01",
    title: "Виділяємо у пошуку",
    desc: "Бейдж Superhost у картці й окремий фільтр у пошуку. У середньому +47% переглядів.",
  },
  {
    n: "02",
    title: "Бонус ₴3 000 на квартал",
    desc: "Окремо від доходу — як компенсація за стабільність. Кошти приходять на 1-е число місяця.",
  },
  {
    n: "03",
    title: "Підвищений захист",
    desc: "StayHub Cover піднімає ліміт з ₴3.5 млн до ₴8 млн. Окрема страховка від втрати доходу.",
  },
  {
    n: "04",
    title: "Окрема підтримка",
    desc: "Менеджер для Superhost — відповідає за 4 хвилини, а не 12. Допомагає з податками та юридичними питаннями.",
  },
  {
    n: "05",
    title: "Реклама за наш рахунок",
    desc: "Раз на квартал твоє оголошення потрапляє в email-розсилку — 280 000 підписників, які шукають житло.",
  },
  {
    n: "06",
    title: "Знижка 50% на фотозйомку",
    desc: "Професійна зйомка коштує ₴4 800 — для Superhost ₴2 400. Можна замовляти 1 раз на 6 місяців.",
  },
];

const FAQS = [
  {
    q: "Що буде, якщо я не пройду перегляд?",
    a: "Бейдж зникне з оголошень, бонуси припиняться. Усі активні бронювання залишаються, твоя репутація — теж. Знову отримати статус можна вже наступного кварталу.",
  },
  {
    q: "А якщо у мене декілька оголошень?",
    a: "Критерії рахуються на хоста, а не на оголошення — суми всіх поїздок, середнє по всіх оцінках. Бейдж зʼявиться на всіх оголошеннях одночасно.",
  },
  {
    q: "Чи можна отримати, маючи 1 квартиру?",
    a: "Так. Чимало Superhost мають лише одне оголошення — головне стабільність, а не масштаб. Тобі лише потрібно 10 завершених поїздок за рік.",
  },
  {
    q: "Гість залишив 3 з 5 — що тепер?",
    a: "Один низький відгук не критичний — рахується середнє. Зверни увагу на коментар, обговори з менеджером — як виправити, щоб не повторилось.",
  },
  {
    q: "А Superhost+, Elite — щось ще буде?",
    a: "Працюємо над двома рівнями вище — Elite (топ 1%) і Founding (для хостів з нами 5+ років). Запустимо у Q4 2026.",
  },
];

const TIMELINE = [
  { quarter: "2025 Q4", label: "Отримано вперше", state: "done" },
  { quarter: "2026 Q1", label: "Продовжено", state: "done" },
  {
    quarter: "2026 Q2 — зараз",
    label: "Усі критерії виконані",
    state: "active",
  },
  {
    quarter: "2026 Q3 · 01.07",
    label: "Автоматичне продовження",
    state: "future",
  },
];

export default function SuperhostPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-300 mx-auto px-6 py-12 lg:py-20">
          <nav
            className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-widest mb-10"
            style={{ color: "var(--sh-muted)" }}
          >
            <Link
              href="/"
              style={{ color: "var(--sh-muted)" }}
              className="hover:text-(--ink) transition-colors"
            >
              StayHub
            </Link>
            <span>/</span>
            <Link
              href="/host-landing"
              style={{ color: "var(--sh-muted)" }}
              className="hover:text-(--ink) transition-colors"
            >
              Хостинг
            </Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>Superhost</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="font-mono text-[10.5px] uppercase tracking-widest mb-4"
                style={{ color: "var(--sh-muted)" }}
              >
                Програма Superhost · з 2017 року · 178 хостів зараз
              </p>
              <h1
                className="font-serif leading-[1.05] mb-6"
                style={{ fontSize: 48, color: "var(--ink)" }}
              >
                Найкращі хости
                <br />
                StayHub —<br />
                <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                  видно здалеку
                </em>
              </h1>
              <p
                className="text-[15px] mb-8 max-w-125 leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                Superhost — це не нагорода, а контракт. Ти даєш гостям
                стабільність, ми даємо тобі видимість, бонуси й окремого
                менеджера. Перегляд кожні 3 місяці автоматично.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#progress"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--ink)", color: "var(--bg)" }}
                >
                  Подивитись свій прогрес
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="#criteria"
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-accent"
                  style={{ color: "var(--ink-2)" }}
                >
                  Дізнатись критерії
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Medal */}
            <div className="flex items-center justify-center lg:justify-end">
              <div
                className="relative flex items-center justify-center"
                style={{ width: 220, height: 220 }}
              >
                {/* Rings */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "1px solid var(--line)", opacity: 0.6 }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: 20,
                    border: "1px solid var(--line)",
                    opacity: 0.4,
                  }}
                />
                {/* Medal circle */}
                <div
                  className="relative flex flex-col items-center justify-center rounded-full"
                  style={{ width: 140, height: 140, background: "var(--ink)" }}
                >
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent-soft)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest mt-1"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    SUPERHOST
                    <br />
                    2026 / Q2
                  </span>
                </div>
                {/* Flag */}
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <StarFillIcon size={9} className="text-accent" />
                  <span
                    className="font-mono text-[9.5px]"
                    style={{ color: "var(--ink)" }}
                  >
                    Топ-12% хостів
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Strip stats */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-12 rounded-2xl overflow-hidden"
            style={{ background: "var(--line)" }}
          >
            {[
              { val: "178", lbl: "Superhost'ів\nу Європі" },
              { val: "+47%", lbl: "переглядів\nоголошення" },
              { val: "+32%", lbl: "бронювань\nпісля отримання" },
              { val: "₴12K", lbl: "бонусів\nщороку" },
            ].map(({ val, lbl }) => (
              <div
                key={val}
                className="flex flex-col gap-1 p-6"
                style={{ background: "var(--surface)" }}
              >
                <span
                  className="font-serif leading-none"
                  style={{ fontSize: 34, color: "var(--ink)" }}
                >
                  {val}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest whitespace-pre-line"
                  style={{ color: "var(--sh-muted)" }}
                >
                  {lbl}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRITERIA ─────────────────────────────────────────── */}
      <section
        id="criteria"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
            <div>
              <p
                className="font-mono text-[10.5px] uppercase tracking-widest mb-2"
                style={{ color: "var(--sh-muted)" }}
              >
                Як отримати · 04 критерії · перегляд щоквартально
              </p>
              <h2
                className="font-serif leading-tight"
                style={{ fontSize: 34, color: "var(--ink)" }}
              >
                Чотири числа,
                <br />
                <em style={{ fontStyle: "italic" }}>які мають значення</em>
              </h2>
            </div>
            <div className="flex items-end gap-2">
              <span
                className="font-serif leading-none"
                style={{ fontSize: 48, color: "var(--ink)" }}
              >
                ⩾ 4
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-widest pb-1"
                style={{ color: "var(--sh-muted)" }}
              >
                всі чотири
                <br />
                одночасно
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CRITERIA.map((c) => {
              const ratio = c.inverted
                ? Math.max(0, 1 - c.you / c.max)
                : Math.min(1, c.you / c.max);
              const targetPos = c.inverted ? 1 : 0.8;

              return (
                <article
                  key={c.n}
                  className="flex flex-col gap-4 p-7 rounded-2xl border"
                  style={{
                    borderColor: "var(--line)",
                    background: "var(--surface)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-serif text-[38px] leading-none"
                      style={{ color: "var(--line)" }}
                    >
                      {c.n}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: "var(--sh-muted)" }}
                    >
                      {c.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="font-serif leading-none"
                        style={{ fontSize: 38, color: "var(--ink)" }}
                      >
                        {c.target}
                      </span>
                      <span
                        className="text-[13px]"
                        style={{ color: "var(--sh-muted)" }}
                      >
                        {c.range}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {c.desc}
                  </p>

                  {/* Progress bar */}
                  <div>
                    <div
                      className="relative h-2 rounded-full overflow-hidden mb-2"
                      style={{ background: "var(--bg-alt)" }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all"
                        style={{
                          width: `${ratio * 100}%`,
                          background: "var(--accent)",
                        }}
                      />
                      {/* Target marker */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                        style={{
                          left: `${targetPos * 100}%`,
                          background: "var(--ink)",
                          opacity: 0.3,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span style={{ color: "var(--ink-2)" }}>
                        Твоє:{" "}
                        <strong style={{ color: "var(--ink)" }}>
                          {c.format(c.you)}
                        </strong>
                      </span>
                      <span style={{ color: "var(--sh-muted)" }}>
                        Ціль: {c.target}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROGRESS DASHBOARD ───────────────────────────────── */}
      <section
        id="progress"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-24">
          <div className="mb-10">
            <p
              className="font-mono text-[10.5px] uppercase tracking-widest mb-2"
              style={{ color: "var(--sh-muted)" }}
            >
              Особистий прогрес · Q2 2026 · до перегляду 41 день
            </p>
            <h2
              className="font-serif leading-tight"
              style={{ fontSize: 34, color: "var(--ink)" }}
            >
              Ти зараз — на
              <br />
              <em style={{ fontStyle: "italic" }}>4-й позиції з 4</em>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border"
            style={{ borderColor: "var(--line)" }}
          >
            {/* Left */}
            <div
              className="p-8 flex flex-col gap-6"
              style={{ background: "var(--bg)" }}
            >
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium mb-4"
                  style={{
                    background: "var(--ink)",
                    color: "var(--accent-soft)",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Superhost підтверджено
                </span>
                <h3
                  className="font-serif text-[24px] leading-tight mb-3"
                  style={{ color: "var(--ink)" }}
                >
                  Ти отримаєш статус наступного циклу
                </h3>
                <p
                  className="text-[13.5px] leading-relaxed"
                  style={{ color: "var(--ink-2)" }}
                >
                  За поточними показниками — Superhost буде продовжено на Q3
                  2026 (1 липня – 30 вересня). Жодних дій від тебе не потрібно.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {CRITERIA.map((c) => (
                  <div
                    key={c.n}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                    style={{
                      background: "oklch(0.92 0.05 145 / 0.3)",
                      border: "1px solid oklch(0.80 0.06 145)",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="oklch(0.35 0.10 150)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span
                      className="text-[12.5px]"
                      style={{ color: "var(--ink-2)" }}
                    >
                      {c.label}:{" "}
                      <strong style={{ color: "var(--ink)" }}>
                        {c.format(c.you)}
                      </strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div
              className="p-8 flex flex-col gap-8"
              style={{
                background: "var(--surface)",
                borderLeft: "1px solid var(--line)",
              }}
            >
              <div className="text-center py-4">
                <p
                  className="font-serif leading-none mb-2"
                  style={{ fontSize: 52, color: "var(--ink)" }}
                >
                  04 / 04
                </p>
                <p
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--sh-muted)" }}
                >
                  критеріїв виконано
                </p>
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-4">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                      <div
                        className="w-3 h-3 rounded-full border-2 shrink-0"
                        style={
                          t.state === "active"
                            ? {
                                background: "var(--accent)",
                                borderColor: "var(--accent)",
                              }
                            : t.state === "done"
                              ? {
                                  background: "var(--ink)",
                                  borderColor: "var(--ink)",
                                }
                              : {
                                  background: "transparent",
                                  borderColor: "var(--line)",
                                }
                        }
                      />
                      {i < TIMELINE.length - 1 && (
                        <div
                          className="w-px flex-1 min-h-5"
                          style={{ background: "var(--line)" }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="font-mono text-[10px] uppercase tracking-widest mb-0.5"
                        style={{ color: "var(--sh-muted)" }}
                      >
                        {t.quarter}
                      </p>
                      <p
                        className="text-[13.5px] font-medium"
                        style={{
                          color:
                            t.state === "future"
                              ? "var(--sh-muted)"
                              : "var(--ink)",
                        }}
                      >
                        {t.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section style={{ background: "var(--ink)" }}>
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-24">
          <div className="mb-12">
            <p
              className="font-mono text-[10.5px] uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Що отримуєш · 06 переваг
            </p>
            <h2
              className="font-serif leading-tight"
              style={{ fontSize: 34, color: "#fff" }}
            >
              Окрема ліга,
              <br />
              <em style={{ fontStyle: "italic" }}>окремі правила</em>
            </h2>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {BENEFITS.map((b) => (
              <article
                key={b.n}
                className="flex flex-col gap-3 p-8"
                style={{ background: "var(--ink)" }}
              >
                <span
                  className="font-mono text-[11px]"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {b.n}
                </span>
                <h4
                  className="font-serif text-[20px] leading-tight"
                  style={{ color: "#fff" }}
                >
                  {b.title}
                </h4>
                <p
                  className="text-[13.5px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {b.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-16">
            <div>
              <p
                className="font-mono text-[10.5px] uppercase tracking-widest mb-2"
                style={{ color: "var(--sh-muted)" }}
              >
                Часті питання
              </p>
              <h2
                className="font-serif leading-tight mb-4"
                style={{ fontSize: 34, color: "var(--ink)" }}
              >
                Якщо ти ще
                <br />
                <em style={{ fontStyle: "italic" }}>не Superhost</em>
              </h2>
              <p
                className="text-[14px] leading-relaxed mb-6"
                style={{ color: "var(--ink-2)" }}
              >
                Більшість хостів отримує статус через 6–9 місяців активної
                роботи. Не поспішай — головне стабільність, а не пробіги.
              </p>
              <Link
                href="/host-landing"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-accent"
                style={{ color: "var(--ink-2)" }}
              >
                Стати хостом
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border px-5 py-4"
                  style={{
                    borderColor: "var(--line)",
                    background: "var(--bg)",
                  }}
                >
                  <summary className="flex items-center gap-4 cursor-pointer list-none">
                    <span
                      className="font-mono text-[10.5px] shrink-0"
                      style={{ color: "var(--sh-muted)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex-1 text-[14px] font-medium"
                      style={{ color: "var(--ink)" }}
                    >
                      {f.q}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 transition-transform group-open:rotate-45"
                      style={{ color: "var(--sh-muted)" }}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p
                    className="mt-3 text-[13.5px] leading-relaxed pl-9"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
