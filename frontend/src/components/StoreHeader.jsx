import { Link, NavLink } from "react-router-dom";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import BrandMark from "./BrandMark.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { homeFor, useAuth } from "../auth.jsx";
import { useCart } from "../cart.jsx";
import { useSite } from "../site.jsx";

const links = [
  { to: "/", label: "Inicio", end: true },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#servicios", label: "Servicios", hash: true },
  { to: "/#nosotros", label: "Nosotros", hash: true },
  { to: "/#contacto", label: "Contacto", hash: true }
];

export default function StoreHeader() {
  const auth = useAuth();
  const cart = useCart();
  const { site } = useSite();

  return (
    <header>
      <div className="bg-night h-8 px-6 lg:px-[72px] flex items-center justify-between text-[11px]">
        <span className="text-mist">{site.headerNote}</span>
        <a href={site.whatsappLink} className="text-white no-underline">
          Hablemos: {site.whatsappDisplay}
        </a>
      </div>
      <div className="bg-card border-b border-border h-[88px] px-6 lg:px-[72px] flex items-center justify-between gap-4">
        <BrandMark />
        <nav className="hidden md:flex items-center gap-[26px] text-sm" aria-label="Principal">
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
        <div className="flex items-center gap-2 text-ink">
          <ThemeToggle />
          <Link to="/carrito" className="text-xs font-semibold text-ink no-underline">
            Carrito ({cart.count})
          </Link>
          {auth.isLoggedIn ? (
            <Link to={homeFor(auth.user.role)} className="text-xs font-semibold text-mute no-underline">
              {auth.user.role === "cliente" ? "Mi cuenta" : "Panel"}
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-semibold text-mute no-underline">
                Entrar
              </Link>
              <Link to="/registro" className="hidden sm:inline text-xs font-semibold text-connect no-underline">
                Crear cuenta
              </Link>
            </>
          )}
          <a
            href={site.whatsappLink}
            className="inline-flex h-[38px] items-center gap-2.5 rounded-lg bg-connect px-3.5 text-xs font-semibold text-white no-underline"
          >
            <ChatBubbleOutlined sx={{ fontSize: 20 }} />
            Escríbenos
          </a>
        </div>
      </div>
    </header>
  );
}
