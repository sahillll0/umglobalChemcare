import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  cookieOptions,
  isAuthConfigured,
  verifyCredentials,
  createSessionToken,
} from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const { email, password } = body || {};
  if (!email || !password) {
    return Response.json(
      { success: false, message: "Email and password are required." },
      { status: 400 }
    );
  }

  // Missing env vars (e.g. not added to Vercel) — guide the user instead of
  // returning a misleading "Invalid email or password".
  if (!isAuthConfigured()) {
    return Response.json(
      {
        success: false,
        message:
          "Admin login is not configured on this server. Add ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET as environment variables (Vercel → Project Settings → Environment Variables), then redeploy.",
      },
      { status: 503 }
    );
  }

  if (!verifyCredentials(email, password)) {
    return Response.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = createSessionToken(email);
  if (!token) {
    return Response.json(
      {
        success: false,
        message: "Server is not configured (AUTH_SECRET missing).",
      },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, cookieOptions);

  return Response.json({ success: true, message: "Logged in." });
}
