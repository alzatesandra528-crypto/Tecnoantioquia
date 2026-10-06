import { Link } from "react-router-dom";
import { money } from "../api.js";
import { isAvailable, productSubtitle } from "../store.js";
import { productImages } from "../catalogImages.js";

export default function ProductCard({ product }) {
  const available = isAvailable(product);
  const image = productImages(product)[0];

  return (
    <article className="bg-white border border-[#e3e6f0] rounded-[14px] p-4 flex flex-col gap-3">
      <div className="relative bg-fog h-[208px] rounded-lg overflow-hidden">
        <img src={image} alt={product.name} className="h-full w-full object-cover" />
        <span
          className={`absolute left-2 top-2 rounded-full px-2.5 py-[5px] text-[11px] font-semibold ${
            available ? "bg-[#e8f6f0] text-[#177c62]" : "bg-[#edf1ff] text-connect"
          }`}
        >
          {available ? "Disponible" : "Por consultar"}
        </span>
      </div>
      <p className="text-[11px] text-mute">{product.category}</p>
      <h3 className="font-semibold text-base leading-[1.3] min-h-[42px]">{product.name}</h3>
      <p className="text-xs text-mute">{productSubtitle(product)}</p>
      <p className="font-bold text-[23px]">{money.format(product.price)}</p>
      <Link
        to={`/catalogo/${product._id}`}
        className="h-[38px] rounded-lg border border-[#e3e6f0] text-xs font-semibold text-ink flex items-center justify-center no-underline"
      >
        Ver producto →
      </Link>
    </article>
  );
}
