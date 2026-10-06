import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import { api, money } from "../api.js";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api(`/api/catalog/${id}`).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return (
      <div>
        <StoreHeader />
        <p className="p-12">Cargando producto...</p>
      </div>
    );
  }

  const message = encodeURIComponent(`Hola, quiero información sobre ${product.name}`);

  return (
    <div>
      <StoreHeader />
      <main className="px-6 md:px-16 py-12 grid md:grid-cols-2 gap-10">
        <img src={product.images?.[0] || "/products/servicio-1.jpg"} alt={product.name} className="rounded-3xl w-full object-cover" />
        <div>
          <p className="text-mute text-sm">{product.category} · {product.sku}</p>
          <h1 className="text-4xl font-extrabold mt-2">{product.name}</h1>
          <p className="text-3xl font-extrabold text-connect mt-4">{money.format(product.price)}</p>
          <p className="text-mute mt-6">{product.description}</p>
          <p className="mt-4 font-semibold">Stock: {product.stock}</p>
          <a
            className="inline-block mt-8 bg-connect text-white rounded-xl px-5 py-3 font-bold"
            href={`https://wa.me/573015752454?text=${message}`}
          >
            Compra por WhatsApp
          </a>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
