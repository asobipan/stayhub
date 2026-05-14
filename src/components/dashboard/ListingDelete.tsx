"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ListingDelete({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Видалити оголошення? Цю дію не можна скасувати.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Оголошення видалено");
      router.refresh();
    } catch {
      toast.error("Помилка видалення");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-md transition-colors hover:bg-red-50"
      title="Видалити"
      style={{ color: "#DC2626" }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
