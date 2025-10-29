import { formatDistanceToNow } from "date-fns";
import { CollaborationRecord, CollaborationStatus } from "@/lib/collaboration-constants";
import { TypeBadge } from "./type-badge";

export type CollaborationCardProps = {
  collaboration: Pick<
    CollaborationRecord,
    "id" | "title" | "type" | "organization" | "description" | "link" | "createdAt" | "status"
  >;
  showStatus?: boolean;
};

export function CollaborationCard({ collaboration, showStatus }: CollaborationCardProps) {
  const { title, type, organization, description, link, createdAt, status } = collaboration;
  return (
    <article className="card space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TypeBadge type={type} />
          {showStatus && (
            <span
              className={`badge ${statusBadgeStyles(status)}`}
            >
              {status}
            </span>
          )}
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        {organization && <p className="text-sm font-medium text-slate-500">{organization}</p>}
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-500"
        >
          Visit link ↗
        </a>
      )}
    </article>
  );
}

function statusBadgeStyles(status: CollaborationStatus) {
  if (status === "APPROVED") {
    return "bg-emerald-50 text-emerald-600";
  }
  if (status === "REJECTED") {
    return "bg-rose-50 text-rose-600";
  }
  return "bg-amber-50 text-amber-600";
}
