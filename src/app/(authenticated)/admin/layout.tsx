import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminTopBar } from "@/components/admin/admin-top-bar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminTopBar />
      <main>{children}</main>
    </div>
  );
}
