import { useMemo, useState } from "react";
import { useActiveMode } from "@/lib/use-active-mode";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { computeKPIs, convertCurrency, dateRangeForPreset, formatCurrency } from "@/lib/calc";
import type { Preset, CustomRange } from "@/components/PeriodPicker";

type Props = { preset: Preset; customRange: CustomRange };

export function BreakEvenTab({ preset, customRange }: Props) {
  const { user } = useAuth();
  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);

  const { currency, mode: activeMode } = useActiveMode();
  const usdRate = Number((profileQ.data as any)?.usd_to_xof_rate ?? 0);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];

  const rows = products.map((p) => {
    const sale = convertCurrency(Number(p.sale_price ?? 0), p.currency ?? currency, currency, usdRate);
    const cost = convertCurrency(Number(p.cost_price ?? 0), p.currency ?? currency, currency, usdRate);
    const ship = convertCurrency(Number(p.shipping_cost ?? 0), p.currency ?? currency, currency, usdRate);
    const unitMargin = sale - cost - ship;
    const grossPct = sale > 0 ? unitMargin / sale : 0;
    const breakEvenRoas = grossPct > 0 ? 1 / grossPct : 0;
    const breakEvenCpa = unitMargin; // CPA max pour ne pas perdre

    const pEntries = entries.filter((e) => e.product_id === p.id);
    const k = computeKPIs(pEntries, [p], currency, usdRate, metaTaxPct);
    const margin = breakEvenRoas > 0 ? (k.roas - breakEvenRoas) / breakEvenRoas : 0;

    return { product: p, sale, cost, ship, unitMargin, grossPct, breakEvenRoas, breakEvenCpa, actualRoas: k.roas, margin };
  });

  // Mini simulateur
  const [simProductId, setSimProductId] = useState<string>(products[0]?.id ?? "");
  const [simBudget, setSimBudget] = useState<number>(100);
  const [simCpa, setSimCpa] = useState<number>(20);
  const simProduct = products.find((p) => p.id === simProductId);
  const simRow = rows.find((r) => r.product.id === simProductId);
  const sim = useMemo(() => {
    if (!simProduct || !simRow) return null;
    const orders = simCpa > 0 ? simBudget / simCpa : 0;
    const grossProfit = orders * simRow.unitMargin;
    const netProfit = grossProfit - simBudget;
    const roas = simBudget > 0 ? (orders * simRow.sale) / simBudget : 0;
    return { orders, grossProfit, netProfit, roas };
  }, [simProduct, simRow, simBudget, simCpa]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Seuils & Simulateur</h2>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">
          Connais ton seuil de rentabilité par produit + projette tes scénarios.
        </p>
      </div>

      <div className="brutal-border-thin overflow-x-auto bg-card">
        <div className="px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border">
          Break-even par produit
        </div>
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Produit</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Prix vente</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Marge unité</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Marge brute %</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">BE ROAS</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">BE CPA max</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">ROAS actuel</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const ok = r.actualRoas > 0 && r.actualRoas >= r.breakEvenRoas;
              return (
                <tr key={r.product.id} className="border-t border-border">
                  <td className="px-3 py-2 font-bold">{r.product.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(r.sale, currency)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold">{formatCurrency(r.unitMargin, currency)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{(r.grossPct * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.breakEvenRoas ? r.breakEvenRoas.toFixed(2) : "—"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(r.breakEvenCpa, currency)}</td>
                  <td className={`px-3 py-2 text-right tabular-nums font-bold ${ok ? "text-emerald-600" : r.actualRoas > 0 ? "text-red-600" : ""}`}>
                    {r.actualRoas > 0 ? r.actualRoas.toFixed(2) : "—"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      r.actualRoas === 0 ? "bg-muted text-muted-foreground" :
                      ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}>
                      {r.actualRoas === 0 ? "—" : ok ? "RENTABLE" : "EN PERTE"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">Aucun produit</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simulateur */}
      {products.length > 0 && (
        <div className="brutal-border p-5 bg-card">
          <div className="text-xs uppercase tracking-widest font-bold mb-1">🧪 Simulateur de scénario</div>
          <p className="text-xs text-muted-foreground mb-4">
            « Si je dépense X en pub avec un CPA de Y, combien je gagne ? »
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            <Field label="Produit">
              <select
                value={simProductId}
                onChange={(e) => setSimProductId(e.target.value)}
                className="brutal-border-thin px-3 py-2 text-sm font-bold bg-background w-full"
              >
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label={`Budget pub (${currency})`}>
              <input
                type="number" min={0} value={simBudget}
                onChange={(e) => setSimBudget(Number(e.target.value) || 0)}
                className="brutal-border-thin px-3 py-2 text-sm font-bold bg-background w-full tabular-nums"
              />
            </Field>
            <Field label={`Coût/commande visé (${currency})`}>
              <input
                type="number" min={0} value={simCpa}
                onChange={(e) => setSimCpa(Number(e.target.value) || 0)}
                className="brutal-border-thin px-3 py-2 text-sm font-bold bg-background w-full tabular-nums"
              />
            </Field>
          </div>

          {sim && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Box label="Commandes" value={sim.orders.toFixed(1)} />
              <Box label="Marge brute" value={formatCurrency(sim.grossProfit, currency)} />
              <Box label="Bénéfice net" value={formatCurrency(sim.netProfit, currency)} tone={sim.netProfit > 0 ? "good" : sim.netProfit < 0 ? "bad" : undefined} />
              <Box label="ROAS projeté" value={sim.roas.toFixed(2)} />
            </div>
          )}
          {simRow && simCpa > simRow.breakEvenCpa && (
            <div className="mt-4 brutal-border-thin border-red-600 p-3 text-xs font-mono text-red-600 bg-red-50 dark:bg-red-950/30">
              ⚠ CPA visé ({formatCurrency(simCpa, currency)}) supérieur au CPA max ({formatCurrency(simRow.breakEvenCpa, currency)}) — tu perds de l'argent sur chaque commande.
            </div>
          )}
        </div>
      )}

      <div className="brutal-border-thin p-4 bg-muted/30 text-xs font-mono text-muted-foreground space-y-1">
        <p><strong>BE ROAS</strong> = 1 / marge brute. C'est le ROAS minimum pour ne pas perdre.</p>
        <p><strong>BE CPA</strong> = marge unitaire. Au-dessus, chaque commande te coûte de l'argent.</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-1">{label}</span>
      {children}
    </label>
  );
}
function Box({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const cls = tone === "good" ? "bg-emerald-600 text-white" : tone === "bad" ? "bg-red-600 text-white" : "bg-background brutal-border-thin";
  return (
    <div className={`p-3 ${cls}`}>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{label}</div>
      <div className="text-xl font-black mt-1 tabular-nums">{value}</div>
    </div>
  );
}
