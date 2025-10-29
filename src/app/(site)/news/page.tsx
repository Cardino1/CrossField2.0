import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/news-card";

export const dynamic = "force-dynamic";

export default async function NewsIndexPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-grid space-y-8 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">CrossField News</h1>
        <p className="text-sm text-slate-500">
          Stories, launches, and noteworthy drops from the CrossField collective.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            slug={item.slug}
            summary={item.summary}
            publishedAt={item.publishedAt.toISOString()}
          />
        ))}
        {news.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-500">
            No news yet. Stay tuned.
          </div>
        )}
      </div>
    </div>
  );
}
