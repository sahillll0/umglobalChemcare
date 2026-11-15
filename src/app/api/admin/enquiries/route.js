import { isAuthenticated } from "@/lib/auth";
import { listEnquiries, computeStats } from "@/lib/store";
import { isMongoConfigured } from "@/lib/mongo";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const enquiries = await listEnquiries();
  const stats = computeStats(enquiries);
  const mongoActive = isMongoConfigured();

  return Response.json({
    success: true,
    enquiries,
    stats,
    storage: mongoActive ? "MongoDB Atlas" : "Local Storage",
    lastUpdated: new Date().toISOString(),
  });
}
