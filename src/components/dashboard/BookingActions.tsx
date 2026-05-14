"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState<"confirm" | "cancel" | null>(null);
  const router = useRouter();

  async function updateStatus(status: "CONFIRMED" | "CANCELLED") {
    setLoading(status === "CONFIRMED" ? "confirm" : "cancel");
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(status === "CONFIRMED" ? "Бронювання підтверджено" : "Бронювання скасовано");
      router.refresh();
    } catch {
      toast.error("Помилка оновлення");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateStatus("CONFIRMED")}
        disabled={loading !== null}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
        style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
      >
        <Check className="w-3 h-3" />
        {loading === "confirm" ? "..." : "Підтвердити"}
      </button>
      <button
        onClick={() => updateStatus("CANCELLED")}
        disabled={loading !== null}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
        style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626" }}
      >
        <X className="w-3 h-3" />
        {loading === "cancel" ? "..." : "Відхилити"}
      </button>
    </div>
  );
}
