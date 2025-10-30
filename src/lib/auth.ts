import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const ADMIN_COOKIE_NAME = "crossfield-admin";

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const adminUser = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUser || !hash) {
    throw new Error("Admin credentials are not configured");
  }
  if (username !== adminUser) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  cookies().set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  cookies().set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role === "admin") {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export const adminCookieName = ADMIN_COOKIE_NAME;
