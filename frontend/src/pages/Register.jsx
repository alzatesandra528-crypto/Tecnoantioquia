import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, TextField } from "@mui/material";
import BrandMark from "../components/BrandMark.jsx";
import { api } from "../api.js";
import { homeFor, useAuth } from "../auth.jsx";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate(homeFor(auth.user.role), { replace: true });
    }
  }, [auth.isLoggedIn, auth.user, navigate]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          username: form.get("username"),
          password: form.get("password")
        })
      });
      auth.login(data.token, data.user);
      navigate("/cuenta", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-night flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 w-full max-w-md">
        <BrandMark />
        <h1 className="text-2xl font-extrabold mt-6">Crear cuenta</h1>
        <p className="text-mute mb-6">Guarda tu carrito, pedidos e historial de compras.</p>
        <div className="grid gap-4">
          <TextField name="name" label="Nombre" fullWidth />
          <TextField name="username" label="Usuario" autoComplete="username" fullWidth required />
          <TextField name="password" label="Contraseña" type="password" autoComplete="new-password" fullWidth required />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large">Registrarme</Button>
        </div>
        <p className="text-sm text-mute mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-connect font-semibold">Iniciar sesión</Link>
        </p>
      </form>
    </main>
  );
}
