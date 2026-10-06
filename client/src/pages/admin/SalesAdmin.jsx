import { useEffect, useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { api, money } from "../../api.js";

export default function SalesAdmin() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  async function load() {
    const [nextSales, nextProducts] = await Promise.all([api("/api/sales"), api("/api/products")]);
    setSales(nextSales);
    setProducts(nextProducts);
    if (!productId && nextProducts[0]) setProductId(nextProducts[0]._id);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function sell(event) {
    event.preventDefault();
    await api("/api/sales", {
      method: "POST",
      body: JSON.stringify({ productId, quantity: Number(quantity) })
    });
    await load();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold mb-6">Ventas</h1>
      <form onSubmit={sell} className="bg-white rounded-2xl p-6 grid md:grid-cols-3 gap-4 mb-8">
        <TextField select label="Producto" value={productId} onChange={(e) => setProductId(e.target.value)}>
          {products.map((product) => (
            <MenuItem key={product._id} value={product._id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Cantidad" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <Button type="submit" variant="contained">Registrar venta</Button>
      </form>
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-fog text-left">
            <tr>
              <th className="p-4">Fecha</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-t border-[#eef0f6]">
                <td className="p-4">{new Date(sale.createdAt).toLocaleString("es-CO")}</td>
                <td>{sale.productId?.name}</td>
                <td>{sale.quantity}</td>
                <td>{money.format(sale.quantity * sale.unitPrice)}</td>
                <td>{sale.userId?.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
