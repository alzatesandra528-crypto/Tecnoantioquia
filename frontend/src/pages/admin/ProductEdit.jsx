import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { api, getUser, money, profitOf } from "../../api.js";
import ImageCarousel from "../../components/ImageCarousel.jsx";
import { compressImage, MAX_PRODUCT_IMAGES } from "../../imageUpload.js";
import { useSite } from "../../site.jsx";

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

const NEW_CATEGORY = "__nueva__";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { site } = useSite();
  const isNew = !id || id === "nuevo";
  const [form, setForm] = useState(empty);
  const [products, setProducts] = useState([]);
  const [extraCategories, setExtraCategories] = useState([]);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState("");
  const [existing, setExisting] = useState(null);
  const profit = profitOf(form);
  const isAdmin = getUser()?.role === "admin";

  useEffect(() => {
    api("/api/products")
      .then((items) => {
        setProducts(items);
        if (!isNew) {
          const found = items.find((item) => item._id === id);
          if (found) setForm({ ...empty, ...found, images: found.images || [] });
        }
      })
      .catch(() => setProducts([]));
  }, [id, isNew]);

  const categories = useMemo(() => {
    const fromSite = (site.categories?.items || []).map((item) => item.name);
    const fromProducts = products.map((item) => item.category);
    return [...new Set([...fromSite, ...fromProducts, ...extraCategories, form.category].filter(Boolean))];
  }, [site, products, extraCategories, form.category]);

  const skuMatch = useMemo(() => {
    const sku = String(form.sku || "").trim().toLowerCase();
    if (!sku) return null;
    return (
      products.find(
        (item) => String(item.sku).trim().toLowerCase() === sku && (isNew || item._id !== id)
      ) || null
    );
  }, [form.sku, products, isNew, id]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "sku") setExisting(null);
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

  function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    setExtraCategories((current) => (current.includes(name) ? current : [...current, name]));
    setField("category", name);
    setCreatingCategory(false);
    setNewCategory("");
  }

  async function addToExisting(product) {
    const add = Number(form.stock);
    try {
      if (add >= 1) {
        await api(`/api/products/${product._id || product.id}/stock`, {
          method: "POST",
          body: JSON.stringify({ add })
        });
      }
      navigate(`/admin/producto/${product._id || product.id}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function save() {
    setMessage("");
    setExisting(null);
    if (skuMatch && isNew) {
      setExisting(skuMatch);
      setMessage(`La referencia ${skuMatch.sku} ya existe en “${skuMatch.name}”. Agrégala a ese producto.`);
      return;
    }
    const payload = {
      name: form.name,
      sku: String(form.sku || "").trim(),
      category: String(form.category || "").trim(),
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
      if (error.payload?.existing) setExisting(error.payload.existing);
      setMessage(error.message);
    }
  }

  const duplicate = existing || (isNew ? skuMatch : null);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <p className="text-sm text-mute">Catálogo / {isNew ? "Nuevo producto" : "Editar producto"}</p>
          <h1 className="text-3xl font-extrabold">{isNew ? "Agregar producto" : "Editar producto"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/admin")}>Cancelar</Button>
          <Button variant="contained" onClick={save}>
            Guardar
          </Button>
          {isAdmin && !isNew && (
            <Button
              color="error"
              onClick={async () => {
                if (!window.confirm("¿Eliminar este producto?")) return;
                await api(`/api/products/${id}`, { method: "DELETE" });
                navigate("/admin");
              }}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
      {Boolean(message || duplicate) && (
        <Alert
          severity={duplicate ? "warning" : "error"}
          className="mb-4"
          action={
            duplicate ? (
              <div className="flex flex-col sm:flex-row gap-1">
                <Button color="inherit" size="small" onClick={() => navigate(`/admin/producto/${duplicate._id || duplicate.id}`)}>
                  Abrir el existente
                </Button>
                <Button color="inherit" size="small" onClick={() => addToExisting(duplicate)}>
                  Sumar stock ({Number(form.stock) || 0})
                </Button>
              </div>
            ) : null
          }
        >
          {message || `La referencia ${duplicate.sku} ya existe en “${duplicate.name}”. Agrégala a ese producto.`}
        </Alert>
      )}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="grid gap-6">
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Información básica</h2>
            <TextField label="Nombre del producto" value={form.name} onChange={(e) => setField("name", e.target.value)} fullWidth />
            <div className="grid md:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  label="Categoría"
                  value={creatingCategory ? NEW_CATEGORY : form.category}
                  onChange={(event) => {
                    if (event.target.value === NEW_CATEGORY) {
                      setCreatingCategory(true);
                      return;
                    }
                    setCreatingCategory(false);
                    setField("category", event.target.value);
                  }}
                >
                  {categories.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                  <MenuItem value={NEW_CATEGORY}>+ Crear categoría nueva</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Referencia / SKU"
                value={form.sku}
                onChange={(e) => setField("sku", e.target.value)}
                error={Boolean(duplicate)}
                helperText={duplicate ? `Ya existe en “${duplicate.name}”.` : "Debe ser única. Si ya existe, súmala al producto."}
                spellCheck={false}
                inputProps={{ autoCapitalize: "none", autoCorrect: "off" }}
              />
            </div>
            {creatingCategory && (
              <div className="flex flex-col sm:flex-row gap-2">
                <TextField
                  label="Nombre de la nueva categoría"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={addCategory}>
                  Agregar
                </Button>
              </div>
            )}
            <TextField
              label="Descripción"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              multiline
              minRows={4}
            />
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-4">
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
                  <img src={src} alt="" className="h-20 w-20 rounded-xl object-cover border border-border" />
                  <div className="flex justify-center gap-1 mt-1">
                    <button type="button" className="text-xs text-mute" onClick={() => moveImage(index, -1)}>
                      ←
                    </button>
                    <button type="button" className="text-xs text-red-600" onClick={() => removeImage(index)}>
                      Quitar
                    </button>
                    <button type="button" className="text-xs text-mute" onClick={() => moveImage(index, 1)}>
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-card rounded-2xl p-6 grid md:grid-cols-2 gap-4">
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
          <section className="bg-card rounded-2xl p-6">
            <h2 className="font-extrabold mb-2">Publicación</h2>
            <div className="flex items-center justify-between">
              <span>Visible en la tienda</span>
              <Switch checked={Boolean(form.published)} onChange={(e) => setField("published", e.target.checked)} />
            </div>
          </section>
          <section className="bg-card rounded-2xl p-6">
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
