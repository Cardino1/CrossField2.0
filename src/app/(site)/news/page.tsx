import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/news-card";
import { EmptyState } from "@/components/empty-state";
import { FiRss } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function NewsIndexPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-grid space-y-8 py-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-slate-900">CrossField News</h1>
        <p className="text-lg text-slate-600">
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
          <div className="col-span-full">
            <EmptyState
              icon={<FiRss className="h-12 w-12 text-slate-400" />}
              title="No news yet"
              description="Stay tuned for stories, launches, and noteworthy updates from the CrossField collective."
            />
          </div>
        )}
      </div>
    </div>
  );
}
