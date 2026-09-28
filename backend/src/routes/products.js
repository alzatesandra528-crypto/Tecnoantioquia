const express = require("express");
const { query } = require("../db");
const { authRequired, adminOnly } = require("../middleware/auth");

const router = express.Router();

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

router.get("/", authRequired, async (_req, res) => {
  try {
    const products = await query(
      "SELECT id, nombre, sku, categoria, precio, stock, descripcion, updated_at FROM products ORDER BY nombre"
    );
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "No se pudo leer el inventario." });
  }
});

router.post("/", authRequired, adminOnly, async (req, res) => {
  const data = parseProduct(req.body);
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  try {
    const result = await query(
      "INSERT INTO products (nombre, sku, categoria, precio, stock, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
      [data.nombre, data.sku, data.categoria, data.precio, data.stock, data.descripcion]
    );

    return res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ya existe un producto con ese SKU." });
    }
    console.error(error);
    return res.status(500).json({ error: "No se pudo crear el producto." });
  }
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const data = parseProduct(req.body);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Identificador inválido." });
  }
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  try {
    const result = await query(
      "UPDATE products SET nombre = ?, sku = ?, categoria = ?, precio = ?, stock = ?, descripcion = ? WHERE id = ?",
      [data.nombre, data.sku, data.categoria, data.precio, data.stock, data.descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    return res.json({ id, ...data });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ya existe un producto con ese SKU." });
    }
    console.error(error);
    return res.status(500).json({ error: "No se pudo actualizar el producto." });
  }
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Identificador inválido." });
  }

  try {
    const result = await query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    return res.status(204).send();
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        error: "No se puede eliminar: el producto ya tiene ventas registradas."
      });
    }
    console.error(error);
    return res.status(500).json({ error: "No se pudo eliminar el producto." });
  }
});

module.exports = router;
