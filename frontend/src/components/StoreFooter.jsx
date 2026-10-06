import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import { WHATSAPP_DISPLAY, WHATSAPP_LINK } from "../store.js";

export default function StoreFooter() {
  return (
    <footer className="bg-night text-mist px-6 lg:px-[72px] py-10">
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="max-w-[350px]">
          <BrandMark inverted />
          <p className="text-[13px] mt-[18px]">
            Tecnología para tu día a día. Te ayudamos a encontrar lo que necesitas.
          </p>
        </div>
        <div>
          <p className="text-white font-bold text-[15px] mb-2.5">Explora</p>
          <p className="text-[13px]">
            <Link to="/catalogo" className="text-mist no-underline">Catálogo</Link>
            {" · "}
            <a href="/#servicios" className="text-mist no-underline">Servicios</a>
          </p>
          <p className="text-[13px]">
            <a href="/#nosotros" className="text-mist no-underline">Nosotros</a>
            {" · "}
            <a href="/#contacto" className="text-mist no-underline">Contacto</a>
          </p>
        </div>
        <div>
          <p className="text-white font-bold text-[15px]">Conversemos por WhatsApp</p>
          <a href={WHATSAPP_LINK} className="block text-signal font-bold text-xl mt-2.5 no-underline">
            {WHATSAPP_DISPLAY}
          </a>
          <p className="text-xs mt-2.5">Consulta disponibilidad y opciones de compra.</p>
        </div>
      </div>
      <div className="h-px bg-[#303753] my-8" />
      <div className="flex flex-col md:flex-row justify-between gap-2 text-[11px]">
        <p>© 2026 Tecnoantioquia · Tecnología que te conecta</p>
        <p>Catálogo de demostración. Precios y stock de muestra en COP.</p>
      </div>
    </footer>
  );
}
