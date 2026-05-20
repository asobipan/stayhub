import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[color-mix(in_oklab,var(--background)_70%,transparent)]">
      <div className="max-w-[1320px] mx-auto px-8 pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-[1.2fr_2fr] gap-16 pb-12 border-b border-[color-mix(in_oklab,var(--background)_10%,transparent)]">
          <div>
            <p className="font-serif italic text-[32px] text-[var(--background)] mb-3">StayHub</p>
            <p className="text-[13px] leading-[1.7] max-w-[360px]">
              Простір, де відпочинок зустрічає характер.<br />
              Понад 580 помешкань у 8 країнах Європи.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: "Підтримка",
                links: ["Центр допомоги", "Правила скасування", "Безпека гостей", "Контакти"],
              },
              {
                title: "Хостинг",
                links: ["Розмістити житло", "Хост-гарантія", "Ресурси для хостів", "Форум спільноти"],
              },
              {
                title: "Про нас",
                links: ["Команда", "Кар'єра", "Журнал", "Преса"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h5 className="font-mono-sh text-[11px] text-[var(--background)] uppercase tracking-[0.1em] mb-4">
                  {title}
                </h5>
                {links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="block py-1.5 text-[13px] transition-colors hover:text-[var(--sh-accent)]"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex items-center justify-between gap-6 text-[12px]">
          <span>© 2026 StayHub · Київ</span>
          <div className="flex gap-5">
            {["Конфіденційність", "Умови", "Карта сайту"].map((t) => (
              <Link key={t} href="#" className="hover:text-[var(--sh-accent)] transition-colors">
                {t}
              </Link>
            ))}
          </div>
          <span className="font-mono-sh text-[11px] tracking-[0.06em]">
            Українська · UAH ₴
          </span>
        </div>
      </div>
    </footer>
  );
}
