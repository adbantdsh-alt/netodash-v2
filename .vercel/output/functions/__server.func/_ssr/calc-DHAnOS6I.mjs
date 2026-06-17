import { n as normalizeDropshippingCurrency, c as convertDropshippingCurrency } from "./dropshipping-fx-BpQqYaq9.mjs";
function upsellTotalsForEntry(entry, productMap, targetCurrency, fx) {
  const list = Array.isArray(entry.upsells) ? entry.upsells : [];
  let revenue = 0;
  let cogs = 0;
  let shipping = 0;
  let units = 0;
  const fxOpts = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR")
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
      fxOpts
    );
    shipping += convertDropshippingCurrency(
      qty * unitShippingCost(p),
      productCurrency,
      targetCurrency,
      fxOpts
    );
    units += qty;
  }
  return { revenue, cogs, shipping, units };
}
const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP", "XOF"];
const DEFAULT_USD_VALUE = {
  EUR: 1.08,
  USD: 1,
  GBP: 1.27,
  XOF: 1 / 600
};
function normalizeCurrency(currency) {
  const cur = String(currency ?? "EUR").toUpperCase();
  return SUPPORTED_CURRENCIES.includes(cur) ? cur : "EUR";
}
function convertCurrency(value, fromCurrency, toCurrency = "EUR", usdToXofRate) {
  const raw = Number(value) || 0;
  const from = normalizeCurrency(fromCurrency);
  const to = normalizeCurrency(toCurrency);
  if (from === to) return raw;
  const manualXofPerUsd = Number(usdToXofRate);
  const haveManual = Number.isFinite(manualXofPerUsd) && manualXofPerUsd > 0;
  const usdValues = { ...DEFAULT_USD_VALUE };
  if (haveManual) usdValues.XOF = 1 / manualXofPerUsd;
  const usdValue = raw * usdValues[from];
  return usdValue / usdValues[to];
}
function adSpendInCurrency(entry, targetCurrency = "EUR", fx) {
  const fxOpts = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR")
  };
  return convertDropshippingCurrency(
    Number(entry.ad_budget),
    entry.ad_budget_currency ?? targetCurrency,
    targetCurrency,
    fxOpts
  );
}
function unitProductCost(product) {
  return Number(product.cost_price ?? 0) || 0;
}
function unitShippingCost(product) {
  return Number(product.shipping_cost ?? 0) || 0;
}
function unitLandedCost(product) {
  return unitProductCost(product) + unitShippingCost(product);
}
const SHOPIFY_FEES_PCT = 2.9;
const SHOPIFY_FIXED_FEE_USD = 0.3;
const WAVE_FEES_PCT = 1;
function computeKPIs(entries, products, targetCurrency = "EUR", fx, metaTaxPct = 0) {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const fxOpts = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR")
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
    const revenueCurrency = e.total_revenue != null ? e.total_revenue_currency ?? p.currency ?? targetCurrency : p.currency ?? targetCurrency;
    const revRaw = e.total_revenue != null ? Number(e.total_revenue) : orders * Number(p.sale_price);
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
    upsellUnits
  };
}
function formatCurrency(value, currency = "EUR") {
  const code = normalizeCurrency(currency);
  const symbols = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    XOF: "FCFA"
  };
  const sym = symbols[code] || code;
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const decimals = code === "XOF" || Math.abs(safeValue - Math.round(safeValue)) < 5e-3 ? 0 : 2;
  return `${safeValue.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })} ${sym}`;
}
function formatNumber(value, fractionDigits = 0) {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
}
function toLocalISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function dateRangeForPreset(preset, custom) {
  const now = /* @__PURE__ */ new Date();
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
function fillDailySeries(series, from, to, zeroFactory) {
  const map = new Map(series.map((s) => [s.date, s]));
  const result = [];
  const start = /* @__PURE__ */ new Date(from + "T00:00:00");
  const end = /* @__PURE__ */ new Date(to + "T00:00:00");
  let count = 0;
  for (let d = new Date(start); d <= end && count < 366; d.setDate(d.getDate() + 1), count++) {
    const key = toLocalISODate(d);
    result.push(map.get(key) ?? zeroFactory(key));
  }
  return result;
}
function computeDailySeries(entries, products, productId, targetCurrency = "EUR", fx, metaTaxPct = 0) {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const fxOpts = {
    ...fx,
    displayCurrency: normalizeDropshippingCurrency(targetCurrency, fx?.displayCurrency ?? "EUR")
  };
  const filtered = productId ? entries.filter((e) => e.product_id === productId) : entries;
  const byDay = /* @__PURE__ */ new Map();
  for (const e of filtered) {
    const p = productMap.get(e.product_id);
    if (!p) continue;
    const orders = Number(e.shopify_orders) || 0;
    const revenueCurrency = e.total_revenue != null ? e.total_revenue_currency ?? p.currency ?? targetCurrency : p.currency ?? targetCurrency;
    const revRaw = e.total_revenue != null ? Number(e.total_revenue) : orders * Number(p.sale_price);
    const rev = convertDropshippingCurrency(revRaw, revenueCurrency, targetCurrency, fxOpts);
    const cogs = convertDropshippingCurrency(orders * unitLandedCost(p), p.currency ?? targetCurrency, targetCurrency, fxOpts);
    const ad = adSpendInCurrency(e, targetCurrency, fxOpts);
    const tax = e.include_meta_tax !== false ? ad * (Number(metaTaxPct) / 100) : 0;
    const shopifyFees = e.include_shopify_fees ? rev * (SHOPIFY_FEES_PCT / 100) + convertDropshippingCurrency(orders * SHOPIFY_FIXED_FEE_USD, "USD", targetCurrency, fxOpts) : 0;
    const waveFees = e.include_wave_fees ? rev * (WAVE_FEES_PCT / 100) : 0;
    const ups = upsellTotalsForEntry(e, productMap, targetCurrency, fxOpts);
    const revWithUps = rev + ups.revenue;
    const cogsWithUps = cogs + ups.cogs;
    const profit = revWithUps - ad - cogsWithUps - tax - shopifyFees - waveFees;
    const cur = byDay.get(e.entry_date);
    const noteRaw = e.notes;
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
        notes: note
      });
    }
  }
  for (const k of byDay.values()) {
    const totalAd = k.adSpend + k.metaTax;
    k.roas = totalAd > 0 ? k.revenue / totalAd : 0;
  }
  return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
}
function computeTrend(values, threshold = 0.1) {
  if (values.length < 2) return "flat";
  const first = values[0];
  const last = values[values.length - 1];
  if (first === 0) return last > 0 ? "up" : "flat";
  const slope = (last - first) / Math.abs(first);
  if (slope > threshold) return "up";
  if (slope < -threshold) return "down";
  return "flat";
}
function trendArrow(t) {
  if (t === "up") return "↑";
  if (t === "down") return "↓";
  return "→";
}
function computeProductDecision(marginPct, netRoas, hasSpend) {
  if (!hasSpend) {
    return {
      decision: "none",
      label: "EN ATTENTE",
      marginPct,
      netRoas,
      hint: "Pas encore de dépense pub."
    };
  }
  if (marginPct > 30 && netRoas > 2.5) {
    return {
      decision: "scale",
      label: "SCALE",
      marginPct,
      netRoas,
      hint: "Pousse le budget. Le produit tient la route."
    };
  }
  if (marginPct < 15 || netRoas < 1.8) {
    return {
      decision: "kill",
      label: "KILL",
      marginPct,
      netRoas,
      hint: "Coupe ou pivote — la marge ne suit pas."
    };
  }
  return {
    decision: "watch",
    label: "WATCH",
    marginPct,
    netRoas,
    hint: "Optimise créa, prix ou COGS avant de scaler."
  };
}
function computeProductRanking(entries, products, targetCurrency = "EUR", fx, metaTaxPct = 0) {
  return products.map((p) => {
    const pEntries = entries.filter((e) => e.product_id === p.id);
    const kpis = computeKPIs(pEntries, products, targetCurrency, fx, metaTaxPct);
    const marginPct = kpis.revenue > 0 ? kpis.netProfit / kpis.revenue * 100 : 0;
    const decision = computeProductDecision(marginPct, kpis.roas, kpis.adSpend > 0);
    return { product: p, kpis, marginPct, decision };
  }).sort((a, b) => b.kpis.netProfit - a.kpis.netProfit);
}
function breakEvenRoas(products) {
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
function profitVerdictKind(netProfit, revenue, hasData = true) {
  if (!hasData || revenue === 0 && netProfit === 0) return "pending";
  const marginPct = revenue > 0 ? netProfit / revenue * 100 : 0;
  if (netProfit < 0) return "loss";
  if (Math.abs(netProfit) < 0.01 || Math.abs(marginPct) < 2) return "break_even";
  return "profit";
}
function profitVerdictLabel(kind) {
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
function profitVerdictBadgeClass(kind) {
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
function profitVerdictTextClass(kind) {
  switch (kind) {
    case "profit":
      return "text-[#16a34a]";
    case "break_even":
      return "text-[#eab308]";
    case "loss":
      return "text-[#dc2626]";
    default:
      return "text-muted-foreground";
  }
}
export {
  WAVE_FEES_PCT as W,
  profitVerdictLabel as a,
  profitVerdictKind as b,
  computeKPIs as c,
  dateRangeForPreset as d,
  formatNumber as e,
  formatCurrency as f,
  computeDailySeries as g,
  computeTrend as h,
  computeProductRanking as i,
  breakEvenRoas as j,
  fillDailySeries as k,
  profitVerdictTextClass as l,
  convertCurrency as m,
  profitVerdictBadgeClass as p,
  trendArrow as t
};
