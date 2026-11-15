import { MongoClient } from "mongodb";

const rawUri = (process.env.MONGODB_URL || "").trim();
const configuredDbName = (process.env.MONGODB_DB || "umglobal").trim();

let clientPromise = null;

function getClientPromise() {
  if (!rawUri) return null;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(rawUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 10,
    });
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn("MongoDB Atlas connection attempt failed:", err.message);
      // Reset so next request can retry instead of being stuck on null
      global._mongoClientPromise = null;
      throw err;
    });
  }

  return global._mongoClientPromise;
}

export async function getCollection(name = "enquiries") {
  if (!rawUri) return null;

  try {
    const promise = getClientPromise();
    if (!promise) return null;

    const client = await promise;
    if (!client) return null;

    // Use configured dbName, or default to umglobal
    const db = client.db(configuredDbName);
    return db.collection(name);
  } catch (err) {
    console.warn("MongoDB getCollection failed:", err.message);
    return null;
  }
}

export function isMongoConfigured() {
  return Boolean(rawUri);
}
