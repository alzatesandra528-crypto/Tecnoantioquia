import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Sale } from "./models/Sale.js";
import { authRequired, adminOnly } from "./middleware/auth.js";
import { seedIfEmpty } from "./seed.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: "mongodb" });
});

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
  }

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Credenciales incorrectas." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

app.get("/api/catalog", async (_req, res) => {
  const products = await Product.find({ published: true }).sort({ name: 1 });
  res.json(products);
});

app.get("/api/catalog/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, published: true });
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }
  res.json(product);
});

app.get("/api/products", authRequired, async (_req, res) => {
  res.json(await Product.find().sort({ name: 1 }));
});

app.post("/api/products", authRequired, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Ya existe un producto con ese SKU." });
    }
    res.status(400).json({ error: "No se pudo crear el producto." });
  }
});

app.put("/api/products/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json(product);
  } catch {
    res.status(400).json({ error: "No se pudo actualizar el producto." });
  }
});

app.delete("/api/products/:id", authRequired, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }
  res.status(204).end();
});

app.get("/api/sales", authRequired, async (_req, res) => {
  const sales = await Sale.find()
    .populate("productId", "name sku")
    .populate("userId", "username")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(sales);
});

app.post("/api/sales", authRequired, async (req, res) => {
  const productId = req.body.productId;
  const quantity = Number(req.body.quantity);
  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Producto y cantidad válidos son obligatorios." });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }
  if (product.stock < quantity) {
    return res.status(409).json({ error: "No hay stock suficiente para esta venta." });
  }

  product.stock -= quantity;
  await product.save();

  const sale = await Sale.create({
    productId: product.id,
    quantity,
    unitPrice: product.price,
    userId: req.user.id
  });

  res.status(201).json(sale);
});

const clientDist = path.join(__dirname, "../../client/dist");
if (fs.existsSync(path.join(clientDist, "index.html"))) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  const isAtlas = String(uri).includes("mongodb+srv");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: isAtlas ? 20000 : 2500 });
    console.log(`Conectado a MongoDB (${mongoose.connection.name})`);
  } catch (error) {
    if (isAtlas) {
      throw error;
    }
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const memory = await MongoMemoryServer.create();
    await mongoose.connect(memory.getUri());
    console.log("MongoDB local no está disponible. Usando base en memoria.");
  }
}

async function start() {
  await connectDb();
  await seedIfEmpty();
  app.listen(port, () => {
    console.log(`API MongoDB en http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("No se pudo conectar a MongoDB:", error.message);
  process.exit(1);
});
