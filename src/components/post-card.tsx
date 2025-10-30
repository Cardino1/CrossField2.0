import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { FiArrowRight } from "react-icons/fi";

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
    <Link href={`/posts/${slug}`}>
      <article className="card overflow-hidden group">
        {imageUrl ? (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              className="object-cover" 
            />
          </div>
        ) : (
          <div className="relative h-48 w-full bg-slate-100" />
        )}
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">
              {format(new Date(createdAt), "MMM d, yyyy")}
            </span>
            {tags?.length > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge-soft text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-950">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                {excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-950">
            Read more <FiArrowRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}
