/**
 * Logo Netodash — version TEXTE uniquement.
 *
 * Le pictogramme « N » (image PNG) a été retiré : le logo est désormais le mot
 * NETODASH en typographie brutaliste, partout (landing, app connectée, tarifs,
 * pages légales, contact, dashboard).
 *
 * Les props `mode` / `alt` / `priority` sont conservées uniquement pour ne pas
 * casser les appels existants : elles n'ont plus d'effet.
 */

const SIZES = {
  sm: "text-lg md:text-xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-5xl md:text-6xl",
} as const;

type LogoProps = {
  size?: keyof typeof SIZES;
  className?: string;
  /** @deprecated sans effet — le logo n'est plus une image. */
  mode?: "dropshipping" | "cod";
  /** @deprecated sans effet — le logo est du texte (donc déjà accessible). */
  alt?: string;
  /** @deprecated sans effet — rien à précharger pour du texte. */
  priority?: boolean;
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span
      className={`font-black uppercase tracking-tighter leading-none select-none ${SIZES[size]} ${className}`}
    >
      NETODASH
    </span>
  );
}
