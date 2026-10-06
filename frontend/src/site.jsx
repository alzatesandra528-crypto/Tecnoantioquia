import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { api } from "./api.js";
import { defaultSite, mergeSite } from "../../backend/src/siteDefaults.js";

const SiteContext = createContext(null);
const THEME_KEY = "tecnoantioquia_theme";

function applyPalette(site, mode) {
  const palette = mode === "dark" ? site.colorsDark : site.colors;
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  Object.entries(palette || {}).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--site-${key}`, value);
  });
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", palette.night || "#0B102A");
}

function applySeo(site) {
  const title = site.seo?.title || site.brandName;
  document.title = title;
  setMeta("name", "description", site.seo?.description || "");
  setMeta("name", "keywords", site.seo?.keywords || "");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", site.seo?.description || "");
  setMeta("property", "og:type", "website");
  setMeta("property", "og:locale", "es_CO");
  setMeta("property", "og:site_name", site.brandName);
  const image = site.seo?.ogImage || site.hero?.image;
  if (image) setMeta("property", "og:image", image);
  setMeta("name", "twitter:card", "summary_large_image");
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = "https://tecnoantioquia.vercel.app/";
  let jsonLd = document.getElementById("seo-jsonld");
  if (!jsonLd) {
    jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.id = "seo-jsonld";
    document.head.appendChild(jsonLd);
  }
  jsonLd.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: site.brandName,
    description: site.seo?.description,
    url: "https://tecnoantioquia.vercel.app/",
    telephone: site.whatsappDisplay,
    image: image || undefined,
    areaServed: "CO"
  });
}

function setMeta(attr, key, value) {
  if (!value) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

export function SiteProvider({ children }) {
  const [site, setSite] = useState(defaultSite);
  const [mode, setMode] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    api("/api/site")
      .then((data) => setSite(mergeSite(data)))
      .catch(() => setSite(defaultSite));
  }, []);

  useEffect(() => {
    applyPalette(site, mode);
    applySeo(site);
    localStorage.setItem(THEME_KEY, mode);
  }, [site, mode]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: (mode === "dark" ? site.colorsDark.connect : site.colors.connect) || "#305BFF" },
          secondary: { main: (mode === "dark" ? site.colorsDark.impulse : site.colors.impulse) || "#753EF2" },
          background: {
            default: mode === "dark" ? site.colorsDark.page : site.colors.page,
            paper: mode === "dark" ? site.colorsDark.card : site.colors.card
          },
          text: {
            primary: mode === "dark" ? site.colorsDark.ink : site.colors.ink,
            secondary: mode === "dark" ? site.colorsDark.mute : site.colors.mute
          }
        },
        typography: {
          fontFamily: "Inter, sans-serif",
          button: { textTransform: "none", fontWeight: 700 }
        },
        shape: { borderRadius: 14 }
      }),
    [site, mode]
  );

  const value = useMemo(
    () => ({
      site,
      setSite,
      mode,
      setMode,
      toggleMode() {
        setMode((current) => (current === "dark" ? "light" : "dark"));
      },
      refresh: async () => {
        const data = await api("/api/site");
        setSite(mergeSite(data));
      },
      whatsappHref(text) {
        return `${site.whatsappLink}?text=${encodeURIComponent(text)}`;
      }
    }),
    [site, mode]
  );

  return (
    <SiteContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext) || {
    site: defaultSite,
    mode: "light",
    setMode() {},
    toggleMode() {},
    setSite() {},
    refresh: async () => {},
    whatsappHref(text) {
      return `${defaultSite.whatsappLink}?text=${encodeURIComponent(text)}`;
    }
  };
}
