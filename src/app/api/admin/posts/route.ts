import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { Prisma } from "@prisma/client";

const baseSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().max(160).optional(),
  excerpt: z.string().max(300).optional().nullable(),
  body: z.string().min(10),
  imageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const values = baseSchema.parse({ ...body, tags: body.tags ?? [] });
    const slug = values.slug ? slugify(values.slug) : slugify(values.title);
    const post = await prisma.post.create({
      data: {
        title: values.title,
        slug,
        excerpt: values.excerpt ?? null,
        body: values.body,
        imageUrl: values.imageUrl ?? null,
        tags: values.tags ?? [],
        published: values.published ?? true,
      },
    });
    return NextResponse.json(post, { status: 201 });
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
