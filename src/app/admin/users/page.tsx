import Image from "next/image";
import { db } from "@/lib/db";
import { RoleSelect } from "@/components/admin/RoleSelect";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true, listings: true } },
    },
  });

  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--sh-muted)" }}>
        Адміністрування · користувачі
      </p>
      <h1 className="font-serif text-[28px] leading-tight mb-8" style={{ color: "var(--ink)" }}>
        Користувачі
        <span className="ml-3 font-serif text-lg" style={{ color: "var(--sh-muted)", fontStyle: "normal" }}>
          {users.length}
        </span>
      </h1>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              {["Користувач", "Роль", "Бронювань", "Оголошень", "Зареєстрований"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--sh-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-[var(--bg-alt)]"
                style={{ borderBottom: i < users.length - 1 ? "1px solid var(--line)" : "none" }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? ""}
                        width={32}
                        height={32}
                        className="rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{ background: "var(--ink)", color: "var(--bg)" }}
                      >
                        {user.name?.[0] ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                        {user.name ?? "—"}
                      </p>
                      <p className="font-mono text-[10.5px]" style={{ color: "var(--sh-muted)" }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <RoleSelect userId={user.id} currentRole={user.role} />
                </td>
                <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                  {user._count.bookings}
                </td>
                <td className="px-5 py-4 font-mono text-sm" style={{ color: "var(--ink-2)" }}>
                  {user._count.listings}
                </td>
                <td className="px-5 py-4 font-mono text-[11px]" style={{ color: "var(--sh-muted)" }}>
                  {new Date(user.createdAt).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
