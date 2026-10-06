import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, TextField } from "@mui/material";
import BrandMark from "../components/BrandMark.jsx";
import { api, saveSession } from "../api.js";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password")
        })
      });
      saveSession(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-night flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 w-full max-w-md">
        <BrandMark />
        <h1 className="text-2xl font-extrabold mt-6">Entrar como administradora</h1>
        <p className="text-mute mb-6">Desde aquí agregas productos, precios de compra/venta y ves la ganancia.</p>
        <div className="grid gap-4">
          <TextField name="username" label="Usuario" defaultValue="admin" fullWidth required />
          <TextField name="password" label="Contraseña" type="password" defaultValue="admin123" fullWidth required />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large">Ingresar</Button>
        </div>
        <div className="text-sm text-mute mt-6 bg-fog rounded-2xl p-4">
          <p className="font-semibold text-ink">Administradora</p>
          <p>Usuario: admin</p>
          <p>Contraseña: admin123</p>
          <p className="mt-3 font-semibold text-ink">Vendedor</p>
          <p>Usuario: vendedor</p>
          <p>Contraseña: vendedor123</p>
        </div>
        <Link to="/" className="block mt-4 text-connect font-semibold">Volver al sitio</Link>
      </form>
    </main>
  );
}
