import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { IconButton } from "@mui/material";
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
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const accountLink = auth.isLoggedIn ? (
    <Link to={homeFor(auth.user.role)} className="text-sm font-semibold text-ink no-underline" onClick={() => setOpen(false)}>
      {auth.user.role === "cliente" ? "Mi cuenta" : "Panel"}
    </Link>
  ) : (
    <>
      <Link to="/login" className="text-sm font-semibold text-ink no-underline" onClick={() => setOpen(false)}>
        Entrar
      </Link>
      <Link to="/registro" className="text-sm font-semibold text-connect no-underline" onClick={() => setOpen(false)}>
        Crear cuenta
      </Link>
    </>
  );

  return (
    <header className="relative z-30">
      <div className="bg-night px-4 sm:px-6 lg:px-[72px] min-h-8 py-1.5 flex items-center justify-between gap-3 text-[11px]">
        <span className="text-mist truncate hidden sm:block">{site.headerNote}</span>
        <a href={site.whatsappLink} className="text-white no-underline whitespace-nowrap ml-auto">
          WhatsApp {site.whatsappDisplay}
        </a>
      </div>
      <div className="bg-card border-b border-border h-16 md:h-[88px] px-4 sm:px-6 lg:px-[72px] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <BrandMark />
        </div>
        <nav className="hidden lg:flex items-center gap-6 text-sm shrink-0" aria-label="Principal">
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
        <div className="flex items-center gap-1 sm:gap-2 text-ink shrink-0">
          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>
          <Link
            to="/carrito"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink no-underline relative"
            aria-label={`Carrito, ${cart.count} productos`}
          >
            <ShoppingBagOutlined />
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-connect text-white text-[10px] font-bold flex items-center justify-center">
              {cart.count}
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            {auth.isLoggedIn ? (
              <Link to={homeFor(auth.user.role)} className="text-xs font-semibold text-mute no-underline">
                {auth.user.role === "cliente" ? "Mi cuenta" : "Panel"}
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-semibold text-mute no-underline">
                Entrar
              </Link>
            )}
            <a
              href={site.whatsappLink}
              className="hidden lg:inline-flex h-[38px] items-center gap-2 rounded-lg bg-connect px-3.5 text-xs font-semibold text-white no-underline"
            >
              <ChatBubbleOutlined sx={{ fontSize: 18 }} />
              Escríbenos
            </a>
          </div>
          <span className="lg:hidden">
            <IconButton
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              sx={{ color: "currentColor" }}
            >
              <MenuOutlined />
            </IconButton>
          </span>
        </div>
      </div>

      {open && (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed top-0 right-0 z-50 h-full w-[min(100%,20rem)] bg-card text-ink shadow-2xl p-5 overflow-y-auto flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-extrabold">Menú</p>
              <IconButton onClick={() => setOpen(false)} aria-label="Cerrar menú" sx={{ color: "currentColor" }}>
                <CloseOutlined />
              </IconButton>
            </div>
            <nav className="grid gap-1" aria-label="Móvil">
              {links.map((link) =>
                link.hash ? (
                  <a
                    key={link.label}
                    href={link.to}
                    className="rounded-xl px-3 py-3 font-semibold text-ink no-underline hover:bg-fog"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-3 font-semibold no-underline ${isActive ? "bg-connect text-white" : "text-ink hover:bg-fog"}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>
            <div className="grid gap-3 pt-2 border-t border-border">
              {accountLink}
              <Link to="/carrito" className="text-sm font-semibold text-ink no-underline" onClick={() => setOpen(false)}>
                Carrito ({cart.count})
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm text-mute">Apariencia</span>
                <ThemeToggle />
              </div>
              <a
                href={site.whatsappLink}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-connect px-4 text-sm font-semibold text-white no-underline"
              >
                <ChatBubbleOutlined sx={{ fontSize: 20 }} />
                Escríbenos
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
