import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import { api, money } from "../api.js";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Todas");

  useEffect(() => {
    api("/api/catalog").then(setProducts).catch(() => setProducts([]));
  }, []);

  const categories = ["Todas", ...new Set(products.map((item) => item.category))];
  const visible = products.filter((item) => category === "Todas" || item.category === category);

  return (
    <div>
      <StoreHeader />
      <main className="px-6 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold">Encuentra tu próxima conexión.</h1>
        <div className="flex gap-2 mt-6 mb-8 flex-wrap">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                category === item ? "bg-connect text-white" : "bg-white text-mute"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((product) => (
            <Link key={product._id} to={`/catalogo/${product._id}`} className="bg-white rounded-2xl p-4">
              <img src={product.images?.[0] || "/products/servicio-1.jpg"} alt="" className="h-44 w-full object-cover rounded-xl" />
              <p className="text-xs text-mute mt-3">{product.category}</p>
              <h2 className="font-bold">{product.name}</h2>
              <p className="text-connect font-extrabold">{money.format(product.price)}</p>
            </Link>
          ))}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
