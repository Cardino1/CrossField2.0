"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Paginator({ page, pageSize, total }: { page: number; pageSize: number; total: number }) {
  const params = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const createLink = (newPage: number) => {
    const query = new URLSearchParams(params.toString());
    query.set("page", String(newPage));
    return `?${query.toString()}`;
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Link
          href={createLink(Math.max(1, page - 1))}
          className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-100"
          aria-disabled={page === 1}
        >
          Previous
        </Link>
        <Link
          href={createLink(Math.min(totalPages, page + 1))}
          className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-100"
          aria-disabled={page === totalPages}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
