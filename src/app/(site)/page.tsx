import { Hero } from "@/components/hero";
import { PostCard } from "@/components/post-card";
import { NewsCard } from "@/components/news-card";
import { EmptyState } from "@/components/empty-state";
import { prisma } from "@/lib/prisma";
import { FiFileText, FiRss } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, news] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-16 pb-16">
      <Hero />
      <section className="container-grid grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              imageUrl={post.imageUrl}
              tags={post.tags}
              createdAt={post.createdAt.toISOString()}
            />
          ))}
          {posts.length === 0 && (
            <EmptyState
              icon={<FiFileText className="h-12 w-12 text-slate-400" />}
              title="No posts yet"
              description="Check back soon for curated content and insights."
            />
          )}
        </div>
        <aside className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent News</h2>
          <div className="grid gap-4">
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
              <EmptyState
                icon={<FiRss className="h-8 w-8 text-slate-400" />}
                title="No news yet"
                description="Stay tuned for updates."
              />
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
