import { Link, NavLink } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";

export default function StoreHeader() {
  return (
    <header>
      <div className="bg-night text-mist text-xs py-2 px-6 md:px-16 flex justify-between">
        <span>Cra 52 # 51 - 55, Rionegro · 10:00 AM a 9:00 PM</span>
        <a href="https://wa.me/573015752454">WhatsApp 301 575 2454</a>
      </div>
      <div className="bg-white px-6 md:px-16 py-4 flex items-center justify-between gap-4">
        <Link to="/">
          <BrandMark />
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-semibold text-mute">
          <NavLink to="/catalogo">Catálogo</NavLink>
          <a href="/#servicios">Servicio técnico</a>
          <a href="/#contacto">Contacto</a>
        </nav>
        <div className="flex gap-3">
          <Link to="/catalogo" className="rounded-xl bg-connect text-white px-4 py-2 text-sm font-bold">
            Ver catálogo
          </Link>
          <Link to="/login" className="rounded-xl border border-[#e3e6f0] px-4 py-2 text-sm font-bold text-ink">
            Inventario
          </Link>
        </div>
      </div>
    </header>
  );
}
