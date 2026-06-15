import { useMemo, useState } from "react";
import { useActiveMode } from "@/lib/use-active-mode";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { useDropshippingFx } from "@/lib/use-dropshipping-fx";
import { computeKPIs, dateRangeForPreset, formatCurrency } from "@/lib/calc";
import { computeBreakdown } from "@/lib/analytics-insights";
import type { Preset, CustomRange } from "@/components/PeriodPicker";

type Props = { preset: Preset; customRange: CustomRange };

export function ProfitBreakdownTab({ preset, customRange }: Props) {
  const { user } = useAuth();
  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);

  const { currency, mode: activeMode } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];

  const [productId, setProductId] = useState<string | "all">("all");

  const filteredEntries = productId === "all" ? entries : entries.filter((e) => e.product_id === productId);
  const filteredProducts = productId === "all" ? products : products.filter((p) => p.id === productId);

  const kpis = useMemo(
    () => computeKPIs(filteredEntries, filteredProducts, currency, dropshippingFx, metaTaxPct),
    [filteredEntries, filteredProducts, currency, dropshippingFx, metaTaxPct],
  );

  const steps = useMemo(() => computeBreakdown(kpis), [kpis]);

  // Échelle pour la barre visuelle : valeur absolue max
  const maxVal = Math.max(kpis.revenue, 1);

  // Pour le donut "où part chaque euro" : on prend les coûts (positifs)
  const costs = [
    { label: "Coûts produits livrés", value: kpis.cogs, color: "hsl(0 75% 55%)" },
    { label: "Pub", value: kpis.adSpend, color: "hsl(220 75% 55%)" },
    { label: "Taxe Meta", value: kpis.metaTax, color: "hsl(260 60% 55%)" },
    { label: "Shopify/Stripe", value: kpis.shopifyFees, color: "hsl(180 60% 45%)" },
    { label: "Wave", value: kpis.waveFees, color: "hsl(280 55% 50%)" },
    { label: "Remboursés", value: kpis.refundedAmount, color: "hsl(340 60% 50%)" },
    { label: "Bénéfice net", value: Math.max(0, kpis.netProfit), color: "hsl(150 70% 40%)" },
  ].filter((s) => s.value > 0);
  const totalCost = costs.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Décomposition du bénéfice</h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">
            Où part chaque euro de CA. Identifie les postes qui pèsent.
          </p>
        </div>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value as any)}
          className="brutal-border-thin px-3 py-2 text-xs uppercase tracking-widest font-bold bg-background"
        >
          <option value="all">Tous les produits</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Waterfall */}
      <div className="brutal-border-thin p-5 bg-card">
        <div className="text-xs uppercase tracking-widest font-bold mb-4">Waterfall — du CA au bénéfice net</div>
        <div className="space-y-2">
          {steps.map((s) => {
            const abs = Math.abs(s.value);
            const widthPct = Math.min(100, (abs / maxVal) * 100);
            const isCost = s.kind === "cost";
            const isResult = s.kind === "result";
            const tone = isResult
              ? (s.value >= 0 ? "bg-emerald-600 text-white" : "bg-red-600 text-white")
              : isCost ? "bg-red-500/80 text-white" : "bg-foreground text-background";
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-44 text-xs font-bold tracking-wide">{s.label}</div>
                <div className="flex-1 h-7 bg-muted relative">
                  <div className={`h-full ${tone} flex items-center px-2`} style={{ width: `${widthPct}%` }}>
                    <span className="text-[11px] font-bold tabular-nums whitespace-nowrap">
                      {isCost ? "−" : ""}{formatCurrency(abs, currency)}
                    </span>
                  </div>
                </div>
                <div className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                  {(s.pctOfRevenue * 100).toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut visuel via stacked bar */}
      <div className="brutal-border-thin p-5 bg-card">
        <div className="text-xs uppercase tracking-widest font-bold mb-4">Où part chaque euro de CA</div>
        {totalCost > 0 ? (
          <>
            <div className="flex h-8 brutal-border-thin overflow-hidden">
              {costs.map((c) => (
                <div
                  key={c.label}
                  style={{ width: `${(c.value / totalCost) * 100}%`, backgroundColor: c.color }}
                  title={`${c.label} — ${formatCurrency(c.value, currency)}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {costs.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="font-bold truncate">{c.label}</span>
                  <span className="ml-auto tabular-nums text-muted-foreground">
                    {((c.value / totalCost) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Pas de données sur cette période</div>
        )}
      </div>

      {/* Récap chiffré */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Box label="CA" value={formatCurrency(kpis.revenue, currency)} />
        <Box label="Total coûts" value={formatCurrency(kpis.revenue - kpis.netProfit, currency)} />
        <Box label="Dont expédition" value={formatCurrency(kpis.shippingCost, currency)} />
        <Box label="Bénéfice net" value={formatCurrency(kpis.netProfit, currency)} tone={kpis.netProfit > 0 ? "good" : kpis.netProfit < 0 ? "bad" : undefined} />
        <Box label="Marge nette" value={kpis.revenue > 0 ? `${((kpis.netProfit / kpis.revenue) * 100).toFixed(1)}%` : "—"} />
      </div>
    </div>
  );
}

function Box({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const cls = tone === "good" ? "bg-emerald-600 text-white" : tone === "bad" ? "bg-red-600 text-white" : "bg-card";
  return (
    <div className={`brutal-border-thin p-3 ${cls}`}>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{label}</div>
      <div className="text-xl font-black mt-1 tabular-nums">{value}</div>
    </div>
  );
}
