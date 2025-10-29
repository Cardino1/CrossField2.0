import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import {
  COLLABORATION_STATUSES,
  COLLABORATION_TYPES,
  CollaborationStatus,
  CollaborationType,
} from "@/lib/collaboration-constants";

const createSchema = z.object({
  type: z.enum(COLLABORATION_TYPES),
  title: z.string().min(3).max(120),
  fullName: z.string().min(2).max(120),
  organization: z.string().max(120).optional(),
  description: z.string().min(30).max(2000),
  link: z.string().url().optional(),
});

const pageSize = 6;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1") || 1;
  const query = url.searchParams.get("q") ?? "";
  const typeQuery = url.searchParams.get("type") ?? "";
  const statusQuery = url.searchParams.get("status") ?? undefined;
  const types = typeQuery.split(",").filter(Boolean) as CollaborationType[];
  const session = await getAdminSession();

  const where: any = {};
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  if (types.length) {
    where.type = { in: types };
  }
  if (session) {
    if (statusQuery && COLLABORATION_STATUSES.includes(statusQuery as CollaborationStatus)) {
      where.status = statusQuery as CollaborationStatus;
    }
  } else {
    where.status = "APPROVED";
  }

  const [total, data] = await Promise.all([
    prisma.collaboration.count({ where }),
    prisma.collaboration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    pageSize,
    data,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = createSchema.parse(body);
    const collaboration = await prisma.collaboration.create({
      data: {
        ...values,
        organization: values.organization ?? null,
        link: values.link ?? null,
        status: "PENDING",
      },
    });
    return NextResponse.json(collaboration, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to submit" }, { status: 500 });
  }
}
