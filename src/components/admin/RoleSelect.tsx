"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  USER:  { bg: "rgba(168,162,158,0.12)", color: "#78716C" },
  ADMIN: { bg: "rgba(245,158,11,0.12)", color: "#D97706" },
};

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [isLoading, setIsLoading] = useState(false);

  async function handleChange(newRole: string) {
    if (newRole === role) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        toast.error("Помилка зміни ролі");
        return;
      }
      setRole(newRole);
      toast.success("Роль оновлено");
      router.refresh();
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setIsLoading(false);
    }
  }

  const style = ROLE_STYLES[role] ?? ROLE_STYLES.USER;

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isLoading}
      className="text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer transition-all"
      style={{ background: style.bg, color: style.color }}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
