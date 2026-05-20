"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PendingListing {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  bedrooms: number;
  maxGuests: number;
  createdAt: Date;
  host: { name: string | null; email: string | null };
}

export function ModerationQueue({ listings }: { listings: PendingListing[] }) {
  const router = useRouter();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function moderate(id: string, action: "approve" | "reject", rejectReason?: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: rejectReason }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Помилка");
        return;
      }
      toast.success(action === "approve" ? "Оголошення схвалено" : "Оголошення відхилено");
      setRejectId(null);
      setReason("");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {listings.map((l) => (
          <div
            key={l.id}
            className="rounded-2xl border p-5 flex items-center gap-5"
            style={{ borderColor: "var(--line)", background: "var(--surface)" }}
          >
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/listings/${l.id}`}
                  target="_blank"
                  className="font-medium text-[15px] truncate transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--ink)" }}
                >
                  {l.title}
                </Link>
              </div>
              <p className="text-[13px] mb-2" style={{ color: "var(--ink-2)" }}>
                {l.city}, {l.country} · ${l.price}/ніч · {l.bedrooms} спальн. · до {l.maxGuests} гостей
              </p>
              <p className="font-mono text-[11px]" style={{ color: "var(--sh-muted)" }}>
                {l.host.name} · {l.host.email} · {new Date(l.createdAt).toLocaleDateString("uk-UA")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => moderate(l.id, "approve")}
                disabled={loading === l.id}
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={{ background: "oklch(0.94 0.06 145)", color: "oklch(0.3 0.12 145)" }}
              >
                {loading === l.id ? "..." : "Схвалити"}
              </button>
              <button
                onClick={() => { setRejectId(l.id); setReason(""); }}
                disabled={loading === l.id}
                className="px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={{ background: "oklch(0.95 0.05 20)", color: "oklch(0.45 0.15 20)" }}
              >
                Відхилити
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRejectId(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--surface)" }}
          >
            <h3 className="font-serif text-[20px]" style={{ color: "var(--ink)" }}>Причина відхилення</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Опишіть, чому оголошення відхиляється..."
              className="w-full rounded-xl border px-4 py-3 text-[14px] resize-none outline-none"
              style={{ background: "var(--bg-alt)", borderColor: "var(--line)", color: "var(--ink)" }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectId(null)}
                className="px-4 py-2 rounded-xl text-[13px]"
                style={{ color: "var(--ink-2)" }}
              >
                Скасувати
              </button>
              <button
                onClick={() => moderate(rejectId, "reject", reason)}
                disabled={!reason.trim() || loading === rejectId}
                className="px-5 py-2 rounded-xl text-[13px] font-medium transition-opacity"
                style={{
                  background: "oklch(0.95 0.05 20)",
                  color: "oklch(0.45 0.15 20)",
                  opacity: !reason.trim() ? 0.5 : 1,
                }}
              >
                {loading === rejectId ? "..." : "Відхилити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
