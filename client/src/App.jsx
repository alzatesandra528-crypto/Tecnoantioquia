import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Product from "./pages/Product.jsx";
import Login from "./pages/Login.jsx";
import Protected from "./pages/Protected.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import CatalogAdmin from "./pages/admin/CatalogAdmin.jsx";
import ProductEdit from "./pages/admin/ProductEdit.jsx";
import SalesAdmin from "./pages/admin/SalesAdmin.jsx";
import { getUser } from "./api.js";

function AdminOnly({ children }) {
  return getUser()?.role === "admin" ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalogo/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <Protected>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<CatalogAdmin />} />
          <Route path="ventas" element={<SalesAdmin />} />
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
