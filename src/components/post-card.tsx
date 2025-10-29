import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export type PostCardProps = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  tags: string[];
  createdAt: string | Date;
};

export function PostCard({ title, slug, excerpt, imageUrl, tags, createdAt }: PostCardProps) {
  return (
    <article className="card overflow-hidden">
      {imageUrl ? (
        <div className="relative h-52 w-full">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      ) : null}
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
          <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
          {tags?.map((tag) => (
            <span key={tag} className="badge-soft">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/posts/${slug}`} className="block space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          {excerpt && <p className="text-sm text-slate-600">{excerpt}</p>}
        </Link>
      </div>
    </article>
  );
}
