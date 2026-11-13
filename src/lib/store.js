import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const STATUSES = ["pending", "in_progress", "completed", "rejected"];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "enquiries.json");

async function ensureStore() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FILE_PATH);
    } catch {
      await fs.writeFile(FILE_PATH, "[]", "utf8");
    }
  } catch {
    // Read-only filesystem (e.g. serverless deploys such as Vercel).
    // Reads will return [] and writes will fail gracefully higher up.
  }
}

async function readEnquiries() {
  await ensureStore();
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEnquiries(enquiries) {
  await ensureStore();
  await fs.writeFile(FILE_PATH, JSON.stringify(enquiries, null, 2), "utf8");
}

// Save a new contact-form submission with status "pending".
export async function addEnquiry(data) {
  const enquiries = await readEnquiries();
  const enquiry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    email: data.email,
    address: data.address,
    message: data.message,
  };
  enquiries.unshift(enquiry); // newest first
  await writeEnquiries(enquiries);
  return enquiry;
}

export async function listEnquiries() {
  return await readEnquiries();
}

export async function getEnquiry(id) {
  const enquiries = await readEnquiries();
  return enquiries.find((e) => e.id === id) || null;
}

export async function updateEnquiryStatus(id, status) {
  if (!STATUSES.includes(status)) return null;
  const enquiries = await readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  enquiries[index].status = status;
  enquiries[index].updatedAt = new Date().toISOString();
  await writeEnquiries(enquiries);
  return enquiries[index];
}

// Mark that the admin has replied to an enquiry (via email).
export async function markEnquiryReplied(id) {
  const enquiries = await readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  enquiries[index].lastReplyAt = new Date().toISOString();
  enquiries[index].lastReplyChannel = "email";
  await writeEnquiries(enquiries);
  return enquiries[index];
}

export async function deleteEnquiry(id) {
  const enquiries = await readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return false;
  enquiries.splice(index, 1);
  await writeEnquiries(enquiries);
  return true;
}

export function computeStats(enquiries) {
  const stats = {
    total: enquiries.length,
    pending: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  };
  for (const e of enquiries) {
    if (stats[e.status] !== undefined) stats[e.status] += 1;
  }
  return stats;
}
