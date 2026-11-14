import { MongoClient } from "mongodb";

const rawUri = (process.env.MONGODB_URL || "").trim();
const dbName = (process.env.MONGODB_DB || "umglobal").trim();

let clientPromise = null;

function withTimeout(promise, ms = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`MongoDB connection timed out after ${ms}ms`)), ms)
    ),
  ]);
}

if (rawUri) {
  // Use global client promise across dev and production to reuse connection pool
  // and prevent exhausting Atlas connection limits or spinning on cold starts.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(rawUri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
      maxPoolSize: 10,
    });
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn("MongoDB Atlas connection attempt failed:", err.message);
      global._mongoClientPromise = null;
      return null;
    });
  }
  clientPromise = global._mongoClientPromise;
}

export async function getCollection(name = "enquiries") {
  if (!clientPromise) return null;
  try {
    const client = await withTimeout(clientPromise, 2500);
    if (!client) return null;
    return client.db(dbName).collection(name);
  } catch (err) {
    console.warn("MongoDB getCollection failed:", err.message);
    return null;
  }
}

export function isMongoConfigured() {
  return Boolean(rawUri);
}
