import { isAuthenticated } from "@/lib/auth";
import { listEnquiries, computeStats } from "@/lib/store";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const enquiries = await listEnquiries();
  const stats = computeStats(enquiries);
  return Response.json({ success: true, enquiries, stats });
}
