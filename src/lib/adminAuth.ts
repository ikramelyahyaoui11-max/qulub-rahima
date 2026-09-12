import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "qr_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-change-me";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createSessionValue(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  if (sign(payload) !== sig) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() <= expires;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(COOKIE_NAME)?.value);
}

/** Verifies the password and, if valid, sets the session cookie. Returns whether login succeeded. */
export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  if (!timingSafeEqualStr(password, expected)) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
