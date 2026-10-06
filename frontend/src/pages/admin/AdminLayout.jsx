import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import BrandMark from "../../components/BrandMark.jsx";
import { useAuth } from "../../auth.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const isAdmin = auth.user?.role === "admin";

  const links = [
    { to: "/admin", label: "Catálogo", end: true },
    { to: "/admin/ventas", label: "Ventas" },
    ...(isAdmin ? [{ to: "/admin/vendedores", label: "Vendedores" }] : [])
  ];

  function logout() {
    auth.logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[244px_1fr]">
      <aside className="bg-night text-white p-6 flex flex-col gap-6">
        <BrandMark inverted />
        <p className="text-[10px] tracking-widest text-mist">
          {auth.user?.username} · {auth.user?.role?.toUpperCase()}
        </p>
        <nav className="grid gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-connect" : "text-mist"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <p className="text-xs text-mist bg-white/5 rounded-2xl p-4">
          {isAdmin
            ? "Puedes agregar, editar y eliminar productos, y crear vendedores."
            : "Puedes agregar productos y registrar ventas. No puedes eliminar."}
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
