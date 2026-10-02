const { query } = require("../../_lib/db");
const { send, readBody, getUser, requireAdmin } = require("../../_lib/http");

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

  const denied = requireAdmin(auth.user);
  if (denied) {
    return send(res, denied.status, { error: denied.error });
  }

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    return send(res, 400, { error: "Identificador inválido." });
  }

  if (req.method === "PUT") {
    const data = parseProduct(readBody(req));
    if (data.error) {
      return send(res, 400, { error: data.error });
    }

    try {
      const result = await query(
        "UPDATE products SET nombre = ?, sku = ?, categoria = ?, precio = ?, stock = ?, descripcion = ? WHERE id = ?",
        [data.nombre, data.sku, data.categoria, data.precio, data.stock, data.descripcion, id]
      );
      if (result.affectedRows === 0) {
        return send(res, 404, { error: "Producto no encontrado." });
      }
      return send(res, 200, { id, ...data });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return send(res, 409, { error: "Ya existe un producto con ese SKU." });
      }
      console.error(error);
      return send(res, 500, { error: "No se pudo actualizar el producto." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await query("DELETE FROM products WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return send(res, 404, { error: "Producto no encontrado." });
      }
      res.statusCode = 204;
      return res.end();
    } catch (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return send(res, 409, {
          error: "No se puede eliminar: el producto ya tiene ventas registradas."
        });
      }
      console.error(error);
      return send(res, 500, { error: "No se pudo eliminar el producto." });
    }
  }

  return send(res, 405, { error: "Método no permitido." });
};
