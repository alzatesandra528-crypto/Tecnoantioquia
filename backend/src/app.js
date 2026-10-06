import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Sale } from "./models/Sale.js";
import { Order } from "./models/Order.js";
import { Site } from "./models/Site.js";
import { authRequired, adminOnly, staffOnly } from "./middleware/auth.js";
import { connectDb } from "./db.js";
import { mergeSite } from "./siteDefaults.js";

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name || "" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

function publicUser(user) {
  return { id: user.id, username: user.username, role: user.role, name: user.name || "" };
}

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
  app.use(express.json({ limit: "8mb" }));

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

  app.get("/api/site", async (_req, res) => {
    const doc = await Site.findOne({ key: "landing" });
    res.json(mergeSite(doc?.data));
  });

  app.put("/api/site", authRequired, adminOnly, async (req, res) => {
    const merged = mergeSite(req.body || {});
    const doc = await Site.findOneAndUpdate(
      { key: "landing" },
      { data: merged },
      { upsert: true, new: true }
    );
    res.json(mergeSite(doc.data));
  });

  app.post("/api/auth/login", async (req, res) => {
    const username = String(req.body.username || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }
    if (user.active === false) {
      return res.status(403).json({ error: "Esta cuenta está desactivada." });
    }

    const token = tokenFor(user);
    res.json({ token, user: publicUser(user) });
  });

  app.post("/api/auth/register", async (req, res) => {
    const username = String(req.body.username || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const name = String(req.body.name || "").trim();
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }
    try {
      const user = await User.create({
        username,
        name,
        passwordHash: await bcrypt.hash(password, 10),
        role: "cliente"
      });
      res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: "Ese usuario ya existe." });
      }
      res.status(400).json({ error: "No se pudo crear la cuenta." });
    }
  });

  app.get("/api/users", authRequired, adminOnly, async (_req, res) => {
    const users = await User.find({ role: { $in: ["admin", "vendedor"] } })
      .select("username role name active createdAt")
      .sort({ createdAt: -1 });
    res.json(users);
  });

  app.post("/api/users", authRequired, adminOnly, async (req, res) => {
    const username = String(req.body.username || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const name = String(req.body.name || "").trim();
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
    }
    try {
      const user = await User.create({
        username,
        name,
        passwordHash: await bcrypt.hash(password, 10),
        role: "vendedor"
      });
      res.status(201).json({ id: user.id, username: user.username, role: user.role, name: user.name });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: "Ese usuario ya existe." });
      }
      res.status(400).json({ error: "No se pudo crear el vendedor." });
    }
  });

  app.put("/api/users/:id", authRequired, adminOnly, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    if (user.role === "admin" && String(user.id) === String(req.user.id) && req.body.active === false) {
      return res.status(400).json({ error: "No puedes desactivar tu propia cuenta." });
    }
    if (req.body.name !== undefined) user.name = String(req.body.name).trim();
    if (req.body.username) user.username = String(req.body.username).trim().toLowerCase();
    if (req.body.active !== undefined) user.active = Boolean(req.body.active);
    if (req.body.password) user.passwordHash = await bcrypt.hash(String(req.body.password), 10);
    try {
      await user.save();
      res.json({ id: user.id, username: user.username, role: user.role, name: user.name, active: user.active });
    } catch (error) {
      if (error.code === 11000) return res.status(409).json({ error: "Ese usuario ya existe." });
      res.status(400).json({ error: "No se pudo actualizar el usuario." });
    }
  });

  app.delete("/api/users/:id", authRequired, adminOnly, async (req, res) => {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ error: "No puedes eliminar tu propia cuenta." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    res.status(204).end();
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

  app.get("/api/products", authRequired, async (req, res) => {
    const products = await Product.find().sort({ name: 1 });
    if (req.user.role !== "admin") {
      return res.json(products.map((item) => {
        const data = item.toObject();
        delete data.cost;
        return data;
      }));
    }
    res.json(products);
  });

  app.post("/api/products", authRequired, staffOnly, async (req, res) => {
    try {
      const payload = { ...req.body };
      if (req.user.role !== "admin") delete payload.cost;
      payload.sku = String(payload.sku || "").trim();
      payload.category = String(payload.category || "").trim();
      if (!payload.sku || !payload.category || !payload.name) {
        return res.status(400).json({ error: "Nombre, categoría y referencia son obligatorios." });
      }
      const existing = await Product.findOne({
        sku: { $regex: `^${payload.sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
      });
      if (existing) {
        return res.status(409).json({
          error: `La referencia ${existing.sku} ya existe en “${existing.name}”. Agrégala a ese producto.`,
          existing: {
            id: existing.id,
            _id: existing._id,
            name: existing.name,
            sku: existing.sku,
            stock: existing.stock
          }
        });
      }
      const product = await Product.create(payload);
      res.status(201).json(product);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: "Ya existe un producto con ese SKU." });
      }
      res.status(400).json({ error: "No se pudo crear el producto." });
    }
  });

  app.post("/api/products/:id/stock", authRequired, staffOnly, async (req, res) => {
    const add = Number(req.body.add);
    if (!Number.isFinite(add) || add < 1) {
      return res.status(400).json({ error: "Indica una cantidad válida para sumar al stock." });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado." });
    product.stock += add;
    await product.save();
    res.json(product);
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

  app.get("/api/orders", authRequired, async (req, res) => {
    const filter = req.user.role === "cliente" ? { userId: req.user.id } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  });

  app.post("/api/orders", authRequired, async (req, res) => {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }
    const total = items.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0);
    const order = await Order.create({
      userId: req.user.id,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      })),
      total,
      note: String(req.body.note || "")
    });
    res.status(201).json(order);
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Error interno del servidor." });
  });

  return app;
}
