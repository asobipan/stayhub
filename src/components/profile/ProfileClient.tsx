"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldIcon, StarFillIcon, CalIcon } from "@/components/ui/icons";

type UserRole = "GUEST" | "HOST" | "ADMIN";

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  bookingCount: number;
  reviewCount: number;
}

const ROLE_LABEL: Record<UserRole, string> = {
  GUEST: "Гість",
  HOST: "Хост",
  ADMIN: "Адмін",
};

const MONTHS_UK = ["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру"];
function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS_UK[d.getMonth()]} ${d.getFullYear()}`;
}

function Avatar({ name, image, size = 96 }: { name?: string | null; image?: string | null; size?: number }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (image) {
    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0 border-4"
        style={{ width: size, height: size, borderColor: "var(--surface)" }}
      >
        <Image src={image} alt={name ?? "Avatar"} width={size} height={size} style={{ objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 border-4"
      style={{
        width: size,
        height: size,
        background: "var(--accent)",
        color: "var(--accent-ink)",
        borderColor: "var(--surface)",
        fontSize: size * 0.35,
        fontFamily: "var(--font-heading)",
      }}
    >
      {initials}
    </div>
  );
}

export function ProfileClient({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [name, setName]   = useState(profile.name ?? "");
  const [bio, setBio]     = useState(profile.bio ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  function markDirty() { if (!dirty) setDirty(true); }

  async function save() {
    if (!name.trim()) { toast.error("Ім'я не може бути порожнім"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, phone }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Помилка збереження");
        return;
      }
      toast.success("Профіль оновлено");
      setDirty(false);
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Hero banner ───────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "var(--ink)",
          height: 220,
        }}
      >
        {/* Decorative grain texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Accent orb */}
        <div
          className="absolute -bottom-16 -right-16 rounded-full opacity-20"
          style={{ width: 260, height: 260, background: "var(--accent)" }}
        />

        <div className="sh-container relative flex items-end h-full pb-0">
          <div className="flex items-end gap-5 translate-y-12">
            <Avatar name={profile.name} image={profile.image} size={96} />
            <div className="pb-2" style={{ color: "var(--accent-ink)" }}>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-1">
                {ROLE_LABEL[profile.role]} · з {fmtDate(profile.createdAt)}
              </p>
              <h1
                className="font-serif leading-tight"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--accent-ink)" }}
              >
                {profile.name ?? "Без імені"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="sh-container pt-20 pb-20">
        <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 340px" }}>

          {/* Left: edit form */}
          <div className="flex flex-col gap-6">

            {/* Section: особисті дані */}
            <section
              className="rounded-2xl border p-6 flex flex-col gap-5"
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--sh-muted)" }}>
                    01 · Особисті дані
                  </p>
                  <h2 className="font-serif text-[20px]" style={{ color: "var(--ink)" }}>
                    Редагування профілю
                  </h2>
                </div>
                {dirty && (
                  <span
                    className="font-mono text-[10px] px-2.5 py-1 rounded-full"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    Незбережені зміни
                  </span>
                )}
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {/* Name */}
                <div className="flex flex-col gap-1.5" style={{ gridColumn: "1 / -1" }}>
                  <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>
                    Повне ім'я *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); markDirty(); }}
                    placeholder="Як вас звати?"
                    className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-colors"
                    style={{ background: "var(--bg-alt)", borderColor: "var(--line)", color: "var(--ink)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                  />
                </div>

                {/* Email (readonly) */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>
                    Email
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-xl border px-4 py-3 text-[14px]"
                    style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink-2)" }}
                  >
                    <span>{profile.email}</span>
                    <span className="ml-auto flex-shrink-0" style={{ color: "var(--sh-muted)" }}><ShieldIcon size={12} /></span>
                  </div>
                  <p className="text-[10.5px]" style={{ color: "var(--sh-muted)" }}>Email не можна змінити</p>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); markDirty(); }}
                    placeholder="+380..."
                    className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-colors"
                    style={{ background: "var(--bg-alt)", borderColor: "var(--line)", color: "var(--ink)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>
                  Про себе
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => { setBio(e.target.value); markDirty(); }}
                  rows={4}
                  maxLength={500}
                  placeholder="Розкажіть трохи про себе — хостам і подорожанам цікаво знати, хто до них їде..."
                  className="w-full rounded-xl border px-4 py-3 text-[14px] leading-relaxed resize-none outline-none transition-colors"
                  style={{ background: "var(--bg-alt)", borderColor: "var(--line)", color: "var(--ink)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                />
                <p className="text-right font-mono text-[10px]" style={{ color: "var(--sh-muted)" }}>
                  {bio.length}/500
                </p>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={save}
                  disabled={loading || !dirty}
                  className="sh-btn sh-btn-primary px-7"
                  style={{ opacity: loading || !dirty ? 0.5 : 1 }}
                >
                  {loading ? "Зберігаю..." : "Зберегти зміни"}
                </button>
              </div>
            </section>

          </div>

          {/* Right: stats + info */}
          <div className="flex flex-col gap-4">

            {/* Stats card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              <div
                className="px-5 py-4 border-b flex items-center gap-2"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
                  Статистика
                </span>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {[
                  { icon: <CalIcon size={14} />, val: profile.bookingCount, lbl: "Поїздок" },
                  { icon: <StarFillIcon size={14} className="text-[var(--accent)]" />, val: profile.reviewCount, lbl: "Відгуків" },
                ].map(({ icon, val, lbl }) => (
                  <div
                    key={lbl}
                    className="flex flex-col gap-1 px-5 py-4 border-r last:border-r-0"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <div style={{ color: "var(--ink-2)" }}>{icon}</div>
                    <span className="font-serif text-3xl leading-none" style={{ color: "var(--ink)" }}>{val}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Role card */}
            <div
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--sh-muted)" }}>
                Роль та доступ
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--accent-soft)" }}
                >
                  <span style={{ color: "var(--accent)" }}><ShieldIcon size={16} /></span>
                </div>
                <div>
                  <p className="font-medium text-[14px]" style={{ color: "var(--ink)" }}>{ROLE_LABEL[profile.role]}</p>
                  <p className="text-[12px]" style={{ color: "var(--sh-muted)" }}>
                    {profile.role === "GUEST" && "Може бронювати помешкання"}
                    {profile.role === "HOST"  && "Може публікувати помешкання"}
                    {profile.role === "ADMIN" && "Повний доступ до платформи"}
                  </p>
                </div>
              </div>
            </div>

            {/* Member since */}
            <div
              className="rounded-2xl border px-5 py-4 flex items-center gap-3"
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg-alt)" }}
              >
                <span className="font-mono text-[10px]" style={{ color: "var(--sh-muted)" }}>SH</span>
              </div>
              <div>
                <p className="text-[12px]" style={{ color: "var(--sh-muted)" }}>Учасник з</p>
                <p className="font-serif text-[15px]" style={{ color: "var(--ink)" }}>{fmtDate(profile.createdAt)}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
