import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Switch, TextField } from "@mui/material";
import { api, getUser, money, profitOf } from "../../api.js";
import ImageCarousel from "../../components/ImageCarousel.jsx";
import { compressImage, MAX_PRODUCT_IMAGES } from "../../imageUpload.js";

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
  const isNew = !id || id === "nuevo";
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const profit = profitOf(form);
  const isAdmin = getUser()?.role === "admin";

  useEffect(() => {
    if (!isNew) {
      api("/api/products").then((products) => {
        const found = products.find((item) => item._id === id);
        if (found) setForm({ ...empty, ...found, images: found.images || [] });
      });
    }
  }, [id, isNew]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onImages(event) {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    const remaining = MAX_PRODUCT_IMAGES - (form.images?.length || 0);
    if (remaining <= 0) {
      setMessage(`Puedes subir hasta ${MAX_PRODUCT_IMAGES} fotos para el carrusel.`);
      return;
    }
    try {
      const next = await Promise.all(files.slice(0, remaining).map((file) => compressImage(file)));
      setForm((current) => ({ ...current, images: [...(current.images || []), ...next] }));
    } catch (error) {
      setMessage(error.message);
    }
  }

  function removeImage(index) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index)
    }));
  }

  function moveImage(index, direction) {
    setForm((current) => {
      const images = [...current.images];
      const next = index + direction;
      if (next < 0 || next >= images.length) return current;
      [images[index], images[next]] = [images[next], images[index]];
      return { ...current, images };
    });
  }

  async function save() {
    setMessage("");
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      description: form.description,
      cost: Number(form.cost),
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images || [],
      published: Boolean(form.published),
      subtitle: form.subtitle || "",
      specs: form.specs || {},
      variants: form.variants || []
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
          <section className="bg-white rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Fotos del carrusel</h2>
            <p className="text-sm text-mute">
              Sube hasta {MAX_PRODUCT_IMAGES} imágenes. Se muestran en el producto como carrusel.
            </p>
            <label className="inline-flex">
              <input type="file" accept="image/*" multiple className="hidden" onChange={onImages} />
              <span className="inline-flex h-11 items-center rounded-xl bg-connect px-4 text-sm font-semibold text-white cursor-pointer">
                Subir imágenes
              </span>
            </label>
            {form.images?.length > 0 && (
              <div className="h-[280px] rounded-2xl overflow-hidden bg-fog">
                <ImageCarousel images={form.images} alt={form.name || "Producto"} className="h-full" />
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {form.images?.map((src, index) => (
                <div key={`${index}-${src.slice(-12)}`} className="relative">
                  <img src={src} alt="" className="h-20 w-20 rounded-xl object-cover border border-[#e3e6f0]" />
                  <div className="flex justify-center gap-1 mt-1">
                    <button type="button" className="text-xs text-mute" onClick={() => moveImage(index, -1)}>←</button>
                    <button type="button" className="text-xs text-red-600" onClick={() => removeImage(index)}>Quitar</button>
                    <button type="button" className="text-xs text-mute" onClick={() => moveImage(index, 1)}>→</button>
                  </div>
                </div>
              ))}
            </div>
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
