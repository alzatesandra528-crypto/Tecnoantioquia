import BrandMark from "./BrandMark.jsx";

export default function StoreFooter() {
  return (
    <footer className="bg-night text-mist px-6 md:px-16 py-12 mt-16">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <BrandMark inverted />
        <div>
          <p className="text-signal font-bold text-xl">301 575 2454</p>
          <p className="text-sm">Celulares · Accesorios · Servicio técnico</p>
        </div>
      </div>
      <p className="text-xs mt-8">© 2026 tecnoantioquia · Tecnología que te conecta</p>
    </footer>
  );
}
