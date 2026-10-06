import { Link } from "react-router-dom";
import logoLight from "../assets/logo-mark.svg";
import logoDark from "../assets/logo-mark-dark.svg";
import { useSite } from "../site.jsx";

export default function BrandMark({ inverted = false, to = "/" }) {
  const { site } = useSite();
  const fallback = inverted ? logoLight : logoDark;
  const src = inverted ? site.logoLight || fallback : site.logoDark || site.logoLight || fallback;
  return (
    <Link to={to} className="flex items-center gap-2 no-underline" aria-label={`${site.brandName} inicio`}>
      <img src={src} alt="" width="44" height="44" className="h-11 w-11 object-contain" />
      <span className="leading-none">
        <span className={`block font-extrabold text-[23px] ${inverted ? "text-white" : "text-ink"}`}>
          {site.brandName}
        </span>
        <span className={`block text-[10px] ${inverted ? "text-mist" : "text-mute"}`}>
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
