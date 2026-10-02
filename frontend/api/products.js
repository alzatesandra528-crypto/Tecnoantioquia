const { query } = require("./_lib/db");
const { send, readBody, getUser, requireAdmin } = require("./_lib/http");

function parseProduct(body) {
  const nombre = String(body.nombre || "").trim();
  const sku = String(body.sku || "").trim().toUpperCase();
  const categoria = String(body.categoria || "").trim();
  const descripcion = String(body.descripcion || "").trim();
  const precio = Number(body.precio);
  const stock = Number(body.stock);

  if (!nombre || !sku || !categoria) {
    return { error: "Nombre, SKU y categoría son obligatorios." };
  }
  if (!Number.isFinite(precio) || precio < 0) {
    return { error: "El precio debe ser un número válido." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "El stock debe ser un entero mayor o igual a 0." };
  }

  return { nombre, sku, categoria, descripcion, precio, stock };
}

module.exports = async function handler(req, res) {
  const auth = getUser(req);
  if (auth.error) {
    return send(res, auth.status, { error: auth.error });
  }

  if (req.method === "GET") {
    try {
      const products = await query(
        "SELECT id, nombre, sku, categoria, precio, stock, descripcion, updated_at FROM products ORDER BY nombre"
      );
      return send(res, 200, products);
    } catch (error) {
      console.error(error);
      return send(res, 500, { error: "No se pudo leer el inventario." });
    }
  }

  if (req.method === "POST") {
    const denied = requireAdmin(auth.user);
    if (denied) {
      return send(res, denied.status, { error: denied.error });
    }

    const data = parseProduct(readBody(req));
    if (data.error) {
      return send(res, 400, { error: data.error });
    }

    try {
      const result = await query(
        "INSERT INTO products (nombre, sku, categoria, precio, stock, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
        [data.nombre, data.sku, data.categoria, data.precio, data.stock, data.descripcion]
      );
      return send(res, 201, { id: result.insertId, ...data });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return send(res, 409, { error: "Ya existe un producto con ese SKU." });
      }
      console.error(error);
      return send(res, 500, { error: "No se pudo crear el producto." });
    }
  }

  return send(res, 405, { error: "Método no permitido." });
};
