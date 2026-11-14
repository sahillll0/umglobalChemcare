import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getCollection, isMongoConfigured } from "./mongo.js";

export const STATUSES = ["pending", "in_progress", "completed", "rejected"];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "enquiries.json");

/* ------------------------------------------------------------------ */
/* MongoDB backend                                                     */
/* ------------------------------------------------------------------ */

function mapDoc(d) {
  if (!d) return null;
  return {
    id: d._id || d.id,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
    status: d.status || "pending",
    fullName: d.fullName || "",
    mobileNumber: d.mobileNumber || "",
    email: d.email || "",
    address: d.address || "",
    message: d.message || "",
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    lastReplyAt: d.lastReplyAt ? new Date(d.lastReplyAt).toISOString() : null,
    lastReplyChannel: d.lastReplyChannel || null,
  };
}

async function mongoAddEnquiry(data) {
  const col = await getCollection();
  if (!col) return null;
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
  if (!col) return null;
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(mapDoc);
}

async function mongoGetEnquiry(id) {
  const col = await getCollection();
  if (!col) return null;
  const doc = await col.findOne({ _id: id });
  return doc ? mapDoc(doc) : null;
}

async function mongoUpdateEnquiryStatus(id, status) {
  if (!STATUSES.includes(status)) return null;
  const col = await getCollection();
  if (!col) return null;
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
  if (!col) return null;
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
  if (!col) return null;
  const res = await col.deleteOne({ _id: id });
  return res.deletedCount > 0;
}

/* ------------------------------------------------------------------ */
/* JSON-file backend (local storage / fallback)                       */
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
    // Read-only filesystem (e.g. serverless deploys).
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
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(enquiries, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write to local file store:", err.message);
  }
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
    updatedAt: null,
    lastReplyAt: null,
    lastReplyChannel: null,
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
/* Public API (resilient multi-tier persistence)                       */
/* ------------------------------------------------------------------ */

export async function addEnquiry(data) {
  if (isMongoConfigured()) {
    try {
      const res = await mongoAddEnquiry(data);
      if (res) {
        // Also persist to local file in background if possible for backup
        fileAddEnquiry(data).catch(() => {});
        return res;
      }
    } catch (err) {
      console.warn("MongoDB addEnquiry error, falling back to file store:", err.message);
    }
  }
  return fileAddEnquiry(data);
}

export async function listEnquiries() {
  if (isMongoConfigured()) {
    try {
      const res = await mongoListEnquiries();
      if (res && res.length > 0) return res;
      // If mongo collection is empty, check file store to merge or display
      const fileDocs = await fileListEnquiries();
      if (res && res.length === 0 && fileDocs.length > 0) return fileDocs;
      if (res) return res;
    } catch (err) {
      console.warn("MongoDB listEnquiries error, falling back to file store:", err.message);
    }
  }
  return fileListEnquiries();
}

export async function getEnquiry(id) {
  if (isMongoConfigured()) {
    try {
      const res = await mongoGetEnquiry(id);
      if (res) return res;
    } catch (err) {
      console.warn("MongoDB getEnquiry error, checking file store:", err.message);
    }
  }
  return fileGetEnquiry(id);
}

export async function updateEnquiryStatus(id, status) {
  if (isMongoConfigured()) {
    try {
      const res = await mongoUpdateEnquiryStatus(id, status);
      if (res) return res;
    } catch (err) {
      console.warn("MongoDB updateEnquiryStatus error:", err.message);
    }
  }
  return fileUpdateEnquiryStatus(id, status);
}

export async function markEnquiryReplied(id) {
  if (isMongoConfigured()) {
    try {
      const res = await mongoMarkEnquiryReplied(id);
      if (res) return res;
    } catch (err) {
      console.warn("MongoDB markEnquiryReplied error:", err.message);
    }
  }
  return fileMarkEnquiryReplied(id);
}

export async function deleteEnquiry(id) {
  if (isMongoConfigured()) {
    try {
      const res = await mongoDeleteEnquiry(id);
      if (res) return res;
    } catch (err) {
      console.warn("MongoDB deleteEnquiry error:", err.message);
    }
  }
  return fileDeleteEnquiry(id);
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
