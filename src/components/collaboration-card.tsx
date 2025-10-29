import { formatDistanceToNow } from "date-fns";
import { Collaboration, CollaborationStatus } from "@prisma/client";
import { TypeBadge } from "./type-badge";
import { FiExternalLink } from "react-icons/fi";

export type CollaborationCardProps = {
  collaboration: Pick<Collaboration, "id" | "title" | "type" | "organization" | "description" | "link" | "createdAt" | "status">;
  showStatus?: boolean;
};

export function CollaborationCard({ collaboration, showStatus }: CollaborationCardProps) {
  const { title, type, organization, description, link, createdAt, status } = collaboration;
  return (
    <article className="card space-y-4 p-6 group animate-slide-up">
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
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-200">{title}</h3>
        {organization && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <p className="text-sm font-medium text-slate-600">{organization}</p>
          </div>
        )}
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-all duration-200 hover:text-brand-700 hover:gap-3"
        >
          Visit link <FiExternalLink className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}

function statusBadgeStyles(status: CollaborationStatus) {
  if (status === "APPROVED") {
    return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 ring-1 ring-emerald-200/50";
  }
  if (status === "REJECTED") {
    return "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 ring-1 ring-rose-200/50";
  }
  return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 ring-1 ring-amber-200/50";
}
