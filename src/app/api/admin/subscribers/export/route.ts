import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const header = "email,created_at";
  const rows = subscribers.map((subscriber) => `${subscriber.email},${subscriber.createdAt.toISOString()}`);
  const csv = [header, ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="crossfield-subscribers.csv"`,
    },
  });
}
