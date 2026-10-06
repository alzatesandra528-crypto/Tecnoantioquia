import { Link } from "react-router-dom";
import logoLight from "../assets/logo-mark.svg";
import logoDark from "../assets/logo-mark-dark.svg";
import { useSite } from "../site.jsx";

export default function BrandMark({ inverted = false, to = "/" }) {
  const { site } = useSite();
  const fallback = inverted ? logoLight : logoDark;
  const src = inverted ? site.logoLight || fallback : site.logoDark || site.logoLight || fallback;
  return (
    <Link to={to} className="flex items-center gap-2 no-underline min-w-0" aria-label={`${site.brandName} inicio`}>
      <img src={src} alt="" width="44" height="44" className="h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0" />
      <span className="leading-none min-w-0">
        <span className={`block font-extrabold text-[17px] sm:text-[20px] md:text-[23px] truncate ${inverted ? "text-white" : "text-ink"}`}>
          {site.brandName}
        </span>
        <span className={`hidden sm:block text-[10px] truncate ${inverted ? "text-mist" : "text-mute"}`}>
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
