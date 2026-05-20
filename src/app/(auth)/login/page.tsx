"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/auth";

type Tab = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirm: "" });

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Невірний email або пароль");
      } else {
        window.location.href = "/";
      }
    });
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (registerData.password !== registerData.confirm) {
      toast.error("Паролі не співпадають");
      return;
    }
    startTransition(async () => {
      const result = await registerUser(registerData.name, registerData.email, registerData.password);
      if (!result.success) { toast.error(result.error); return; }
      const res = await signIn("credentials", {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Помилка входу після реєстрації");
      } else {
        window.location.href = "/";
      }
    });
  }

  async function handleGoogleSignIn() {
    setIsGooglePending(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex" style={{ background: "var(--bg)" }}>

      {/* ── Left decorative panel ─────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden"
        style={{ background: "var(--ink)" }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(var(--sh-accent) 1px, transparent 1px), linear-gradient(90deg, var(--sh-accent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* Accent orbs */}
        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full opacity-[0.15]"
          style={{ background: "radial-gradient(circle, var(--sh-accent) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-80px] left-[20%] w-[280px] h-[280px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, var(--sh-accent) 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--sh-accent)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z"
                  fill="var(--ink)" />
                <circle cx="12" cy="10" r="2" fill="var(--sh-accent)" />
              </svg>
            </span>
            <span className="font-serif text-[22px] italic" style={{ color: "var(--bg)" }}>
              StayHub
            </span>
          </div>

          {/* Main text */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-7 h-px" style={{ background: "var(--sh-accent)" }} />
              <span className="font-mono-sh text-[10px] uppercase tracking-widest" style={{ color: "oklch(0.65 0.06 85)" }}>
                Ласкаво просимо
              </span>
            </div>
            <h1
              className="font-serif leading-[1.05] tracking-[-0.02em] mb-5"
              style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)", color: "var(--bg)" }}
            >
              Знайди своє
              <br /><em className="italic" style={{ color: "var(--sh-accent)" }}>ідеальне</em>
              <br />місце
            </h1>
            <p className="text-[14.5px] leading-relaxed max-w-[320px]" style={{ color: "oklch(0.65 0.02 120)" }}>
              Тисячі унікальних помешкань по всьому світу — від затишних апартаментів до розкішних вілл.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[
              { num: "580+", lbl: "Помешкань" },
              { num: "4.91", lbl: "Середня оцінка" },
              { num: "8",    lbl: "Країн" },
            ].map(({ num, lbl }) => (
              <div key={lbl}>
                <div className="font-serif text-[28px] leading-none mb-1" style={{ color: "var(--sh-accent)" }}>{num}</div>
                <div className="font-mono-sh text-[10px] uppercase tracking-wider" style={{ color: "oklch(0.55 0.02 120)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-6 py-8 sm:px-10"
        style={{ background: "var(--surface)" }}
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-7">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--ink)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z" fill="var(--bg)" />
              <circle cx="12" cy="10" r="2" fill="var(--sh-accent)" />
            </svg>
          </span>
          <span className="font-serif text-[20px] italic" style={{ color: "var(--ink)" }}>StayHub</span>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <div className="mb-6">
            <p className="font-mono-sh text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
              {tab === "login" ? "01 · Вхід" : "01 · Реєстрація"}
            </p>
            <h2 className="font-serif text-[28px] leading-tight" style={{ color: "var(--ink)" }}>
              {tab === "login" ? "Вітаємо знову" : "Приєднатись"}
            </h2>
            <p className="text-[13.5px] mt-1" style={{ color: "var(--ink-2)" }}>
              {tab === "login" ? "Введіть дані облікового запису" : "Створіть безкоштовний акаунт"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-5 rounded-xl p-0.5 gap-0.5" style={{ background: "var(--bg-alt)" }}>
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-[13px] font-medium rounded-lg transition-all"
                style={{
                  background: tab === t ? "var(--surface)" : "transparent",
                  color: tab === t ? "var(--ink)" : "var(--sh-muted)",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t === "login" ? "Увійти" : "Зареєструватись"}
              </button>
            ))}
          </div>

          {/* Login form */}
          {tab === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
              <Field label="Email" type="email" value={loginData.email}
                onChange={(v) => setLoginData((d) => ({ ...d, email: v }))} placeholder="your@email.com" />
              <Field label="Пароль" type="password" value={loginData.password}
                onChange={(v) => setLoginData((d) => ({ ...d, password: v }))} placeholder="••••••••" />
              <SubmitBtn loading={isPending}>Увійти</SubmitBtn>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
              <Field label="Ім'я" type="text" value={registerData.name}
                onChange={(v) => setRegisterData((d) => ({ ...d, name: v }))} placeholder="Ваше ім'я" />
              <Field label="Email" type="email" value={registerData.email}
                onChange={(v) => setRegisterData((d) => ({ ...d, email: v }))} placeholder="your@email.com" />
              <Field label="Пароль" type="password" value={registerData.password}
                onChange={(v) => setRegisterData((d) => ({ ...d, password: v }))} placeholder="Мін. 8 символів" />
              <Field label="Підтвердіть пароль" type="password" value={registerData.confirm}
                onChange={(v) => setRegisterData((d) => ({ ...d, confirm: v }))} placeholder="Повторіть пароль" />
              <SubmitBtn loading={isPending}>Зареєструватись</SubmitBtn>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
            <span className="font-mono-sh text-[10px] uppercase tracking-wider" style={{ color: "var(--sh-muted)" }}>або</span>
            <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGooglePending}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-[13.5px] font-medium border transition-all"
            style={{
              background: "var(--bg)",
              borderColor: "var(--line)",
              color: "var(--ink)",
              opacity: isGooglePending ? 0.7 : 1,
            }}
          >
            <GoogleIcon />
            {isGooglePending ? "Перенаправлення..." : "Продовжити через Google"}
          </button>

          <p className="text-[11px] text-center mt-5" style={{ color: "var(--sh-muted)" }}>
            Продовжуючи, ви погоджуєтесь з{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--ink-2)" }}>умовами використання</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-mono-sh text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "var(--sh-muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-colors"
        style={{ background: "var(--bg-alt)", borderColor: "var(--line)", color: "var(--ink)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sh-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
      />
    </div>
  );
}

function SubmitBtn({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl text-[14px] font-semibold mt-1 transition-opacity"
      style={{
        background: "var(--ink)",
        color: "var(--bg)",
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Зачекайте..." : children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
