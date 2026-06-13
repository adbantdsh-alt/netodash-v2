import { useMemo } from "react";
import { useActiveMode } from "@/lib/use-active-mode";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { computeDailySeries, computeKPIs, dateRangeForPreset } from "@/lib/calc";
import { generateInsights, previousRange, rankProducts, type Insight } from "@/lib/analytics-insights";
import type { Preset, CustomRange } from "@/components/PeriodPicker";

type Props = { preset: Preset; customRange: CustomRange };

export function InsightsTab({ preset, customRange }: Props) {
  const { user } = useAuth();
  const range = useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const prev = useMemo(() => previousRange(range), [range]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const curQ = useEntries(user?.id, range);
  const prevQ = useEntries(user?.id, prev);

  const { currency, mode: activeMode } = useActiveMode();
  const usdRate = Number((profileQ.data as any)?.usd_to_xof_rate ?? 0);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = curQ.data ?? [];
  const prevEntries = prevQ.data ?? [];

  const insights = useMemo(() => {
    const globalKpis = computeKPIs(entries, products, currency, usdRate, metaTaxPct);
    const prevKpis = computeKPIs(prevEntries, products, currency, usdRate, metaTaxPct);
    const rankings = rankProducts(products, entries, currency, usdRate, metaTaxPct);
    const dailyGlobal = computeDailySeries(entries, products, null, currency, usdRate, metaTaxPct);
    return generateInsights({ rankings, entries, products, globalKpis, prevKpis, dailyGlobal, currency });
  }, [entries, prevEntries, products, currency, usdRate, metaTaxPct]);

  const grouped = {
    danger: insights.filter((i) => i.severity === "danger"),
    warning: insights.filter((i) => i.severity === "warning"),
    good: insights.filter((i) => i.severity === "good"),
    info: insights.filter((i) => i.severity === "info"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Alertes & Insights auto</h2>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1">
          Ce que NETODASH a remarqué sur tes données. Trié par urgence.
        </p>
      </div>

      {insights.length === 0 && (
        <div className="brutal-border p-8 bg-card text-center">
          <div className="text-4xl mb-2">✓</div>
          <p className="font-bold">Tout va bien</p>
          <p className="text-sm text-muted-foreground mt-1">Aucune alerte sur cette période. Continue comme ça.</p>
        </div>
      )}

      <Section title="🛑 À traiter en priorité" items={grouped.danger} />
      <Section title="⚠ À surveiller" items={grouped.warning} />
      <Section title="✅ Bonnes nouvelles" items={grouped.good} />
      <Section title="ℹ Infos" items={grouped.info} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: Insight[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{title}</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((i) => <InsightCard key={i.id} insight={i} />)}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const tones = {
    danger: "border-l-4 border-l-red-600",
    warning: "border-l-4 border-l-amber-500",
    good: "border-l-4 border-l-emerald-600",
    info: "border-l-4 border-l-blue-500",
  } as const;
  return (
    <div className={`brutal-border-thin bg-card p-4 ${tones[insight.severity]}`}>
      <div className="font-bold mb-1">{insight.title}</div>
      <p className="text-sm text-muted-foreground mb-3">{insight.body}</p>
      {insight.actionLabel && insight.actionTo && (
        <Link
          to={insight.actionTo as any}
          className="inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold brutal-border-thin hover:bg-foreground hover:text-background"
        >
          {insight.actionLabel} →
        </Link>
      )}
    </div>
  );
}
