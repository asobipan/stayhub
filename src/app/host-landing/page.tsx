import Link from "next/link";
import { StarFillIcon } from "@/components/ui/icons";
import { IncomeCalculator } from "@/components/host-landing/IncomeCalculator";

const STEPS = [
  {
    n: "01",
    title: "Розкажи про простір",
    time: "3 хв",
    desc: "Кілька фото, кімнати, спальні місця, зручності. Якщо немає хороших фото — наш фотограф приїде безкоштовно.",
  },
  {
    n: "02",
    title: "Підкажемо ціну",
    time: "1 хв",
    desc: "Наш алгоритм проаналізує 12 000 оголошень у твоєму районі й запропонує оптимальну ціну за ніч і знижки на тижні.",
  },
  {
    n: "03",
    title: "Перевіримо разом",
    time: "до 2 год",
    desc: "Команда модерації перевіряє оголошення за 2 години у будні. Підкажемо, що покращити в описі чи фото.",
  },
  {
    n: "04",
    title: "Прийми перших гостей",
    time: "≈ 6 днів",
    desc: "Після публікації перші бронювання приходять у середньому через 6 днів. Календар гнучкості — у тебе.",
  },
];

const BENEFITS = [
  {
    n: "01",
    title: "Захист на ₴3.5 млн",
    desc: "StayHub Cover покриває збитки від гостя — від плями на килимі до пошкодженої техніки. Без папірців і черг.",
  },
  {
    n: "02",
    title: "Динамічні ціни",
    desc: "Алгоритм щодня переглядає ціну з огляду на сезон, події в місті й попит. Можеш вимкнути будь-коли.",
  },
  {
    n: "03",
    title: "Виплати за 24 год",
    desc: "Кошти на картку через 24 години після заїзду гостя. SEPA, Visa Direct, Mastercard Send — всі основні.",
  },
  {
    n: "04",
    title: "Підтримка українською",
    desc: "Жива людина в чаті відповідає за 12 хв. Допоможемо з податковою декларацією, ФОПом, перевіркою гостей.",
  },
];

const STORIES = [
  {
    name: "Анна, Київ",
    since: "Хост з 2021",
    earn: "₴48 000",
    item: "1 лофт у центрі",
    quote:
      "Спочатку здавала тільки на вихідні. За пів року побачила, що будні заповнюються легше — змінила стратегію.",
    hue: 155,
  },
  {
    name: "Тарас, Карпати",
    since: "Хост з 2020",
    earn: "₴126 000",
    item: "2 будиночки",
    quote:
      "Перший дім купляли як «для себе». Зараз у мене два — і обидва закривають іпотеку, та ще й залишається на третій.",
    hue: 200,
  },
  {
    name: "Marija, Будва",
    since: "Хост з 2019",
    earn: "₴312 000",
    item: "1 вілла з басейном",
    quote:
      "Літо — нон-стоп, листопад–лютий — закрита для ремонту. Динамічна ціна сама піднімає тариф на серпневі тижні.",
    hue: 45,
  },
];

const FAQS = [
  {
    q: "Скільки коштує реєстрація і публікація?",
    a: "Реєстрація і публікація оголошень — безкоштовні. Ми беремо 12% з вартості бронювання, плюс гість сплачує сервісний збір 3%. Без прихованих платежів.",
  },
  {
    q: "Чи можна вимкнути оголошення тимчасово?",
    a: "Так — у будь-який момент в один клік. Вже підтверджені бронювання залишаються активними, нових прийматись не буде.",
  },
  {
    q: "Хто несе відповідальність за пошкодження?",
    a: "StayHub Cover покриває до ₴3.5 млн за інцидент. Гість залишає депозит, який автоматично списується у разі підтвердженого пошкодження.",
  },
  {
    q: "Потрібно ставати ФОПом?",
    a: "Якщо плануєш дохід більше ₴300 000/рік — рекомендуємо ФОП 2-ї групи (5% єдиного). Наша команда юристів допомагає з оформленням.",
  },
  {
    q: "Як перевіряєте гостей?",
    a: "Усі гості проходять верифікацію документа і телефону. Ти бачиш рейтинг і відгуки гостя від інших хостів. Можеш вимагати додаткову перевірку.",
  },
];

export default function HostLandingPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
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
            <span style={{ color: "var(--ink)" }}>Стати хостом</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="font-mono text-[10.5px] uppercase tracking-widest mb-4"
                style={{ color: "var(--accent)" }}
              >
                Для орендодавців · Реєстрація за 8 хв · 0% комісії за публікацію
              </p>
              <h1
                className="font-serif leading-[1.05] mb-6"
                style={{ fontSize: 48, color: "var(--ink)" }}
              >
                Перетвори
                <br />
                порожні стіни на
                <br />
                <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                  стабільний дохід
                </em>
              </h1>
              <p
                className="text-[15px] mb-8 max-w-115 leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                Понад 580 хостів у Європі вже працюють зі StayHub. Допоможемо з
                фотозйомкою, описом і ціноутворенням. Платіж від гостя — на
                твоїй картці протягом 24 годин після заїзду.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/dashboard/listings/new"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--ink)", color: "var(--bg)" }}
                >
                  Створити перше оголошення
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
                </Link>
                <a
                  href="#calc"
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-accent"
                  style={{ color: "var(--ink-2)" }}
                >
                  Розрахувати дохід
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
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarFillIcon key={i} size={13} className="text-accent" />
                  ))}
                </div>
                <span
                  className="text-[13px]"
                  style={{ color: "var(--sh-muted)" }}
                >
                  4.91 — середня оцінка хоста · спільнота з 1 400+ хостів
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="col-span-2 p-6 rounded-2xl"
                style={{ background: "var(--ink)" }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Середній дохід хоста
                </p>
                <p
                  className="font-serif leading-none mb-1"
                  style={{ fontSize: 40, color: "#fff" }}
                >
                  ₴52 800
                </p>
                <p
                  className="text-[12px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  / міс · 2-кімнатна, Київ, центр
                </p>
              </div>
              <div
                className="p-5 rounded-2xl"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2 opacity-70">
                  Найвищий дохід
                </p>
                <p
                  className="font-serif leading-none mb-1"
                  style={{ fontSize: 32 }}
                >
                  ₴284K
                </p>
                <p className="text-[11px] opacity-60">Пентхаус, Барселона</p>
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div
                  className="p-4 rounded-2xl border"
                  style={{
                    borderColor: "var(--line)",
                    background: "var(--surface)",
                  }}
                >
                  <p
                    className="font-serif leading-none mb-1"
                    style={{ fontSize: 28, color: "var(--ink)" }}
                  >
                    8 хв
                  </p>
                  <p
                    className="text-[11.5px]"
                    style={{ color: "var(--sh-muted)" }}
                  >
                    створити
                    <br />
                    оголошення
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl border"
                  style={{
                    borderColor: "var(--line)",
                    background: "var(--surface)",
                  }}
                >
                  <p
                    className="font-serif leading-none mb-1"
                    style={{ fontSize: 28, color: "var(--ink)" }}
                  >
                    24 год
                  </p>
                  <p
                    className="text-[11.5px]"
                    style={{ color: "var(--sh-muted)" }}
                  >
                    до виплати
                    <br />
                    після заїзду
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IncomeCalculator />

      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--line)",
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
                Як це працює · 04 кроки · ~8 хв
              </p>
              <h2
                className="font-serif leading-tight"
                style={{ fontSize: 34, color: "var(--ink)" }}
              >
                Від ідеї до
                <br />
                <em style={{ fontStyle: "italic" }}>першого гостя</em>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="flex flex-col p-6 rounded-2xl border"
                style={{ borderColor: "var(--line)", background: "var(--bg)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="font-serif text-[42px] leading-none"
                    style={{ color: "var(--line)" }}
                  >
                    {s.n}
                  </span>
                  <span
                    className="font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    {s.time}
                  </span>
                </div>
                <h4
                  className="font-serif text-[19px] leading-tight mb-3"
                  style={{ color: "var(--ink)" }}
                >
                  {s.title}
                </h4>
                <p
                  className="text-[13.5px] leading-relaxed"
                  style={{ color: "var(--ink-2)" }}
                >
                  {s.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "var(--ink)" }}>
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-20">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {BENEFITS.map((b) => (
              <div
                key={b.n}
                className="p-8"
                style={{ background: "var(--ink)" }}
              >
                <span
                  className="font-mono text-[11px] mb-4 block"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {b.n}
                </span>
                <h4
                  className="font-serif text-[20px] leading-tight mb-3"
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
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}
      >
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-24">
          <div className="mb-12">
            <p
              className="font-mono text-[10.5px] uppercase tracking-widest mb-2"
              style={{ color: "var(--sh-muted)" }}
            >
              Хости говорять · 03 з 1 400+
            </p>
            <h2
              className="font-serif leading-tight"
              style={{ fontSize: 34, color: "var(--ink)" }}
            >
              Реальні цифри.
              <br />
              <em style={{ fontStyle: "italic" }}>Реальні люди.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {STORIES.map((s) => (
              <article
                key={s.name}
                className="flex flex-col rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--surface)",
                }}
              >
                <div
                  className="h-40"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.52 0.10 ${s.hue}) 0%, oklch(0.38 0.08 ${s.hue + 20}) 100%)`,
                  }}
                />
                <div className="flex flex-col gap-4 p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className="font-serif text-[18px] leading-tight"
                        style={{ color: "var(--ink)" }}
                      >
                        {s.name}
                      </h4>
                      <p
                        className="font-mono text-[10.5px] mt-0.5"
                        style={{ color: "var(--sh-muted)" }}
                      >
                        {s.since} · {s.item}
                      </p>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium shrink-0"
                      style={{
                        background: "var(--ink)",
                        color: "var(--accent-soft)",
                      }}
                    >
                      Superhost
                    </span>
                  </div>
                  <blockquote
                    className="text-[14px] leading-relaxed italic flex-1"
                    style={{ color: "var(--ink-2)" }}
                  >
                    «{s.quote}»
                  </blockquote>
                  <div
                    className="pt-4"
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: "var(--sh-muted)" }}
                    >
                      Дохід / міс
                    </p>
                    <p
                      className="font-serif text-[28px] leading-none"
                      style={{ color: "var(--ink)" }}
                    >
                      {s.earn}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
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
                Що ще хочеться
                <br />
                <em style={{ fontStyle: "italic" }}>знати?</em>
              </h2>
              <p
                className="text-[14px] leading-relaxed mb-6"
                style={{ color: "var(--ink-2)" }}
              >
                Не знайшов відповіді? Напиши нам у чаті — менеджер для хостів
                відповідає за 12 хв.
              </p>
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
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}
      >
        <div className="max-w-300 mx-auto px-6 py-16 lg:py-20">
          <div
            className="rounded-3xl p-10 lg:p-14 overflow-hidden relative"
            style={{ background: "var(--ink)" }}
          >
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background: "oklch(0.62 0.14 45 / 0.12)",
                transform: "translate(30%, -30%)",
                filter: "blur(60px)",
              }}
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p
                  className="font-mono text-[10.5px] uppercase tracking-widest mb-4"
                  style={{ color: "var(--accent)" }}
                >
                  Залишилось 1 крок
                </p>
                <h2
                  className="font-serif leading-[1.05] mb-4"
                  style={{ fontSize: 38, color: "#fff" }}
                >
                  Готовий прийняти
                  <br />
                  <em style={{ fontStyle: "italic" }}>першого гостя</em>?
                </h2>
                <p
                  className="text-[14px] mb-8"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Створення оголошення безкоштовне і займає 8 хвилин. Виплати —
                  за 24 години після заїзду.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/listings/new"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-90"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    Створити оголошення
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
                  </Link>
                  <Link
                    href="/superhost"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-medium transition-colors"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Дізнатись про Superhost
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { val: "1 412", lbl: "активних\nхостів" },
                  { val: "96%", lbl: "залишаються\nпісля 1-го року" },
                  { val: "12 хв", lbl: "відповідь\nпідтримки" },
                ].map(({ val, lbl }) => (
                  <div key={val} className="text-center">
                    <p
                      className="font-serif leading-none mb-2"
                      style={{ fontSize: 32, color: "#fff" }}
                    >
                      {val}
                    </p>
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest whitespace-pre-line"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {lbl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
