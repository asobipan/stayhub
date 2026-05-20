"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GridIcon, AptIcon, VillaIcon, LoftIcon,
  CabinIcon, StudioIcon, PentIcon, BoutiqueIcon, SlidersIcon,
} from "@/components/ui/icons";

const CATEGORIES = [
  { id: "all",       label: "Всі",          icon: <GridIcon /> },
  { id: "apartment", label: "Апартаменти",  icon: <AptIcon /> },
  { id: "villa",     label: "Вілли",        icon: <VillaIcon /> },
  { id: "loft",      label: "Лофти",        icon: <LoftIcon /> },
  { id: "cabin",     label: "Будиночки",    icon: <CabinIcon /> },
  { id: "studio",    label: "Студії",       icon: <StudioIcon /> },
  { id: "penthouse", label: "Пентхауси",    icon: <PentIcon /> },
  { id: "boutique",  label: "Бутік-готелі", icon: <BoutiqueIcon /> },
];

export function CategoryTabs() {
  const [active, setActive] = useState("all");

  return (
    <section className="border-t border-b border-[var(--line)] bg-[var(--background)]">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-[14px]">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={c.id === "all" ? "/listings" : `/listings?type=${c.id}`}
              onClick={() => setActive(c.id)}
              className={[
                "flex flex-col items-center gap-1.5 px-4 py-2.5 min-w-[76px] text-[11px] font-medium shrink-0 transition-colors border-b-2",
                active === c.id
                  ? "text-[var(--ink)] border-[var(--ink)] rounded-none"
                  : "text-[var(--sh-muted)] border-transparent rounded-xl hover:text-[var(--ink)]",
              ].join(" ")}
            >
              {c.icon}
              {c.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="ml-auto flex items-center gap-2 px-[18px] py-2.5 border border-[var(--line)] rounded-xl text-[13px] font-medium text-[var(--ink)] no-underline shrink-0 hover:bg-[var(--bg-alt)] transition-colors"
          >
            <SlidersIcon size={14} />
            Фільтри
          </Link>
        </div>
      </div>
    </section>
  );
}
