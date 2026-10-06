import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, TextField } from "@mui/material";
import BrandMark from "../components/BrandMark.jsx";
import { api } from "../api.js";
import { homeFor, useAuth } from "../auth.jsx";

export default function Login() {
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
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password")
        })
      });
      auth.login(data.token, data.user);
      navigate(homeFor(data.user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-night flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="bg-card rounded-3xl p-8 w-full max-w-md text-ink">
        <BrandMark />
        <h1 className="text-2xl font-extrabold mt-6">Iniciar sesión</h1>
        <p className="text-mute mb-6">Clientes, vendedores y administración.</p>
        <div className="grid gap-4">
          <TextField name="username" label="Usuario" autoComplete="username" fullWidth required />
          <TextField name="password" label="Contraseña" type="password" autoComplete="current-password" fullWidth required />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large">Ingresar</Button>
        </div>
        <p className="text-sm text-mute mt-6">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" className="text-connect font-semibold">Crear cuenta</Link>
        </p>
        <Link to="/" className="block mt-4 text-connect font-semibold">Volver al sitio</Link>
      </form>
    </main>
  );
}
