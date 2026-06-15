// Core profitability calculations — full dropshipping.

import {
  convertDropshippingCurrency,
  normalizeDropshippingCurrency,
  type DropshippingCurrency,
  type DropshippingFxOptions,
  DROPSHIPPING_CURRENCIES,
} from "./dropshipping-fx";

export type { DropshippingCurrency, DropshippingFxOptions };
export { DROPSHIPPING_CURRENCIES, normalizeDropshippingCurrency };

export type Product = {
  id: string;
  name: string;
  sale_price: number;
  cost_price: number;
  testing_days?: number | null;
  testing_started_at?: string | null;
  /** Devise du produit (EUR / USD / GBP). */
  currency?: string | null;
  /** Coût d'expédition par commande. */
  shipping_cost?: number | null;
};

export type UpsellLine = {
  product_id: string;
  qty: number;
  unit_price: number;
  currency?: string | null;
  /** Cadeau offert avec la commande (prix forcé à 0). */
  offered?: boolean | null;
};

export type DailyEntry = {
  id: string;
  product_id: string;
  entry_date: string;
  /** Commandes reçues (= payées en dropshipping). */
  shopify_orders: number;
  ad_budget: number;
  ad_budget_currency?: string | null;
  /** CA total (montant des commandes reçues). */
  total_revenue?: number | null;
  /** Si true, on applique la taxe Meta Ads (case informative seulement pour l'instant). */
  include_meta_tax?: boolean | null;
  /** Si true, on applique les frais Shopify/Stripe Payments (2.9%) sur le CA. */
  include_shopify_fees?: boolean | null;
  /** Si true, on applique les frais Wave (1%) sur le cash encaissé (COD). */
  include_wave_fees?: boolean | null;
  /** Devise du CA encaissé (EUR / USD / GBP), distincte de la devise pub. */
  total_revenue_currency?: string | null;
  /** Nb de commandes remboursées. */
  refunded_orders?: number | null;
  /** Montant total remboursé. */
  refunded_amount?: number | null;
  /** Ventes additionnelles (upsells) — Plan Pro. */
  upsells?: UpsellLine[] | null;
};

/** Totaux d'upsells convertis en devise cible (revenue + coût livré). */
export function upsellTotalsForEntry(
  entry: DailyEntry,
  productMap: Map<string, Product>,
  targetCurrency: string,
  fx?: DropshippingFxOptions,
): { revenue: number; cogs: number; shipping: number; units: number } {
  const list = Array.isArray(entry.upsells) ? entry.upsells : [];
  let revenue = 0;
  let cogs = 0;
  let shipping = 0;
  let units = 0;
  const fxOpts: DropshippingFxOptions = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR"),
  };
  for (const u of list) {
    if (!u || !u.product_id) continue;
    const p = productMap.get(u.product_id);
    if (!p) continue;
    const qty = Number(u.qty) || 0;
    if (qty <= 0) continue;
    const price = Number(u.unit_price) || 0;
    const cur = u.currency ?? p.currency ?? targetCurrency;
    const productCurrency = p.currency ?? targetCurrency;
    revenue += convertDropshippingCurrency(qty * price, cur, targetCurrency, fxOpts);
    cogs += convertDropshippingCurrency(
      qty * unitLandedCost(p),
      productCurrency,
      targetCurrency,
      fxOpts,
    );
    shipping += convertDropshippingCurrency(
      qty * unitShippingCost(p),
      productCurrency,
      targetCurrency,
      fxOpts,
    );
    units += qty;
  }
  return { revenue, cogs, shipping, units };
}

/** @deprecated Mode COD uniquement — ne pas utiliser en dropshipping. */
export type AppCurrency = "EUR" | "USD" | "GBP" | "XOF";
const SUPPORTED_CURRENCIES: AppCurrency[] = ["EUR", "USD", "GBP", "XOF"];
const DEFAULT_USD_VALUE: Record<AppCurrency, number> = {
  EUR: 1.08,
  USD: 1,
  GBP: 1.27,
  XOF: 1 / 600,
};

export function normalizeCurrency(currency?: string | null): AppCurrency {
  const cur = String(currency ?? "EUR").toUpperCase();
  return SUPPORTED_CURRENCIES.includes(cur as AppCurrency) ? (cur as AppCurrency) : "EUR";
}

/** Conversion XOF / COD uniquement (DashboardCod). */
export function convertCurrency(
  value: number,
  fromCurrency?: string | null,
  toCurrency: string = "EUR",
  usdToXofRate?: number,
): number {
  const raw = Number(value) || 0;
  const from = normalizeCurrency(fromCurrency);
  const to = normalizeCurrency(toCurrency);
  if (from === to) return raw;

  const manualXofPerUsd = Number(usdToXofRate);
  const haveManual = Number.isFinite(manualXofPerUsd) && manualXofPerUsd > 0;
  const usdValues: Record<AppCurrency, number> = { ...DEFAULT_USD_VALUE };
  if (haveManual) usdValues.XOF = 1 / manualXofPerUsd;

  const usdValue = raw * usdValues[from];
  return usdValue / usdValues[to];
}

export function adSpendInCurrency(
  entry: DailyEntry,
  targetCurrency: string = "EUR",
  fx?: DropshippingFxOptions,
): number {
  const fxOpts: DropshippingFxOptions = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR"),
  };
  return convertDropshippingCurrency(
    Number(entry.ad_budget),
    entry.ad_budget_currency ?? targetCurrency,
    targetCurrency,
    fxOpts,
  );
}

function unitProductCost(product: Product): number {
  return Number(product.cost_price ?? 0) || 0;
}

function unitShippingCost(product: Product): number {
  return Number(product.shipping_cost ?? 0) || 0;
}

function unitLandedCost(product: Product): number {
  return unitProductCost(product) + unitShippingCost(product);
}

export const SHOPIFY_FEES_PCT = 2.9;
/** Frais fixe Stripe/Shopify Payments par transaction (commande). */
export const SHOPIFY_FIXED_FEE_USD = 0.30;
export const WAVE_FEES_PCT = 1;

export type KPIs = {
  revenue: number;
  /** Coût produit livré total = achat + expédition, y compris cadeaux/upsells offerts. */
  cogs: number;
  /** Sous-total informatif de l'expédition déjà incluse dans cogs. */
  shippingCost: number;
  adSpend: number;
  /** Taxe Meta Ads (% défini sur le profil) sur le budget pub. */
  metaTax: number;
  /** Frais Shopify/Stripe Payments (2.9%) sur le CA. */
  shopifyFees: number;
  /** Frais Wave (1%) sur le cash encaissé (COD). */
  waveFees: number;
  netProfit: number;
  roas: number;
  shopifyOrders: number;
  refundedOrders: number;
  refundedAmount: number;
  /** CA généré par les ventes additionnelles (upsells). */
  upsellRevenue: number;
  /** Coût livré des upsells (achat + expédition). */
  upsellCogs: number;
  /** Marge dégagée par les upsells (= upsellRevenue − coût livré upsell). */
  upsellMargin: number;
  /** Nombre d'unités upsell vendues. */
  upsellUnits: number;
};

export function computeKPIs(
  entries: DailyEntry[],
  products: Product[],
  targetCurrency: string = "EUR",
  fx?: DropshippingFxOptions,
  metaTaxPct = 0,
): KPIs {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const fxOpts: DropshippingFxOptions = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR"),
  };
  let revenue = 0;
  let cogs = 0;
  let shippingCost = 0;
  let adSpend = 0;
  let metaTax = 0;
  let shopifyFees = 0;
  let waveFees = 0;
  let shopify = 0;
  let refundedOrders = 0;
  let refundedAmount = 0;
  let upsellRevenue = 0;
  let upsellCogs = 0;
  let upsellUnits = 0;

  for (const e of entries) {
    const p = productMap.get(e.product_id);
    if (!p) continue;
    const orders = Number(e.shopify_orders) || 0;
    const revenueCurrency = e.total_revenue != null
      ? e.total_revenue_currency ?? p.currency ?? targetCurrency
      : p.currency ?? targetCurrency;
    const revRaw = e.total_revenue != null
      ? Number(e.total_revenue)
      : orders * Number(p.sale_price);
    const rev = convertDropshippingCurrency(revRaw, revenueCurrency, targetCurrency, fxOpts);
    revenue += rev;
    cogs += convertDropshippingCurrency(orders * unitLandedCost(p), p.currency ?? targetCurrency, targetCurrency, fxOpts);
    shippingCost += convertDropshippingCurrency(orders * unitShippingCost(p), p.currency ?? targetCurrency, targetCurrency, fxOpts);
    const ad = adSpendInCurrency(e, targetCurrency, fxOpts);
    adSpend += ad;
    if (e.include_meta_tax !== false) {
      metaTax += ad * (Number(metaTaxPct) / 100);
    }
    if (e.include_shopify_fees) {
      shopifyFees += rev * (SHOPIFY_FEES_PCT / 100);
      shopifyFees += convertDropshippingCurrency(orders * SHOPIFY_FIXED_FEE_USD, "USD", targetCurrency, fxOpts);
    }
    if (e.include_wave_fees) {
      waveFees += rev * (WAVE_FEES_PCT / 100);
    }
    const ups = upsellTotalsForEntry(e, productMap, targetCurrency, fxOpts);
    revenue += ups.revenue;
    cogs += ups.cogs;
    shippingCost += ups.shipping;
    upsellRevenue += ups.revenue;
    upsellCogs += ups.cogs;
    upsellUnits += ups.units;
    shopify += orders;
    refundedOrders += Number(e.refunded_orders ?? 0);
    refundedAmount += convertDropshippingCurrency(Number(e.refunded_amount ?? 0), revenueCurrency, targetCurrency, fxOpts);
  }

  const netProfit = revenue - adSpend - cogs - metaTax - shopifyFees - waveFees;
  const totalAdCost = adSpend + metaTax;
  const roas = totalAdCost > 0 ? revenue / totalAdCost : 0;

  return {
    revenue,
    cogs,
    shippingCost,
    adSpend,
    metaTax,
    shopifyFees,
    waveFees,
    netProfit,
    roas,
    shopifyOrders: shopify,
    refundedOrders,
    refundedAmount,
    upsellRevenue,
    upsellCogs,
    upsellMargin: upsellRevenue - upsellCogs,
    upsellUnits,
  };
}

export type RoasVerdict = {
  level: "scale" | "watch" | "cut" | "none";
  label: string;
  emoji: string;
  className: string;
};

export function roasVerdict(roas: number, hasSpend: boolean): RoasVerdict {
  if (!hasSpend) {
    return {
      level: "none",
      label: "PAS DE DONNÉES",
      emoji: "—",
      className: "bg-background text-foreground border-2 border-foreground",
    };
  }
  if (roas > 3) {
    return {
      level: "scale",
      label: "SCALABLE",
      emoji: "🚀",
      className: "bg-foreground text-background border-2 border-foreground",
    };
  }
  if (roas >= 1.8) {
    return {
      level: "watch",
      label: "À SURVEILLER",
      emoji: "⚖️",
      className: "bg-background text-foreground border-2 border-foreground",
    };
  }
  return {
    level: "cut",
    label: "COUPER / DANGER",
    emoji: "🛑",
    className: "bg-accent text-accent-foreground border-2 border-accent",
  };
}

export function formatCurrency(value: number, currency = "EUR"): string {
  const code = normalizeCurrency(currency);
  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    XOF: "FCFA",
  };
  const sym = symbols[code] || code;
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const decimals = code === "XOF" || Math.abs(safeValue - Math.round(safeValue)) < 0.005 ? 0 : 2;
  // Pour FCFA on met l'unité après avec un espace insécable (lecture locale).
  return `${safeValue.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${sym}`;
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type PresetKey = "today" | "yesterday" | "7d" | "30d" | "month" | "all" | "custom";

export function dateRangeForPreset(
  preset: PresetKey,
  custom?: { from: string; to: string } | null,
): { from: string; to: string } {
  const now = new Date();
  const to = toLocalISODate(now);
  let from = to;
  if (preset === "custom" && custom?.from) {
    return { from: custom.from, to: custom.to || custom.from };
  }
  if (preset === "today") {
    from = to;
  } else if (preset === "yesterday") {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    const y = toLocalISODate(d);
    return { from: y, to: y };
  } else if (preset === "7d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    from = toLocalISODate(d);
  } else if (preset === "30d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    from = toLocalISODate(d);
  } else if (preset === "month") {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    from = toLocalISODate(d);
  } else {
    from = "1970-01-01";
  }
  return { from, to };
}

export function fillDailySeries<T extends { date: string }>(
  series: T[],
  from: string,
  to: string,
  zeroFactory: (date: string) => T,
): T[] {
  const map = new Map(series.map((s) => [s.date, s]));
  const result: T[] = [];
  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  let count = 0;
  for (let d = new Date(start); d <= end && count < 366; d.setDate(d.getDate() + 1), count++) {
    const key = toLocalISODate(d);
    result.push(map.get(key) ?? zeroFactory(key));
  }
  return result;
}

export type DailyKPI = {
  date: string;
  revenue: number;
  adSpend: number;
  metaTax: number;
  netProfit: number;
  roas: number;
  shopifyOrders: number;
  notes: string | null;
};

export function computeDailySeries(
  entries: DailyEntry[],
  products: Product[],
  productId?: string | null,
  targetCurrency: string = "EUR",
  fx?: DropshippingFxOptions,
  metaTaxPct = 0,
): DailyKPI[] {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const fxOpts: DropshippingFxOptions = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR"),
  };
  const filtered = productId ? entries.filter((e) => e.product_id === productId) : entries;
  const byDay = new Map<string, DailyKPI>();

  for (const e of filtered) {
    const p = productMap.get(e.product_id);
    if (!p) continue;
    const orders = Number(e.shopify_orders) || 0;
    const revenueCurrency = e.total_revenue != null
      ? e.total_revenue_currency ?? p.currency ?? targetCurrency
      : p.currency ?? targetCurrency;
    const revRaw = e.total_revenue != null
      ? Number(e.total_revenue)
      : orders * Number(p.sale_price);
    const rev = convertDropshippingCurrency(revRaw, revenueCurrency, targetCurrency, fxOpts);
    const cogs = convertDropshippingCurrency(orders * unitLandedCost(p), p.currency ?? targetCurrency, targetCurrency, fxOpts);
    const ad = adSpendInCurrency(e, targetCurrency, fxOpts);
    const tax = e.include_meta_tax !== false ? ad * (Number(metaTaxPct) / 100) : 0;
    const shopifyFees = e.include_shopify_fees
      ? rev * (SHOPIFY_FEES_PCT / 100)
        + convertDropshippingCurrency(orders * SHOPIFY_FIXED_FEE_USD, "USD", targetCurrency, fxOpts)
      : 0;
    const waveFees = e.include_wave_fees ? rev * (WAVE_FEES_PCT / 100) : 0;
    const ups = upsellTotalsForEntry(e, productMap, targetCurrency, fxOpts);
    const revWithUps = rev + ups.revenue;
    const cogsWithUps = cogs + ups.cogs;
    const profit = revWithUps - ad - cogsWithUps - tax - shopifyFees - waveFees;

    const cur = byDay.get(e.entry_date);
    const noteRaw = (e as any).notes;
    const note = typeof noteRaw === "string" && noteRaw.trim() ? noteRaw.trim() : null;
    if (cur) {
      cur.revenue += revWithUps;
      cur.adSpend += ad;
      cur.metaTax += tax;
      cur.netProfit += profit;
      cur.shopifyOrders += orders;
      if (note) cur.notes = cur.notes ? `${cur.notes} | ${note}` : note;
    } else {
      byDay.set(e.entry_date, {
        date: e.entry_date,
        revenue: revWithUps,
        adSpend: ad,
        metaTax: tax,
        netProfit: profit,
        roas: 0,
        shopifyOrders: orders,
        notes: note,
      });
    }
  }

  for (const k of byDay.values()) {
    const totalAd = k.adSpend + k.metaTax;
    k.roas = totalAd > 0 ? k.revenue / totalAd : 0;
  }

  return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export type Trend = "up" | "down" | "flat";

export function computeTrend(values: number[], threshold = 0.1): Trend {
  if (values.length < 2) return "flat";
  const first = values[0];
  const last = values[values.length - 1];
  if (first === 0) return last > 0 ? "up" : "flat";
  const slope = (last - first) / Math.abs(first);
  if (slope > threshold) return "up";
  if (slope < -threshold) return "down";
  return "flat";
}

export function trendArrow(t: Trend): string {
  if (t === "up") return "↑";
  if (t === "down") return "↓";
  return "→";
}

export type TestingStatus = {
  dayIndex: number;
  totalDays: number;
  startedAt: string | null;
  isComplete: boolean;
  daysWithData: number;
};

export function computeTestingStatus(
  product: Pick<Product, "testing_days" | "testing_started_at">,
  entries: DailyEntry[],
): TestingStatus {
  const totalDays = product.testing_days ?? 3;
  const dates = Array.from(new Set(entries.map((e) => e.entry_date))).sort();

  if (dates.length === 0) {
    return {
      dayIndex: 0,
      totalDays,
      startedAt: product.testing_started_at ?? null,
      isComplete: false,
      daysWithData: 0,
    };
  }

  const startedAt = product.testing_started_at ?? dates[0];
  const last = dates[dates.length - 1];
  const startMs = new Date(startedAt + "T00:00:00").getTime();
  const lastMs = new Date(last + "T00:00:00").getTime();
  const dayIndex = Math.max(1, Math.floor((lastMs - startMs) / 86400000) + 1);

  return {
    dayIndex,
    totalDays,
    startedAt,
    isComplete: dayIndex >= totalDays,
    daysWithData: dates.length,
  };
}

export type TestingVerdict = {
  level: "running" | "watch" | "scale" | "optimize" | "cut" | "none";
  label: string;
  emoji: string;
  hint: string;
  className: string;
};

export function verdictForTesting(
  status: TestingStatus,
  series: DailyKPI[],
  hasSpend: boolean,
): TestingVerdict {
  if (!hasSpend || series.length === 0) {
    return {
      level: "none",
      label: "EN ATTENTE DE DATA",
      emoji: "—",
      hint: "Saisis ta première journée pour démarrer le test.",
      className: "bg-background text-foreground border-2 border-foreground",
    };
  }

  const roasTrend = computeTrend(series.map((s) => s.roas));
  const profitTrend = computeTrend(series.map((s) => s.netProfit));

  if (status.dayIndex <= 1 || series.length < 2) {
    return {
      level: "running",
      label: `LAISSE TOURNER · JOUR 1/${status.totalDays}`,
      emoji: "⏳",
      hint: "Un jour ne suffit pas pour juger. Reviens demain saisir tes nouveaux chiffres.",
      className: "bg-background text-foreground border-2 border-foreground",
    };
  }

  if (!status.isComplete) {
    if (profitTrend === "up" || roasTrend === "up") {
      return {
        level: "running",
        label: `ÇA REMONTE · JOUR ${status.dayIndex}/${status.totalDays}`,
        emoji: "📈",
        hint: "Tendance positive. Laisse tourner et continue à saisir.",
        className: "bg-background text-foreground border-2 border-foreground",
      };
    }
    if (profitTrend === "down" && roasTrend === "down") {
      return {
        level: "watch",
        label: `SURVEILLE · JOUR ${status.dayIndex}/${status.totalDays}`,
        emoji: "⚠",
        hint: "Tendance qui se dégrade. Si demain c'est pareil, envisage de couper.",
        className: "bg-background text-foreground border-2 border-accent",
      };
    }
    return {
      level: "running",
      label: `LAISSE TOURNER · JOUR ${status.dayIndex}/${status.totalDays}`,
      emoji: "⏳",
      hint: "Trop tôt pour décider. Continue le test.",
      className: "bg-background text-foreground border-2 border-foreground",
    };
  }

  const weights = series.map((_, i) => (i === series.length - 1 ? 1.5 : 1));
  const totalW = weights.reduce((a, b) => a + b, 0);
  const weightedRoas =
    series.reduce((acc, s, i) => acc + s.roas * weights[i], 0) / totalW;

  if (weightedRoas > 3) {
    return {
      level: "scale",
      label: "SCALE",
      emoji: "🚀",
      hint: `Test concluant (ROAS moy. ${weightedRoas.toFixed(2)}). Augmente le budget de 20–30 %.`,
      className: "bg-foreground text-background border-2 border-foreground",
    };
  }
  if (weightedRoas >= 1.8) {
    return {
      level: "optimize",
      label: "OPTIMISE",
      emoji: "⚖",
      hint: `ROAS moy. ${weightedRoas.toFixed(2)}. Améliore CTR / créa / panier avant de scaler.`,
      className: "bg-background text-foreground border-2 border-foreground",
    };
  }
  return {
    level: "cut",
    label: "COUPE",
    emoji: "🛑",
    hint: `Test négatif (ROAS moy. ${weightedRoas.toFixed(2)}). Coupe ou pivote l'angle/créa.`,
    className: "bg-accent text-accent-foreground border-2 border-accent",
  };
}

/** "débutant" si <10 jours d'entrées tous produits confondus. */
export function detectUserLevel(totalEntries: number): "débutant" | "opérateur" {
  return totalEntries < 10 ? "débutant" : "opérateur";
}

// ─────────────────────────────────────────────────────────────
// Decision Engine — Scale / Watch / Kill
// ─────────────────────────────────────────────────────────────

export type ProductDecision = "scale" | "watch" | "kill" | "none";

export type ProductDecisionResult = {
  decision: ProductDecision;
  label: string;
  marginPct: number;
  netRoas: number;
  hint: string;
};

/**
 * Décision hybride marge + ROAS net.
 * - SCALE  : marge > 30%  ET  ROAS net > 2.5
 * - KILL   : marge < 15%  OU  ROAS net < 1.8
 * - WATCH  : entre les deux
 */
export function computeProductDecision(
  marginPct: number,
  netRoas: number,
  hasSpend: boolean,
): ProductDecisionResult {
  if (!hasSpend) {
    return {
      decision: "none",
      label: "EN ATTENTE",
      marginPct,
      netRoas,
      hint: "Pas encore de dépense pub.",
    };
  }
  if (marginPct > 30 && netRoas > 2.5) {
    return {
      decision: "scale",
      label: "SCALE",
      marginPct,
      netRoas,
      hint: "Pousse le budget. Le produit tient la route.",
    };
  }
  if (marginPct < 15 || netRoas < 1.8) {
    return {
      decision: "kill",
      label: "KILL",
      marginPct,
      netRoas,
      hint: "Coupe ou pivote — la marge ne suit pas.",
    };
  }
  return {
    decision: "watch",
    label: "WATCH",
    marginPct,
    netRoas,
    hint: "Optimise créa, prix ou COGS avant de scaler.",
  };
}

/** Agrège les KPIs par produit pour un ranking décisionnel. */
export type ProductRankingRow = {
  product: Product;
  kpis: KPIs;
  marginPct: number;
  decision: ProductDecisionResult;
};

export function computeProductRanking(
  entries: DailyEntry[],
  products: Product[],
  targetCurrency: string = "EUR",
  fx?: DropshippingFxOptions,
  metaTaxPct = 0,
): ProductRankingRow[] {
  return products
    .map((p) => {
      const pEntries = entries.filter((e) => e.product_id === p.id);
      const kpis = computeKPIs(pEntries, products, targetCurrency, fx, metaTaxPct);
      const marginPct = kpis.revenue > 0 ? (kpis.netProfit / kpis.revenue) * 100 : 0;
      const decision = computeProductDecision(marginPct, kpis.roas, kpis.adSpend > 0);
      return { product: p, kpis, marginPct, decision };
    })
    .sort((a, b) => b.kpis.netProfit - a.kpis.netProfit);
}

/** Break-even ROAS = 1 / marge brute (sale - cost - shipping) / sale. */
export function breakEvenRoas(products: Product[]): number {
  if (products.length === 0) return 0;
  let totalSale = 0;
  let totalGross = 0;
  for (const p of products) {
    const sale = Number(p.sale_price) || 0;
    const cost = Number(p.cost_price) || 0;
    const ship = Number(p.shipping_cost ?? 0);
    const gross = sale - cost - ship;
    totalSale += sale;
    totalGross += gross;
  }
  const margin = totalSale > 0 ? totalGross / totalSale : 0;
  return margin > 0 ? 1 / margin : 0;
}

/** Verdict rentabilité pour badges UI (vert / jaune / rouge). */
export type ProfitVerdictKind = "profit" | "break_even" | "loss" | "pending";

export function profitVerdictKind(
  netProfit: number,
  revenue: number,
  hasData = true,
): ProfitVerdictKind {
  if (!hasData || (revenue === 0 && netProfit === 0)) return "pending";
  const marginPct = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  if (netProfit < 0) return "loss";
  if (Math.abs(netProfit) < 0.01 || Math.abs(marginPct) < 2) return "break_even";
  return "profit";
}

export function profitVerdictLabel(kind: ProfitVerdictKind): string {
  switch (kind) {
    case "profit":
      return "✓ RENTABLE";
    case "break_even":
      return "≈ BREAK EVEN";
    case "loss":
      return "✗ PERTE";
    default:
      return "EN ATTENTE";
  }
}

export function profitVerdictBadgeClass(kind: ProfitVerdictKind): string {
  switch (kind) {
    case "profit":
      return "bg-[#16a34a] text-white";
    case "break_even":
      return "bg-[#eab308] text-foreground";
    case "loss":
      return "bg-[#dc2626] text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}
