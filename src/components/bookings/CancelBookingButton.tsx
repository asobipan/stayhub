"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Скасувати бронювання?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Помилка скасування");
        return;
      }
      toast.success("Бронювання скасовано");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors"
      style={{ borderColor: "#E7E5E0", color: "#78716C" }}
    >
      {isLoading ? "..." : "Скасувати"}
    </button>
  );
}
