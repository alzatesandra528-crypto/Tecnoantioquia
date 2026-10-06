import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import { api, getUser, money, profitOf } from "../../api.js";

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
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Tu catálogo, al día.</h1>
          <p className="text-mute">Agrega productos con precio de compra, precio de venta y ganancia.</p>
        </div>
        {isAdmin && (
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
              <th>Compra</th>
              <th>Venta</th>
              <th>Ganancia</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const profit = profitOf(product);
              return (
                <tr key={product._id} className="border-t border-[#eef0f6]">
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{money.format(product.cost || 0)}</td>
                  <td>{money.format(product.price)}</td>
                  <td className="font-semibold text-[#177c62]">
                    {money.format(profit.amount)}
                    <span className="block text-xs text-mute">{profit.percent.toFixed(0)}%</span>
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
