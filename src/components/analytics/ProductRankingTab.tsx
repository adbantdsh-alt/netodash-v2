import { useMemo, useState } from "react";
import { useActiveMode } from "@/lib/use-active-mode";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { canExportCsv } from "@/lib/plan-limits";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { formatCurrency, formatNumber, dateRangeForPreset } from "@/lib/calc";
import { rankProducts, downloadCSV, type ProductRanking } from "@/lib/analytics-insights";
import type { Preset, CustomRange } from "@/components/PeriodPicker";

type Props = { preset: Preset; customRange: CustomRange };
type SortKey = "score" | "netProfit" | "revenue" | "roas" | "marginPct" | "refundRate" | "profitPerAdEuro";

export function ProductRankingTab({ preset, customRange }: Props) {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);

  const { currency, mode: activeMode } = useActiveMode();
  const csvAllowed = canExportCsv(sub.plan, activeMode);
  const usdRate = Number((profileQ.data as any)?.usd_to_xof_rate ?? 0);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);

  const [sort, setSort] = useState<SortKey>("score");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rankings = useMemo(
    () => rankProducts(productsQ.data ?? [], entriesQ.data ?? [], currency, usdRate, metaTaxPct),
    [productsQ.data, entriesQ.data, currency, usdRate, metaTaxPct],
  );

  const sorted = useMemo(() => {
    const cp = [...rankings];
    cp.sort((a, b) => {
      const va = readSortVal(a, sort);
      const vb = readSortVal(b, sort);
      return dir === "desc" ? vb - va : va - vb;
    });
    return cp;
  }, [rankings, sort, dir]);

  const setSortKey = (k: SortKey) => {
    if (sort === k) setDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSort(k); setDir("desc"); }
  };

  const handleExport = () => {
    const rows: (string | number)[][] = [
      ["Produit", "Score", "Verdict", "CA", "Bénéfice net", "Marge %", "ROAS", "AOV", "Coût/cmd", "Bénéfice/€pub", "Remboursés %", "Cmds", "Break-even ROAS"],
      ...sorted.map((r) => [
        r.product.name,
        r.score,
        r.verdict,
        Math.round(r.kpis.revenue),
        Math.round(r.kpis.netProfit),
        (r.marginPct * 100).toFixed(1),
        r.kpis.roas.toFixed(2),
        Math.round(r.aov),
        Math.round(r.costPerOrder),
        r.profitPerAdEuro.toFixed(2),
        (r.refundRate * 100).toFixed(1),
        r.kpis.shopifyOrders,
        r.breakEvenRoas.toFixed(2),
      ]),
    ];
    downloadCSV(`netodash-ranking-${range.from}_${range.to}.csv`, rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Classement produits</h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">
            Trie par score, marge, ROAS… Identifie tes winners & losers en un coup d'œil.
          </p>
        </div>
        {csvAllowed ? (
          <button
            onClick={handleExport}
            className="px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin hover:bg-foreground hover:text-background"
          >
            ↓ Export CSV
          </button>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            🔒 Export CSV · plan Pro Drop
          </span>
        )}
      </div>

      <div className="brutal-border-thin overflow-x-auto bg-card">
        <table className="w-full text-sm min-w-[1000px]">
          <thead className="bg-muted">
            <tr className="text-left">
              <Th>Produit</Th>
              <SortableTh label="Score" k="score" sort={sort} dir={dir} onClick={setSortKey} />
              <Th>Verdict</Th>
              <SortableTh label="CA" k="revenue" sort={sort} dir={dir} onClick={setSortKey} align="right" />
              <SortableTh label="Bénéfice" k="netProfit" sort={sort} dir={dir} onClick={setSortKey} align="right" />
              <SortableTh label="Marge %" k="marginPct" sort={sort} dir={dir} onClick={setSortKey} align="right" />
              <SortableTh label="ROAS" k="roas" sort={sort} dir={dir} onClick={setSortKey} align="right" />
              <SortableTh label="€ profit/€ pub" k="profitPerAdEuro" sort={sort} dir={dir} onClick={setSortKey} align="right" />
              <SortableTh label="Remb. %" k="refundRate" sort={sort} dir={dir} onClick={setSortKey} align="right" />
              <Th align="right">Cmds</Th>
              <Th align="center">Action</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.product.id} className="border-t border-border">
                <td className="px-3 py-2 font-bold">{r.product.name}</td>
                <td className="px-3 py-2"><ScoreBar score={r.score} /></td>
                <td className="px-3 py-2"><VerdictBadge v={r.verdict} /></td>
                <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(r.kpis.revenue, currency)}</td>
                <td className={`px-3 py-2 text-right tabular-nums font-bold ${r.kpis.netProfit > 0 ? "text-emerald-600" : r.kpis.netProfit < 0 ? "text-red-600" : ""}`}>
                  {formatCurrency(r.kpis.netProfit, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{(r.marginPct * 100).toFixed(0)}%</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.kpis.roas.toFixed(2)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.profitPerAdEuro.toFixed(2)}</td>
                <td className={`px-3 py-2 text-right tabular-nums ${r.refundRate > 0.08 ? "text-amber-600 font-bold" : ""}`}>
                  {(r.refundRate * 100).toFixed(0)}%
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(r.kpis.shopifyOrders)}</td>
                <td className="px-3 py-2 text-center">
                  <Link to="/products" className="text-[10px] uppercase tracking-widest font-bold underline">
                    Gérer
                  </Link>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-muted-foreground">Aucun produit</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="brutal-border-thin p-4 bg-muted/30 text-xs font-mono text-muted-foreground space-y-1">
        <p><strong>Score</strong> : pondère marge nette, bénéfice/€ pub, ROAS vs break-even et taux de remboursement.</p>
        <p><strong>€ profit/€ pub</strong> : combien tu gagnes par euro investi en publicité (le KPI roi du dropshipping).</p>
        <p><strong>Verdicts</strong> : 🟢 winner ≥65 · 🟡 watch 40-64 · 🔴 loser &lt;40.</p>
      </div>
    </div>
  );
}

function readSortVal(r: ProductRanking, k: SortKey): number {
  switch (k) {
    case "score": return r.score;
    case "netProfit": return r.kpis.netProfit;
    case "revenue": return r.kpis.revenue;
    case "roas": return r.kpis.roas;
    case "marginPct": return r.marginPct;
    case "refundRate": return r.refundRate;
    case "profitPerAdEuro": return r.profitPerAdEuro;
  }
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
  return <th className={`px-3 py-2 text-xs uppercase tracking-widest text-${align}`}>{children}</th>;
}
function SortableTh({ label, k, sort, dir, onClick, align = "left" }: { label: string; k: SortKey; sort: SortKey; dir: "asc" | "desc"; onClick: (k: SortKey) => void; align?: "left" | "right" | "center" }) {
  const active = sort === k;
  return (
    <th className={`px-3 py-2 text-xs uppercase tracking-widest text-${align}`}>
      <button onClick={() => onClick(k)} className={`inline-flex items-center gap-1 ${active ? "underline" : ""}`}>
        {label} {active && (dir === "desc" ? "▼" : "▲")}
      </button>
    </th>
  );
}
function ScoreBar({ score }: { score: number }) {
  const color = score >= 65 ? "bg-emerald-600" : score >= 40 ? "bg-amber-500" : score > 0 ? "bg-red-600" : "bg-muted-foreground/30";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-muted">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-7">{score}</span>
    </div>
  );
}
function VerdictBadge({ v }: { v: ProductRanking["verdict"] }) {
  const map = {
    winner: { label: "WINNER", cls: "bg-emerald-600 text-white" },
    watch: { label: "WATCH", cls: "bg-amber-500 text-black" },
    loser: { label: "LOSER", cls: "bg-red-600 text-white" },
    "no-data": { label: "—", cls: "bg-muted text-muted-foreground" },
  } as const;
  const x = map[v];
  return <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${x.cls}`}>{x.label}</span>;
}
