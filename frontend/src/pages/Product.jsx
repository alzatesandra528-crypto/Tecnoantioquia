import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { api, money } from "../api.js";
import { WHATSAPP_DISPLAY, isAvailable, productSubtitle, whatsappHref } from "../store.js";
import { productImages } from "../catalogImages.js";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [variantIndex, setVariantIndex] = useState(0);
  const [tab, setTab] = useState("descripcion");

  useEffect(() => {
    api(`/api/catalog/${id}`)
      .then((item) => {
        setProduct(item);
        setImageIndex(0);
        setQty(1);
        setVariantIndex(0);
      })
      .catch(() => setProduct(null));
    api("/api/catalog").then(setRelated).catch(() => setRelated([]));
  }, [id]);

  const images = product ? productImages(product) : [];
  const variant = product?.variants?.[variantIndex];
  const available = product ? isAvailable(product) : false;
  const price = variant?.price || product?.price || 0;

  const message = useMemo(() => {
    if (!product) return "";
    return `Hola, me interesa el ${product.name}${variant?.capacity ? `, ${variant.capacity}` : ""}${variant?.color ? `, ${variant.color}` : ""}. Cantidad: ${qty}. Precio de referencia: ${money.format(price)}. ¿Está disponible?`;
  }, [product, variant, qty, price]);

  if (!product) {
    return (
      <div>
        <StoreHeader />
        <p className="p-12">Cargando producto...</p>
      </div>
    );
  }

  const specs = product.specs || {
    Pantalla: "Consulta ficha",
    Memoria: variant?.capacity || "—",
    Conectividad: "Consulta con el asesor"
  };

  return (
    <div className="bg-white">
      <StoreHeader />
      <main className="px-6 lg:px-[72px] py-8">
        <p className="text-xs text-mute">
          <Link to="/" className="text-mute no-underline">Inicio</Link>
          {" / "}
          <Link to="/catalogo" className="text-mute no-underline">Catálogo</Link>
          {" / "}
          {product.category} / {product.name}
        </p>

        <div className="grid lg:grid-cols-2 gap-10 mt-6">
          <div>
            <div className="relative bg-fog rounded-[24px] p-6 min-h-[420px] flex items-center justify-center">
              <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-xs text-mute">
                {product.category}{variant?.color ? ` · ${variant.color.split(" ")[0]}` : ""}
              </span>
              <img src={images[imageIndex]} alt={product.name} className="max-h-[360px] object-contain" />
            </div>
            <div className="flex gap-3 mt-4">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border ${index === imageIndex ? "border-connect" : "border-[#e3e6f0]"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-mute mt-3">Fotografías ilustrativas · Producto y precio de demostración.</p>
          </div>

          <div>
            <div className="flex justify-between items-start gap-4">
              <p className="text-xs tracking-widest text-mute">{product.sku}</p>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${available ? "bg-[#e8f6f0] text-[#177c62]" : "bg-[#edf1ff] text-connect"}`}>
                {available ? `Disponible · ${product.stock} unidades` : "Por consultar"}
              </span>
            </div>
            <h1 className="text-[40px] font-extrabold leading-tight mt-2">{product.name}</h1>
            <p className="text-mute mt-3">{product.description}</p>
            <p className="font-extrabold text-[40px] mt-6">{money.format(price)}</p>
            <p className="text-xs text-mute">Pesos colombianos (COP) · Precio de muestra</p>

            {product.variants?.length > 0 && (
              <>
                <p className="text-sm font-semibold mt-6">Almacenamiento</p>
                <div className="flex gap-2 mt-2">
                  {[...new Set(product.variants.map((item) => item.capacity).filter(Boolean))].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      className={`h-9 px-3 rounded-lg border text-sm ${variant?.capacity === cap ? "border-connect text-connect" : "border-[#e3e6f0]"}`}
                      onClick={() => setVariantIndex(product.variants.findIndex((item) => item.capacity === cap))}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-semibold mt-5">Color: {variant?.color}</p>
                <div className="flex gap-2 mt-2">
                  {product.variants.map((item, index) => (
                    <button
                      key={`${item.color}-${index}`}
                      type="button"
                      onClick={() => setVariantIndex(index)}
                      className={`h-8 w-8 rounded-full border ${index === variantIndex ? "border-connect" : "border-[#e3e6f0]"}`}
                      style={{ background: item.color?.toLowerCase().includes("lila") ? "#cbb4e8" : "#1c2740" }}
                      aria-label={item.color}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center gap-4 mt-6">
              <p className="text-sm font-semibold">Cantidad</p>
              <div className="flex items-center border border-[#e3e6f0] rounded-lg">
                <button type="button" className="w-9 h-9" onClick={() => setQty((n) => Math.max(1, n - 1))}>-</button>
                <span className="w-8 text-center">{qty}</span>
                <button type="button" className="w-9 h-9" onClick={() => setQty((n) => n + 1)}>+</button>
              </div>
              <p className="text-xs text-mute">Máximo {product.stock || 1} en esta variante</p>
            </div>

            <div className="bg-[#edf1ff] rounded-2xl p-4 mt-6 text-sm">
              <p className="text-connect text-[11px] font-bold">TU CONSULTA POR WHATSAPP</p>
              <p className="mt-2">{message}</p>
              <p className="text-xs text-mute mt-2">Destino: {WHATSAPP_DISPLAY} · Sin pago en línea</p>
            </div>
            <a
              href={whatsappHref(message)}
              className="mt-4 h-12 rounded-lg bg-connect text-white font-semibold flex items-center justify-center gap-2 no-underline"
            >
              <ChatBubbleOutlined sx={{ fontSize: 20 }} />
              Comprar por WhatsApp
            </a>
            <p className="text-[11px] text-mute mt-3">
              Confirma disponibilidad y condiciones antes de comprar. Puedes consultar opciones de financiación sujetas a requisitos y aprobación.
            </p>
          </div>
        </div>

        <div className="flex gap-6 mt-12 border-b border-[#e3e6f0] text-sm">
          {["descripcion", "caracteristicas", "antes"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`pb-3 ${tab === key ? "text-connect font-bold border-b-2 border-connect" : "text-mute"}`}
            >
              {key === "descripcion" ? "Descripción" : key === "caracteristicas" ? "Características" : "Antes de comprar"}
            </button>
          ))}
        </div>
        {tab === "descripcion" && (
          <div className="grid lg:grid-cols-2 gap-10 py-8">
            <div>
              <h2 className="text-2xl font-extrabold">Hecho para acompañar tu día.</h2>
              <p className="text-mute mt-3">{product.description}</p>
            </div>
            <div>
              {Object.entries(specs).map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#e3e6f0] py-3 text-sm">
                  <span className="text-mute">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "caracteristicas" && (
          <p className="py-8 text-mute">{productSubtitle(product)}. Consulta la ficha completa con el asesor.</p>
        )}
        {tab === "antes" && (
          <p className="py-8 text-mute">
            Precios y stock de muestra. Confirma disponibilidad, entrega, garantía y financiación por WhatsApp.
          </p>
        )}

        <div className="flex justify-between items-end mt-6">
          <h2 className="text-[34px] font-bold">Completa tu conexión.</h2>
          <Link to="/catalogo" className="text-connect text-sm font-semibold no-underline">Ver accesorios →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 mb-10">
          {related.filter((item) => item._id !== product._id).slice(0, 4).map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
