import mongoose from "mongoose";
import { seedIfEmpty } from "./seed.js";

let connecting;

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Falta MONGODB_URI en Vercel.");
  }
  if (!connecting) {
    connecting = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .catch((error) => {
        connecting = undefined;
        throw error;
      });
  }
  await connecting;
  try {
    await seedIfEmpty();
  } catch (error) {
    console.error("No se pudo sembrar el catálogo:", error.message);
  }
  return mongoose.connection;
}
