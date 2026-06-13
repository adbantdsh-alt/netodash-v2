import { useMemo } from "react";
import { useActiveMode } from "@/lib/use-active-mode";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { computeKPIs, formatCurrency, formatNumber } from "@/lib/calc";
import { previousRange, deltaPct } from "@/lib/analytics-insights";
import { MetricsView } from "@/components/MetricsView";
import type { Preset, CustomRange } from "@/components/PeriodPicker";
import { dateRangeForPreset } from "@/lib/calc";

type Props = { preset: Preset; customRange: CustomRange };

export function OverviewTab({ preset, customRange }: Props) {
  const { user } = useAuth();
  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const prev = useMemo(() => previousRange(range), [range]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const curEntriesQ = useEntries(user?.id, range);
  const prevEntriesQ = useEntries(user?.id, prev);

  const { currency, mode: activeMode } = useActiveMode();
  const usdRate = Number((profileQ.data as any)?.usd_to_xof_rate ?? 0);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];

  const cur = useMemo(
    () => computeKPIs(curEntriesQ.data ?? [], products, currency, usdRate, metaTaxPct),
    [curEntriesQ.data, products, currency, usdRate, metaTaxPct],
  );
  const prevK = useMemo(
    () => computeKPIs(prevEntriesQ.data ?? [], products, currency, usdRate, metaTaxPct),
    [prevEntriesQ.data, products, currency, usdRate, metaTaxPct],
  );

  const deltas = [
    { label: "Bénéfice net", cur: cur.netProfit, prev: prevK.netProfit, fmt: (v: number) => formatCurrency(v, currency) },
    { label: "Chiffre d'affaires", cur: cur.revenue, prev: prevK.revenue, fmt: (v: number) => formatCurrency(v, currency) },
    { label: "Dépense pub", cur: cur.adSpend + cur.metaTax, prev: prevK.adSpend + prevK.metaTax, fmt: (v: number) => formatCurrency(v, currency) },
    { label: "ROAS", cur: cur.roas, prev: prevK.roas, fmt: (v: number) => v.toFixed(2) },
    { label: "Commandes", cur: cur.shopifyOrders, prev: prevK.shopifyOrders, fmt: (v: number) => formatNumber(v) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {deltas.map((d) => {
          const delta = deltaPct(d.cur, d.prev);
          const arrow = delta == null ? "" : delta > 0.02 ? "▲" : delta < -0.02 ? "▼" : "→";
          const tone = delta == null ? "text-muted-foreground" : delta > 0.02 ? "text-emerald-600" : delta < -0.02 ? "text-red-600" : "text-muted-foreground";
          // Pour la dépense pub : à la baisse = bon, à la hausse = neutre
          const isCost = d.label.includes("pub");
          const finalTone = isCost && delta != null
            ? delta < -0.02 ? "text-emerald-600" : delta > 0.02 ? "text-amber-600" : "text-muted-foreground"
            : tone;
          return (
            <div key={d.label} className="brutal-border-thin p-3 bg-card">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{d.label}</div>
              <div className="text-xl font-black mt-1 tabular-nums">{d.fmt(d.cur)}</div>
              <div className={`text-[10px] font-mono mt-1 ${finalTone}`}>
                {delta == null ? "— vs précédent" : `${arrow} ${(Math.abs(delta) * 100).toFixed(0)}% vs précédent`}
              </div>
            </div>
          );
        })}
      </div>

      <MetricsView />
    </div>
  );
}
