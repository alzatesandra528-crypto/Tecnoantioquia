import "dotenv/config";
import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import { createApp } from "./app.js";
import { connectDb } from "./db.js";

const app = createApp();
const port = Number(process.env.PORT || 4000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.VERCEL) {
  const clientDist = path.join(__dirname, "../../frontend/dist");
  if (fs.existsSync(path.join(clientDist, "index.html"))) {
    app.use(express.static(clientDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`API MongoDB en http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("No se pudo conectar a MongoDB:", error.message);
      process.exit(1);
    });
}

export default app;
