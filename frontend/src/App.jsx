import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Product from "./pages/Product.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Account from "./pages/Account.jsx";
import Protected from "./pages/Protected.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import CatalogAdmin from "./pages/admin/CatalogAdmin.jsx";
import ProductEdit from "./pages/admin/ProductEdit.jsx";
import SalesAdmin from "./pages/admin/SalesAdmin.jsx";
import SellersAdmin from "./pages/admin/SellersAdmin.jsx";
import { useAuth } from "./auth.jsx";

function AdminOnly({ children }) {
  const auth = useAuth();
  return auth.user?.role === "admin" ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalogo/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Cart />} />
        <Route
          path="/cuenta"
          element={
            <Protected>
              <Account />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected roles={["admin", "vendedor"]}>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<CatalogAdmin />} />
          <Route path="ventas" element={<SalesAdmin />} />
          <Route path="producto/nuevo" element={<ProductEdit />} />
          <Route
            path="vendedores"
            element={
              <AdminOnly>
                <SellersAdmin />
              </AdminOnly>
            }
          />
          <Route
            path="producto/:id"
            element={
              <AdminOnly>
                <ProductEdit />
              </AdminOnly>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
