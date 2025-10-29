import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12">
      <div className="card w-full max-w-md space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">CrossField Admin</h1>
          <p className="text-sm text-slate-500">Sign in with the admin credentials.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
