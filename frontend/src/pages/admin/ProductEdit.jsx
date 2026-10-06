import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Switch, TextField } from "@mui/material";
import { api, getUser, money, profitOf } from "../../api.js";

const empty = {
  name: "",
  sku: "",
  category: "Celulares",
  description: "",
  cost: 0,
  price: 0,
  stock: 0,
  images: [],
  published: true
};

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "nuevo";
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const profit = profitOf(form);
  const isAdmin = getUser()?.role === "admin";

  useEffect(() => {
    if (!isNew) {
      api("/api/products").then((products) => {
        const found = products.find((item) => item._id === id);
        if (found) setForm({ ...empty, ...found });
      });
    }
  }, [id, isNew]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setMessage("");
    const payload = {
      ...form,
      cost: Number(form.cost),
      price: Number(form.price),
      stock: Number(form.stock)
    };
    try {
      if (isNew) {
        await api("/api/products", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await api(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      navigate("/admin");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <p className="text-sm text-mute">Catálogo / {isNew ? "Nuevo producto" : "Editar producto"}</p>
          <h1 className="text-3xl font-extrabold">{isNew ? "Agregar producto" : "Editar producto"}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin")}>Cancelar</Button>
          <Button variant="contained" onClick={save}>
            Guardar
          </Button>
          {isAdmin && !isNew && (
            <Button color="error" onClick={async () => {
              if (!window.confirm("¿Eliminar este producto?")) return;
              await api(`/api/products/${id}`, { method: "DELETE" });
              navigate("/admin");
            }}>
              Eliminar
            </Button>
          )}
        </div>
      </div>
      {message && <Alert severity="error" className="mb-4">{message}</Alert>}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="grid gap-6">
          <section className="bg-white rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Información básica</h2>
            <TextField label="Nombre del producto" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth />
            <div className="grid md:grid-cols-2 gap-4">
              <TextField label="Categoría" value={form.category} onChange={(e) => setField("category", e.target.value)} />
              <TextField label="Referencia / SKU" value={form.sku} onChange={(e) => setField("sku", e.target.value)} />
            </div>
            <TextField
              label="Descripción"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              multiline
              minRows={4}
            />
          </section>
          <section className="bg-white rounded-2xl p-6 grid md:grid-cols-2 gap-4">
            <h2 className="font-extrabold md:col-span-2">Precios y ganancia</h2>
            {isAdmin && (
              <TextField
                label="Precio de compra (COP)"
                type="number"
                value={form.cost}
                onChange={(e) => setField("cost", e.target.value)}
                helperText="Lo que te costó el producto"
              />
            )}
            <TextField
              label="Precio de venta (COP)"
              type="number"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              helperText="Lo que verá el cliente en la tienda"
            />
            <TextField label="Stock total" type="number" value={form.stock} onChange={(e) => setField("stock", e.target.value)} />
            {isAdmin && (
              <div className="rounded-xl bg-[#e8f6f0] p-4">
                <p className="text-xs text-[#177c62] font-semibold">Ganancia por unidad</p>
                <p className="text-2xl font-extrabold text-[#177c62]">{money.format(profit.amount)}</p>
                <p className="text-sm text-mute">{profit.percent.toFixed(0)}% sobre el precio de venta</p>
              </div>
            )}
          </section>
        </div>
        <aside className="grid gap-6">
          <section className="bg-white rounded-2xl p-6">
            <h2 className="font-extrabold mb-2">Publicación</h2>
            <div className="flex items-center justify-between">
              <span>Visible en la tienda</span>
              <Switch checked={Boolean(form.published)} onChange={(e) => setField("published", e.target.checked)} />
            </div>
          </section>
          <section className="bg-white rounded-2xl p-6">
            <p className="text-xs text-mute">{form.category}</p>
            <h3 className="font-extrabold">{form.name || "Producto"}</h3>
            <p className="text-xs text-mute mt-3">Venta</p>
            <p className="text-connect font-extrabold text-2xl">{money.format(Number(form.price) || 0)}</p>
            <p className="text-xs text-mute mt-3">Compra</p>
            <p className="font-semibold">{money.format(Number(form.cost) || 0)}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
