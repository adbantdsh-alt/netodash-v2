// Helpers analytics avancés : ranking produits, waterfall, break-even,
// deltas période, insights auto. Tout est pur (pas d'I/O).

import type { DailyEntry, Product, KPIs, DailyKPI, DropshippingFxOptions } from "./calc";
import {
  computeDailySeries,
  computeKPIs,
  dateRangeForPreset,
  type PresetKey,
} from "./calc";
import { convertDropshippingCurrency } from "./dropshipping-fx";

// ──────────────────────────────────────────────────────────────────
// 1) Ranking produits
// ──────────────────────────────────────────────────────────────────
export type ProductRanking = {
  product: Product;
  kpis: KPIs;
  marginPct: number;          // bénéfice net / CA
  unitMargin: number;         // marge unitaire (sale - cost - shipping)
  aov: number;                // panier moyen
  costPerOrder: number;       // (pub + taxe) / commandes
  refundRate: number;         // remboursées / commandes
  profitPerAdEuro: number;    // bénéfice / dépense pub
  breakEvenRoas: number;
  score: number;              // 0-100
  verdict: "winner" | "watch" | "loser" | "no-data";
};

export function rankProducts(
  products: Product[],
  entries: DailyEntry[],
  currency: string,
  fx?: DropshippingFxOptions,
  metaTaxPct: number = 0,
): ProductRanking[] {
  return products
    .map((p) => {
      const pEntries = entries.filter((e) => e.product_id === p.id);
      const kpis = computeKPIs(pEntries, products, currency, fx, metaTaxPct);

      const sale = convertDropshippingCurrency(Number(p.sale_price ?? 0), p.currency ?? currency, currency, fx);
      const cost = convertDropshippingCurrency(Number(p.cost_price ?? 0), p.currency ?? currency, currency, fx);
      const ship = convertDropshippingCurrency(Number(p.shipping_cost ?? 0), p.currency ?? currency, currency, fx);
      const landedCost = cost + ship;
      const unitMargin = sale - landedCost;

      const marginPct = kpis.revenue > 0 ? kpis.netProfit / kpis.revenue : 0;
      const aov = kpis.shopifyOrders > 0 ? kpis.revenue / kpis.shopifyOrders : 0;
      const costPerOrder = kpis.shopifyOrders > 0 ? (kpis.adSpend + kpis.metaTax) / kpis.shopifyOrders : 0;
      const refundRate = kpis.shopifyOrders > 0 ? kpis.refundedOrders / kpis.shopifyOrders : 0;
      const totalAd = kpis.adSpend + kpis.metaTax;
      const profitPerAdEuro = totalAd > 0 ? kpis.netProfit / totalAd : 0;

      // Break-even ROAS = CA nécessaire pour couvrir tous les coûts variables / CA
      // Approximation : prix vente / marge brute par unité
      const grossMarginPct = sale > 0 ? (sale - landedCost) / sale : 0;
      const breakEvenRoas = grossMarginPct > 0 ? 1 / grossMarginPct : 0;

      // Score 0-100 (heuristique pondérée)
      let score = 50;
      if (kpis.shopifyOrders === 0 && totalAd === 0) {
        return { product: p, kpis, marginPct, unitMargin, aov, costPerOrder, refundRate, profitPerAdEuro, breakEvenRoas, score: 0, verdict: "no-data" as const };
      }
      score += Math.min(30, marginPct * 100);              // marge nette : +30 max
      score += Math.min(20, profitPerAdEuro * 10);          // bénéfice/€ pub : +20 max
      score -= Math.min(20, refundRate * 100);              // pénalité remboursements
      if (kpis.roas > breakEvenRoas && breakEvenRoas > 0) score += 10;
      if (kpis.netProfit < 0) score -= 30;
      score = Math.max(0, Math.min(100, Math.round(score)));

      const verdict: ProductRanking["verdict"] =
        score >= 65 ? "winner" : score >= 40 ? "watch" : "loser";

      return { product: p, kpis, marginPct, unitMargin, aov, costPerOrder, refundRate, profitPerAdEuro, breakEvenRoas, score, verdict };
    })
    .sort((a, b) => b.kpis.netProfit - a.kpis.netProfit);
}

// ──────────────────────────────────────────────────────────────────
// 2) Décomposition (waterfall)
// ──────────────────────────────────────────────────────────────────
export type BreakdownStep = {
  label: string;
  value: number;       // négatif = coût, positif = revenu
  cumulative: number;  // valeur cumulée après cette étape
  pctOfRevenue: number;
  kind: "revenue" | "cost" | "result";
};

export function computeBreakdown(kpis: KPIs): BreakdownStep[] {
  const rev = kpis.revenue;
  const pct = (v: number) => (rev > 0 ? v / rev : 0);
  const steps: Omit<BreakdownStep, "cumulative">[] = [
    { label: "Chiffre d'affaires", value: rev, kind: "revenue", pctOfRevenue: 1 },
    { label: "Coûts produits livrés", value: -kpis.cogs, kind: "cost", pctOfRevenue: -pct(kpis.cogs) },
    { label: "Dépense publicitaire", value: -kpis.adSpend, kind: "cost", pctOfRevenue: -pct(kpis.adSpend) },
    { label: "Taxe Meta", value: -kpis.metaTax, kind: "cost", pctOfRevenue: -pct(kpis.metaTax) },
    { label: "Frais Shopify/Stripe", value: -kpis.shopifyFees, kind: "cost", pctOfRevenue: -pct(kpis.shopifyFees) },
    { label: "Frais Wave (COD)", value: -kpis.waveFees, kind: "cost", pctOfRevenue: -pct(kpis.waveFees) },
    { label: "Remboursés", value: -kpis.refundedAmount, kind: "cost", pctOfRevenue: -pct(kpis.refundedAmount) },
  ];
  let cum = 0;
  const result: BreakdownStep[] = steps.map((s) => {
    cum += s.value;
    return { ...s, cumulative: cum };
  });
  result.push({
    label: "Bénéfice net",
    value: kpis.netProfit,
    cumulative: kpis.netProfit,
    pctOfRevenue: pct(kpis.netProfit),
    kind: "result",
  });
  return result;
}

// ──────────────────────────────────────────────────────────────────
// 3) Période précédente (pour delta)
// ──────────────────────────────────────────────────────────────────
export function previousRange(range: { from: string; to: string }): { from: string; to: string } {
  const from = new Date(range.from + "T00:00:00");
  const to = new Date(range.to + "T00:00:00");
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1);
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - (days - 1));
  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  return { from: toISO(prevFrom), to: toISO(prevTo) };
}

export function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) {
    if (current === 0) return 0;
    return null; // pas comparable
  }
  return (current - previous) / Math.abs(previous);
}

// ──────────────────────────────────────────────────────────────────
// 4) Streaks (jours rentables consécutifs)
// ──────────────────────────────────────────────────────────────────
export function longestProfitableStreak(daily: DailyKPI[]): number {
  let best = 0;
  let cur = 0;
  for (const d of daily) {
    if (d.netProfit > 0) {
      cur++;
      if (cur > best) best = cur;
    } else cur = 0;
  }
  return best;
}

export function currentStreak(daily: DailyKPI[]): { kind: "profit" | "loss" | "none"; days: number } {
  if (daily.length === 0) return { kind: "none", days: 0 };
  const sorted = [...daily].sort((a, b) => b.date.localeCompare(a.date));
  const last = sorted[0];
  if (last.netProfit === 0) return { kind: "none", days: 0 };
  const kind = last.netProfit > 0 ? "profit" : "loss";
  let n = 0;
  for (const d of sorted) {
    const sign = d.netProfit > 0 ? "profit" : d.netProfit < 0 ? "loss" : "none";
    if (sign === kind) n++;
    else break;
  }
  return { kind, days: n };
}

// ──────────────────────────────────────────────────────────────────
// 5) Insights auto
// ──────────────────────────────────────────────────────────────────
export type Insight = {
  id: string;
  severity: "good" | "warning" | "danger" | "info";
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
};

export function generateInsights(args: {
  rankings: ProductRanking[];
  entries: DailyEntry[];
  products: Product[];
  globalKpis: KPIs;
  prevKpis: KPIs;
  dailyGlobal: DailyKPI[];
  currency: string;
}): Insight[] {
  const out: Insight[] = [];
  const { rankings, globalKpis, prevKpis, dailyGlobal, entries } = args;

  // Δ ROAS global
  const dRoas = deltaPct(globalKpis.roas, prevKpis.roas);
  if (dRoas != null && dRoas <= -0.2 && globalKpis.adSpend > 0) {
    out.push({
      id: "roas-drop",
      severity: "warning",
      title: `ROAS en baisse de ${Math.round(Math.abs(dRoas) * 100)}%`,
      body: `Ton ROAS global a chuté vs la période précédente (${prevKpis.roas.toFixed(2)} → ${globalKpis.roas.toFixed(2)}). Vérifie les créas qui fatiguent.`,
    });
  }
  if (dRoas != null && dRoas >= 0.2 && globalKpis.adSpend > 0) {
    out.push({
      id: "roas-up",
      severity: "good",
      title: `ROAS en hausse de ${Math.round(dRoas * 100)}%`,
      body: `Bonne dynamique vs période précédente. Si la tendance tient 2-3 jours, c'est un signal scale.`,
    });
  }

  // Winners / losers
  const winners = rankings.filter((r) => r.verdict === "winner");
  const losers = rankings.filter((r) => r.verdict === "loser" && r.kpis.adSpend > 0);
  for (const w of winners.slice(0, 2)) {
    out.push({
      id: `winner-${w.product.id}`,
      severity: "good",
      title: `${w.product.name} : candidat scale`,
      body: `Score ${w.score}/100, marge ${(w.marginPct * 100).toFixed(0)}%, ${w.profitPerAdEuro.toFixed(2)}€ de bénéfice par € de pub. Tu peux augmenter le budget progressivement (+20%/jour).`,
      actionLabel: "Voir le produit",
      actionTo: `/products`,
    });
  }
  for (const l of losers.slice(0, 2)) {
    out.push({
      id: `loser-${l.product.id}`,
      severity: "danger",
      title: `${l.product.name} : à couper`,
      body: `Score ${l.score}/100, ROAS ${l.kpis.roas.toFixed(2)} (break-even ${l.breakEvenRoas.toFixed(2)}). Tu perds de l'argent sur chaque commande.`,
      actionLabel: "Voir le produit",
      actionTo: `/products`,
    });
  }

  // Taux de remboursement élevé
  for (const r of rankings) {
    if (r.refundRate > 0.08 && r.kpis.shopifyOrders >= 5) {
      out.push({
        id: `refund-${r.product.id}`,
        severity: "warning",
        title: `${r.product.name} : ${(r.refundRate * 100).toFixed(0)}% de remboursements`,
        body: `Au-dessus de 8%, vérifie la qualité produit, le délai de livraison ou la description.`,
      });
    }
  }

  // Allocation budgétaire vs profit
  if (rankings.length >= 2 && globalKpis.adSpend > 0 && globalKpis.netProfit > 0) {
    for (const r of rankings) {
      const adShare = (r.kpis.adSpend + r.kpis.metaTax) / (globalKpis.adSpend + globalKpis.metaTax);
      const profitShare = r.kpis.netProfit > 0 ? r.kpis.netProfit / globalKpis.netProfit : 0;
      if (adShare > 0.3 && profitShare < adShare - 0.2) {
        out.push({
          id: `misalloc-${r.product.id}`,
          severity: "warning",
          title: `${r.product.name} : pub mal allouée`,
          body: `Ce produit consomme ${(adShare * 100).toFixed(0)}% de ton budget pub mais ne génère que ${(profitShare * 100).toFixed(0)}% du bénéfice. Rééquilibre.`,
        });
      }
    }
  }

  // Streak
  const streak = currentStreak(dailyGlobal);
  if (streak.kind === "profit" && streak.days >= 5) {
    out.push({
      id: "streak-profit",
      severity: "good",
      title: `${streak.days} jours rentables d'affilée 🚀`,
      body: `Momentum solide. C'est le bon moment pour tester une augmentation de budget.`,
    });
  }
  if (streak.kind === "loss" && streak.days >= 3) {
    out.push({
      id: "streak-loss",
      severity: "danger",
      title: `${streak.days} jours de perte d'affilée`,
      body: `Pause et audit nécessaire : créas, ciblage, prix, fournisseur. Ne laisse pas filer.`,
    });
  }

  // Absence de saisie
  if (entries.length === 0) {
    out.push({
      id: "no-data",
      severity: "info",
      title: "Pas de saisies sur la période",
      body: "Ajoute tes données dans Saisies pour générer des insights pertinents.",
      actionLabel: "Saisir maintenant",
      actionTo: "/entries",
    });
  } else {
    // dernière saisie il y a > 2 jours ?
    const lastDate = entries
      .map((e) => e.entry_date)
      .sort()
      .pop();
    if (lastDate) {
      const last = new Date(lastDate + "T00:00:00");
      const days = Math.floor((Date.now() - last.getTime()) / 86_400_000);
      if (days >= 3) {
        out.push({
          id: "stale-data",
          severity: "warning",
          title: `Aucune saisie depuis ${days} jours`,
          body: `Tes analyses perdent en pertinence sans données fraîches.`,
          actionLabel: "Saisir aujourd'hui",
          actionTo: "/entries",
        });
      }
    }
  }

  return out;
}

// ──────────────────────────────────────────────────────────────────
// 6) Export CSV
// ──────────────────────────────────────────────────────────────────
export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c ?? "");
          return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Re-export utilitaires pour confort
export { computeDailySeries, computeKPIs, dateRangeForPreset };
export type { PresetKey };
