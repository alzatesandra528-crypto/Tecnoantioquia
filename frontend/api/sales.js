const { query } = require("./_lib/db");
const { send, readBody, getUser } = require("./_lib/http");

module.exports = async function handler(req, res) {
  const auth = getUser(req);
  if (auth.error) {
    return send(res, auth.status, { error: auth.error });
  }

  if (req.method === "GET") {
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
      return send(res, 200, sales);
    } catch (error) {
      console.error(error);
      return send(res, 500, { error: "No se pudieron leer las ventas." });
    }
  }

  if (req.method === "POST") {
    const body = readBody(req);
    const productId = Number(body.productId);
    const cantidad = Number(body.cantidad);

    if (!Number.isInteger(productId) || !Number.isInteger(cantidad) || cantidad < 1) {
      return send(res, 400, { error: "Producto y cantidad válidos son obligatorios." });
    }

    try {
      const products = await query(
        "SELECT id, nombre, precio, stock FROM products WHERE id = ? LIMIT 1",
        [productId]
      );
      const product = products[0];

      if (!product) {
        return send(res, 404, { error: "Producto no encontrado." });
      }
      if (product.stock < cantidad) {
        return send(res, 409, { error: "No hay stock suficiente para esta venta." });
      }

      await query(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [cantidad, productId, cantidad]
      );

      const result = await query(
        "INSERT INTO sales (product_id, cantidad, precio_unitario, user_id) VALUES (?, ?, ?, ?)",
        [productId, cantidad, product.precio, auth.user.id]
      );

      return send(res, 201, {
        id: result.insertId,
        productId,
        producto: product.nombre,
        cantidad,
        precio_unitario: product.precio,
        total: cantidad * Number(product.precio)
      });
    } catch (error) {
      console.error(error);
      return send(res, 500, { error: "No se pudo registrar la venta." });
    }
  }

  return send(res, 405, { error: "Método no permitido." });
};
