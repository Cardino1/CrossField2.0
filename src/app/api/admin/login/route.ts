import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminCredentials, createAdminSession } from "@/lib/auth";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = schema.parse(body);
    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ message: "ok" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to login" }, { status: 500 });
  }
}
