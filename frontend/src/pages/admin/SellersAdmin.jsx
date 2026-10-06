import { useEffect, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { api } from "../../api.js";

export default function SellersAdmin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    setUsers(await api("/api/users"));
  }

  useEffect(() => {
    load().catch(() => setUsers([]));
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          username: form.get("username"),
          password: form.get("password")
        })
      });
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Vendedores</h1>
      <p className="text-mute mb-6">Solo la administradora puede crear cuentas de vendedor.</p>
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 grid md:grid-cols-4 gap-4 mb-8">
        <TextField name="name" label="Nombre" />
        <TextField name="username" label="Usuario" required />
        <TextField name="password" label="Contraseña" type="password" required />
        <Button type="submit" variant="contained">Agregar vendedor</Button>
      </form>
      {message && <Alert severity="error" className="mb-4">{message}</Alert>}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-fog text-left">
            <tr>
              <th className="p-4">Usuario</th>
              <th>Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item._id} className="border-t border-[#eef0f6]">
                <td className="p-4 font-semibold">{item.username}</td>
                <td>{item.name || "—"}</td>
                <td>{item.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
