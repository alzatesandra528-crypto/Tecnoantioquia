const express = require("express");
const { query } = require("../db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", authRequired, async (_req, res) => {
  try {
    const sales = await query(`
      SELECT
        s.id,
        s.cantidad,
        s.precio_unitario,
        (s.cantidad * s.precio_unitario) AS total,
        s.created_at,
        p.nombre AS producto,
        p.sku,
        u.username AS vendedor
      FROM sales s
      INNER JOIN products p ON p.id = s.product_id
      INNER JOIN users u ON u.id = s.user_id
      ORDER BY s.created_at DESC
      LIMIT 50
    `);
    return res.json(sales);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "No se pudieron leer las ventas." });
  }
});

router.post("/", authRequired, async (req, res) => {
  const productId = Number(req.body.productId);
  const cantidad = Number(req.body.cantidad);

  if (!Number.isInteger(productId) || !Number.isInteger(cantidad) || cantidad < 1) {
    return res.status(400).json({ error: "Producto y cantidad válidos son obligatorios." });
  }

  try {
    const products = await query(
      "SELECT id, nombre, precio, stock FROM products WHERE id = ? LIMIT 1",
      [productId]
    );
    const product = products[0];

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    if (product.stock < cantidad) {
      return res.status(409).json({ error: "No hay stock suficiente para esta venta." });
    }

    await query(
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
      [cantidad, productId, cantidad]
    );

    const result = await query(
      "INSERT INTO sales (product_id, cantidad, precio_unitario, user_id) VALUES (?, ?, ?, ?)",
      [productId, cantidad, product.precio, req.user.id]
    );

    return res.status(201).json({
      id: result.insertId,
      productId,
      producto: product.nombre,
      cantidad,
      precio_unitario: product.precio,
      total: cantidad * Number(product.precio)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "No se pudo registrar la venta." });
  }
});

module.exports = router;
