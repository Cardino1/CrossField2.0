import Link from "next/link";
import { format } from "date-fns";

export type NewsCardProps = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  publishedAt: string | Date;
};

export function NewsCard({ title, slug, summary, publishedAt }: NewsCardProps) {
  return (
    <article className="card space-y-4 p-6">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-400">
        <span>{format(new Date(publishedAt), "MMM d, yyyy")}</span>
        <span className="badge-muted">News</span>
      </div>
      <Link href={`/news/${slug}`} className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        {summary && <p className="text-sm text-slate-600">{summary}</p>}
      </Link>
    </article>
  );
}
