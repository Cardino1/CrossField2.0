"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { GetUpdatesModal } from "./get-updates-modal";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/news", label: "News" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="container-grid">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
            CrossField
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700"
            >
              Get Updates
            </button>
          </div>
          <button
            className="rounded-full border border-slate-200 p-2 text-slate-600 md:hidden"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label="Open navigation"
          >
            {drawerOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
      <div
        className={clsx(
          "md:hidden transition-all duration-300",
          drawerOpen ? "max-h-96 border-t border-slate-200 bg-white" : "max-h-0 overflow-hidden"
        )}
      >
        <div className="container-grid flex flex-col gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(true);
              setDrawerOpen(false);
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Get Updates
          </button>
        </div>
      </div>
      <GetUpdatesModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
