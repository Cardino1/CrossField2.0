import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) {
    return { title: "CrossField" };
  }
  return {
    title: `${post.title} – CrossField`,
  };
}

export default async function PostDetailPage({ params }: Params) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container-grid space-y-8 py-12">
      <div className="space-y-3">
        <span className="badge-soft">CrossField Post</span>
        <h1 className="text-4xl font-semibold text-slate-900">{post.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
          {post.tags.map((tag) => (
            <span key={tag} className="badge-soft">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <MarkdownRenderer content={post.body} />
    </article>
  );
}
