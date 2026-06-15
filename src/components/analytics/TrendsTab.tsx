import { useMemo } from "react";
import { useActiveMode } from "@/lib/use-active-mode";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { useDropshippingFx } from "@/lib/use-dropshipping-fx";
import { computeDailySeries, dateRangeForPreset, fillDailySeries, formatCurrency } from "@/lib/calc";
import { previousRange, longestProfitableStreak, currentStreak } from "@/lib/analytics-insights";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend,
} from "recharts";
import type { Preset, CustomRange } from "@/components/PeriodPicker";

type Props = { preset: Preset; customRange: CustomRange };

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function TrendsTab({ preset, customRange }: Props) {
  const { user } = useAuth();
  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const prev = useMemo(() => previousRange(range), [range]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const curQ = useEntries(user?.id, range);
  const prevQ = useEntries(user?.id, prev);

  const { currency, mode: activeMode } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];

  const curSeries = useMemo(
    () => fillDailySeries(
      computeDailySeries(curQ.data ?? [], products, null, currency, dropshippingFx, metaTaxPct),
      range.from, range.to,
      (date) => ({ date, revenue: 0, adSpend: 0, metaTax: 0, netProfit: 0, roas: 0, shopifyOrders: 0, notes: null }),
    ),
    [curQ.data, products, currency, dropshippingFx, metaTaxPct, range.from, range.to],
  );
  const prevSeries = useMemo(
    () => fillDailySeries(
      computeDailySeries(prevQ.data ?? [], products, null, currency, dropshippingFx, metaTaxPct),
      prev.from, prev.to,
      (date) => ({ date, revenue: 0, adSpend: 0, metaTax: 0, netProfit: 0, roas: 0, shopifyOrders: 0, notes: null }),
    ),
    [prevQ.data, products, currency, dropshippingFx, metaTaxPct, prev.from, prev.to],
  );

  // Overlay : on aligne par index (jour 1, jour 2…)
  const overlayData = curSeries.map((d, i) => ({
    label: `J${i + 1}`,
    actuel: Math.round(d.netProfit),
    precedent: Math.round(prevSeries[i]?.netProfit ?? 0),
    date: d.date,
  }));

  // Best/worst days
  const sortedByProfit = [...curSeries].filter((d) => d.revenue > 0 || d.adSpend > 0).sort((a, b) => b.netProfit - a.netProfit);
  const bestDay = sortedByProfit[0];
  const worstDay = sortedByProfit[sortedByProfit.length - 1];

  // Heatmap jour de semaine × semaine
  const heatmap = useMemo(() => buildWeekdayHeatmap(curSeries), [curSeries]);
  const maxAbsHeat = heatmap.weeks.length
    ? Math.max(1, ...heatmap.weeks.flatMap((w) => w.cells.map((c) => Math.abs(c?.profit ?? 0))))
    : 1;

  // Streaks
  const bestStreak = longestProfitableStreak(curSeries);
  const cur = currentStreak(curSeries);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Tendances & Cohortes</h2>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">
          Compare période actuelle vs précédente. Repère tes meilleurs jours.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Box label="Meilleur jour" value={bestDay ? formatCurrency(bestDay.netProfit, currency) : "—"} sub={bestDay?.date ?? ""} tone="good" />
        <Box label="Pire jour" value={worstDay && worstDay.netProfit < 0 ? formatCurrency(worstDay.netProfit, currency) : "—"} sub={worstDay && worstDay.netProfit < 0 ? worstDay.date : ""} tone={worstDay && worstDay.netProfit < 0 ? "bad" : undefined} />
        <Box label="Meilleur streak" value={`${bestStreak} j`} sub="jours rentables d'affilée" />
        <Box label="Streak actuel" value={`${cur.days} j`} sub={cur.kind === "profit" ? "rentables ✓" : cur.kind === "loss" ? "en perte ⚠" : "neutre"} tone={cur.kind === "profit" ? "good" : cur.kind === "loss" ? "bad" : undefined} />
      </div>

      {/* Overlay actuel vs précédent */}
      <div className="brutal-border-thin p-4 bg-card">
        <div className="text-xs uppercase tracking-widest font-bold mb-3">
          Bénéfice net : période actuelle vs précédente
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overlayData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => formatCurrency(Number(v), currency)} contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="actuel" name="Période actuelle" stroke="hsl(150 70% 40%)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="precedent" name="Période précédente" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="brutal-border-thin p-4 bg-card overflow-x-auto">
        <div className="text-xs uppercase tracking-widest font-bold mb-3">
          Heatmap — Bénéfice par jour de la semaine
        </div>
        {heatmap.weeks.length === 0 ? (
          <div className="text-sm text-muted-foreground">Pas assez de données</div>
        ) : (
          <table className="text-xs">
            <thead>
              <tr>
                <th className="text-left pr-2 font-mono text-muted-foreground">Semaine</th>
                {WEEKDAYS.map((d) => <th key={d} className="px-1 font-mono text-muted-foreground">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {heatmap.weeks.map((w) => (
                <tr key={w.label}>
                  <td className="pr-2 font-mono text-muted-foreground">{w.label}</td>
                  {w.cells.map((c, i) => {
                    if (!c) return <td key={i} className="p-0.5"><div className="w-10 h-8 bg-muted/40" /></td>;
                    const intensity = Math.min(1, Math.abs(c.profit) / maxAbsHeat);
                    const bg = c.profit >= 0
                      ? `rgba(34, 197, 94, ${0.15 + intensity * 0.75})`
                      : `rgba(239, 68, 68, ${0.15 + intensity * 0.75})`;
                    return (
                      <td key={i} className="p-0.5">
                        <div
                          className="w-10 h-8 flex items-center justify-center text-[9px] font-bold tabular-nums"
                          style={{ backgroundColor: bg, color: intensity > 0.5 ? "white" : "inherit" }}
                          title={`${c.date} — ${formatCurrency(c.profit, currency)}`}
                        >
                          {Math.round(c.profit / 1000)}k
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="text-[10px] font-mono text-muted-foreground mt-3">
          Plus c'est vert/foncé, plus le jour est rentable. Identifie les jours où concentrer ton budget.
        </p>
      </div>
    </div>
  );
}

function buildWeekdayHeatmap(series: { date: string; netProfit: number }[]) {
  if (series.length === 0) return { weeks: [] as { label: string; cells: ({ date: string; profit: number } | null)[] }[] };
  const weeks: { label: string; cells: ({ date: string; profit: number } | null)[] }[] = [];
  let current: typeof weeks[number] | null = null;
  for (const d of series) {
    const dt = new Date(d.date + "T00:00:00");
    const wd = (dt.getDay() + 6) % 7; // 0 = lundi
    if (!current || wd === 0) {
      current = { label: shortISOWeek(dt), cells: Array(7).fill(null) };
      weeks.push(current);
    }
    current.cells[wd] = { date: d.date, profit: d.netProfit };
  }
  return { weeks };
}

function shortISOWeek(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${m}`;
}

function Box({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "good" | "bad" }) {
  const cls = tone === "good" ? "bg-emerald-600 text-white" : tone === "bad" ? "bg-red-600 text-white" : "bg-card";
  return (
    <div className={`brutal-border-thin p-3 ${cls}`}>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{label}</div>
      <div className="text-xl font-black mt-1 tabular-nums">{value}</div>
      {sub && <div className="text-[10px] mt-1 opacity-70">{sub}</div>}
    </div>
  );
}
