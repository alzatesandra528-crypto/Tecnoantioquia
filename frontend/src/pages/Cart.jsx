import { Link, useNavigate } from "react-router-dom";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import { api, money } from "../api.js";
import { useAuth } from "../auth.jsx";
import { useCart } from "../cart.jsx";

export default function Cart() {
  const cart = useCart();
  const auth = useAuth();
  const navigate = useNavigate();
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function placeOrder() {
    if (!auth.isLoggedIn) {
      navigate("/login");
      return;
    }
    await api("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      })
    });
    cart.clear();
    navigate("/cuenta");
  }

  return (
    <div className="bg-fog min-h-screen">
      <StoreHeader />
      <main className="px-6 lg:px-[72px] py-10">
        <h1 className="text-4xl font-extrabold">Tu carrito</h1>
        {cart.items.length === 0 ? (
          <p className="text-mute mt-6">
            Aún no hay productos. <Link to="/catalogo" className="text-connect font-semibold">Ir al catálogo</Link>
          </p>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-8">
            <div className="bg-white rounded-2xl divide-y divide-[#eef0f6]">
              {cart.items.map((item) => (
                <div key={item.productId} className="p-5 flex justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-mute text-sm">{money.format(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button type="button" onClick={() => cart.setQuantity(item.productId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => cart.setQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button type="button" className="text-sm text-mute" onClick={() => cart.remove(item.productId)}>
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            <aside className="bg-white rounded-2xl p-6 h-fit">
              <p className="text-mute text-sm">Total</p>
              <p className="text-3xl font-extrabold">{money.format(total)}</p>
              <button type="button" onClick={placeOrder} className="mt-4 w-full h-12 rounded-lg bg-connect text-white font-semibold">
                {auth.isLoggedIn ? "Hacer pedido" : "Inicia sesión para pedir"}
              </button>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
