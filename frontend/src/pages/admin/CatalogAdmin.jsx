import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import { api, getUser, money } from "../../api.js";

export default function CatalogAdmin() {
  const [products, setProducts] = useState([]);
  const user = getUser();
  const isAdmin = user?.role === "admin";

  async function load() {
    setProducts(await api("/api/products"));
  }

  useEffect(() => {
    load().catch(() => setProducts([]));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Tu catálogo, al día.</h1>
          <p className="text-mute">Inventario conectado a MongoDB</p>
        </div>
        {isAdmin && (
          <Button component={Link} to="/admin/producto/nuevo" variant="contained">
            Nuevo producto
          </Button>
        )}
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-fog text-mute text-left">
            <tr>
              <th className="p-4">Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-[#eef0f6]">
                <td className="p-4 font-semibold">{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>{money.format(product.price)}</td>
                <td>
                  <Chip size="small" label={product.stock} color={product.stock <= 3 ? "error" : "default"} />
                </td>
                <td className="p-4 text-right">
                  {isAdmin && (
                    <Link className="text-connect font-semibold" to={`/admin/producto/${product._id}`}>
                      Editar
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
