import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Switch, TextField } from "@mui/material";
import { api, money } from "../../api.js";

const empty = {
  name: "",
  sku: "",
  category: "Celulares",
  description: "",
  price: 0,
  stock: 0,
  images: ["/products/servicio-1.jpg"],
  published: true
};

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "nuevo";
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isNew) {
      api("/api/products").then((products) => {
        const found = products.find((item) => item._id === id);
        if (found) setForm(found);
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
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm text-mute">Catálogo / Editar producto</p>
          <h1 className="text-3xl font-extrabold">{isNew ? "Nuevo producto" : "Editar producto"}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin")}>Cancelar</Button>
          <Button variant="contained" onClick={save}>
            Guardar cambios
          </Button>
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
            <h2 className="font-extrabold md:col-span-2">Precio y disponibilidad</h2>
            <TextField label="Precio base (COP)" type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
            <TextField label="Stock total" type="number" value={form.stock} onChange={(e) => setField("stock", e.target.value)} />
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
            <p className="text-connect font-extrabold text-2xl">{money.format(Number(form.price) || 0)}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
