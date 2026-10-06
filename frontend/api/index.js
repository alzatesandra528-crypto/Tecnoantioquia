import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "../../backend/src/db.js";
import { Product } from "../../backend/src/models/Product.js";
import { User } from "../../backend/src/models/User.js";
import { Sale } from "../../backend/src/models/Sale.js";
import { demoCatalog } from "../../backend/src/seed.js";

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.end(JSON.stringify(data));
}

function demoProducts() {
  return demoCatalog.map((item) => {
    const product = { ...item, _id: item.sku };
    delete product.cost;
    return product;
  });
}

async function readBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string" && req.body) {
    return JSON.parse(req.body);
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function readUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    throw Object.assign(new Error("Debes iniciar sesión."), { status: 401 });
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw Object.assign(new Error("Sesión inválida o vencida."), { status: 401 });
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      return json(res, 204, {});
    }

    let url = req.url || "/";
    const q = url.indexOf("?");
    if (q >= 0) url = url.slice(0, q);
    if (!url.startsWith("/api")) {
      url = "/api" + (url.startsWith("/") ? url : `/${url}`);
    }

    let dbOk = false;
    try {
      await connectDb();
      dbOk = true;
    } catch (error) {
      console.error("MongoDB:", error.message);
    }

    if (req.method === "GET" && url === "/api/health") {
      return json(res, 200, { ok: true, database: dbOk ? "mongodb" : "demo" });
    }

    if (req.method === "GET" && url === "/api/catalog") {
      if (!dbOk) return json(res, 200, demoProducts());
      const products = await Product.find({ published: true }).select("-cost").sort({ name: 1 });
      return json(res, 200, products);
    }

    const catalogItem = url.match(/^\/api\/catalog\/([^/]+)$/);
    if (req.method === "GET" && catalogItem) {
      if (!dbOk) {
        const found = demoProducts().find((item) => item._id === decodeURIComponent(catalogItem[1]));
        if (!found) return json(res, 404, { error: "Producto no encontrado." });
        return json(res, 200, found);
      }
      const product = await Product.findOne({
        _id: catalogItem[1],
        published: true
      })
        .select("-cost")
        .catch(() => null);
      if (!product) return json(res, 404, { error: "Producto no encontrado." });
      return json(res, 200, product);
    }

    if (req.method === "POST" && url === "/api/auth/login") {
      if (!dbOk) return json(res, 503, { error: "Falta conexión a MongoDB (MONGODB_URI)." });
      const body = await readBody(req);
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (!username || !password) {
        return json(res, 400, { error: "Usuario y contraseña son obligatorios." });
      }
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return json(res, 401, { error: "Credenciales incorrectas." });
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );
      return json(res, 200, {
        token,
        user: { id: user.id, username: user.username, role: user.role }
      });
    }

    if (url === "/api/products" && req.method === "GET") {
      readUser(req);
      if (!dbOk) return json(res, 503, { error: "Falta conexión a MongoDB (MONGODB_URI)." });
      return json(res, 200, await Product.find().sort({ name: 1 }));
    }

    if (url === "/api/products" && req.method === "POST") {
      const user = readUser(req);
      if (user.role !== "admin") {
        return json(res, 403, { error: "Solo el administrador puede modificar el inventario." });
      }
      const product = await Product.create(await readBody(req));
      return json(res, 201, product);
    }

    const productId = url.match(/^\/api\/products\/([^/]+)$/);
    if (productId && req.method === "PUT") {
      const user = readUser(req);
      if (user.role !== "admin") {
        return json(res, 403, { error: "Solo el administrador puede modificar el inventario." });
      }
      const product = await Product.findByIdAndUpdate(productId[1], await readBody(req), {
        new: true,
        runValidators: true
      });
      if (!product) return json(res, 404, { error: "Producto no encontrado." });
      return json(res, 200, product);
    }

    if (productId && req.method === "DELETE") {
      const user = readUser(req);
      if (user.role !== "admin") {
        return json(res, 403, { error: "Solo el administrador puede modificar el inventario." });
      }
      const product = await Product.findByIdAndDelete(productId[1]);
      if (!product) return json(res, 404, { error: "Producto no encontrado." });
      res.statusCode = 204;
      return res.end();
    }

    if (url === "/api/sales" && req.method === "GET") {
      readUser(req);
      const sales = await Sale.find()
        .populate("productId", "name sku")
        .populate("userId", "username")
        .sort({ createdAt: -1 })
        .limit(50);
      return json(res, 200, sales);
    }

    if (url === "/api/sales" && req.method === "POST") {
      const user = readUser(req);
      const body = await readBody(req);
      const quantity = Number(body.quantity);
      const product = await Product.findById(body.productId);
      if (!product) return json(res, 404, { error: "Producto no encontrado." });
      if (!Number.isInteger(quantity) || quantity < 1) {
        return json(res, 400, { error: "Producto y cantidad válidos son obligatorios." });
      }
      if (product.stock < quantity) {
        return json(res, 409, { error: "No hay stock suficiente para esta venta." });
      }
      product.stock -= quantity;
      await product.save();
      const sale = await Sale.create({
        productId: product.id,
        quantity,
        unitPrice: product.price,
        unitCost: product.cost || 0,
        userId: user.id
      });
      return json(res, 201, sale);
    }

    return json(res, 404, { error: "Ruta no encontrada." });
  } catch (error) {
    console.error(error);
    return json(res, error.status || 500, { error: error.message || "Error de la API." });
  }
}
