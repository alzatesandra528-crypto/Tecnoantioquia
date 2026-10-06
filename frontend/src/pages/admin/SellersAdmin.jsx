import { useEffect, useState } from "react";
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { api } from "../../api.js";
import { useAuth } from "../../auth.jsx";

export default function SellersAdmin() {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);

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

  async function saveEdit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    try {
      await api(`/api/users/${editing._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.get("name"),
          username: form.get("username"),
          ...(password ? { password } : {})
        })
      });
      setEditing(null);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function toggleActive(item) {
    try {
      await api(`/api/users/${item._id}`, {
        method: "PUT",
        body: JSON.stringify({ active: item.active === false })
      });
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`¿Eliminar a ${item.username}?`)) return;
    try {
      await api(`/api/users/${item._id}`, { method: "DELETE" });
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Vendedores</h1>
      <p className="text-mute mb-6">Edita, desactiva o elimina cuentas con los iconos de cada fila.</p>
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 grid md:grid-cols-4 gap-4 mb-8">
        <TextField name="name" label="Nombre" />
        <TextField name="username" label="Usuario" required />
        <TextField name="password" label="Contraseña" type="password" required />
        <Button type="submit" variant="contained">Agregar vendedor</Button>
      </form>
      {message && <Alert severity="error" className="mb-4">{message}</Alert>}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-fog text-left">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="pr-4">Acciones</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const active = item.active !== false;
              const isSelf = item.username === auth.user?.username;
              return (
                <tr key={item._id} className="border-t border-[#eef0f6]">
                  <td className="p-4 font-semibold">{item.username}</td>
                  <td className="whitespace-nowrap">
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => setEditing(item)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={active ? "Desactivar" : "Activar"}>
                      <IconButton color={active ? "warning" : "success"} onClick={() => toggleActive(item)} disabled={isSelf && active}>
                        {active ? <BlockOutlined /> : <CheckCircleOutlined />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => remove(item)} disabled={isSelf}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td>{item.name || "—"}</td>
                  <td>{item.role}</td>
                  <td>
                    <Chip size="small" label={active ? "Activo" : "Desactivado"} color={active ? "success" : "default"} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="xs">
        <form onSubmit={saveEdit}>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogContent className="grid gap-4 !pt-2">
            <TextField name="name" label="Nombre" defaultValue={editing?.name || ""} fullWidth />
            <TextField name="username" label="Usuario" defaultValue={editing?.username || ""} fullWidth required />
            <TextField name="password" label="Nueva contraseña (opcional)" type="password" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(null)}>Cancelar</Button>
            <Button type="submit" variant="contained">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
