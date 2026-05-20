import { db } from "@/lib/db";
import { UsersClient } from "@/components/admin/UsersClient";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isBlocked: true,
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

      <UsersClient initialUsers={users} />
    </div>
  );
}
