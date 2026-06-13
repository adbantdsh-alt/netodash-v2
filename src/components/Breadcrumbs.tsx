import { Link, useLocation } from "@tanstack/react-router";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Produits",
  entries: "Saisies",
  analytics: "Analytics",
  plan: "Mon plan",
  settings: "Paramètres",
  "roas-calculator": "Calculateur ROAS",
  netodsh: "Admin",
};

/**
 * Fil d'Ariane minimal : visible uniquement quand on est en sous-page de l'app.
 * Pas affiché sur la home dashboard (déjà évident).
 */
export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1 && parts[0] === "dashboard") return null;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="max-w-[1600px] mx-auto px-4 md:px-6 pt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 overflow-x-auto"
    >
      <Link to="/dashboard" className="hover:text-foreground shrink-0">
        ⌂ Accueil
      </Link>
      {parts.map((part, i) => {
        const to = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        const label = LABELS[part] ?? decodeURIComponent(part);
        return (
          <span key={to} className="flex items-center gap-1.5 shrink-0">
            <span className="opacity-40">/</span>
            {isLast ? (
              <span className="text-foreground font-bold">{label}</span>
            ) : (
              <Link to={to as any} className="hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
