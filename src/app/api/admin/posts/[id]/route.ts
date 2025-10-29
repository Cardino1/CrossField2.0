import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { Prisma } from "@prisma/client";

const schema = z.object({
  title: z.string().min(3).max(160).optional(),
  slug: z.string().max(160).optional(),
  excerpt: z.string().max(300).optional().nullable(),
  body: z.string().min(10).optional(),
  imageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const values = schema.parse(body);
    const data: any = {};
    if (values.title) data.title = values.title;
    if (values.body) data.body = values.body;
    if (values.excerpt !== undefined) data.excerpt = values.excerpt ?? null;
    if (values.imageUrl !== undefined) data.imageUrl = values.imageUrl ?? null;
    if (values.tags !== undefined) data.tags = values.tags;
    if (values.published !== undefined) data.published = values.published;
    if (values.slug || values.title) {
      const baseTitle = values.title ?? (await prisma.post.findUniqueOrThrow({ where: { id: params.id } })).title;
      data.slug = slugify(values.slug ?? baseTitle);
    }
    const post = await prisma.post.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Slug already exists. Choose another." }, { status: 409 });
    }
    return NextResponse.json({ message: "Unable to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "deleted" });
}
