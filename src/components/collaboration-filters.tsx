"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import clsx from "clsx";
import { CollaborationType } from "@prisma/client";

const typeOptions: { value: CollaborationType; label: string }[] = [
  { value: "RESEARCH", label: "Research" },
  { value: "OPEN_SOURCE_PROJECT", label: "Open Source Project" },
  { value: "STARTUP_COFOUNDER", label: "Startup Co-Founder" },
];

export function CollaborationFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const activeTypes = new Set((params.get("type") ?? "").split(",").filter(Boolean));

  const updateQuery = (newParams: Record<string, string | null>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        query.delete(key);
      } else {
        query.set(key, value);
      }
    });
    router.push(`/collaborations?${query.toString()}`);
  };

  const toggleType = (type: CollaborationType) => {
    const values = new Set(activeTypes);
    if (values.has(type)) {
      values.delete(type);
    } else {
      values.add(type);
    }
    updateQuery({ type: Array.from(values).join(",") || null, page: "1" });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery({ q: search || null, page: "1" });
  };

  return (
    <div className="card space-y-6 p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search collaborations
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Search
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {typeOptions.map((option) => {
          const isActive = activeTypes.has(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggleType(option.value)}
              className={clsx(
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
                isActive
                  ? "border-brand-500 bg-brand-50 text-brand-600"
                  : "border-slate-200 bg-white text-slate-500 hover:border-brand-200"
              )}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
