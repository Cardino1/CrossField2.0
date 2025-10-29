import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(30).max(2000).optional(),
  organization: z.string().max(120).optional().nullable(),
  link: z.string().url().optional().nullable(),
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
    const values = updateSchema.parse(body);
    const collaboration = await prisma.collaboration.update({
      where: { id: params.id },
      data: {
        ...values,
        organization: values.organization ?? undefined,
        link: values.link ?? undefined,
      },
    });
    return NextResponse.json({ id: collaboration.id, status: collaboration.status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
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
  await prisma.collaboration.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "deleted" });
}
