import logoLight from "./assets/logo-mark.svg";
import logoDark from "./assets/logo-mark-dark.svg";

export default function BrandMark({ inverted = false, compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={inverted ? logoLight : logoDark}
        alt="tecnoantioquia"
        className={compact ? "h-8 w-auto" : "h-10 w-auto"}
      />
      {!compact && (
        <div className="leading-tight">
          <p className={`font-extrabold ${inverted ? "text-white" : "text-ink"}`}>
            tecnoantioquia
          </p>
          <p className={`text-[10px] ${inverted ? "text-mist" : "text-mute"}`}>
            Tecnología que te conecta
          </p>
        </div>
      )}
    </div>
  );
}
