"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { GetUpdatesModal } from "./get-updates-modal";
import clsx from "clsx";

const navItems = [
  { href: "/collaborations", label: "Collaborations" },
  { href: "/news", label: "News" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="container-grid">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-slate-950">
              CrossField
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center md:flex">
            <button
              onClick={() => setOpen(true)}
              className="btn-primary"
            >
              Get Updates
            </button>
          </div>
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
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
        <div className="container-grid flex flex-col gap-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
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
            className="btn-primary mt-2"
          >
            Get Updates
          </button>
        </div>
      </div>
      <GetUpdatesModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
