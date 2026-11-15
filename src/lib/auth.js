import crypto from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export const cookieOptions = {
  httpOnly: true,
  // Only enforce Secure on real HTTPS serverless deployments, allow HTTP on localhost
  secure:
    process.env.NODE_ENV === "production" &&
    Boolean(process.env.VERCEL || process.env.RAILWAY_STATIC_URL),
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

function getSecret() {
  return process.env.AUTH_SECRET;
}

// True only when all three admin auth env vars are present.
export function isAuthConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.AUTH_SECRET
  );
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

// Create an HMAC-signed session token: payload.signature
export function createSessionToken(email) {
  const secret = getSecret();
  if (!secret) return null;

  const payload = base64UrlEncode(
    JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 })
  );
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

// Verify a session token. Returns the decoded payload or null.
export function verifySessionToken(token) {
  const secret = getSecret();
  if (!secret || !token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const data = JSON.parse(base64UrlDecode(payload));
    if (!data || typeof data.exp !== "number" || Date.now() > data.exp) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// Constant-time email + password check against env-configured admin creds.
export function verifyCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (!adminEmail || !adminPassword) return false;

  const emailOk =
    String(email || "").toLowerCase() === adminEmail.toLowerCase();

  const a = Buffer.from(String(password || ""));
  const b = Buffer.from(adminPassword);
  const passwordOk =
    a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);

  return emailOk && passwordOk;
}

// Read the session cookie and decide if the current request is the admin.
export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const data = verifySessionToken(token);
    if (!data) return false;
    const adminEmail = process.env.ADMIN_EMAIL || "";
    return (
      !!adminEmail && data.email?.toLowerCase() === adminEmail.toLowerCase()
    );
  } catch {
    return false;
  }
}
