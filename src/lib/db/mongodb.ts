import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

// eslint-disable-next-line prefer-const
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB using Mongoose
 *
 * This function uses a singleton pattern to ensure only one connection
 * is created and reused across the application.
 *
 * Why do we need this?
 * - In development, Next.js hot-reloads code frequently
 * - Each reload would create a new connection without caching
 * - MongoDB has connection limits - too many = crashes
 *
 * How it works:
 * 1. Check if we already have a connection (cached.conn)
 * 2. If yes, return it immediately
 * 3. If no, check if connection is in progress (cached.promise)
 * 4. If not, start connecting and cache the promise
 * 5. Wait for connection, cache it, return it
 */
export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local',
    );
  }

  // If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a connection promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    // Wait for the connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, clear the promise so we can retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Optional: Disconnect from MongoDB
 * Usually not needed as Next.js handles this,
 * but useful for testing or cleanup
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}
