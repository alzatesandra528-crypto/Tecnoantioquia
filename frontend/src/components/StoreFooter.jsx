import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import { useSite } from "../site.jsx";

export default function StoreFooter() {
  const { site } = useSite();
  return (
    <footer className="bg-night text-mist px-6 lg:px-[72px] py-10">
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="max-w-[350px]">
          <BrandMark inverted />
          <p className="text-[13px] mt-[18px]">{site.footer.text}</p>
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
          <a href={site.whatsappLink} className="block text-signal font-bold text-xl mt-2.5 no-underline">
            {site.whatsappDisplay}
          </a>
          <p className="text-xs mt-2.5">Consulta disponibilidad y opciones de compra.</p>
        </div>
      </div>
      <div className="h-px bg-border my-8 opacity-40" />
      <div className="flex flex-col md:flex-row justify-between gap-2 text-[11px]">
        <p>{site.footer.legal}</p>
        <p>{site.featured.disclaimer}</p>
      </div>
    </footer>
  );
}
