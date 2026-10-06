import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import { api, money } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Account() {
  const auth = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api("/api/orders").then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="bg-fog min-h-screen">
      <StoreHeader />
      <main className="px-6 lg:px-[72px] py-10">
        <h1 className="text-4xl font-extrabold">Hola, {auth.user?.name || auth.user?.username}</h1>
        <p className="text-mute mt-2">Historial de compras y pedidos.</p>
        <div className="flex gap-4 mt-4">
          <Link to="/carrito" className="text-connect font-semibold">Ver carrito</Link>
          <Link to="/catalogo" className="text-connect font-semibold">Seguir comprando</Link>
        </div>
        <div className="grid gap-4 mt-8">
          {orders.length === 0 && <p className="text-mute">Aún no tienes pedidos.</p>}
          {orders.map((order) => (
            <article key={order._id} className="bg-white rounded-2xl p-6">
              <div className="flex justify-between gap-4">
                <p className="font-bold">Pedido {new Date(order.createdAt).toLocaleString("es-CO")}</p>
                <span className="text-xs font-semibold rounded-full bg-[#edf1ff] text-connect px-3 py-1">{order.status}</span>
              </div>
              <ul className="mt-3 text-sm text-mute">
                {order.items.map((item, index) => (
                  <li key={`${order._id}-${index}`}>
                    {item.quantity} × {item.name} · {money.format(item.unitPrice)}
                  </li>
                ))}
              </ul>
              <p className="font-extrabold mt-3">{money.format(order.total)}</p>
            </article>
          ))}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
