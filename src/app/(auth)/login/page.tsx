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
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

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
      const result = await registerUser(
        registerData.name,
        registerData.email,
        registerData.password
      );
      if (!result.success) {
        toast.error(result.error);
        return;
      }
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
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #312E81 40%, #1E1B4B 100%)",
        }}
      >
        {/* Geometric decorations */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(217,119,6,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 45%)
            `,
          }}
        />

        {/* Large circle */}
        <div
          className="absolute -right-24 top-1/4 w-96 h-96 rounded-full"
          style={{
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        />
        <div
          className="absolute -right-16 top-1/4 w-72 h-72 rounded-full"
          style={{
            border: "1px solid rgba(245,158,11,0.1)",
            transform: "translate(10%, 10%)",
          }}
        />

        {/* Bottom-left decoration */}
        <div
          className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full"
          style={{
            border: "1px solid rgba(245,158,11,0.12)",
          }}
        />

        {/* Thin diagonal line */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 80px, rgba(245,158,11,0.03) 80px, rgba(245,158,11,0.03) 81px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-8 xl:p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.9)" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1E1B4B">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span
              className="text-white text-xl font-semibold tracking-wide"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}
            >
              StayHub
            </span>
          </div>

          {/* Main text */}
          <div>
            <div
              className="mb-3 text-xs uppercase tracking-widest"
              style={{ color: "rgba(245,158,11,0.8)", letterSpacing: "0.18em" }}
            >
              Ласкаво просимо
            </div>
            <h1
              className="text-4xl xl:text-5xl font-semibold leading-tight mb-4 text-white"
              style={{ fontFamily: "var(--font-heading)", lineHeight: 1.15 }}
            >
              Знайди своє
              <br />
              <em style={{ color: "#F59E0B", fontStyle: "italic" }}>ідеальне</em>
              <br />
              місце
            </h1>
            <p
              className="text-base max-w-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}
            >
              Тисячі унікальних помешкань по всьому світу. Від затишних апартаментів
              до розкішних вілл — оберіть ідеальне місце для відпочинку.
            </p>
          </div>

          {/* Bottom stats */}
          <div className="flex gap-10">
            {[
              { number: "12K+", label: "Оголошень" },
              { number: "94%", label: "Задоволених" },
              { number: "80+", label: "Міст" },
            ].map(({ number, label }) => (
              <div key={label}>
                <div
                  className="text-2xl font-bold text-white mb-0.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {number}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-6 py-4 sm:px-10"
        style={{ background: "#FAFAF8" }}
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-5">
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{ background: "#D97706" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1E1B4B">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
          >
            StayHub
          </span>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <div className="mb-5">
            <h2
              className="text-2xl font-semibold mb-1"
              style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
            >
              {tab === "login" ? "Вітаємо знову" : "Приєднатись"}
            </h2>
            <p className="text-sm" style={{ color: "#78716C" }}>
              {tab === "login"
                ? "Введіть дані облікового запису"
                : "Створіть безкоштовний акаунт"}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex mb-4 rounded-md p-0.5"
            style={{ background: "#EEEDE8" }}
          >
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 text-sm font-medium rounded transition-all duration-200"
                style={{
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#1E1B4B" : "#78716C",
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {t === "login" ? "Увійти" : "Зареєструватись"}
              </button>
            ))}
          </div>

          {/* Login form */}
          {tab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <Field
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(v) => setLoginData((d) => ({ ...d, email: v }))}
                placeholder="your@email.com"
              />
              <Field
                label="Пароль"
                type="password"
                value={loginData.password}
                onChange={(v) => setLoginData((d) => ({ ...d, password: v }))}
                placeholder="••••••••"
              />
              <SubmitButton loading={isPending}>Увійти</SubmitButton>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <Field
                label="Ім'я"
                type="text"
                value={registerData.name}
                onChange={(v) => setRegisterData((d) => ({ ...d, name: v }))}
                placeholder="Ваше ім'я"
              />
              <Field
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(v) => setRegisterData((d) => ({ ...d, email: v }))}
                placeholder="your@email.com"
              />
              <Field
                label="Пароль"
                type="password"
                value={registerData.password}
                onChange={(v) => setRegisterData((d) => ({ ...d, password: v }))}
                placeholder="Мін. 8 символів"
              />
              <Field
                label="Підтвердіть пароль"
                type="password"
                value={registerData.confirm}
                onChange={(v) => setRegisterData((d) => ({ ...d, confirm: v }))}
                placeholder="Повторіть пароль"
              />
              <SubmitButton loading={isPending}>Зареєструватись</SubmitButton>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{ background: "#E7E5E0" }} />
            <span className="text-xs" style={{ color: "#A8A29E" }}>
              або
            </span>
            <div className="flex-1 h-px" style={{ background: "#E7E5E0" }} />
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGooglePending}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium border transition-all duration-150"
            style={{
              background: "#fff",
              borderColor: "#E7E5E0",
              color: "#1C1917",
              opacity: isGooglePending ? 0.7 : 1,
            }}
          >
            <GoogleIcon />
            {isGooglePending ? "Перенаправлення..." : "Продовжити через Google"}
          </button>

          <p className="text-xs text-center mt-6" style={{ color: "#A8A29E" }}>
            Продовжуючи, ви погоджуєтесь з{" "}
            <span className="underline cursor-pointer" style={{ color: "#78716C" }}>
              умовами використання
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "#44403C" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-3.5 py-2.5 rounded-md text-sm outline-none transition-all duration-150"
        style={{
          background: "#fff",
          border: "1px solid #E7E5E0",
          color: "#1C1917",
          fontFamily: "var(--font-sans)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#312E81";
          e.target.style.boxShadow = "0 0 0 3px rgba(49,46,129,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E7E5E0";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function SubmitButton({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-150 mt-1"
      style={{
        background: loading ? "#312E81cc" : "#1E1B4B",
        color: "#fff",
        letterSpacing: "0.01em",
        cursor: loading ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!loading) (e.target as HTMLButtonElement).style.background = "#312E81";
      }}
      onMouseLeave={(e) => {
        if (!loading) (e.target as HTMLButtonElement).style.background = "#1E1B4B";
      }}
    >
      {loading ? "Будь ласка, зачекайте..." : children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
