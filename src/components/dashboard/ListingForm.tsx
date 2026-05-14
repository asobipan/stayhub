"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Plus, Check } from "lucide-react";

const AMENITIES = [
  "Wi-Fi", "Кухня", "Парковка", "Кондиціонер", "Опалення",
  "Пральна машина", "Сушарка", "Телевізор", "Балкон", "Басейн",
  "Тренажерний зал", "Ліфт", "Домашні тварини", "Дитяче ліжко", "Сейф",
];

interface ListingFormProps {
  mode: "new" | "edit";
  listingId?: string;
  initial?: {
    title: string;
    description: string;
    address: string;
    city: string;
    country: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    amenities: string[];
    images: string[];
  };
}

const STEPS = ["Основне", "Деталі", "Фото", "Підтвердження"];

export function ListingForm({ mode, listingId, initial }: ListingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    country: initial?.country ?? "",
    price: initial?.price?.toString() ?? "",
    bedrooms: initial?.bedrooms?.toString() ?? "1",
    bathrooms: initial?.bathrooms?.toString() ?? "1",
    maxGuests: initial?.maxGuests?.toString() ?? "2",
    amenities: initial?.amenities ?? [] as string[],
    images: initial?.images ?? [] as string[],
  });

  function set(field: string, value: string | string[]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    } catch {
      toast.error("Помилка завантаження фото");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const url = mode === "new" ? "/api/listings" : `/api/listings/${listingId}`;
      const method = mode === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Помилка збереження");
        return;
      }

      toast.success(mode === "new" ? "Оголошення створено!" : "Оголошення оновлено!");
      router.push("/dashboard/listings");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setSubmitting(false);
    }
  }

  function canAdvance() {
    if (step === 0) return form.title && form.description && form.address && form.city && form.country;
    if (step === 1) return form.price && form.bedrooms && form.bathrooms && form.maxGuests;
    return true;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i < step ? "#059669" : i === step ? "#1E1B4B" : "#E7E5E0",
                  color: i <= step ? "#fff" : "#A8A29E",
                }}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: i === step ? "#1E1B4B" : "#A8A29E" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px"
                style={{ background: i < step ? "#059669" : "#E7E5E0" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Основне */}
      {step === 0 && (
        <div className="space-y-5">
          <Field label="Назва оголошення *" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Напр. Затишна квартира в центрі Львова"
              className={inputCls}
            />
          </Field>
          <Field label="Опис *" required>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Розкажіть про своє помешкання, його переваги та особливості..."
              rows={5}
              className={inputCls}
              style={{ resize: "none" }}
            />
          </Field>
          <Field label="Адреса *" required>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="вул. Шевченка, 10"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Місто *" required>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Львів"
                className={inputCls}
              />
            </Field>
            <Field label="Країна *" required>
              <input
                type="text"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="Україна"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      )}

      {/* Step 1 — Деталі */}
      {step === 1 && (
        <div className="space-y-5">
          <Field label="Ціна за ніч ($) *" required>
            <input
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="50"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Кімнат *" required>
              <NumberInput
                value={form.bedrooms}
                onChange={(v) => set("bedrooms", v)}
                min={1}
                max={20}
              />
            </Field>
            <Field label="Санвузлів *" required>
              <NumberInput
                value={form.bathrooms}
                onChange={(v) => set("bathrooms", v)}
                min={1}
                max={10}
              />
            </Field>
            <Field label="Макс. гостей *" required>
              <NumberInput
                value={form.maxGuests}
                onChange={(v) => set("maxGuests", v)}
                min={1}
                max={50}
              />
            </Field>
          </div>
          <Field label="Зручності">
            <div className="flex flex-wrap gap-2 mt-1">
              {AMENITIES.map((a) => {
                const selected = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: selected ? "#1E1B4B" : "#F5F4F0",
                      color: selected ? "#fff" : "#44403C",
                      border: selected ? "1px solid #1E1B4B" : "1px solid #E7E5E0",
                    }}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      )}

      {/* Step 2 — Фото */}
      {step === 2 && (
        <div className="space-y-5">
          <Field label="Фото помешкання">
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-indigo-400"
              style={{ borderColor: "#E7E5E0" }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: "#A8A29E" }} />
              <p className="text-sm font-medium" style={{ color: "#44403C" }}>
                {uploading ? "Завантаження..." : "Натисніть або перетягніть фото"}
              </p>
              <p className="text-xs mt-1" style={{ color: "#A8A29E" }}>
                PNG, JPG до 5 МБ
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                  e.target.value = "";
                }}
              />
            </div>
          </Field>

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {form.images.map((url) => (
                <div key={url} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Підтвердження */}
      {step === 3 && (
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ borderColor: "#E7E5E0", background: "#fff" }}
        >
          <h3 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}>
            Перевірте дані
          </h3>
          <Summary label="Назва" value={form.title} />
          <Summary label="Адреса" value={`${form.address}, ${form.city}, ${form.country}`} />
          <Summary label="Ціна" value={`$${form.price} / ніч`} />
          <Summary label="Кімнат" value={form.bedrooms} />
          <Summary label="Санвузлів" value={form.bathrooms} />
          <Summary label="Макс. гостей" value={form.maxGuests} />
          <Summary label="Зручності" value={form.amenities.join(", ") || "—"} />
          <Summary label="Фото" value={`${form.images.length} фото`} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors"
          style={{
            borderColor: step === 0 ? "#E7E5E0" : "#1E1B4B",
            color: step === 0 ? "#A8A29E" : "#1E1B4B",
            cursor: step === 0 ? "not-allowed" : "pointer",
          }}
        >
          Назад
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: canAdvance() ? "#1E1B4B" : "#E7E5E0",
              color: canAdvance() ? "#fff" : "#A8A29E",
              cursor: canAdvance() ? "pointer" : "not-allowed",
            }}
          >
            Далі
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: submitting ? "#312E81cc" : "#1E1B4B",
              color: "#fff",
            }}
          >
            {submitting ? "Збереження..." : mode === "new" ? "Опублікувати" : "Зберегти зміни"}
          </button>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all border focus:border-indigo-800 focus:shadow-[0_0_0_3px_rgba(49,46,129,0.08)]";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#44403C" }}>
        {label}
        {required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, max }: { value: string; onChange: (v: string) => void; min: number; max: number }) {
  const num = parseInt(value) || min;
  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2" style={{ borderColor: "#E7E5E0" }}>
      <button
        type="button"
        onClick={() => onChange(String(Math.max(min, num - 1)))}
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-[#F5F4F0]"
        style={{ color: "#44403C" }}
      >
        −
      </button>
      <span className="flex-1 text-center text-sm font-semibold" style={{ color: "#1C1917" }}>
        {num}
      </span>
      <button
        type="button"
        onClick={() => onChange(String(Math.min(max, num + 1)))}
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-[#F5F4F0]"
        style={{ color: "#44403C" }}
      >
        +
      </button>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-2 border-b" style={{ borderColor: "#F7F6F3" }}>
      <span className="text-sm" style={{ color: "#78716C" }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: "#1C1917" }}>{value}</span>
    </div>
  );
}
