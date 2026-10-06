import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Sale } from "./models/Sale.js";
import { authRequired, adminOnly } from "./middleware/auth.js";
import { connectDb } from "./db.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://tecnoantioquia.vercel.app"
      ]
    })
  );
  app.use(express.json());

  app.use(async (_req, _res, next) => {
    try {
      await connectDb();
      next();
    } catch (error) {
      next(error);
    }
  });

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
    const products = await Product.find({ published: true }).select("-cost").sort({ name: 1 });
    res.json(products);
  });

  app.get("/api/catalog/:id", async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id, published: true }).select("-cost");
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
      unitCost: product.cost || 0,
      userId: req.user.id
    });

    res.status(201).json(sale);
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Error interno del servidor." });
  });

  return app;
}
