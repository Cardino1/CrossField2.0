import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { prisma } from "@/lib/prisma";

type CollaborationRecord = Awaited<
  ReturnType<typeof prisma.collaboration.findMany>
>[number];
type PostRecord = Awaited<ReturnType<typeof prisma.post.findMany>>[number];
type NewsRecord = Awaited<ReturnType<typeof prisma.news.findMany>>[number];
type SubscriberRecord = Awaited<
  ReturnType<typeof prisma.subscriber.findMany>
>[number];

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const collaborations = await prisma.collaboration.findMany({
    orderBy: { createdAt: "desc" },
  });
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
  });
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminDashboard
      collaborations={collaborations.map((item: CollaborationRecord) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))}
      posts={posts.map((item: PostRecord) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))}
      news={news.map((item: NewsRecord) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        publishedAt: item.publishedAt.toISOString(),
      }))}
      subscribers={subscribers.map((item: SubscriberRecord) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
