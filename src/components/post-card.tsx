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
      <article className="card overflow-hidden group animate-slide-up">
        {imageUrl ? (
          <div className="relative h-52 w-full overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-brand-50 via-blue-50 to-cyan-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-brand-200/30 blur-2xl" />
            </div>
          </div>
        )}
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {format(new Date(createdAt), "MMM d, yyyy")}
            </span>
            {tags?.length > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <div className="flex flex-wrap gap-2">
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
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-200">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                {excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:gap-3 transition-all duration-200">
            Read more <FiArrowRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}
