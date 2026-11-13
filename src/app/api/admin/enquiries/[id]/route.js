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
  const updated = await updateEnquiryStatus(id, status);
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
  const deleted = await deleteEnquiry(id);
  if (!deleted) {
    return Response.json(
      { success: false, message: "Enquiry not found." },
      { status: 404 }
    );
  }

  return Response.json({ success: true });
}
