// CTA principal du site : créer un compte.
//
// Remplace BetaCtaButton, qui affichait « Devenir bêta-testeur » et renvoyait
// vers /auth?mode=signup&beta=1. Deux problèmes réglés d'un coup :
//   1. le programme bêta est arrêté — plus de bouton « devenir bêta-testeur » ;
//   2. cette URL renvoyait une ERREUR 500 (le paramètre `beta` faisait lever la
//      validation du schéma de recherche), donc TOUS les CTA du site — header,
//      hero, cartes de tarifs, CTA final — menaient à une page cassée.
//
// Le bouton pointe maintenant vers /auth?mode=signup, qui répond 200.
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type SignupCtaVariant =
  | "header"
  | "headerMobile"
  | "hero"
  | "card"
  | "cardHighlight"
  | "final"
  | "inline";

const VARIANT_CLASSES: Record<SignupCtaVariant, string> = {
  header:
    "brutal-border bg-foreground text-background px-5 py-2.5 font-bold uppercase tracking-wider text-sm hover:bg-accent hover:border-accent",
  headerMobile:
    "brutal-border bg-foreground text-background px-3 py-2 font-bold uppercase tracking-wider text-xs",
  hero: "brutal-border bg-accent text-accent-foreground border-accent px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base text-center hover:bg-foreground hover:text-background hover:border-foreground",
  card: "block w-full text-center brutal-border px-5 py-3 font-black uppercase tracking-wider bg-background text-foreground hover:bg-foreground hover:text-background",
  cardHighlight:
    "block w-full text-center brutal-border px-5 py-3 font-black uppercase tracking-wider bg-accent text-accent-foreground border-accent text-base hover:bg-foreground hover:text-background hover:border-foreground",
  final:
    "inline-block brutal-border border-background bg-background text-foreground px-10 py-5 font-black uppercase tracking-wider text-lg hover:bg-accent hover:text-accent-foreground hover:border-accent",
  inline:
    "inline underline text-foreground font-bold hover:text-accent bg-transparent border-0 p-0 normal-case tracking-normal text-inherit cursor-pointer",
};

type SignupCtaButtonProps = {
  variant?: SignupCtaVariant;
  className?: string;
  /** Libellé personnalisé (le CTA « final » a souvent son propre texte). */
  label?: string;
};

const DEFAULT_LABEL = "Créer un compte gratuit";

export function SignupCtaButton({
  variant = "hero",
  className,
  label = DEFAULT_LABEL,
}: SignupCtaButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}
      className={cn(VARIANT_CLASSES[variant], className)}
    >
      {label}
    </button>
  );
}
