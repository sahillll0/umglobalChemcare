import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  cookieOptions,
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

  if (!verifyCredentials(email, password)) {
    return Response.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = createSessionToken(email);
  if (!token) {
    return Response.json(
      { success: false, message: "Server is not configured (AUTH_SECRET missing)." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, cookieOptions);

  return Response.json({ success: true, message: "Logged in." });
}
