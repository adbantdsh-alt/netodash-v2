/**
 * Logo Netodash qui change automatiquement de couleur selon le mode actif :
 * - data-mode="dropshipping" → point bleu  (/netodash-logo-blue.png)
 * - data-mode="cod"          → point orange (/netodash-logo.png)
 *
 * Tu peux aussi forcer une variante via la prop `mode`.
 */
import { useEffect, useState } from "react";

type Mode = "dropshipping" | "cod";

const SRC: Record<Mode, string> = {
  dropshipping: "/netodash-logo-blue.png",
  cod: "/netodash-logo.png",
};

function readDocMode(): Mode {
  if (typeof document === "undefined") return "cod";
  const v = document.documentElement.getAttribute("data-mode");
  return v === "dropshipping" ? "dropshipping" : "cod";
}

export function Logo({
  mode,
  className = "h-7 md:h-9 w-auto object-contain shrink-0",
  alt = "NETODASH",
  priority = false,
}: {
  mode?: Mode;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const [docMode, setDocMode] = useState<Mode>(() => mode ?? readDocMode());

  useEffect(() => {
    if (mode) return; // contrôlé par prop
    const update = () => setDocMode(readDocMode());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });
    return () => observer.disconnect();
  }, [mode]);

  const src = SRC[mode ?? docMode];

  return (
    <img
      src={src}
      alt={alt}
      width={1650}
      height={297}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}
