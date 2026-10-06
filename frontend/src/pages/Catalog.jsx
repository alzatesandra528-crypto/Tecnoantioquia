import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Search from "@mui/icons-material/Search";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../api.js";
import { whatsappHref } from "../store.js";

const chips = ["Todas", "Celulares", "Audio", "Accesorios", "Relojes", "Variedades"];

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("destacados");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const category = params.get("categoria") || "Todas";

  useEffect(() => {
    api("/api/catalog").then(setProducts).catch(() => setProducts([]));
  }, []);

  const counts = useMemo(() => {
    const next = { Todas: products.length };
    products.forEach((item) => {
      next[item.category] = (next[item.category] || 0) + 1;
    });
    return next;
  }, [products]);

  function setCategory(name) {
    const next = new URLSearchParams(params);
    if (name === "Todas") next.delete("categoria");
    else next.set("categoria", name);
    setParams(next);
  }

  const visible = products
    .filter((item) => category === "Todas" || item.category === category)
    .filter((item) => {
      const haystack = `${item.name} ${item.category} ${item.subtitle || ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .filter((item) => (minPrice === "" ? true : item.price >= Number(minPrice)))
    .filter((item) => (maxPrice === "" ? true : item.price <= Number(maxPrice)))
    .filter((item) => {
      if (availability === "stock") return item.stock > 0;
      if (availability === "consult") return item.stock <= 0;
      return true;
    })
    .sort((a, b) => {
      if (sort === "precio-asc") return a.price - b.price;
      if (sort === "precio-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-fog min-h-screen">
      <StoreHeader />
      <main className="px-6 lg:px-[72px] py-10">
        <p className="text-xs text-mute">
          <Link to="/" className="text-mute no-underline">Inicio</Link> / Catálogo
        </p>
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-3">
          <div>
            <h1 className="text-[40px] font-extrabold leading-tight">Encuentra tu próxima conexión.</h1>
            <p className="text-mute mt-2">Celulares y accesorios para lo que viene. Elige y consulta por WhatsApp.</p>
          </div>
          <span className="self-start rounded-full bg-[#edf1ff] text-connect text-xs font-semibold px-3 py-1">
            Catálogo de demostración
          </span>
        </div>

        <label className="mt-6 bg-white border border-[#e3e6f0] rounded-xl h-12 px-4 flex items-center gap-3">
          <Search sx={{ color: "#687089" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca celulares, accesorios y más..."
            className="w-full outline-none bg-transparent text-sm"
          />
        </label>

        <div className="flex flex-wrap gap-2 mt-4">
          {chips.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`h-9 px-4 rounded-full text-sm font-semibold ${
                category === item ? "bg-connect text-white" : "bg-white text-mute"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 mt-8">
          <aside className="bg-white rounded-[14px] p-5 h-fit">
            <div className="flex justify-between items-center">
              <p className="font-bold">Filtros</p>
              <button type="button" className="text-connect text-xs" onClick={() => {
                setCategory("Todas");
                setMinPrice("");
                setMaxPrice("");
                setAvailability("all");
                setQuery("");
              }}>
                Limpiar
              </button>
            </div>
            <p className="text-xs font-bold mt-5 mb-2">Categoría</p>
            {chips.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm py-1">
                <input type="checkbox" checked={category === item} onChange={() => setCategory(item)} />
                <span className="flex-1">{item === "Todas" ? "Todos" : item}</span>
                <span className="text-mute">{counts[item === "Todas" ? "Todas" : item] || 0}</span>
              </label>
            ))}
            <p className="text-xs font-bold mt-5 mb-2">Precio en COP</p>
            <div className="grid grid-cols-2 gap-2">
              <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="$0" className="border border-[#e3e6f0] rounded-lg px-2 py-1 text-sm" />
              <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="$1.500.000" className="border border-[#e3e6f0] rounded-lg px-2 py-1 text-sm" />
            </div>
            <p className="text-xs font-bold mt-5 mb-2">Disponibilidad</p>
            <label className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={availability === "stock"} onChange={() => setAvailability(availability === "stock" ? "all" : "stock")} />
              Con stock
            </label>
            <label className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={availability === "consult"} onChange={() => setAvailability(availability === "consult" ? "all" : "consult")} />
              Por consultar
            </label>
            <div className="bg-[#edf1ff] rounded-xl p-4 mt-5">
              <ChatBubbleOutlined sx={{ color: "#305BFF", fontSize: 20 }} />
              <p className="font-bold text-sm mt-2">¿No sabes cuál elegir?</p>
              <p className="text-xs text-mute mt-1">Te ayudamos a comparar opciones por WhatsApp.</p>
              <a href={whatsappHref("Hola, necesito asesoría para elegir un producto.")} className="text-connect text-xs font-semibold mt-2 inline-block no-underline">
                Pedir asesoría ↗
              </a>
            </div>
          </aside>

          <div>
            <div className="flex justify-between items-center mb-4 text-sm text-mute">
              <p>{visible.length} productos · {category === "Todas" ? "Todos los productos" : category}</p>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white border border-[#e3e6f0] rounded-lg h-9 px-3 text-ink">
                <option value="destacados">Ordenar: Destacados</option>
                <option value="precio-asc">Precio menor</option>
                <option value="precio-desc">Precio mayor</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {visible.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <p className="text-center text-xs text-mute mt-8">Mostrando {visible.length} de {products.length} productos de demostración.</p>
          </div>
        </div>
        <p className="text-xs text-mute mt-10">
          Precios y stock de muestra en COP. La disponibilidad y las condiciones de compra, entrega, garantía o financiación se confirman directamente por WhatsApp.
        </p>
      </main>
      <StoreFooter />
    </div>
  );
}
