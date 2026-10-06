import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "../../backend/src/db.js";
import { Product } from "../../backend/src/models/Product.js";
import { User } from "../../backend/src/models/User.js";
import { Sale } from "../../backend/src/models/Sale.js";
import { Order } from "../../backend/src/models/Order.js";
import { demoCatalog } from "../../backend/src/seed.js";
import { Site } from "../../backend/src/models/Site.js";
import { defaultSite, mergeSite } from "../../backend/src/siteDefaults.js";

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
    let dbError = "";
    try {
      await connectDb();
      dbOk = true;
    } catch (error) {
      dbError = error.message;
      console.error("MongoDB:", error.message);
    }

    if (req.method === "GET" && url === "/api/health") {
      return json(res, 200, { ok: true, database: dbOk ? "mongodb" : "demo" });
    }

    if (req.method === "GET" && url === "/api/site") {
      if (!dbOk) return json(res, 200, defaultSite);
      const doc = await Site.findOne({ key: "landing" });
      return json(res, 200, mergeSite(doc?.data));
    }

    if (req.method === "PUT" && url === "/api/site") {
      const auth = readUser(req);
      if (auth.role !== "admin") throw Object.assign(new Error("Solo la administradora puede editar la tienda."), { status: 403 });
      const merged = mergeSite(await readBody(req));
      const doc = await Site.findOneAndUpdate({ key: "landing" }, { data: merged }, { upsert: true, new: true });
      return json(res, 200, mergeSite(doc.data));
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
      if (!dbOk) {
        return json(res, 503, {
          error: dbError || "Falta conexión a MongoDB. En Vercel agrega MONGODB_URI y JWT_SECRET."
        });
      }
      const body = await readBody(req);
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!username || !password) {
        return json(res, 400, { error: "Usuario y contraseña son obligatorios." });
      }
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return json(res, 401, { error: "Credenciales incorrectas." });
      }
      if (user.active === false) {
        return json(res, 403, { error: "Esta cuenta está desactivada." });
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, name: user.name || "" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return json(res, 200, {
        token,
        user: { id: user.id, username: user.username, role: user.role, name: user.name || "" }
      });
    }

    if (req.method === "POST" && url === "/api/auth/register") {
      if (!dbOk) {
        return json(res, 503, {
          error: dbError || "Falta conexión a MongoDB. En Vercel agrega MONGODB_URI y JWT_SECRET."
        });
      }
      const body = await readBody(req);
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "").trim();
      if (!username || !password) {
        return json(res, 400, { error: "Usuario y contraseña son obligatorios." });
      }
      if (password.length < 6) {
        return json(res, 400, { error: "La contraseña debe tener al menos 6 caracteres." });
      }
      try {
        const created = await User.create({
          username,
          name,
          passwordHash: await bcrypt.hash(password, 10),
          role: "cliente"
        });
        const token = jwt.sign(
          { id: created.id, username: created.username, role: created.role, name: created.name || "" },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        return json(res, 201, {
          token,
          user: { id: created.id, username: created.username, role: created.role, name: created.name || "" }
        });
      } catch (error) {
        if (error.code === 11000) return json(res, 409, { error: "Ese usuario ya existe." });
        return json(res, 400, { error: "No se pudo crear la cuenta." });
      }
    }

    if (url === "/api/users" && req.method === "GET") {
      const auth = readUser(req);
      if (auth.role !== "admin") throw Object.assign(new Error("Solo la administradora puede ver el equipo."), { status: 403 });
      if (!dbOk) {
        return json(res, 503, { error: dbError || "Falta conexión a MongoDB." });
      }
      const users = await User.find({ role: { $in: ["admin", "vendedor"] } })
        .select("username role name active createdAt")
        .sort({ createdAt: -1 });
      return json(res, 200, users);
    }

    if (url === "/api/users" && req.method === "POST") {
      const auth = readUser(req);
      if (auth.role !== "admin") throw Object.assign(new Error("Solo la administradora puede crear vendedores."), { status: 403 });
      const body = await readBody(req);
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "").trim();
      if (!username || !password) {
        return json(res, 400, { error: "Usuario y contraseña son obligatorios." });
      }
      try {
        const created = await User.create({
          username,
          name,
          passwordHash: await bcrypt.hash(password, 10),
          role: "vendedor"
        });
        return json(res, 201, { id: created.id, username: created.username, role: created.role, name: created.name });
      } catch (error) {
        if (error.code === 11000) return json(res, 409, { error: "Ese usuario ya existe." });
        return json(res, 400, { error: "No se pudo crear el vendedor." });
      }
    }

    const userId = url.match(/^\/api\/users\/([^/]+)$/);
    if (userId && req.method === "PUT") {
      const auth = readUser(req);
      if (auth.role !== "admin") throw Object.assign(new Error("Solo la administradora puede editar el equipo."), { status: 403 });
      const user = await User.findById(userId[1]);
      if (!user) return json(res, 404, { error: "Usuario no encontrado." });
      const body = await readBody(req);
      if (user.role === "admin" && String(user.id) === String(auth.id) && body.active === false) {
        return json(res, 400, { error: "No puedes desactivar tu propia cuenta." });
      }
      if (body.name !== undefined) user.name = String(body.name).trim();
      if (body.username) user.username = String(body.username).trim().toLowerCase();
      if (body.active !== undefined) user.active = Boolean(body.active);
      if (body.password) user.passwordHash = await bcrypt.hash(String(body.password), 10);
      try {
        await user.save();
        return json(res, 200, { id: user.id, username: user.username, role: user.role, name: user.name, active: user.active });
      } catch (error) {
        if (error.code === 11000) return json(res, 409, { error: "Ese usuario ya existe." });
        return json(res, 400, { error: "No se pudo actualizar el usuario." });
      }
    }

    if (userId && req.method === "DELETE") {
      const auth = readUser(req);
      if (auth.role !== "admin") throw Object.assign(new Error("Solo la administradora puede eliminar vendedores."), { status: 403 });
      if (String(userId[1]) === String(auth.id)) {
        return json(res, 400, { error: "No puedes eliminar tu propia cuenta." });
      }
      const user = await User.findByIdAndDelete(userId[1]);
      if (!user) return json(res, 404, { error: "Usuario no encontrado." });
      res.statusCode = 204;
      return res.end();
    }

    if (url === "/api/products" && req.method === "GET") {
      const auth = readUser(req);
      if (!dbOk) {
        return json(res, 503, {
          error: dbError || "Falta conexión a MongoDB. En Vercel agrega MONGODB_URI y JWT_SECRET."
        });
      }
      const products = await Product.find().sort({ name: 1 });
      if (auth.role !== "admin") {
        return json(
          res,
          200,
          products.map((item) => {
            const data = item.toObject();
            delete data.cost;
            return data;
          })
        );
      }
      return json(res, 200, products);
    }

    if (url === "/api/products" && req.method === "POST") {
      const user = readUser(req);
      if (user.role !== "admin" && user.role !== "vendedor") {
        return json(res, 403, { error: "No tienes permiso para agregar productos." });
      }
      const payload = await readBody(req);
      if (user.role !== "admin") delete payload.cost;
      payload.sku = String(payload.sku || "").trim();
      payload.category = String(payload.category || "").trim();
      if (!payload.sku || !payload.category || !payload.name) {
        return json(res, 400, { error: "Nombre, categoría y referencia son obligatorios." });
      }
      const existing = await Product.findOne({
        sku: { $regex: `^${payload.sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
      });
      if (existing) {
        return json(res, 409, {
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
      try {
        const product = await Product.create(payload);
        return json(res, 201, product);
      } catch (error) {
        if (error.code === 11000) return json(res, 409, { error: "Ya existe un producto con ese SKU." });
        return json(res, 400, { error: "No se pudo crear el producto." });
      }
    }

    const stockAdd = url.match(/^\/api\/products\/([^/]+)\/stock$/);
    if (stockAdd && req.method === "POST") {
      const user = readUser(req);
      if (user.role !== "admin" && user.role !== "vendedor") {
        return json(res, 403, { error: "No tienes permiso para esta acción." });
      }
      const body = await readBody(req);
      const add = Number(body.add);
      if (!Number.isFinite(add) || add < 1) {
        return json(res, 400, { error: "Indica una cantidad válida para sumar al stock." });
      }
      const product = await Product.findById(stockAdd[1]);
      if (!product) return json(res, 404, { error: "Producto no encontrado." });
      product.stock += add;
      await product.save();
      return json(res, 200, product);
    }

    const productId = url.match(/^\/api\/products\/([^/]+)$/);
    if (productId && req.method === "PUT") {
      const user = readUser(req);
      if (user.role !== "admin") {
        return json(res, 403, { error: "Solo la administradora puede editar o eliminar productos." });
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
        return json(res, 403, { error: "Solo la administradora puede editar o eliminar productos." });
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

    if (url === "/api/orders" && req.method === "GET") {
      const auth = readUser(req);
      const filter = auth.role === "cliente" ? { userId: auth.id } : {};
      const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50);
      return json(res, 200, orders);
    }

    if (url === "/api/orders" && req.method === "POST") {
      const auth = readUser(req);
      const body = await readBody(req);
      const items = Array.isArray(body.items) ? body.items : [];
      if (!items.length) return json(res, 400, { error: "El carrito está vacío." });
      const total = items.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0);
      const order = await Order.create({
        userId: auth.id,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        })),
        total,
        note: String(body.note || "")
      });
      return json(res, 201, order);
    }

    return json(res, 404, { error: "Ruta no encontrada." });
  } catch (error) {
    console.error(error);
    return json(res, error.status || 500, { error: error.message || "Error de la API." });
  }
}
