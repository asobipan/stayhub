"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function ListingToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !active }),
      });
      if (!res.ok) throw new Error();
      setActive((v) => !v);
      toast.success(active ? "Оголошення приховано" : "Оголошення активовано");
    } catch {
      toast.error("Помилка оновлення");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? "rgba(16,185,129,0.1)" : "rgba(168,162,158,0.12)",
        color: active ? "#059669" : "#78716C",
      }}
    >
      {active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {active ? "Активне" : "Приховане"}
    </button>
  );
}
