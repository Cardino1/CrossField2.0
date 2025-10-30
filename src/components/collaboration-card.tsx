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
    <article className="card space-y-4 p-5 group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TypeBadge type={type} />
          {showStatus && (
            <span className={`badge ${statusBadgeStyles(status)}`}>
              {status}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        {organization && (
          <p className="text-sm text-slate-600">{organization}</p>
        )}
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-950 hover:text-slate-700 transition-colors"
        >
          Visit link <FiExternalLink className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}

function statusBadgeStyles(status: CollaborationStatus) {
  if (status === "APPROVED") {
    return "bg-slate-100 text-slate-600";
  }
  if (status === "REJECTED") {
    return "bg-slate-100 text-slate-600";
  }
  return "bg-slate-100 text-slate-600";
}
