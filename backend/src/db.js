import mongoose from "mongoose";
import { seedIfEmpty } from "./seed.js";

let connecting;

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connecting) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Falta MONGODB_URI");
    }
    connecting = mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  }
  await connecting;
  await seedIfEmpty();
  return mongoose.connection;
}
