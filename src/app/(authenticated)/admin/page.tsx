import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [collaborations, posts, news, subscribers] = await Promise.all([
    prisma.collaboration.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.news.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <AdminDashboard
      collaborations={collaborations.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))}
      posts={posts.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))}
      news={news.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        publishedAt: item.publishedAt.toISOString(),
      }))}
      subscribers={subscribers.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
