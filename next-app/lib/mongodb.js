import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, mongod: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      // Create Local InMemory Database (Perfect for Hackathon without install!)
      if (!cached.mongod) {
        cached.mongod = await MongoMemoryServer.create();
      }
      const uri = cached.mongod.getUri();
      
      console.log("🟢 Booted In-Memory MongoDB Server at:", uri);

      return mongoose.connect(uri, {
        bufferCommands: false,
      }).then((mongoose) => {
        console.log("✅ Successfully connected to Local MongoDB Database");
        return mongoose;
      });
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
