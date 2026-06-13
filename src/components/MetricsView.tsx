import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { useActiveMode } from "@/lib/use-active-mode";
import {
  computeDailySeries,
  computeKPIs,
  dateRangeForPreset,
  fillDailySeries,
  formatCurrency,
  formatNumber,
} from "@/lib/calc";
import { PeriodPicker, type Preset, type CustomRange } from "@/components/PeriodPicker";

// Palette de couleurs distinctes par produit (style Shopify)
const PALETTE = [
  "#2563eb", "#dc2626", "#16a34a", "#ea580c", "#9333ea",
  "#0891b2", "#ca8a04", "#db2777", "#65a30d", "#7c3aed",
  "#0d9488", "#e11d48",
];

type MetricKey = "netProfit" | "revenue" | "adSpend" | "roas" | "shopifyOrders";

const METRICS: { key: MetricKey; label: string; isCurrency?: boolean }[] = [
  { key: "netProfit", label: "Bénéfice net", isCurrency: true },
  { key: "revenue", label: "Chiffre d'affaires", isCurrency: true },
  { key: "adSpend", label: "Dépense pub", isCurrency: true },
  { key: "roas", label: "ROAS" },
  { key: "shopifyOrders", label: "Commandes" },
];

export function MetricsView() {
  const { user } = useAuth();
  // Defaut "Hier" — bcp plus utile que "Aujourd'hui" qui a souvent peu de data
  const [preset, setPreset] = useState<Preset>("yesterday");
  const [customRange, setCustomRange] = useState<CustomRange>(null);
  const [metric, setMetric] = useState<MetricKey>("netProfit");

  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const isSingleDay = range.from === range.to;
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);
  const { currency } = useActiveMode();

  const usdRate = Number((profileQ.data as any)?.usd_to_xof_rate ?? 0);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];

  // Couleur par produit (stable)
  const productColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p, i) => map.set(p.id, PALETTE[i % PALETTE.length]));
    return map;
  }, [products]);

  // Sélection produits (par défaut: tous)
  const [selected, setSelected] = useState<Set<string> | null>(null);
  const selectedSet = selected ?? new Set(products.map((p) => p.id));

  const toggle = (id: string) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  // KPIs globaux pour la période (utile surtout sur 1 jour)
  const globalKpis = useMemo(() => {
    const filteredProducts = products.filter((p) => selectedSet.has(p.id));
    const filteredEntries = entries.filter((e) =>
      filteredProducts.some((p) => p.id === e.product_id),
    );
    return computeKPIs(filteredEntries, filteredProducts, currency, usdRate, metaTaxPct);
  }, [products, selectedSet, entries, currency, usdRate, metaTaxPct]);

  // Série quotidienne par produit sélectionné
  const chartData = useMemo(() => {
    if (products.length === 0) return [];
    const dayMap = new Map<string, Record<string, number | string>>();

    for (const p of products) {
      if (!selectedSet.has(p.id)) continue;
      const series = computeDailySeries(entries, products, p.id, currency, usdRate, metaTaxPct);
      const filled = fillDailySeries(series, range.from, range.to, (date) => ({
        date,
        revenue: 0,
        adSpend: 0,
        metaTax: 0,
        netProfit: 0,
        roas: 0,
        shopifyOrders: 0,
        notes: null,
      }));
      for (const s of filled) {
        if (!dayMap.has(s.date)) dayMap.set(s.date, { date: s.date });
        dayMap.get(s.date)![p.id] = Math.round(Number(s[metric] ?? 0) * 100) / 100;
      }
    }

    return Array.from(dayMap.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    );
  }, [products, selectedSet, entries, currency, usdRate, metaTaxPct, range.from, range.to, metric]);

  // Tableau récap par produit
  const productRows = useMemo(() => {
    return products
      .filter((p) => selectedSet.has(p.id))
      .map((p) => {
        const pEntries = entries.filter((e) => e.product_id === p.id);
        const k = computeKPIs(pEntries, products, currency, usdRate, metaTaxPct);
        const series = computeDailySeries(pEntries, products, p.id, currency, usdRate, metaTaxPct);
        const profitableDays = series.filter((s) => s.netProfit > 0).length;
        const lossDays = series.filter((s) => s.netProfit < 0).length;
        return { product: p, kpis: k, profitableDays, lossDays, totalDays: series.length };
      });
  }, [products, selectedSet, entries, currency, usdRate, metaTaxPct]);

  // Jours détaillés
  const dailyAgg = useMemo(() => {
    const filteredProducts = products.filter((p) => selectedSet.has(p.id));
    const filteredEntries = entries.filter((e) =>
      filteredProducts.some((p) => p.id === e.product_id),
    );
    return computeDailySeries(filteredEntries, filteredProducts, null, currency, usdRate, metaTaxPct)
      .slice()
      .reverse();
  }, [products, selectedSet, entries, currency, usdRate, metaTaxPct]);

  const fmt = (v: number) =>
    METRICS.find((m) => m.key === metric)?.isCurrency
      ? formatCurrency(v, currency)
      : formatNumber(v, metric === "roas" ? 2 : 0);

  const hasData = entries.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Compare tes produits jour par jour
          </p>
        </div>
        <PeriodPicker
          value={preset}
          onChange={setPreset}
          customRange={customRange}
          onCustomChange={setCustomRange}
        />
      </div>

      {/* Filtres produits */}
      <div className="brutal-border-thin p-4 bg-card">
        <div className="text-xs uppercase tracking-widest font-bold mb-3">
          Produits ({selectedSet.size}/{products.length})
        </div>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => {
            const active = selectedSet.has(p.id);
            const color = productColors.get(p.id)!;
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 brutal-border-thin text-xs font-bold uppercase tracking-wider ${
                  active ? "bg-foreground text-background" : "bg-background"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color, opacity: active ? 1 : 0.3 }}
                />
                {p.name}
              </button>
            );
          })}
          {products.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Aucun produit. Crée tes produits pour les comparer ici.
            </div>
          )}
        </div>
      </div>

      {/* KPIs globaux (toujours affichés, surtout utile sur 1 seul jour) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiBox
          label="Bénéfice net"
          value={formatCurrency(globalKpis.netProfit, currency)}
          accent={globalKpis.netProfit > 0 ? "good" : globalKpis.netProfit < 0 ? "bad" : "neutral"}
        />
        <KpiBox label="CA" value={formatCurrency(globalKpis.revenue, currency)} />
        <KpiBox label="Pub + taxe" value={formatCurrency(globalKpis.adSpend + globalKpis.metaTax, currency)} />
        <KpiBox label="ROAS" value={globalKpis.roas.toFixed(2)} />
        <KpiBox label="Commandes" value={formatNumber(globalKpis.shopifyOrders)} />
        <KpiBox label="Remboursées" value={formatNumber(globalKpis.refundedOrders)} />
        <KpiBox label="Mt remboursé" value={formatCurrency(globalKpis.refundedAmount, currency)} />
        <KpiBox label="Coût/cmd" value={formatCurrency(globalKpis.shopifyOrders > 0 ? (globalKpis.adSpend + globalKpis.metaTax) / globalKpis.shopifyOrders : 0, currency)} />

      </div>

      {/* Sélecteur de métrique + graph (cachés si 1 jour) */}
      {!isSingleDay && hasData && (
        <>
          <div className="flex flex-wrap gap-2">
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin ${
                  metric === m.key ? "bg-foreground text-background" : "bg-background"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="brutal-border-thin p-4 bg-card">
            <div className="text-xs uppercase tracking-widest font-bold mb-3">
              {METRICS.find((m) => m.key === metric)?.label} par produit
            </div>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(v: number) => fmt(Number(v))}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {products
                    .filter((p) => selectedSet.has(p.id))
                    .map((p) => (
                      <Line
                        key={p.id}
                        type="monotone"
                        dataKey={p.id}
                        name={p.name}
                        stroke={productColors.get(p.id)}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {isSingleDay && (
        <div className="brutal-border-thin p-4 bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground">
          Graphique masqué : un seul jour sélectionné. Choisis 7J / 30J / Mois pour voir les courbes.
        </div>
      )}

      {/* Tableau récap par produit */}
      <div className="brutal-border-thin overflow-x-auto bg-card">
        <div className="px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border">
          Récap par produit
        </div>
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Produit</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">CA</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Pub</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Bénéfice net</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">ROAS</th>
              {!isSingleDay && (
                <>
                  <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">J. rentables</th>
                  <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">J. perte</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {productRows.map(({ product, kpis, profitableDays, lossDays, totalDays }) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: productColors.get(product.id) }}
                    />
                    <span className="font-bold">{product.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCurrency(kpis.revenue, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCurrency(kpis.adSpend, currency)}
                </td>
                <td
                  className={`px-3 py-2 text-right tabular-nums font-bold ${
                    kpis.netProfit > 0
                      ? "text-emerald-600"
                      : kpis.netProfit < 0
                        ? "text-red-600"
                        : ""
                  }`}
                >
                  {formatCurrency(kpis.netProfit, currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{kpis.roas.toFixed(2)}</td>
                {!isSingleDay && (
                  <>
                    <td className="px-3 py-2 text-right tabular-nums text-emerald-600">
                      {profitableDays}/{totalDays}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-red-600">{lossDays}</td>
                  </>
                )}
              </tr>
            ))}
            {productRows.length === 0 && (
              <tr>
                <td colSpan={isSingleDay ? 5 : 7} className="px-3 py-6 text-center text-muted-foreground">
                  Pas de données sur cette période
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Détail jour par jour */}
      {!isSingleDay && (
        <div className="brutal-border-thin overflow-x-auto bg-card">
          <div className="px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border">
            Détail jour par jour ({dailyAgg.length} jours)
          </div>
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-3 py-2 text-xs uppercase tracking-widest">Date</th>
                <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">CA</th>
                <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Pub</th>
                <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Bénéfice</th>
                <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">ROAS</th>
                <th className="px-3 py-2 text-xs uppercase tracking-widest text-center">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {dailyAgg.map((d) => (
                <tr key={d.date} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs">{d.date}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatCurrency(d.revenue, currency)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatCurrency(d.adSpend, currency)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right tabular-nums font-bold ${
                      d.netProfit > 0 ? "text-emerald-600" : d.netProfit < 0 ? "text-red-600" : ""
                    }`}
                  >
                    {formatCurrency(d.netProfit, currency)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{d.roas.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                        d.netProfit > 0
                          ? "bg-emerald-600 text-white"
                          : d.netProfit < 0
                            ? "bg-red-600 text-white"
                            : "bg-muted"
                      }`}
                    >
                      {d.netProfit > 0 ? "Rentable" : d.netProfit < 0 ? "Perte" : "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {dailyAgg.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    Pas de saisies sur cette période
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KpiBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "good" | "bad" | "neutral";
}) {
  const cls =
    accent === "good"
      ? "bg-emerald-600 text-white"
      : accent === "bad"
        ? "bg-red-600 text-white"
        : "bg-card";
  return (
    <div className={`brutal-border-thin p-3 ${cls}`}>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{label}</div>
      <div className="text-xl font-black mt-1 tabular-nums">{value}</div>
    </div>
  );
}
