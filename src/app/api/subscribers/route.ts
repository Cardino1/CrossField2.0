import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email("Invalid email").max(254),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "You’re already subscribed." }, { status: 200 });
    }
    await prisma.subscriber.create({ data: { email } });
    return NextResponse.json({ message: "Subscribed" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to subscribe" }, { status: 500 });
  }
}
