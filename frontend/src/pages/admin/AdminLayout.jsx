import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import BrandMark from "../../components/BrandMark.jsx";
import { clearSession, getUser } from "../../api.js";

const links = [
  { to: "/admin", label: "Catálogo" },
  { to: "/admin/ventas", label: "Ventas" }
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();

  function logout() {
    clearSession();
    navigate("/login");
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[244px_1fr]">
      <aside className="bg-night text-white p-6 flex flex-col gap-6">
        <BrandMark inverted />
        <p className="text-[10px] tracking-widest text-mist">ADMINISTRACIÓN · {user?.role?.toUpperCase()}</p>
        <nav className="grid gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-connect" : "text-mist"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <p className="text-xs text-mist bg-white/5 rounded-2xl p-4">
          Este módulo administra productos y disponibilidad. El vendedor puede registrar ventas, no editar productos.
        </p>
        <Link to="/" className="rounded-xl border border-white/20 px-3 py-2 text-sm text-center">
          Ver tienda
        </Link>
        <button onClick={logout} className="text-left text-sm text-mist">
          Cerrar sesión
        </button>
      </aside>
      <section className="bg-fog min-h-screen">
        <Outlet />
      </section>
    </div>
  );
}
