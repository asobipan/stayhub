import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <AdminSidebarNav />
      <main className="flex-1 min-w-0 p-8 lg:p-12">{children}</main>
    </div>
  );
}
