import { NavLink } from "react-router-dom";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import BrandMark from "./BrandMark.jsx";
import { WHATSAPP_DISPLAY, WHATSAPP_LINK } from "../store.js";

const links = [
  { to: "/", label: "Inicio", end: true },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#servicios", label: "Servicios", hash: true },
  { to: "/#nosotros", label: "Nosotros", hash: true },
  { to: "/#contacto", label: "Contacto", hash: true }
];

export default function StoreHeader() {
  return (
    <header>
      <div className="bg-night h-8 px-6 lg:px-[72px] flex items-center justify-between text-[11px]">
        <span className="text-mist">Celulares · Accesorios · Recargas · Servicio técnico</span>
        <a href={WHATSAPP_LINK} className="text-white no-underline">
          Hablemos: {WHATSAPP_DISPLAY}
        </a>
      </div>
      <div className="bg-white h-[88px] px-6 lg:px-[72px] flex items-center justify-between gap-4">
        <BrandMark />
        <nav className="hidden md:flex items-center gap-[26px] text-sm">
          {links.map((link) =>
            link.hash ? (
              <a key={link.label} href={link.to} className="font-medium text-mute no-underline">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `no-underline text-sm ${isActive ? "font-bold text-connect" : "font-medium text-mute"}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>
        <a
          href={WHATSAPP_LINK}
          className="inline-flex h-[38px] items-center gap-2.5 rounded-lg bg-connect px-3.5 text-xs font-semibold text-white no-underline"
        >
          <ChatBubbleOutlined sx={{ fontSize: 20 }} />
          Escríbenos
        </a>
      </div>
    </header>
  );
}
