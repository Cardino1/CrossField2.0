import Link from "next/link";
import { CollaborationFilters } from "@/components/collaboration-filters";
import { CollaborationCard } from "@/components/collaboration-card";
import { Paginator } from "@/components/paginator";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { CollaborationStatus, CollaborationType } from "@prisma/client";

const PAGE_SIZE = 6;

export const dynamic = "force-dynamic";

export default async function CollaborationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page ?? "1") || 1;
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const typeFilters = typeof searchParams.type === "string" ? searchParams.type.split(",").filter(Boolean) : [];
  const adminSession = await getAdminSession();
  const statusParam = typeof searchParams.status === "string" ? searchParams.status : undefined;

  const where: any = {};
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  if (typeFilters.length > 0) {
    where.type = { in: typeFilters as CollaborationType[] };
  }
  if (adminSession) {
    if (statusParam) {
      where.status = statusParam as CollaborationStatus;
    }
  } else {
    where.status = "APPROVED";
  }

  const [total, items] = await Promise.all([
    prisma.collaboration.count({ where }),
    prisma.collaboration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <div className="container-grid space-y-10 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Collaborations</h1>
          <p className="text-sm text-slate-500">Curated requests ready for co-builders, researchers, and founders.</p>
        </div>
        <Link
          href="/collaborations/new"
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500"
        >
          Publish a Collaboration
        </Link>
      </div>

      <CollaborationFilters />

      {adminSession && (
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Status filter:</span>
          {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => {
            const active = statusParam === status;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (typeFilters.length > 0) params.set("type", typeFilters.join(","));
            if (active) {
              params.delete("status");
            } else {
              params.set("status", status);
            }
            params.set("page", "1");
            return (
              <Link
                key={status}
                href={`/collaborations?${params.toString()}`}
                className={`rounded-full px-3 py-1 ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((collaboration) => (
          <CollaborationCard
            key={collaboration.id}
            collaboration={{
              ...collaboration,
              createdAt: collaboration.createdAt,
              updatedAt: collaboration.updatedAt,
            }}
            showStatus={Boolean(adminSession)}
          />
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-500">
            No collaborations found with the current filters.
          </div>
        )}
      </div>

      <Paginator page={page} pageSize={PAGE_SIZE} total={total} />
    </div>
  );
}
