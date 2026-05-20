import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "HOST" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <SidebarNav role={session.user.role!} />
      <main className="flex-1 min-w-0 p-8 lg:p-12">{children}</main>
    </div>
  );
}
