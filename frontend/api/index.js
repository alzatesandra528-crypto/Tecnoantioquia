import { createApp } from "../../backend/src/app.js";
import { connectDb } from "../../backend/src/db.js";

const app = createApp();

export default async function handler(req, res) {
  try {
    await connectDb();

    if (req.url && !req.url.startsWith("/api")) {
      req.url = "/api" + (req.url.startsWith("/") ? req.url : `/${req.url}`);
    }

    return app(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Error de la API." });
    }
  }
}
