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
    <div className="anim-fade-up">
      <p className="section-eyebrow mb-2">Адміністрування</p>
      <h1
        className="text-3xl font-semibold mb-10"
        style={{ fontFamily: "var(--font-heading)", color: "#1E1B4B" }}
      >
        Користувачі
        <span className="ml-3 text-lg font-normal" style={{ color: "#A8A29E" }}>
          {users.length}
        </span>
      </h1>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "#E7E5E0", background: "#fff", boxShadow: "0 2px 16px rgba(30,27,75,0.06)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #F0EDE6", background: "#FAFAF8" }}>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#78716C" }}>
                Користувач
              </th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#78716C" }}>
                Роль
              </th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "#78716C" }}>
                Бронювань
              </th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "#78716C" }}>
                Оголошень
              </th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: "#78716C" }}>
                Зареєстрований
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                style={{ borderBottom: i < users.length - 1 ? "1px solid #F0EDE6" : "none" }}
                className="hover:bg-[#FAFAF8] transition-colors"
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
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                        style={{ background: "#312E81" }}
                      >
                        {user.name?.[0] ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium" style={{ color: "#1C1917" }}>{user.name ?? "—"}</p>
                      <p className="text-xs" style={{ color: "#A8A29E" }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <RoleSelect userId={user.id} currentRole={user.role} />
                </td>
                <td className="px-5 py-4 hidden md:table-cell" style={{ color: "#44403C" }}>
                  {user._count.bookings}
                </td>
                <td className="px-5 py-4 hidden md:table-cell" style={{ color: "#44403C" }}>
                  {user._count.listings}
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-xs" style={{ color: "#78716C" }}>
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
