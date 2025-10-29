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
  const news = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!news) {
    return { title: "News – CrossField" };
  }
  return {
    title: `${news.title} – CrossField`,
  };
}

export default async function NewsDetailPage({ params }: Params) {
  const news = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!news || !news.published) {
    notFound();
  }

  return (
    <article className="container-grid space-y-8 py-12">
      <div className="space-y-3">
        <span className="badge-soft">CrossField News</span>
        <h1 className="text-4xl font-semibold text-slate-900">{news.title}</h1>
        <div className="text-sm text-slate-500">
          {format(new Date(news.publishedAt), "MMMM d, yyyy")}
        </div>
      </div>
      <MarkdownRenderer content={news.body} />
    </article>
  );
}
