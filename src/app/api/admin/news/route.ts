import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { Prisma } from "@prisma/client";

const schema = z.object({
  title: z.string().min(3).max(160),
  summary: z.string().max(300).optional().nullable(),
  body: z.string().min(10),
  publishedAt: z.string().optional(),
  published: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const values = schema.parse(body);
    const slug = slugify(values.title);
    const news = await prisma.news.create({
      data: {
        title: values.title,
        slug,
        summary: values.summary ?? null,
        body: values.body,
        publishedAt: values.publishedAt ? new Date(values.publishedAt) : new Date(),
        published: values.published ?? true,
      },
    });
    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Slug already exists. Choose another." }, { status: 409 });
    }
    return NextResponse.json({ message: "Unable to save" }, { status: 500 });
  }
}
