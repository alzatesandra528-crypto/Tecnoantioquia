import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import Smartphone from "@mui/icons-material/Smartphone";
import Headphones from "@mui/icons-material/Headphones";
import Cable from "@mui/icons-material/Cable";
import Watch from "@mui/icons-material/Watch";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Build from "@mui/icons-material/Build";
import Laptop from "@mui/icons-material/Laptop";
import Forum from "@mui/icons-material/Forum";
import SignalCellularAlt from "@mui/icons-material/SignalCellularAlt";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import StoreHeader from "../components/StoreHeader.jsx";
import StoreFooter from "../components/StoreFooter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../api.js";
import { storeImages } from "../catalogImages.js";
import { useSite } from "../site.jsx";

const categoryIcons = [Smartphone, Headphones, Cable, Watch, CardGiftcard];
const highlightIcons = [Smartphone, ChatBubbleOutlined, Build];
const serviceIcons = [Smartphone, Laptop, Forum];

function Title({ text, className, as: Tag = "h1", ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {String(text || "")
        .split("\n")
        .map((line, index, arr) => (
          <span key={index}>
            {line}
            {index < arr.length - 1 ? <br /> : null}
          </span>
        ))}
    </Tag>
  );
}

export default function Home() {
  const { site, whatsappHref } = useSite();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api("/api/catalog").then(setProducts).catch(() => setProducts([]));
  }, []);

  const featuredOrder = ["CEL-IPH16P", "CEL-S25U", "CEL-RN14P", "CEL-001"];
  const featured = [
    ...featuredOrder.map((sku) => products.find((item) => item.sku === sku)).filter(Boolean),
    ...products.filter((item) => item.category === "Celulares" && !featuredOrder.includes(item.sku))
  ].slice(0, 4);

  const heroImage = site.hero.image || storeImages.heroPhones;
  const accessoriesImage = site.accessories.image || storeImages.accessories;
  const aboutImage = site.about.image || storeImages.antioquia;

  return (
    <div className="bg-page text-ink">
      <StoreHeader />
      <main id="contenido">
        <section className="bg-night" aria-labelledby="hero-title">
          <div className="px-6 lg:px-[72px] py-16 grid lg:grid-cols-[590px_1fr] gap-9 items-center">
            <div>
              <p className="text-signal text-xs tracking-wide font-semibold">{site.hero.kicker}</p>
              <Title id="hero-title" text={site.hero.title} className="text-white font-extrabold text-[44px] md:text-[68px] leading-[1.02] mt-6" />
              <p className="text-mist text-lg mt-6 max-w-[500px]">{site.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/catalogo"
                  className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-connect px-5 text-sm font-semibold text-white no-underline"
                >
                  <ArrowOutward sx={{ fontSize: 20 }} />
                  {site.hero.primaryCta}
                </Link>
                <a
                  href={site.whatsappLink}
                  className="inline-flex h-12 items-center rounded-lg border border-mist/40 bg-night px-5 text-sm font-semibold text-white no-underline"
                >
                  {site.hero.secondaryCta}
                </a>
              </div>
              <p className="text-mist text-xs mt-6">{site.hero.note}</p>
            </div>
            <div className="relative h-[320px] lg:h-[470px] rounded-3xl overflow-hidden">
              <img src={heroImage} alt={site.hero.imageAlt} className="h-full w-full object-cover" />
              <div className="absolute left-6 bottom-6 bg-[rgba(17,24,53,0.91)] rounded-xl p-3.5 flex items-center gap-3">
                <ChatBubbleOutlined sx={{ color: "#fff", fontSize: 20 }} aria-hidden />
                <p className="text-white text-xs">{site.hero.caption}</p>
              </div>
            </div>
          </div>
          <div className="bg-night/80 px-6 lg:px-[72px] py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-[13px] text-white">
            {site.highlights.map((text, index) => {
              const Icon = highlightIcons[index] || Smartphone;
              return (
                <span key={text} className="flex items-center gap-3">
                  <Icon sx={{ fontSize: 20 }} aria-hidden /> {text}
                </span>
              );
            })}
          </div>
        </section>

        <section className="px-6 lg:px-[72px] py-16 grid gap-14 bg-page">
          <div>
            <p className="text-connect text-[11px] font-bold">{site.categories.kicker}</p>
            <h2 className="text-[34px] font-bold mt-2">{site.categories.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
              {site.categories.items.map((item, index) => {
                const Icon = categoryIcons[index] || Smartphone;
                return (
                  <Link
                    key={item.name}
                    to={`/catalogo?categoria=${encodeURIComponent(item.name)}`}
                    className="bg-fog rounded-[14px] p-6 no-underline text-ink"
                  >
                    <Icon sx={{ color: "var(--site-connect)", fontSize: 28 }} aria-hidden />
                    <p className="font-bold text-[17px] mt-3">{item.name}</p>
                    <p className="text-xs text-mute mt-1">{item.hint}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-connect text-[11px] font-bold">{site.featured.kicker}</p>
                <h2 className="text-[34px] font-bold mt-2">{site.featured.title}</h2>
                <p className="text-mute mt-2">{site.featured.subtitle}</p>
              </div>
              <Link to="/catalogo" className="h-[38px] px-3.5 rounded-lg border border-border text-xs font-semibold text-ink inline-flex items-center no-underline">
                {site.featured.cta}
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <p className="text-[11px] text-mute mt-4">{site.featured.disclaimer}</p>
          </div>

          <div className="bg-impulse/15 rounded-3xl p-8 flex flex-col lg:flex-row gap-10 items-center min-h-[240px]">
            <div className="flex-1">
              <h2 className="font-bold text-[35px] leading-tight">{site.accessories.title}</h2>
              <p className="text-mute mt-4">{site.accessories.text}</p>
              <Link to="/catalogo?categoria=Accesorios" className="mt-4 inline-flex h-12 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-ink no-underline">
                {site.accessories.cta}
              </Link>
            </div>
            <img src={accessoriesImage} alt={site.accessories.imageAlt} className="w-full lg:w-[430px] h-[210px] object-cover rounded-2xl" />
          </div>
        </section>

        <section id="servicios" className="bg-fog px-6 lg:px-[72px] py-16">
          <p className="text-connect text-[11px] font-bold">{site.services.kicker}</p>
          <h2 className="text-[34px] font-bold mt-2">{site.services.title}</h2>
          <p className="text-mute mt-2">{site.services.subtitle}</p>
          <div className="grid md:grid-cols-3 gap-6 mt-7">
            {site.services.items.map((item, index) => {
              const Icon = serviceIcons[index] || Forum;
              return (
                <div key={item.title} className="bg-card border border-border rounded-[14px] p-7">
                  <Icon sx={{ color: "var(--site-connect)", fontSize: 28 }} aria-hidden />
                  <h3 className="font-bold text-[22px] mt-5">{item.title}</h3>
                  <p className="text-mute mt-4">{item.text}</p>
                  <a href={whatsappHref(`Hola, quiero consultar: ${item.title}`)} className="block mt-4 text-connect font-bold text-[13px] no-underline">
                    Consultar servicio ↗
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-connect px-6 lg:px-[72px] py-9 flex flex-col lg:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-5">
            <SignalCellularAlt sx={{ fontSize: 32 }} aria-hidden />
            <div>
              <p className="font-bold text-[26px]">{site.recargas.title}</p>
              <p className="text-[15px]">{site.recargas.subtitle}</p>
            </div>
          </div>
          <a href={whatsappHref("Hola, quiero consultar recargas.")} className="inline-flex h-12 items-center gap-2.5 rounded-lg border border-white/30 bg-night px-5 text-sm font-semibold text-white no-underline">
            <ChatBubbleOutlined sx={{ fontSize: 20 }} aria-hidden />
            {site.recargas.cta}
          </a>
        </section>

        <section id="nosotros" className="px-6 lg:px-[72px] py-16 grid lg:grid-cols-[510px_1fr] gap-16 items-center bg-page">
          <img src={aboutImage} alt={site.about.imageAlt} className="h-[330px] w-full object-cover rounded-3xl" />
          <div>
            <p className="text-connect text-[11px] font-bold">{site.about.kicker}</p>
            <Title as="h2" text={site.about.title} className="font-bold text-[40px] leading-[1.1] mt-5" />
            <p className="text-mute mt-5">{site.about.text}</p>
            <p className="font-bold text-impulse mt-5">{site.about.accent}</p>
          </div>
        </section>

        <section className="px-6 lg:px-[72px] pb-14 grid gap-14 bg-page">
          <div>
            <p className="text-connect text-[11px] font-bold">{site.steps.kicker}</p>
            <h2 className="text-[34px] font-bold mt-2">{site.steps.title}</h2>
            <p className="text-mute mt-2">{site.steps.subtitle}</p>
            <ol className="grid md:grid-cols-3 gap-8 mt-8 list-none p-0">
              {site.steps.items.map((item) => (
                <li key={item.n}>
                  <p className="text-connect text-[34px]">{item.n}</p>
                  <h3 className="font-bold text-xl mt-3">{item.title}</h3>
                  <p className="text-mute mt-3">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-connect/10 rounded-2xl p-7 flex flex-col lg:flex-row gap-6 items-center">
            <AccountBalanceWallet sx={{ color: "var(--site-connect)", fontSize: 32 }} aria-hidden />
            <div className="flex-1">
              <p className="font-bold text-[22px]">{site.financing.title}</p>
              <p className="text-mute text-[13px] mt-2">{site.financing.text}</p>
            </div>
            <a href={whatsappHref("Hola, quiero consultar opciones de financiación.")} className="h-12 px-5 rounded-lg border border-border bg-card text-sm font-semibold text-ink inline-flex items-center no-underline">
              {site.financing.cta}
            </a>
          </div>

          <div className="grid lg:grid-cols-[390px_1fr] gap-16">
            <div>
              <p className="text-connect text-[11px] font-bold">{site.faqs.kicker}</p>
              <h2 className="text-[34px] font-bold mt-2">{site.faqs.title}</h2>
              <p className="text-mute mt-4">{site.faqs.subtitle}</p>
            </div>
            <div>
              {site.faqs.items.map((item) => (
                <details key={item.q} className="border-b border-border py-5 group">
                  <summary className="font-bold cursor-pointer list-none">{item.q}</summary>
                  <p className="text-mute text-sm mt-2.5">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div id="contacto" className="bg-night rounded-3xl p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-white font-bold text-[38px]">{site.contact.title}</h2>
              <p className="text-mist mt-3">{site.contact.subtitle}</p>
              <p className="text-signal font-bold text-xl mt-3">{site.whatsappDisplay}</p>
            </div>
            <a href={site.whatsappLink} className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-connect px-5 text-sm font-semibold text-white no-underline">
              <ChatBubbleOutlined sx={{ fontSize: 20 }} aria-hidden />
              {site.contact.cta}
            </a>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
