import { useEffect, useRef, useState } from "react";

export default function ImageCarousel({
  images = [],
  alt = "",
  className = "",
  objectFit = "contain",
  index: controlledIndex,
  onIndexChange
}) {
  const slides = images.filter(Boolean);
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const index = isControlled ? controlledIndex : internalIndex;

  useEffect(() => {
    if (!isControlled) setInternalIndex(0);
  }, [slides.join("|"), isControlled]);

  function setIndex(next) {
    const value = typeof next === "function" ? next(index) : next;
    if (!isControlled) setInternalIndex(value);
    onIndexChange?.(value);
  }

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((indexRef.current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className={`flex items-center justify-center bg-fog text-mute text-sm ${className}`}>
        Sin imagen
      </div>
    );
  }

  const current = Math.min(index, slides.length - 1);

  return (
    <div className={`relative ${className}`}>
      <img
        src={slides[current]}
        alt={alt}
        className={`h-full w-full ${objectFit === "cover" ? "object-cover" : "object-contain"}`}
      />
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 text-ink font-bold"
            onClick={() => setIndex((current - 1 + slides.length) % slides.length)}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 text-ink font-bold"
            onClick={() => setIndex((current + 1) % slides.length)}
            aria-label="Imagen siguiente"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Foto ${i + 1}`}
                className={`h-2 rounded-full ${i === current ? "w-5 bg-connect" : "w-2 bg-white/80"}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
