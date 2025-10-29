"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AdminTopBar() {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch("/api/admin/logout", { method: "POST" });
    if (res.ok) {
      toast.success("Logged out");
      router.push("/admin/login");
    } else {
      toast.error("Unable to log out");
    }
  };

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-grid flex items-center justify-between py-4">
        <span className="text-sm font-medium text-slate-500">Logged in as Admin</span>
        <button
          onClick={logout}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-100"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
