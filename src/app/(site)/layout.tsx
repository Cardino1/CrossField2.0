import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white/80">
        <div className="container-grid py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} CrossField. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
