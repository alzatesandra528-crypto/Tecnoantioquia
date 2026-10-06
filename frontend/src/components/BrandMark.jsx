import { Link } from "react-router-dom";
import logoLight from "../assets/logo-mark.svg";
import logoDark from "../assets/logo-mark-dark.svg";

export default function BrandMark({ inverted = false, to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2 no-underline">
      <img
        src={inverted ? logoLight : logoDark}
        alt="tecnoantioquia"
        width="44"
        height="44"
        className="h-11 w-11"
      />
      <span className="leading-none">
        <span className={`block font-extrabold text-[23px] ${inverted ? "text-white" : "text-ink"}`}>
          tecnoantioquia
        </span>
        <span className={`block text-[10px] ${inverted ? "text-mist" : "text-mute"}`}>
          Tecnología que te conecta
        </span>
      </span>
    </Link>
  );
}
