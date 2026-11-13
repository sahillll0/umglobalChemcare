import { Resend } from "resend";
import { isAuthenticated } from "@/lib/auth";
import { getEnquiry, markEnquiryReplied } from "@/lib/store";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(str) {
  return str.replace(/\r?\n/g, "<br>");
}

// Admin replies to a customer's enquiry by email (via Resend).
export async function POST(request, { params }) {
  if (!(await isAuthenticated())) {
    return Response.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) {
    return Response.json(
      { success: false, message: "Enquiry not found." },
      { status: 404 }
    );
  }
  if (!enquiry.email) {
    return Response.json(
      { success: false, message: "This enquiry has no email address to reply to." },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const subject = (body?.subject || "").trim();
  const message = (body?.message || "").trim();
  if (!subject) {
    return Response.json(
      { success: false, message: "Subject is required." },
      { status: 400 }
    );
  }
  if (!message) {
    return Response.json(
      { success: false, message: "Message is required." },
      { status: 400 }
    );
  }

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "UM Global Exim <onboarding@resend.dev>";
  const replyTo = process.env.ADMIN_NOTIFICATION_EMAIL || undefined;
  const firstName = (enquiry.fullName || "there").split(" ")[0];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:30px 15px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                <tr>
                  <td style="background-color:#1E293B;padding:28px 30px;">
                    <p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.5px;">UM Global Exim</p>
                    <p style="margin:4px 0 0;color:#2563EB;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Message from our team</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;">
                    <p style="margin:0 0 16px;font-size:15px;color:#0F172A;">Hello ${escapeHtml(firstName)},</p>
                    <div style="font-size:15px;line-height:1.7;color:#334155;white-space:pre-wrap;">${nl2br(escapeHtml(message))}</div>
                    <p style="margin:24px 0 0;font-size:14px;color:#0F172A;font-weight:600;">
                      Warm regards,<br>
                      <span style="color:#2563EB;">UM Global Exim Team</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#0F172A;padding:18px 30px;text-align:center;color:#94A3B8;font-size:12px;">
                    <p style="margin:0;">This email was sent in response to your enquiry with UM Global Exim.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

  let sendOk = false;
  let sendError = "";
  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: [enquiry.email],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    sendOk = Boolean(result?.data?.id);
    if (!sendOk) {
      sendError =
        result?.error?.message || "Resend did not return a message id.";
    }
  } catch (e) {
    sendError = e?.message || "Unknown send error.";
    console.error("Admin reply email failed:", e);
  }

  if (!sendOk) {
    return Response.json(
      {
        success: false,
        message: `Could not send the email: ${sendError}. If you're using Resend's sandbox domain, it only sends to your own verified address — verify a sending domain in Resend, or use the "Open in email app" option.`,
      },
      { status: 502 }
    );
  }

  let updated = null;
  try {
    updated = await markEnquiryReplied(id);
  } catch (err) {
    // Persistence may be unavailable (e.g. serverless read-only fs).
    // The email was still sent, so report success; we just can't mark "Replied".
    console.error("Could not mark enquiry as replied:", err);
  }
  return Response.json({ success: true, enquiry: updated });
}
