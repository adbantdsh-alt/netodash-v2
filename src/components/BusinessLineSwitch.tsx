import { useActiveMode, type BusinessMode } from "@/lib/use-active-mode";

/**
 * Bascule entre les deux lignes de business du compte :
 *   - CopyX (FCFA, acomptes, XaalipSay)
 *   - Dropshipping (EUR / USD / GBP / FCFA)
 *
 * La ligne active est stockée sur `profiles.active_mode` : les produits et les
 * saisies sont filtrés par `business_mode`, donc changer de ligne change tout
 * le contenu de l'app (aucune donnée n'est mélangée).
 */
export function BusinessLineSwitch({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { mode, setMode, isLoading, dropshippingCurrency } = useActiveMode();

  const items: { key: BusinessMode; label: string; hint: string }[] = [
    { key: "copyx", label: "CopyX", hint: "FCFA · acomptes" },
    { key: "dropshipping", label: "Dropshipping", hint: dropshippingCurrency },
  ];

  if (isLoading) {
    return (
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        …
      </span>
    );
  }

  const compact = variant === "mobile";

  return (
    <div
      role="tablist"
      aria-label="Ligne de business"
      className="brutal-border-thin inline-flex items-center overflow-hidden"
    >
      {items.map((it) => {
        const active = mode === it.key;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => void setMode(it.key)}
            title={`${it.label} — ${it.hint}`}
            className={`px-2.5 py-1.5 font-mono font-bold uppercase tracking-widest transition-colors ${
              compact ? "text-[10px]" : "text-[10px] md:text-[11px]"
            } ${
              active
                ? "bg-foreground text-background"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {it.label}
            <span className={`ml-1.5 ${active ? "opacity-70" : "opacity-50"}`}>
              {it.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
