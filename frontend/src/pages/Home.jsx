import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import Smartphone from "@mui/icons-material/Smartphone";
import Headphones from "@mui/icons-material/Headphones";
import Cable from "@mui/icons-material/Cable";
import Watch from "@mui/icons-material/Watch";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Build from "@mui/icons-material/Build";
import Laptop from "@mui/icons-material/Laptop";
import Forum from "@mui/icons-material/Forum";
import SignalCellularAlt from "@mui/icons-material/SignalCellularAlt";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../api.js";
import { WHATSAPP_DISPLAY, WHATSAPP_LINK, whatsappHref } from "../store.js";
import { storeImages } from "../catalogImages.js";

const categories = [
  { name: "Celulares", hint: "Para ir más allá", Icon: Smartphone },
  { name: "Audio", hint: "Tu día suena mejor", Icon: Headphones },
  { name: "Accesorios", hint: "Pequeños esenciales", Icon: Cable },
  { name: "Relojes", hint: "A tu ritmo", Icon: Watch },
  { name: "Variedades", hint: "Descubre algo nuevo", Icon: CardGiftcard }
];

const faqs = [
  [
    "¿Cómo compro un producto?",
    "Selecciona una variante y cantidad. Envía el resumen por WhatsApp para confirmar precio, disponibilidad y forma de compra."
  ],
  [
    "¿Puedo consultar por servicio técnico?",
    "Sí. Cuéntanos el modelo de tu equipo y qué sucede para orientarte sobre la revisión."
  ],
  [
    "¿Cómo confirmo las condiciones de mi compra?",
    "Consulta directamente por entrega, garantía y opciones de financiación antes de acordar la compra."
  ]
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api("/api/catalog").then(setProducts).catch(() => setProducts([]));
  }, []);

  const featuredOrder = ["CEL-001", "AUD-001", "ACC-025", "AUD-002"];
  const featured = [
    ...featuredOrder.map((sku) => products.find((item) => item.sku === sku)).filter(Boolean),
    ...products.filter((item) => !featuredOrder.includes(item.sku))
  ].slice(0, 4);

  return (
    <div className="bg-white">
      <StoreHeader />

      <section className="bg-night">
        <div className="px-6 lg:px-[72px] py-16 grid lg:grid-cols-[590px_1fr] gap-9 items-center">
          <div>
            <p className="text-signal text-xs tracking-wide">TU PRÓXIMA CONEXIÓN EMPIEZA AQUÍ</p>
            <h1 className="text-white font-extrabold text-[44px] md:text-[68px] leading-[1.02] mt-6">
              Más tecnología.
              <br />
              Más de ti.
            </h1>
            <p className="text-mist text-lg mt-6 max-w-[500px]">
              Celulares, accesorios y soluciones para seguir conectado. Elige lo que va contigo; nosotros te orientamos.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/catalogo"
                className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-connect px-5 text-sm font-semibold text-white no-underline"
              >
                <ArrowOutward sx={{ fontSize: 20 }} />
                Explorar catálogo
              </Link>
              <a
                href={WHATSAPP_LINK}
                className="inline-flex h-12 items-center rounded-lg border border-[#3c456a] bg-[#171d40] px-5 text-sm font-semibold text-white no-underline"
              >
                Asesoría por WhatsApp
              </a>
            </div>
            <p className="text-mist text-xs mt-6">Tecnología que te conecta · Tecnoantioquia</p>
          </div>
          <div className="relative h-[320px] lg:h-[470px] rounded-3xl overflow-hidden">
            <img src={storeImages.heroPhones} alt="Celulares Tecnoantioquia" className="h-full w-full object-cover" />
            <div className="absolute left-6 bottom-6 bg-[rgba(17,24,53,0.91)] rounded-xl p-3.5 flex items-center gap-3">
              <ChatBubbleOutlined sx={{ color: "#fff", fontSize: 20 }} />
              <p className="text-white text-xs">Tu elección, con asesoría cercana.</p>
            </div>
          </div>
        </div>
        <div className="bg-[#171d40] h-auto lg:h-[68px] px-6 lg:px-[72px] py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-[13px] text-white">
          <span className="flex items-center gap-3"><Smartphone sx={{ fontSize: 20 }} /> Tecnología para todos los días</span>
          <span className="flex items-center gap-3"><ChatBubbleOutlined sx={{ fontSize: 20 }} /> Compra conversando por WhatsApp</span>
          <span className="flex items-center gap-3"><Build sx={{ fontSize: 20 }} /> Servicio técnico para tus equipos</span>
        </div>
      </section>

      <section className="px-6 lg:px-[72px] py-16 grid gap-14">
        <div>
          <p className="text-connect text-[11px] font-bold">ENCUENTRA LO TUYO</p>
          <h2 className="text-[34px] font-bold mt-2">Tu mundo, mejor conectado.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {categories.map(({ name, hint, Icon }) => (
              <Link key={name} to={`/catalogo?categoria=${encodeURIComponent(name)}`} className="bg-fog rounded-[14px] p-6 no-underline text-ink">
                <Icon sx={{ color: "#305BFF", fontSize: 28 }} />
                <p className="font-bold text-[17px] mt-3">{name}</p>
                <p className="text-xs text-mute mt-1">{hint}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-connect text-[11px] font-bold">SELECCIÓN PARA TI</p>
              <h2 className="text-[34px] font-bold mt-2">Dale más a tu día.</h2>
              <p className="text-mute mt-2">Explora celulares y accesorios. Consulta los detalles antes de elegir.</p>
            </div>
            <Link to="/catalogo" className="h-[38px] px-3.5 rounded-lg border border-[#e3e6f0] text-xs font-semibold text-ink inline-flex items-center no-underline">
              Ver todo el catálogo →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <p className="text-[11px] text-mute mt-4">
            Productos, precios y disponibilidad de demostración · Valores en pesos colombianos (COP).
          </p>
        </div>

        <div className="bg-[#f0eaff] rounded-3xl p-8 flex flex-col lg:flex-row gap-10 items-center min-h-[240px]">
          <div className="flex-1">
            <h2 className="font-bold text-[35px] leading-tight">Los detalles hacen la conexión.</h2>
            <p className="text-mute mt-4">
              Audio, carga y accesorios que complementan tu celular. Encuentra el compañero ideal para tu equipo.
            </p>
            <Link to="/catalogo?categoria=Accesorios" className="mt-4 inline-flex h-12 items-center rounded-lg border border-[#e3e6f0] bg-white px-5 text-sm font-semibold text-ink no-underline">
              Descubrir accesorios →
            </Link>
          </div>
          <img src={storeImages.accessories} alt="Accesorios" className="w-full lg:w-[430px] h-[210px] object-cover rounded-2xl" />
        </div>
      </section>

      <section id="servicios" className="bg-fog px-6 lg:px-[72px] py-16">
        <p className="text-connect text-[11px] font-bold">MÁS QUE UNA TIENDA</p>
        <h2 className="text-[34px] font-bold mt-2">Tu tecnología merece atención.</h2>
        <p className="text-mute mt-2">Cuéntanos qué necesita tu equipo. Te orientamos sobre el siguiente paso.</p>
        <div className="grid md:grid-cols-3 gap-6 mt-7">
          {[
            [Smartphone, "Servicio para celulares", "Consulta por diagnóstico, revisión y mantenimiento de tu celular."],
            [Laptop, "Equipos de cómputo", "Asesoría para revisión y mantenimiento de computadores."],
            [Forum, "Asesoría de compra", "Compara opciones y encuentra un equipo o accesorio según tu necesidad."]
          ].map(([Icon, title, text]) => (
            <div key={title} className="bg-white border border-[#e3e6f0] rounded-[14px] p-7">
              <Icon sx={{ color: "#305BFF", fontSize: 28 }} />
              <h3 className="font-bold text-[22px] mt-5">{title}</h3>
              <p className="text-mute mt-4">{text}</p>
              <a href={whatsappHref(`Hola, quiero consultar: ${title}`)} className="block mt-4 text-connect font-bold text-[13px] no-underline">
                Consultar servicio ↗
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-connect px-6 lg:px-[72px] py-9 flex flex-col lg:flex-row items-center justify-between gap-6 text-white">
        <div className="flex items-center gap-5">
          <SignalCellularAlt sx={{ fontSize: 32 }} />
          <div>
            <p className="font-bold text-[26px]">Sigue en línea. Consulta tu recarga.</p>
            <p className="text-[15px]">Pregúntanos por operadores, paquetes y montos disponibles.</p>
          </div>
        </div>
        <a href={whatsappHref("Hola, quiero consultar recargas.")} className="inline-flex h-12 items-center gap-2.5 rounded-lg border border-[#3c456a] bg-[#171d40] px-5 text-sm font-semibold text-white no-underline">
          <ChatBubbleOutlined sx={{ fontSize: 20 }} />
          Consultar por WhatsApp
        </a>
      </section>

      <section id="nosotros" className="px-6 lg:px-[72px] py-16 grid lg:grid-cols-[510px_1fr] gap-16 items-center">
        <img src={storeImages.antioquia} alt="Antioquia" className="h-[330px] w-full object-cover rounded-3xl" />
        <div>
          <p className="text-connect text-[11px] font-bold">TECNOLOGÍA CON ACENTO CERCANO</p>
          <h2 className="font-bold text-[40px] leading-[1.1] mt-5">
            Conectados contigo.
            <br />
            Inspirados en nuestra tierra.
          </h2>
          <p className="text-mute mt-5">
            Tecnoantioquia reúne celulares, accesorios, variedades y servicio técnico en un mismo lugar. Nuestra propuesta es simple: ayudarte a elegir, resolver tus dudas y acercar la tecnología a tu día a día.
          </p>
          <p className="font-bold text-impulse mt-5">Tecnología que te conecta.</p>
        </div>
      </section>

      <section className="px-6 lg:px-[72px] pb-14 grid gap-14">
        <div>
          <p className="text-connect text-[11px] font-bold">SIN VUELTAS</p>
          <h2 className="text-[34px] font-bold mt-2">Elige. Pregunta. Conecta.</h2>
          <p className="text-mute mt-2">Tu compra empieza con una conversación, no con un pago en línea.</p>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              ["01", "Encuentra tu producto", "Explora el catálogo y revisa fotos, características y precio."],
              ["02", "Personaliza tu elección", "Selecciona la variante y la cantidad que necesitas."],
              ["03", "Habla con nosotros", "Envía el resumen por WhatsApp y confirma disponibilidad y condiciones."]
            ].map(([n, t, d]) => (
              <div key={n}>
                <p className="text-connect text-[34px]">{n}</p>
                <h3 className="font-bold text-xl mt-3">{t}</h3>
                <p className="text-mute mt-3">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#edf1ff] rounded-2xl p-7 flex flex-col lg:flex-row gap-6 items-center">
          <AccountBalanceWallet sx={{ color: "#305BFF", fontSize: 32 }} />
          <div className="flex-1">
            <p className="font-bold text-[22px]">¿Quieres conocer opciones de financiación?</p>
            <p className="text-mute text-[13px] mt-2">
              Consúltanos. La disponibilidad, requisitos y aprobación están sujetos a las condiciones de cada opción. No implica aprobación automática.
            </p>
          </div>
          <a href={whatsappHref("Hola, quiero consultar opciones de financiación.")} className="h-12 px-5 rounded-lg border border-[#e3e6f0] bg-white text-sm font-semibold text-ink inline-flex items-center no-underline">
            Consultar opciones ↗
          </a>
        </div>

        <div className="grid lg:grid-cols-[390px_1fr] gap-16">
          <div>
            <p className="text-connect text-[11px] font-bold">ANTES DE ELEGIR</p>
            <h2 className="text-[34px] font-bold mt-2">Resolvamos tus dudas.</h2>
            <p className="text-mute mt-4">Si necesitas más información, escríbenos. Estamos para ayudarte a comparar y decidir.</p>
          </div>
          <div>
            {faqs.map(([q, a]) => (
              <div key={q} className="border-b border-[#e3e6f0] py-5">
                <p className="font-bold">{q}</p>
                <p className="text-mute text-sm mt-2.5">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="contacto" className="bg-night rounded-3xl p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-white font-bold text-[38px]">Tu próxima conexión, hablemos.</h2>
            <p className="text-mist mt-3">Celulares, accesorios, recargas o servicio técnico.</p>
            <p className="text-signal font-bold text-xl mt-3">{WHATSAPP_DISPLAY}</p>
          </div>
          <a href={WHATSAPP_LINK} className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-connect px-5 text-sm font-semibold text-white no-underline">
            <ChatBubbleOutlined sx={{ fontSize: 20 }} />
            Escribir por WhatsApp
          </a>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}
