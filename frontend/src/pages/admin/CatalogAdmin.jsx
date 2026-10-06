import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip, IconButton, Tooltip } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import { api, getUser, money, profitOf } from "../../api.js";

export default function CatalogAdmin() {
  const [products, setProducts] = useState([]);
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const canAdd = isAdmin || user?.role === "vendedor";

  async function load() {
    setProducts(await api("/api/products"));
  }

  useEffect(() => {
    load().catch(() => setProducts([]));
  }, []);

  async function remove(id) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await api(`/api/products/${id}`, { method: "DELETE" });
    await load();
  }

  async function togglePublished(product) {
    await api(`/api/products/${product._id}`, {
      method: "PUT",
      body: JSON.stringify({ ...product, published: !product.published })
    });
    await load();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Tu catálogo, al día.</h1>
          <p className="text-mute">
            {isAdmin
              ? "Usa los iconos para editar, desactivar o eliminar. La ganancia se calcula con compra y venta."
              : "Puedes agregar productos nuevos. Editar, desactivar o eliminar solo lo hace la administradora."}
          </p>
        </div>
        {canAdd && (
          <Button component={Link} to="/admin/producto/nuevo" variant="contained">
            Nuevo producto
          </Button>
        )}
      </div>
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-fog text-mute text-left">
            <tr>
              <th className="p-4">Producto</th>
              <th>SKU</th>
              {isAdmin && <th>Compra</th>}
              <th>Venta</th>
              {isAdmin && <th>Ganancia</th>}
              <th>Stock</th>
              <th>Estado</th>
              <th className="text-right pr-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const profit = profitOf(product);
              return (
                <tr key={product._id} className="border-t border-[#eef0f6]">
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td>{product.sku}</td>
                  {isAdmin && <td>{money.format(product.cost || 0)}</td>}
                  <td>{money.format(product.price)}</td>
                  {isAdmin && (
                    <td className="font-semibold text-[#177c62]">
                      {money.format(profit.amount)}
                      <span className="block text-xs text-mute">{profit.percent.toFixed(0)}%</span>
                    </td>
                  )}
                  <td>
                    <Chip size="small" label={product.stock} color={product.stock <= 3 ? "error" : "default"} />
                  </td>
                  <td>
                    <Chip size="small" label={product.published ? "Visible" : "Oculto"} color={product.published ? "success" : "default"} />
                  </td>
                  <td className="p-2 text-right whitespace-nowrap">
                    {isAdmin && (
                      <>
                        <Tooltip title="Editar">
                          <IconButton color="primary" component={Link} to={`/admin/producto/${product._id}`}>
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={product.published ? "Desactivar" : "Activar"}>
                          <IconButton color={product.published ? "warning" : "success"} onClick={() => togglePublished(product)}>
                            {product.published ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => remove(product._id)}>
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
