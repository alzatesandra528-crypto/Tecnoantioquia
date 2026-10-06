import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import { api, money } from "../api.js";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api("/api/catalog").then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <StoreHeader />
      <section className="bg-night text-white px-6 md:px-16 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-signal text-xs font-semibold tracking-widest mb-4">TECNOANTIOQUIA</p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Más tecnología.
            <br />
            Más de ti.
          </h1>
          <p className="text-mist mt-6 max-w-lg">
            Celulares, accesorios y servicio técnico en Rionegro. Una marca tecnológica con voz cercana.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/catalogo" className="bg-connect rounded-xl px-5 py-3 font-bold">
              Ver catálogo
            </Link>
            <a href="https://wa.me/573015752454" className="border border-mist rounded-xl px-5 py-3 font-bold">
              WhatsApp
            </a>
          </div>
        </div>
        <img src="/products/servicio-1.jpg" alt="Catálogo" className="rounded-3xl w-full object-cover h-80" />
      </section>

      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-extrabold">Tu escuela, mejor conectada.</h2>
        <p className="text-mute mt-2 mb-8">Equipos y accesorios listos para consulta en tienda.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product._id} to={`/catalogo/${product._id}`} className="bg-white rounded-2xl p-4 shadow-sm">
              <img src={product.images?.[0] || "/products/servicio-1.jpg"} alt="" className="h-48 w-full object-cover rounded-xl" />
              <p className="text-xs text-mute mt-3">{product.category}</p>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-connect font-extrabold">{money.format(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="servicios" className="px-6 md:px-16 py-16 bg-white">
        <h2 className="text-3xl font-extrabold mb-8">Tu tecnología merece atención.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Celulares", "iPhone, Samsung, Redmi y más."],
            ["Accesorios", "Cargadores, audífonos y protección."],
            ["Servicio técnico", "Display, mantenimiento y equipos de cómputo."]
          ].map(([title, text]) => (
            <div key={title} className="border border-[#e3e6f0] rounded-2xl p-6">
              <h3 className="font-extrabold text-xl">{title}</h3>
              <p className="text-mute mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="px-6 md:px-16 py-16">
        <div className="bg-night text-white rounded-3xl p-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold">Tu próxima conexión, hablemos.</h2>
            <p className="text-mist mt-2">Cra 52 # 51 - 55, Rionegro, Antioquia</p>
          </div>
          <a href="https://wa.me/573015752454" className="bg-connect self-start rounded-xl px-5 py-3 font-bold">
            Escribir por WhatsApp
          </a>
        </div>
      </section>
      <StoreFooter />
    </div>
  );
}
