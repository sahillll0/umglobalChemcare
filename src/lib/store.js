import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getCollection } from "./mongo";

export const STATUSES = ["pending", "in_progress", "completed", "rejected"];

// Use MongoDB when MONGODB_URL is set (production/Vercel);
// otherwise fall back to a local JSON file (local development).
const USE_MONGO = Boolean(process.env.MONGODB_URL);

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "enquiries.json");

/* ------------------------------------------------------------------ */
/* MongoDB backend                                                     */
/* ------------------------------------------------------------------ */

function mapDoc(d) {
  return {
    id: d._id,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
    status: d.status,
    fullName: d.fullName,
    mobileNumber: d.mobileNumber,
    email: d.email,
    address: d.address,
    message: d.message,
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    lastReplyAt: d.lastReplyAt ? new Date(d.lastReplyAt).toISOString() : null,
    lastReplyChannel: d.lastReplyChannel || null,
  };
}

async function mongoAddEnquiry(data) {
  const col = await getCollection();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    createdAt: new Date(),
    status: "pending",
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    email: data.email,
    address: data.address,
    message: data.message,
    updatedAt: null,
    lastReplyAt: null,
    lastReplyChannel: null,
  };
  await col.insertOne(doc);
  return mapDoc(doc);
}

async function mongoListEnquiries() {
  const col = await getCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

async function mongoGetEnquiry(id) {
  const col = await getCollection();
  const doc = await col.findOne({ _id: id });
  return doc ? mapDoc(doc) : null;
}

async function mongoUpdateEnquiryStatus(id, status) {
  if (!STATUSES.includes(status)) return null;
  const col = await getCollection();
  const res = await col.updateOne(
    { _id: id },
    { $set: { status, updatedAt: new Date() } }
  );
  if (res.matchedCount === 0) return null;
  const doc = await col.findOne({ _id: id });
  return doc ? mapDoc(doc) : null;
}

async function mongoMarkEnquiryReplied(id) {
  const col = await getCollection();
  const res = await col.updateOne(
    { _id: id },
    { $set: { lastReplyAt: new Date(), lastReplyChannel: "email" } }
  );
  if (res.matchedCount === 0) return null;
  const doc = await col.findOne({ _id: id });
  return doc ? mapDoc(doc) : null;
}

async function mongoDeleteEnquiry(id) {
  const col = await getCollection();
  const res = await col.deleteOne({ _id: id });
  return res.deletedCount > 0;
}

/* ------------------------------------------------------------------ */
/* JSON-file backend (local development)                              */
/* ------------------------------------------------------------------ */

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

async function fileAddEnquiry(data) {
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
  enquiries.unshift(enquiry);
  await writeEnquiries(enquiries);
  return enquiry;
}

async function fileListEnquiries() {
  return await readEnquiries();
}

async function fileGetEnquiry(id) {
  const enquiries = await readEnquiries();
  return enquiries.find((e) => e.id === id) || null;
}

async function fileUpdateEnquiryStatus(id, status) {
  if (!STATUSES.includes(status)) return null;
  const enquiries = await readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  enquiries[index].status = status;
  enquiries[index].updatedAt = new Date().toISOString();
  await writeEnquiries(enquiries);
  return enquiries[index];
}

async function fileMarkEnquiryReplied(id) {
  const enquiries = await readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  enquiries[index].lastReplyAt = new Date().toISOString();
  enquiries[index].lastReplyChannel = "email";
  await writeEnquiries(enquiries);
  return enquiries[index];
}

async function fileDeleteEnquiry(id) {
  const enquiries = await readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return false;
  enquiries.splice(index, 1);
  await writeEnquiries(enquiries);
  return true;
}

/* ------------------------------------------------------------------ */
/* Public API (selects backend automatically)                          */
/* ------------------------------------------------------------------ */

export async function addEnquiry(data) {
  return USE_MONGO ? mongoAddEnquiry(data) : fileAddEnquiry(data);
}

export async function listEnquiries() {
  return USE_MONGO ? mongoListEnquiries() : fileListEnquiries();
}

export async function getEnquiry(id) {
  return USE_MONGO ? mongoGetEnquiry(id) : fileGetEnquiry(id);
}

export async function updateEnquiryStatus(id, status) {
  return USE_MONGO
    ? mongoUpdateEnquiryStatus(id, status)
    : fileUpdateEnquiryStatus(id, status);
}

export async function markEnquiryReplied(id) {
  return USE_MONGO ? mongoMarkEnquiryReplied(id) : fileMarkEnquiryReplied(id);
}

export async function deleteEnquiry(id) {
  return USE_MONGO ? mongoDeleteEnquiry(id) : fileDeleteEnquiry(id);
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
