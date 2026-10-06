import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { IconButton } from "@mui/material";
import BrandMark from "../../components/BrandMark.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import { useAuth } from "../../auth.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const isAdmin = auth.user?.role === "admin";
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/admin", label: "Catálogo", end: true },
    { to: "/admin/ventas", label: "Ventas" },
    ...(isAdmin ? [{ to: "/admin/vendedores", label: "Vendedores" }, { to: "/admin/landing", label: "Landing y marca" }] : [])
  ];

  function logout() {
    auth.logout();
    navigate("/login");
  }

  const nav = (
    <nav className="grid gap-2" aria-label="Administración">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-connect" : "text-mist"}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen md:grid md:grid-cols-[244px_1fr] bg-page text-ink">
      <header className="md:hidden bg-night text-white px-4 h-16 flex items-center justify-between gap-3 sticky top-0 z-30">
        <BrandMark inverted />
        <IconButton onClick={() => setOpen(true)} aria-label="Abrir menú de administración" sx={{ color: "#fff" }}>
          <MenuOutlined />
        </IconButton>
      </header>

      {open && (
        <div className="md:hidden">
          <button type="button" className="fixed inset-0 z-40 bg-black/45" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
          <aside className="fixed top-0 left-0 z-50 h-full w-[min(100%,18rem)] bg-night text-white p-5 overflow-y-auto flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <BrandMark inverted />
              <IconButton onClick={() => setOpen(false)} aria-label="Cerrar menú" sx={{ color: "#fff" }}>
                <CloseOutlined />
              </IconButton>
            </div>
            {nav}
            <Link to="/" className="rounded-xl border border-white/20 px-3 py-2 text-sm text-center" onClick={() => setOpen(false)}>
              Ver tienda
            </Link>
            <div className="flex items-center justify-between text-white">
              <ThemeToggle />
              <button onClick={logout} className="text-sm text-mist">Cerrar sesión</button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden md:flex bg-night text-white p-6 flex-col gap-6">
        <BrandMark inverted />
        <p className="text-[10px] tracking-widest text-mist">
          {auth.user?.username} · {auth.user?.role?.toUpperCase()}
        </p>
        {nav}
        <p className="text-xs text-mist bg-white/5 rounded-2xl p-4">
          {isAdmin
            ? "Puedes agregar, editar y eliminar productos, y crear vendedores."
            : "Puedes agregar productos y registrar ventas. No puedes eliminar."}
        </p>
        <Link to="/" className="rounded-xl border border-white/20 px-3 py-2 text-sm text-center">
          Ver tienda
        </Link>
        <div className="flex items-center justify-between text-white mt-auto">
          <ThemeToggle />
          <button onClick={logout} className="text-left text-sm text-mist">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <section id="contenido" className="bg-fog min-h-screen overflow-x-hidden">
        <Outlet />
      </section>
    </div>
  );
}
