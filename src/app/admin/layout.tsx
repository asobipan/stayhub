import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F6F3" }}>
      <AdminSidebarNav />
      <main className="flex-1 min-w-0 p-6 lg:p-10">{children}</main>
    </div>
  );
}
