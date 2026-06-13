import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useActiveMode } from "@/lib/use-active-mode";

type Props = {
  onNewEntry?: () => void;
};

/**
 * Bottom navigation persistante sur mobile.
 * 5 emplacements : Dashboard, Produits, [+ Saisie], Saisies, Compte.
 * Le bouton central est surélevé et coloré selon le mode actif.
 */
export function MobileBottomNav({ onNewEntry }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useActiveMode();

  const path = location.pathname;
  const isActive = (p: string) => path === p || path.startsWith(p + "/");

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: "▤" },
    { to: "/products", label: "Produits", icon: "◫" },
    { to: "/analytics", label: "Analytics", icon: "📊" },
    { to: "/settings", label: "Compte", icon: "⚙" },
  ] as const;

  return (
    <nav
      aria-label="Navigation principale"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t-2 border-foreground pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-end">
        {/* 2 premiers items */}
        {items.slice(0, 2).map((it) => (
          <NavBtn key={it.to} to={it.to} label={it.label} icon={it.icon} active={isActive(it.to)} />
        ))}

        {/* Bouton central : Nouvelle saisie */}
        <div className="flex justify-center -mt-5">
          <button
            type="button"
            onClick={() => {
              if (onNewEntry) onNewEntry();
              else navigate({ to: "/entries" });
            }}
            aria-label="Nouvelle saisie"
            data-mode-active={mode}
            className="h-14 w-14 flex flex-col items-center justify-center brutal-border bg-accent text-accent-foreground font-black text-2xl shadow-[4px_4px_0_0_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span aria-hidden>＋</span>
          </button>
        </div>

        {/* 2 derniers items */}
        {items.slice(2).map((it) => (
          <NavBtn key={it.to} to={it.to} label={it.label} icon={it.icon} active={isActive(it.to)} />
        ))}
      </div>
    </nav>
  );
}

function NavBtn({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      to={to as any}
      className={`flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 text-[10px] uppercase tracking-widest font-bold ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <span className={`text-lg leading-none ${active ? "" : "opacity-60"}`} aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
      {active && <span aria-hidden className="block h-[2px] w-6 bg-accent" />}
    </Link>
  );
}
