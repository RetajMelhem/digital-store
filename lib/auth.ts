import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_ROUTE } from "@/lib/constants";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be configured");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(value).digest("hex");
}

export function createAdminSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${expiresAt}`;
  const signature = sign(payload);
  return `${payload}:${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;

  const parts = token.split(":");
  if (parts.length !== 3 || parts[0] !== "admin") return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const payload = `${parts[0]}:${parts[1]}`;
  const expected = sign(payload);

  try {
    return timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", { expires: new Date(0), path: "/" });
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect(ADMIN_ROUTE);
  }
}
