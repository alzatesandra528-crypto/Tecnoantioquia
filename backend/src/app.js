const path = require("path");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const salesRoutes = require("./routes/sales");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://tecnoantioquia.vercel.app"
      ]
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "tecnoantioquia-api" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/sales", salesRoutes);

  if (!process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, "../../frontend")));
  }

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor." });
  });

  return app;
}

module.exports = { createApp };
