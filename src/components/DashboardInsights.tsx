import { Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/calc";

export type InsightProduct = {
  id: string;
  name: string;
  netProfit: number;
};

export type InsightAlert = {
  kind: "loss" | "warn" | "tip";
  title: string;
  message: string;
  cta?: { label: string; to: string };
};

/**
 * Bandeau actionnable au-dessus du dashboard :
 *  - Top 3 produits par profit net (cliquables → filtre le dashboard)
 *  - Alertes contextuelles (perte, pas de saisie récente, marge faible, etc.)
 *
 * Pas de fetch : on lui passe les données déjà calculées.
 */
export function DashboardInsights({
  topProducts,
  alerts,
  currency,
  onSelectProduct,
}: {
  topProducts: InsightProduct[];
  alerts: InsightAlert[];
  currency: string;
  onSelectProduct?: (id: string) => void;
}) {
  if (topProducts.length === 0 && alerts.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-3 mb-4">
      {/* Top 3 produits */}
      {topProducts.length > 0 && (
        <div className="brutal-border-thin p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              🏆 TOP PRODUITS · PROFIT
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              CLIQUER POUR FILTRER
            </span>
          </div>
          <ol className="grid gap-1">
            {topProducts.slice(0, 3).map((p, i) => {
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onSelectProduct?.(p.id)}
                    className="w-full flex items-center justify-between gap-3 px-2 py-1.5 hover:bg-foreground/5 text-left"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{medal}</span>
                      <span className="font-bold uppercase tracking-tight truncate text-sm">
                        {p.name}
                      </span>
                    </span>
                    <span
                      className={`font-mono font-black tabular text-sm shrink-0 ${
                        p.netProfit < 0 ? "text-accent" : ""
                      }`}
                    >
                      {formatCurrency(p.netProfit, currency)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="grid gap-2">
          {alerts.slice(0, 3).map((a, i) => {
            const colors =
              a.kind === "loss"
                ? "border-accent bg-accent/5 text-accent-foreground"
                : a.kind === "warn"
                  ? "border-[#eab308] bg-[#eab308]/10"
                  : "border-foreground/40 bg-foreground/5";
            const icon = a.kind === "loss" ? "⚠" : a.kind === "warn" ? "!" : "💡";
            return (
              <div
                key={i}
                className={`brutal-border-thin p-3 flex flex-wrap items-center justify-between gap-2 ${colors}`}
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span>{a.title}</span>
                  </div>
                  <div className="text-xs font-mono mt-0.5">{a.message}</div>
                </div>
                {a.cta && (
                  <Link
                    to={a.cta.to as any}
                    className="brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent shrink-0"
                  >
                    {a.cta.label} →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
