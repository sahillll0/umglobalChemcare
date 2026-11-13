import { isAuthenticated } from "@/lib/auth";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/store";

export async function PATCH(request, { params }) {
  if (!(await isAuthenticated())) {
    return Response.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const { status } = body || {};
  let updated;
  try {
    updated = await updateEnquiryStatus(id, status);
  } catch (err) {
    console.error("Status update failed:", err);
    return Response.json(
      {
        success: false,
        message:
          "Could not save the change. On serverless deployments (e.g. Vercel) the file store is read-only — a database is required for the admin panel to persist data.",
      },
      { status: 503 }
    );
  }
  if (!updated) {
    return Response.json(
      { success: false, message: "Enquiry not found or invalid status." },
      { status: 404 }
    );
  }

  return Response.json({ success: true, enquiry: updated });
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return Response.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  let deleted;
  try {
    deleted = await deleteEnquiry(id);
  } catch (err) {
    console.error("Delete failed:", err);
    return Response.json(
      {
        success: false,
        message:
          "Could not delete. On serverless deployments (e.g. Vercel) the file store is read-only — a database is required for the admin panel to persist data.",
      },
      { status: 503 }
    );
  }
  if (!deleted) {
    return Response.json(
      { success: false, message: "Enquiry not found." },
      { status: 404 }
    );
  }

  return Response.json({ success: true });
}
