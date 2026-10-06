import { useState } from "react";
import { Alert, Button, Tab, Tabs, TextField } from "@mui/material";
import { api } from "../../api.js";
import { compressImage } from "../../imageUpload.js";
import { useSite } from "../../site.jsx";
import { mergeSite } from "../../../../backend/src/siteDefaults.js";

function Field({ label, value, onChange, multiline = false, helper }) {
  return (
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      helperText={helper}
    />
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 bg-fog rounded-xl p-3">
      <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} aria-label={label} />
      <span className="text-sm font-semibold flex-1">{label}</span>
      <code className="text-xs text-mute">{value}</code>
    </label>
  );
}

function ImageField({ label, value, onChange, altValue, onAlt }) {
  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onChange(await compressImage(file, { maxSize: 1400, quality: 0.78 }));
  }
  return (
    <div className="grid gap-2">
      <p className="font-semibold text-sm">{label}</p>
      {value ? <img src={value} alt="" className="h-32 w-full object-cover rounded-xl border border-border" /> : null}
      <div className="flex gap-2">
        <label className="inline-flex h-10 items-center rounded-lg bg-connect px-3 text-sm font-semibold text-white cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          Subir imagen
        </label>
        {value && (
          <Button onClick={() => onChange("")}>Quitar</Button>
        )}
      </div>
      {onAlt && <Field label="Texto alternativo (accesibilidad)" value={altValue} onChange={onAlt} />}
    </div>
  );
}

const colorLabels = {
  night: "Fondo oscuro / hero",
  connect: "Color principal",
  impulse: "Acento violeta",
  signal: "Acento claro",
  fog: "Fondo suave",
  ink: "Texto",
  mute: "Texto secundario",
  mist: "Texto sobre oscuro",
  page: "Fondo de página",
  card: "Tarjetas",
  border: "Bordes"
};

export default function LandingAdmin() {
  const { site, setSite, refresh } = useSite();
  const [tab, setTab] = useState(0);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState("");

  function patch(path, value) {
    setSite((current) => {
      const next = structuredClone(current);
      const keys = path.split(".");
      let ref = next;
      for (let i = 0; i < keys.length - 1; i += 1) ref = ref[keys[i]];
      ref[keys.at(-1)] = value;
      return next;
    });
  }

  function patchList(path, index, key, value) {
    setSite((current) => {
      const next = structuredClone(current);
      const keys = path.split(".");
      let ref = next;
      for (const k of keys) ref = ref[k];
      ref[index][key] = value;
      return next;
    });
  }

  async function save() {
    setMessage("");
    setOk("");
    try {
      const saved = await api("/api/site", { method: "PUT", body: JSON.stringify(site) });
      setSite(mergeSite(saved));
      await refresh();
      setOk("Landing actualizada. Ya se ve en la tienda.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Landing y marca</h1>
          <p className="text-mute">Edita textos, colores, logo e imágenes de la página de bienvenida.</p>
        </div>
        <Button variant="contained" onClick={save}>Guardar cambios</Button>
      </div>
      {message && <Alert severity="error" className="mb-4">{message}</Alert>}
      {ok && <Alert severity="success" className="mb-4">{ok}</Alert>}
      <Tabs value={tab} onChange={(_e, value) => setTab(value)} variant="scrollable" className="mb-6">
        <Tab label="Marca" />
        <Tab label="Colores" />
        <Tab label="Bienvenida" />
        <Tab label="Secciones" />
        <Tab label="SEO" />
      </Tabs>

      {tab === 0 && (
        <div className="grid gap-4 bg-card rounded-2xl p-6">
          <Field label="Nombre de la tienda" value={site.brandName} onChange={(v) => patch("brandName", v)} />
          <Field label="Eslogan" value={site.tagline} onChange={(v) => patch("tagline", v)} />
          <Field label="Nota del encabezado" value={site.headerNote} onChange={(v) => patch("headerNote", v)} />
          <Field label="WhatsApp visible" value={site.whatsappDisplay} onChange={(v) => patch("whatsappDisplay", v)} />
          <Field label="Enlace WhatsApp" value={site.whatsappLink} onChange={(v) => patch("whatsappLink", v)} />
          <ImageField label="Logo para fondos oscuros" value={site.logoLight} onChange={(v) => patch("logoLight", v)} />
          <ImageField label="Logo para fondos claros" value={site.logoDark} onChange={(v) => patch("logoDark", v)} />
        </div>
      )}

      {tab === 1 && (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-card rounded-2xl p-6 grid gap-3">
            <h2 className="font-extrabold">Modo claro</h2>
            {Object.keys(colorLabels).map((key) => (
              <ColorField key={key} label={colorLabels[key]} value={site.colors[key]} onChange={(v) => patch(`colors.${key}`, v)} />
            ))}
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-3">
            <h2 className="font-extrabold">Modo oscuro</h2>
            {Object.keys(colorLabels).map((key) => (
              <ColorField
                key={key}
                label={colorLabels[key]}
                value={site.colorsDark[key]}
                onChange={(v) => patch(`colorsDark.${key}`, v)}
              />
            ))}
          </section>
        </div>
      )}

      {tab === 2 && (
        <div className="grid gap-4 bg-card rounded-2xl p-6">
          <Field label="Kicker" value={site.hero.kicker} onChange={(v) => patch("hero.kicker", v)} />
          <Field label="Título (usa Enter para un salto de línea)" value={site.hero.title} onChange={(v) => patch("hero.title", v)} multiline />
          <Field label="Subtítulo" value={site.hero.subtitle} onChange={(v) => patch("hero.subtitle", v)} multiline />
          <Field label="Botón principal" value={site.hero.primaryCta} onChange={(v) => patch("hero.primaryCta", v)} />
          <Field label="Botón secundario" value={site.hero.secondaryCta} onChange={(v) => patch("hero.secondaryCta", v)} />
          <Field label="Nota inferior" value={site.hero.note} onChange={(v) => patch("hero.note", v)} />
          <Field label="Leyenda sobre la foto" value={site.hero.caption} onChange={(v) => patch("hero.caption", v)} />
          <ImageField
            label="Imagen de bienvenida"
            value={site.hero.image}
            onChange={(v) => patch("hero.image", v)}
            altValue={site.hero.imageAlt}
            onAlt={(v) => patch("hero.imageAlt", v)}
          />
          {site.highlights.map((item, index) => (
            <Field key={index} label={`Franja ${index + 1}`} value={item} onChange={(v) => {
              const next = [...site.highlights];
              next[index] = v;
              patch("highlights", next);
            }} />
          ))}
        </div>
      )}

      {tab === 3 && (
        <div className="grid gap-6">
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Categorías</h2>
            <Field label="Kicker" value={site.categories.kicker} onChange={(v) => patch("categories.kicker", v)} />
            <Field label="Título" value={site.categories.title} onChange={(v) => patch("categories.title", v)} />
            {site.categories.items.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-3">
                <Field label="Nombre" value={item.name} onChange={(v) => patchList("categories.items", index, "name", v)} />
                <Field label="Descripción" value={item.hint} onChange={(v) => patchList("categories.items", index, "hint", v)} />
              </div>
            ))}
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Celulares destacados</h2>
            <Field label="Kicker" value={site.featured.kicker} onChange={(v) => patch("featured.kicker", v)} />
            <Field label="Título" value={site.featured.title} onChange={(v) => patch("featured.title", v)} />
            <Field label="Subtítulo" value={site.featured.subtitle} onChange={(v) => patch("featured.subtitle", v)} multiline />
            <Field label="Botón" value={site.featured.cta} onChange={(v) => patch("featured.cta", v)} />
            <Field label="Aviso legal" value={site.featured.disclaimer} onChange={(v) => patch("featured.disclaimer", v)} />
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Accesorios</h2>
            <Field label="Título" value={site.accessories.title} onChange={(v) => patch("accessories.title", v)} />
            <Field label="Texto" value={site.accessories.text} onChange={(v) => patch("accessories.text", v)} multiline />
            <Field label="Botón" value={site.accessories.cta} onChange={(v) => patch("accessories.cta", v)} />
            <ImageField
              label="Imagen de accesorios"
              value={site.accessories.image}
              onChange={(v) => patch("accessories.image", v)}
              altValue={site.accessories.imageAlt}
              onAlt={(v) => patch("accessories.imageAlt", v)}
            />
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Servicios</h2>
            <Field label="Kicker" value={site.services.kicker} onChange={(v) => patch("services.kicker", v)} />
            <Field label="Título" value={site.services.title} onChange={(v) => patch("services.title", v)} />
            <Field label="Subtítulo" value={site.services.subtitle} onChange={(v) => patch("services.subtitle", v)} />
            {site.services.items.map((item, index) => (
              <div key={index} className="grid gap-3">
                <Field label={`Servicio ${index + 1}`} value={item.title} onChange={(v) => patchList("services.items", index, "title", v)} />
                <Field label="Texto" value={item.text} onChange={(v) => patchList("services.items", index, "text", v)} multiline />
              </div>
            ))}
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Recargas, nosotros y pasos</h2>
            <Field label="Recargas título" value={site.recargas.title} onChange={(v) => patch("recargas.title", v)} />
            <Field label="Recargas texto" value={site.recargas.subtitle} onChange={(v) => patch("recargas.subtitle", v)} />
            <Field label="Recargas botón" value={site.recargas.cta} onChange={(v) => patch("recargas.cta", v)} />
            <Field label="Nosotros kicker" value={site.about.kicker} onChange={(v) => patch("about.kicker", v)} />
            <Field label="Nosotros título" value={site.about.title} onChange={(v) => patch("about.title", v)} multiline />
            <Field label="Nosotros texto" value={site.about.text} onChange={(v) => patch("about.text", v)} multiline />
            <Field label="Frase destacada" value={site.about.accent} onChange={(v) => patch("about.accent", v)} />
            <ImageField
              label="Imagen de nosotros"
              value={site.about.image}
              onChange={(v) => patch("about.image", v)}
              altValue={site.about.imageAlt}
              onAlt={(v) => patch("about.imageAlt", v)}
            />
            <Field label="Pasos kicker" value={site.steps.kicker} onChange={(v) => patch("steps.kicker", v)} />
            <Field label="Pasos título" value={site.steps.title} onChange={(v) => patch("steps.title", v)} />
            <Field label="Pasos texto" value={site.steps.subtitle} onChange={(v) => patch("steps.subtitle", v)} />
            {site.steps.items.map((item, index) => (
              <div key={index} className="grid gap-3">
                <Field label={`Paso ${index + 1} título`} value={item.title} onChange={(v) => patchList("steps.items", index, "title", v)} />
                <Field label="Texto" value={item.text} onChange={(v) => patchList("steps.items", index, "text", v)} />
              </div>
            ))}
          </section>
          <section className="bg-card rounded-2xl p-6 grid gap-4">
            <h2 className="font-extrabold">Financiación, FAQ y contacto</h2>
            <Field label="Financiación título" value={site.financing.title} onChange={(v) => patch("financing.title", v)} />
            <Field label="Financiación texto" value={site.financing.text} onChange={(v) => patch("financing.text", v)} multiline />
            <Field label="Financiación botón" value={site.financing.cta} onChange={(v) => patch("financing.cta", v)} />
            <Field label="FAQ kicker" value={site.faqs.kicker} onChange={(v) => patch("faqs.kicker", v)} />
            <Field label="FAQ título" value={site.faqs.title} onChange={(v) => patch("faqs.title", v)} />
            <Field label="FAQ texto" value={site.faqs.subtitle} onChange={(v) => patch("faqs.subtitle", v)} />
            {site.faqs.items.map((item, index) => (
              <div key={index} className="grid gap-3">
                <Field label={`Pregunta ${index + 1}`} value={item.q} onChange={(v) => patchList("faqs.items", index, "q", v)} />
                <Field label="Respuesta" value={item.a} onChange={(v) => patchList("faqs.items", index, "a", v)} multiline />
              </div>
            ))}
            <Field label="Contacto título" value={site.contact.title} onChange={(v) => patch("contact.title", v)} />
            <Field label="Contacto texto" value={site.contact.subtitle} onChange={(v) => patch("contact.subtitle", v)} />
            <Field label="Contacto botón" value={site.contact.cta} onChange={(v) => patch("contact.cta", v)} />
            <Field label="Pie de página" value={site.footer.text} onChange={(v) => patch("footer.text", v)} multiline />
            <Field label="Texto legal" value={site.footer.legal} onChange={(v) => patch("footer.legal", v)} />
          </section>
        </div>
      )}

      {tab === 4 && (
        <div className="grid gap-4 bg-card rounded-2xl p-6">
          <Field label="Título SEO" value={site.seo.title} onChange={(v) => patch("seo.title", v)} helper="Aparece en Google y en la pestaña." />
          <Field label="Descripción SEO" value={site.seo.description} onChange={(v) => patch("seo.description", v)} multiline />
          <Field label="Palabras clave" value={site.seo.keywords} onChange={(v) => patch("seo.keywords", v)} />
          <ImageField label="Imagen para redes (Open Graph)" value={site.seo.ogImage} onChange={(v) => patch("seo.ogImage", v)} />
        </div>
      )}
    </div>
  );
}
