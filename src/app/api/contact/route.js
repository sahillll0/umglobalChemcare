import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validation";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "sahiltippe111@gmail.com";

const resend = new Resend(RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate incoming form data
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields and try again.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, mobileNumber, email, address, message } =
      validationResult.data;

    const formattedDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // 2. Beautiful HTML Template for Admin Notification (sahiltippe111@gmail.com)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Enquiry - UM Global Exim</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #263746;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f9; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #102B46; padding: 32px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      UM Global Exim
                    </h1>
                    <p style="margin: 6px 0 0; color: #20A4A8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      New Customer Sourcing Enquiry
                    </p>
                  </td>
                </tr>

                <!-- Alert Banner -->
                <tr>
                  <td style="background-color: #E0F5F6; padding: 14px 30px; border-bottom: 1px solid #c2ecee;">
                    <p style="margin: 0; font-size: 13px; color: #087F8C; font-weight: 600; text-align: center;">
                      Received on ${formattedDate} (IST)
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px; font-size: 18px; color: #102B46; border-bottom: 2px solid #F4F7F9; padding-bottom: 10px;">
                      Client Information
                    </h2>

                    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
                      <tr>
                        <td width="35%" style="color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9; padding: 10px 0;">Full Name:</td>
                        <td width="65%" style="color: #102B46; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding: 10px 0;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9; padding: 10px 0;">Mobile / Phone:</td>
                        <td style="border-bottom: 1px solid #f1f5f9; padding: 10px 0;">
                          <a href="tel:${mobileNumber}" style="color: #087F8C; text-decoration: none; font-weight: 700;">${mobileNumber}</a>
                          &nbsp;&nbsp;
                          <a href="https://wa.me/${mobileNumber.replace(/[^0-9]/g, "")}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">WhatsApp</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9; padding: 10px 0;">Email Address:</td>
                        <td style="border-bottom: 1px solid #f1f5f9; padding: 10px 0;">
                          <a href="mailto:${email}" style="color: #087F8C; text-decoration: none; font-weight: 700;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9; padding: 10px 0;">Location / Address:</td>
                        <td style="color: #334155; border-bottom: 1px solid #f1f5f9; padding: 10px 0;">${address}</td>
                      </tr>
                    </table>

                    <h2 style="margin: 25px 0 15px; font-size: 18px; color: #102B46; border-bottom: 2px solid #F4F7F9; padding-bottom: 10px;">
                      Requirement / Message
                    </h2>

                    <div style="background-color: #F8FAFC; border-left: 4px solid #20A4A8; padding: 16px 20px; border-radius: 0 12px 12px 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>

                    <!-- Quick Action -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                      <tr>
                        <td align="center">
                          <a href="mailto:${email}?subject=Regarding%20your%20chemical%20enquiry%20with%20UM%20Global%20Exim" style="background-color: #102B46; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
                            Reply to Customer Directly
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0B1E31; padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                    <p style="margin: 0;">UM Global Exim Portal Notification</p>
                    <p style="margin: 4px 0 0; color: #64748b;">Ground Floor, Aidun Building B, 1st Dhobi Talao Lane, Mumbai - 400002</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 3. Beautiful HTML Template for Customer Confirmation
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting UM Global Exim</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #263746;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f9; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #102B46; padding: 35px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      UM Global Exim
                    </h1>
                    <p style="margin: 6px 0 0; color: #20A4A8; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                      Specialty Chemicals Sourcing & Consolidation
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 35px 30px;">
                    <h2 style="margin: 0 0 15px; font-size: 20px; color: #102B46;">
                      Hello ${fullName},
                    </h2>
                    
                    <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.6; color: #475569;">
                      Thank you for contacting <strong>UM Global Exim</strong>. We have received your chemical sourcing enquiry and our technical sales team is reviewing your requirements.
                    </p>

                    <div style="background-color: #F8FAFC; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                      <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #087F8C;">
                        Summary of Your Request:
                      </h3>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; font-style: italic;">
                        &ldquo;${message}&rdquo;
                      </p>
                    </div>

                    <p style="margin: 0 0 25px; font-size: 14px; line-height: 1.6; color: #475569;">
                      One of our representatives will contact you shortly via <strong>${mobileNumber}</strong> or email. If you need urgent material availability, please feel free to reach out directly:
                    </p>

                    <!-- Contact Details Box -->
                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #E0F5F6; border-radius: 12px; font-size: 13px; color: #102B46; margin-bottom: 25px;">
                      <tr>
                        <td>
                          <strong>Direct Helpline / WhatsApp:</strong> +91 7304305372<br />
                          <strong>Email:</strong> export@umglobalexim.com<br />
                          <strong>Head Office:</strong> Aidun Building B, 1st Dhobi Talao Lane, Mumbai - 400002
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 14px; color: #102B46; font-weight: 600;">
                      Warm regards,<br />
                      <span style="color: #087F8C;">Export & Sourcing Team</span><br />
                      <strong>UM Global Exim</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0B1E31; padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} UM Global Exim. Estd. 1970 • 50+ Years of Sourcing Excellence.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 4. Dispatch Email to Admin (sahiltippe111@gmail.com) via Resend
    let adminEmailResult = null;
    try {
      adminEmailResult = await resend.emails.send({
        from: "UM Global Exim <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `🔔 New Chemical Enquiry: ${fullName} (${mobileNumber})`,
        html: adminEmailHtml,
      });

      console.log("Admin notification sent successfully via Resend:", adminEmailResult);
    } catch (adminErr) {
      console.error("Failed to send admin notification via Resend:", adminErr);
    }

    // 5. Dispatch Confirmation Email to Customer (if valid recipient and domain allows)
    let customerEmailResult = null;
    try {
      customerEmailResult = await resend.emails.send({
        from: "UM Global Exim <onboarding@resend.dev>",
        to: [email],
        subject: "Thank You for Contacting UM Global Exim | Enquiry Received",
        html: customerEmailHtml,
      });

      console.log("Customer confirmation sent successfully via Resend:", customerEmailResult);
    } catch (customerErr) {
      // Note: On free Resend test domains (onboarding@resend.dev), delivery to unverified external emails
      // may require domain verification; we catch and log gracefully without blocking user submission.
      console.warn("Notice: Customer confirmation email skipped or restricted by Resend sandbox domain:", customerErr.message);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for contacting UM Global Exim! Your enquiry has been received and our export team will contact you shortly.",
        adminNotified: Boolean(adminEmailResult?.data?.id),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred while processing your request. Please call us directly at +91 7304305372 or email export@umglobalexim.com.",
      },
      { status: 500 }
    );
  }
}
