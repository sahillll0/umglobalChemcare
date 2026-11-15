import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getCollection, isMongoConfigured } from "./mongo.js";

export const STATUSES = ["pending", "in_progress", "completed", "rejected"];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "enquiries.json");

/* ------------------------------------------------------------------ */
/* Doc Mapper                                                         */
/* ------------------------------------------------------------------ */

function mapDoc(d) {
  if (!d) return null;
  return {
    id: String(d._id || d.id),
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
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

/* ------------------------------------------------------------------ */
/* MongoDB Backend                                                    */
/* ------------------------------------------------------------------ */

async function mongoAddEnquiry(data, id) {
  const col = await getCollection();
  if (!col) return null;
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
/* Local JSON File Backend                                            */
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
    return Array.isArray(parsed) ? parsed.map(mapDoc).filter(Boolean) : [];
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

async function fileAddEnquiry(data, id) {
  const enquiries = await readEnquiries();
  const enquiry = {
    id: id,
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
/* Public API (unified dual-write & unified retrieval)                */
/* ------------------------------------------------------------------ */

export async function addEnquiry(data) {
  const id = data.id || crypto.randomUUID();
  let savedDoc = null;

  // 1. Try MongoDB
  if (isMongoConfigured()) {
    try {
      savedDoc = await mongoAddEnquiry(data, id);
    } catch (err) {
      console.warn("MongoDB addEnquiry error:", err.message);
    }
  }

  // 2. Dual-write to file store as well (ensures backup & local visibility)
  try {
    const fileDoc = await fileAddEnquiry(data, id);
    if (!savedDoc) savedDoc = fileDoc;
  } catch (err) {
    console.warn("File addEnquiry error:", err.message);
  }

  return (
    savedDoc || {
      id,
      createdAt: new Date().toISOString(),
      status: "pending",
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      address: data.address,
      message: data.message,
    }
  );
}

export async function listEnquiries() {
  let mongoDocs = [];
  let fileDocs = [];

  // Query MongoDB
  if (isMongoConfigured()) {
    try {
      const res = await mongoListEnquiries();
      if (Array.isArray(res)) mongoDocs = res;
    } catch (err) {
      console.warn("MongoDB listEnquiries error:", err.message);
    }
  }

  // Query File store
  try {
    fileDocs = (await fileListEnquiries()) || [];
  } catch (err) {
    console.warn("File listEnquiries error:", err.message);
  }

  // Merge both sources by ID
  const map = new Map();
  for (const d of [...mongoDocs, ...fileDocs]) {
    if (d && d.id && !map.has(d.id)) {
      map.set(d.id, d);
    }
  }

  const all = Array.from(map.values());
  // Sort latest first
  all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Deduplicate dual-write entries that share the same customer, message, and timestamp within 10s
  const unique = [];
  for (const item of all) {
    const isDup = unique.some((existing) => {
      const sameContent =
        existing.fullName === item.fullName &&
        existing.email === item.email &&
        existing.message === item.message;
      if (!sameContent) return false;
      const tDiff = Math.abs(
        new Date(existing.createdAt || 0).getTime() -
          new Date(item.createdAt || 0).getTime()
      );
      return tDiff < 10000;
    });
    if (!isDup) unique.push(item);
  }

  return unique;
}

export async function getEnquiry(id) {
  if (isMongoConfigured()) {
    try {
      const res = await mongoGetEnquiry(id);
      if (res) return res;
    } catch (err) {
      console.warn("MongoDB getEnquiry error:", err.message);
    }
  }
  return fileGetEnquiry(id);
}

export async function updateEnquiryStatus(id, status) {
  let updated = null;
  if (isMongoConfigured()) {
    try {
      updated = await mongoUpdateEnquiryStatus(id, status);
    } catch (err) {
      console.warn("MongoDB updateEnquiryStatus error:", err.message);
    }
  }
  try {
    const fUpdated = await fileUpdateEnquiryStatus(id, status);
    if (!updated) updated = fUpdated;
  } catch (err) {
    console.warn("File updateEnquiryStatus error:", err.message);
  }
  return updated;
}

export async function markEnquiryReplied(id) {
  let updated = null;
  if (isMongoConfigured()) {
    try {
      updated = await mongoMarkEnquiryReplied(id);
    } catch (err) {
      console.warn("MongoDB markEnquiryReplied error:", err.message);
    }
  }
  try {
    const fUpdated = await fileMarkEnquiryReplied(id);
    if (!updated) updated = fUpdated;
  } catch (err) {
    console.warn("File markEnquiryReplied error:", err.message);
  }
  return updated;
}

export async function deleteEnquiry(id) {
  let deleted = false;
  if (isMongoConfigured()) {
    try {
      const res = await mongoDeleteEnquiry(id);
      if (res) deleted = true;
    } catch (err) {
      console.warn("MongoDB deleteEnquiry error:", err.message);
    }
  }
  try {
    const res = await fileDeleteEnquiry(id);
    if (res) deleted = true;
  } catch (err) {
    console.warn("File deleteEnquiry error:", err.message);
  }
  return deleted;
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
