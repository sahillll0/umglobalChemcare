import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB || undefined;

let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Reuse the client across hot reloads in dev to avoid exhausting connections.
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    clientPromise = client.connect();
  }
}

export async function getCollection(name = "enquiries") {
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(dbName).collection(name);
}

export function isMongoConfigured() {
  return Boolean(uri);
}
