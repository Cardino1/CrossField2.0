import Link from "next/link";
import { format } from "date-fns";
import { FiArrowRight } from "react-icons/fi";

export type NewsCardProps = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  publishedAt: string | Date;
};

export function NewsCard({ title, slug, summary, publishedAt }: NewsCardProps) {
  return (
    <Link href={`/news/${slug}`}>
      <article className="card space-y-4 p-5 group">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </span>
          <span className="badge-muted">News</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-950">
            {title}
          </h3>
          {summary && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-950">
          Read more <FiArrowRight className="h-4 w-4" />
        </div>
      </article>
    </Link>
  );
}
