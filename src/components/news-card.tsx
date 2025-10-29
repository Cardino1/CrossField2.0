import Link from "next/link";
import { format } from "date-fns";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

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
      <article className="card space-y-4 p-6 group animate-slide-up">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <FiCalendar className="h-3.5 w-3.5" />
            <span>{format(new Date(publishedAt), "MMM d, yyyy")}</span>
          </div>
          <span className="badge-muted">News</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-200">
            {title}
          </h3>
          {summary && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:gap-3 transition-all duration-200">
          Read more <FiArrowRight className="h-4 w-4" />
        </div>
      </article>
    </Link>
  );
}
