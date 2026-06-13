import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { convertCurrency, formatCurrency, formatNumber, WAVE_FEES_PCT } from "@/lib/calc";
import { DashboardInsights, type InsightAlert } from "@/components/DashboardInsights";

type ShippingZone = { name: string; cost: number };

type Product = {
  id: string;
  name: string;
  cost_price: number;
  sale_price: number;
  shipping_cost: number;
  shipping_zones?: ShippingZone[] | null;
};

type UpsellLine = { product_id: string; qty: number; unit_price: number; currency?: string | null };

type Entry = {
  id: string;
  product_id: string;
  entry_date: string;
  shopify_orders: number | null;
  received_orders: number | null;
  confirmed_orders: number | null;
  delivered_orders: number | null;
  refused_orders: number | null;
  cash_collected: number | null;
  ad_budget: number | null;
  ad_budget_currency: string | null;
  delivered_by_zone?: Record<string, number> | null;
  include_meta_tax?: boolean | null;
  include_wave_fees?: boolean | null;
  upsells?: UpsellLine[] | null;
};

type CodKpis = {
  received: number;
  confirmed: number;
  delivered: number;
  refused: number;
  deliveryRate: number;
  confirmRate: number;
  cashCollected: number;
  adSpend: number;
  cogs: number;
  shipping: number;
  metaTax: number;
  waveFees: number;
  netProfit: number;
  cpa: number;
  profitPerDelivered: number;
  upsellRevenue: number;
  upsellCogs: number;
  upsellMargin: number;
  upsellUnits: number;
};

function computeCodKpis(
  entries: Entry[],
  products: Product[],
  usdToXofRate?: number,
  metaTaxPct = 0,
): CodKpis {
  const productMap = new Map(products.map((p) => [p.id, p]));
  let received = 0,
    confirmed = 0,
    delivered = 0,
    refused = 0,
    cashCollected = 0,
    adSpend = 0,
    cogs = 0,
    shipping = 0,
    metaTax = 0,
    waveFees = 0,
    upsellRevenue = 0,
    upsellCogs = 0,
    upsellUnits = 0;
  for (const e of entries) {
    const p = productMap.get(e.product_id);
    const d = Number(e.delivered_orders ?? 0);
    // Fallback : anciennes saisies COD avant l'ajout des colonnes dédiées
    const rec = e.received_orders ?? e.shopify_orders ?? 0;
    received += Number(rec);
    confirmed += Number(e.confirmed_orders ?? 0);
    delivered += d;
    refused += Number(e.refused_orders ?? 0);
    const cash = Number(e.cash_collected ?? 0);
    cashCollected += cash;
    // Conversion du budget pub vers XOF (devise du dashboard COD)
    const ad = convertCurrency(
      Number(e.ad_budget ?? 0),
      e.ad_budget_currency ?? "XOF",
      "XOF",
      usdToXofRate,
    );
    adSpend += ad;
    if (e.include_meta_tax !== false) {
      metaTax += ad * (Number(metaTaxPct) / 100);
    }
    if (e.include_wave_fees) {
      waveFees += cash * (WAVE_FEES_PCT / 100);
    }
    if (p) {
      cogs += d * Number(p.cost_price ?? 0);
      // Frais d'expédition : si zones définies + répartition saisie, on calcule au plus juste
      const zones = Array.isArray(p.shipping_zones) ? p.shipping_zones : [];
      const breakdown = e.delivered_by_zone || {};
      const breakdownTotal = Object.values(breakdown).reduce(
        (s, v) => s + (Number(v) || 0),
        0,
      );
      if (zones.length > 0 && breakdownTotal > 0) {
        for (const z of zones) {
          const count = Number(breakdown[z.name] ?? 0);
          shipping += count * Number(z.cost ?? 0);
        }
      } else if (zones.length > 0) {
        // Pas de répartition saisie : on prend la moyenne des zones × livrées
        const avg = zones.reduce((s, z) => s + Number(z.cost ?? 0), 0) / zones.length;
        shipping += d * avg;
      } else {
        shipping += d * Number(p.shipping_cost ?? 0);
      }
    }
    // Upsells (Plan Pro) — additionne CA encaissé + COGS upsell
    const ups = Array.isArray(e.upsells) ? e.upsells : [];
    for (const u of ups) {
      if (!u || !u.product_id) continue;
      const up = productMap.get(u.product_id);
      const qty = Number(u.qty) || 0;
      const price = Number(u.unit_price) || 0;
      if (qty <= 0) continue;
      cashCollected += qty * price;
      upsellRevenue += qty * price;
      upsellUnits += qty;
      if (up) {
        const upCogs = qty * Number(up.cost_price ?? 0);
        cogs += upCogs;
        upsellCogs += upCogs;
      }
    }
  }
  const netProfit = cashCollected - adSpend - cogs - shipping - metaTax - waveFees;
  const deliveryRate = received > 0 ? (delivered / received) * 100 : 0;
  const confirmRate = received > 0 ? (confirmed / received) * 100 : 0;
  const cpa = delivered > 0 ? adSpend / delivered : 0;
  const profitPerDelivered = delivered > 0 ? netProfit / delivered : 0;
  return {
    received,
    confirmed,
    delivered,
    refused,
    deliveryRate,
    confirmRate,
    cashCollected,
    adSpend,
    cogs,
    shipping,
    metaTax,
    waveFees,
    netProfit,
    cpa,
    profitPerDelivered,
    upsellRevenue,
    upsellCogs,
    upsellMargin: upsellRevenue - upsellCogs,
    upsellUnits,
  };
}

export function DashboardCod({
  entries,
  products,
  currency,
  range,
  productId,
  setProductId,
  usdToXofRate,
  metaTaxPct = 0,
}: {
  entries: Entry[];
  products: Product[];
  currency: string;
  range: { from: string; to: string };
  productId: string;
  setProductId: (id: string) => void;
  usdToXofRate?: number;
  metaTaxPct?: number;
}) {
  const kpis = useMemo(
    () => computeCodKpis(entries, products, usdToXofRate, metaTaxPct),
    [entries, products, usdToXofRate, metaTaxPct],
  );

  const ranking = useMemo(() => {
    return products
      .map((p) => {
        const pe = entries.filter((e) => e.product_id === p.id);
        return { product: p, kpis: computeCodKpis(pe, [p], usdToXofRate, metaTaxPct) };
      })
      .filter((r) => r.kpis.received > 0 || r.kpis.adSpend > 0)
      .sort((a, b) => b.kpis.netProfit - a.kpis.netProfit);
  }, [entries, products, usdToXofRate, metaTaxPct]);

  const hasData = entries.length > 0;
  const isProfit = kpis.netProfit > 0;
  const storyRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  async function handleCapture() {
    if (!storyRef.current) return;
    setCapturing(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(storyRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `netodash-cod-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("capture failed", e);
    } finally {
      setCapturing(false);
    }
  }


  return (
    <div className="grid gap-0">
      {/* Toolbar produit */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold">
            COD · SÉNÉGAL
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mt-1">
            LIVRAISON & CASH
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {hasData && (
            <button
              onClick={handleCapture}
              disabled={capturing}
              aria-label="Partager"
              className="md:hidden brutal-border-thin bg-[#FF6A00] text-white border-[#FF6A00] px-3 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-60"
            >
              {capturing ? "…" : "📸 Share"}
            </button>
          )}
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="brutal-border-thin bg-background px-3 py-2 text-xs uppercase tracking-widest font-bold focus:outline-none focus:border-accent"
          >
            <option value="">TOUS LES PRODUITS</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!hasData ? (
        <div className="brutal-border p-10 text-center">
          <h2 className="text-3xl font-black mb-3">AUCUNE DONNÉE COD</h2>
          <p className="text-muted-foreground mb-6">
            Crée un produit en mode COD, puis saisis tes livraisons et le cash encaissé.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              to="/products"
              className="brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
            >
              + Créer un produit
            </Link>
            <Link
              to="/entries"
              className="brutal-border px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
            >
              Saisir des livraisons
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Insights actionnables COD */}
          <CodInsights
            ranking={ranking}
            kpis={kpis}
            currency={currency}
            onSelectProduct={setProductId}
          />



          {/* === MOBILE STORY CARD (COD — orange) === */}
          <div
            ref={storyRef}
            className="md:hidden bg-background brutal-border mb-4 overflow-hidden"
          >
            {/* Header — bandeau orange */}
            <div
              className="px-4 py-3 text-white relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #b8470d 0%, #FF6A00 55%, #ff8c3b 100%)",
              }}
            >
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <img
                    src="/netodash-logo.png"
                    alt=""
                    className="w-7 h-7 object-contain bg-white p-0.5 rounded-sm"
                  />
                  <div className="leading-tight">
                    <div className="font-black tracking-tight text-sm">NETODASH</div>
                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-90">
                      COD · AFRIQUE
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-90 text-right">
                  {range.from === range.to ? range.from : `${range.from}\n→ ${range.to}`}
                </span>
              </div>
              <div
                aria-hidden
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
              />
            </div>

            {/* Verdict pill */}
            <div
              className={`px-4 py-2.5 flex items-center justify-between border-b border-foreground text-white ${
                isProfit
                  ? "bg-[#16a34a]"
                  : kpis.netProfit === 0
                    ? "bg-[#eab308] text-foreground"
                    : "bg-accent"
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                {isProfit ? "✓ RENTABLE" : kpis.netProfit === 0 ? "≈ BREAK EVEN" : "✗ PERTE"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-90">
                LIVRAISON {kpis.deliveryRate.toFixed(0)}%
              </span>
            </div>

            {/* Hero — Profit net */}
            <div className="p-4 border-b border-foreground">
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                PROFIT NET
              </div>
              <div
                className={`text-5xl font-black tabular tracking-tighter break-words leading-none ${
                  kpis.netProfit < 0 ? "text-accent" : ""
                }`}
              >
                {formatCurrency(kpis.netProfit, currency)}
              </div>
              <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                CASH {formatCurrency(kpis.cashCollected, currency)} · {formatNumber(kpis.delivered)} LIVRÉES
              </div>
            </div>

            {/* Grid 2x3 */}
            <div className="grid grid-cols-2">
              {[
                { label: "CMD REÇUES", value: formatNumber(kpis.received), sub: "LEADS" },
                { label: "CMD LIVRÉES", value: formatNumber(kpis.delivered), sub: `${kpis.deliveryRate.toFixed(0)}% / REÇUES` },
                { label: "CASH ENCAISSÉ", value: formatCurrency(kpis.cashCollected, currency), sub: `${kpis.delivered} LIVRÉES` },
                { label: "BUDGET PUB", value: formatCurrency(kpis.adSpend, currency), sub: `CPA ${formatCurrency(kpis.cpa, currency)}` },
                { label: "COÛT PRODUIT", value: formatCurrency(kpis.cogs, currency), sub: "LIVRÉES × COÛT" },
                { label: "PROFIT / LIVRÉE", value: formatCurrency(kpis.profitPerDelivered, currency), sub: "MARGE / CMD" },
              ].map((k, i) => (
                <div
                  key={k.label}
                  className={`p-3 border-foreground ${i % 2 === 0 ? "border-r" : ""} ${i < 4 ? "border-b" : ""}`}
                >
                  <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground leading-tight">
                    {k.label}
                  </div>
                  <div className="text-lg font-black tabular tracking-tight mt-1 break-words leading-tight">
                    {k.value}
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5 truncate">
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2.5 text-white text-center"
              style={{
                background:
                  "linear-gradient(90deg, #b8470d 0%, #FF6A00 50%, #b8470d 100%)",
              }}
            >
              <span className="font-black text-[11px] uppercase tracking-[0.25em]">
                netodash.com · Cash & livraison
              </span>
            </div>
          </div>

          {/* Verdict (desktop & tablette) */}
          <div className="hidden md:block">
          <div
            className={`p-5 md:p-7 brutal-border ${
              isProfit
                ? "bg-[#16a34a] text-white border-[#16a34a]"
                : kpis.netProfit === 0
                  ? "bg-[#eab308] text-foreground border-[#eab308]"
                  : "bg-accent text-accent-foreground border-accent"
            }`}
          >
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
              VERDICT COD · {range.from === range.to ? range.from : `${range.from} → ${range.to}`}
            </div>
            <div className="text-3xl md:text-5xl font-black tracking-tight">
              {isProfit ? "✓ RENTABLE" : kpis.netProfit === 0 ? "≈ BREAK EVEN" : "✗ NON RENTABLE"}
            </div>
            <div className="mt-2 font-mono text-sm opacity-90">
              Profit net {formatCurrency(kpis.netProfit, currency)} · Taux livraison{" "}
              {kpis.deliveryRate.toFixed(1)}%
            </div>
          </div>
          </div>



          {/* Hero KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 brutal-border border-t-0">
            <Kpi
              label="PROFIT NET"
              value={formatCurrency(kpis.netProfit, currency)}
              sub="CASH − COÛTS − PUB"
              className="border-r border-b md:border-b-0 border-foreground"
              accent={kpis.netProfit < 0}
            />
            <Kpi
              label="CASH ENCAISSÉ"
              value={formatCurrency(kpis.cashCollected, currency)}
              sub={`${kpis.delivered} LIVRÉES`}
              className="border-b md:border-b-0 md:border-r border-foreground"
            />
            <Kpi
              label="TAUX DE LIVRAISON"
              value={`${kpis.deliveryRate.toFixed(1)}%`}
              sub={`${kpis.delivered} / ${kpis.received} CMD`}
              className="border-r border-foreground"
            />
            <Kpi
              label="BUDGET PUB"
              value={formatCurrency(kpis.adSpend, currency)}
              sub={`CPA ${formatCurrency(kpis.cpa, currency)}`}
            />
          </div>

          {/* Funnel COD */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 brutal-border border-t-0">
            <Kpi
              label="CMD REÇUES"
              value={formatNumber(kpis.received)}
              sub="LEADS / APPELS"
              className="border-r border-b md:border-b-0 border-foreground"
            />
            <Kpi
              label="CMD CONFIRMÉES"
              value={formatNumber(kpis.confirmed)}
              sub={`${kpis.confirmRate.toFixed(0)}% CLOSING`}
              className="border-r border-b md:border-b-0 border-foreground"
            />
            <Kpi
              label="CMD LIVRÉES"
              value={formatNumber(kpis.delivered)}
              sub={`${kpis.deliveryRate.toFixed(0)}% / REÇUES`}
              className="border-b md:border-b-0 md:border-r border-foreground"
            />
            <Kpi
              label="COÛT PRODUIT"
              value={formatCurrency(kpis.cogs, currency)}
              sub={`${kpis.delivered} LIVRÉES × COÛT`}
              className="border-r border-foreground"
            />
            <Kpi
              label="PROFIT / LIVRÉE"
              value={formatCurrency(kpis.profitPerDelivered, currency)}
              sub="MARGE PAR CMD"
              accent={kpis.profitPerDelivered < 0}
            />
          </div>

          {/* Bénéfice net upsell */}
          {kpis.upsellUnits > 0 && (
            <div className="brutal-border border-t-0">
              <Kpi
                label="BÉNÉFICE NET UPSELL"
                value={formatCurrency(kpis.upsellMargin, currency)}
                sub={`${kpis.upsellUnits} UNITÉ${kpis.upsellUnits > 1 ? "S" : ""} · CA ${formatCurrency(kpis.upsellRevenue, currency)} − COGS ${formatCurrency(kpis.upsellCogs, currency)}`}
                accent={kpis.upsellMargin < 0}
              />
            </div>
          )}

          {/* Décomposition */}
          <div className="brutal-border border-t-0 p-6 md:p-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4">
              DÉCOMPOSITION DU CALCUL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 font-mono text-sm">
              <Row label="Cash encaissé" value={`+ ${formatCurrency(kpis.cashCollected, currency)}`} />
              <Row
                label="Budget pub"
                value={`− ${formatCurrency(kpis.adSpend, currency)}`}
                negative
              />
              <Row
                label="Coût marchandise (livrées × coût)"
                value={`− ${formatCurrency(kpis.cogs, currency)}`}
                negative
              />
              <Row
                label="Coût expédition (livrées × frais)"
                value={`− ${formatCurrency(kpis.shipping, currency)}`}
                negative
              />
              {kpis.metaTax > 0 && (
                <Row
                  label={`Taxe Meta Ads (${formatNumber(metaTaxPct, 0)}% du budget pub)`}
                  value={`− ${formatCurrency(kpis.metaTax, currency)}`}
                  negative
                />
              )}
              {kpis.waveFees > 0 && (
                <Row
                  label={`Frais Wave (${WAVE_FEES_PCT}% du cash encaissé)`}
                  value={`− ${formatCurrency(kpis.waveFees, currency)}`}
                  negative
                />
              )}
              {kpis.upsellUnits > 0 && (
                <>
                  <div className="md:col-span-2 mt-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Détail Upsell ({kpis.upsellUnits} unité{kpis.upsellUnits > 1 ? "s" : ""})
                  </div>
                  <Row
                    label="CA upsell (inclus dans cash)"
                    value={`+ ${formatCurrency(kpis.upsellRevenue, currency)}`}
                  />
                  <Row
                    label="COGS upsell (inclus dans coût)"
                    value={`− ${formatCurrency(kpis.upsellCogs, currency)}`}
                    negative
                  />
                  <div className="flex justify-between md:col-span-2 py-1 border-t border-dashed border-foreground/30">
                    <span className="font-bold uppercase text-xs">↳ Marge upsell</span>
                    <span className={`font-black tabular ${kpis.upsellMargin < 0 ? "text-accent" : "text-[#16a34a]"}`}>
                      {formatCurrency(kpis.upsellMargin, currency)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-b-2 border-foreground py-2 md:col-span-2">
                <span className="font-bold uppercase">= Profit net réel</span>
                <span
                  className={`font-black tabular text-lg ${
                    kpis.netProfit < 0 ? "text-accent" : ""
                  }`}
                >
                  {formatCurrency(kpis.netProfit, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Ranking */}
          {ranking.length > 0 && (
            <div className="brutal-border border-t-0 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
                PRODUITS COD
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-sm">
                  <thead className="bg-foreground text-background">
                    <tr className="text-xs uppercase tracking-widest">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">PRODUIT</th>
                      <th className="text-right p-3">REÇUES</th>
                      <th className="text-right p-3">LIVRÉES</th>
                      <th className="text-right p-3">TAUX</th>
                      <th className="text-right p-3">CASH</th>
                      <th className="text-right p-3">PUB</th>
                      <th className="text-right p-3">PROFIT</th>
                      <th className="text-center p-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((r, i) => {
                      const isP = r.kpis.netProfit > 0;
                      const isL = r.kpis.netProfit < 0;
                      const isBE = !isP && !isL;
                      const label = isBE ? "BREAK EVEN" : isP ? "RENTABLE" : "PERTE";
                      const icon = isBE ? "≈" : isP ? "✓" : "✕";
                      const color = isBE
                        ? "bg-[#eab308] text-foreground"
                        : isP
                          ? "bg-[#16a34a] text-white"
                          : "bg-accent text-accent-foreground";
                      return (
                        <tr
                          key={r.product.id}
                          className="border-t border-foreground hover:bg-foreground/5 cursor-pointer"
                          onClick={() => setProductId(r.product.id)}
                        >
                          <td className="p-3 font-bold tabular text-muted-foreground">{i + 1}</td>
                          <td className="p-3 font-bold uppercase tracking-tight">
                            {r.product.name}
                          </td>
                          <td className="p-3 text-right tabular">{r.kpis.received}</td>
                          <td className="p-3 text-right tabular">{r.kpis.delivered}</td>
                          <td className="p-3 text-right tabular">
                            {r.kpis.deliveryRate.toFixed(0)}%
                          </td>
                          <td className="p-3 text-right tabular">
                            {formatCurrency(r.kpis.cashCollected, currency)}
                          </td>
                          <td className="p-3 text-right tabular text-accent">
                            {formatCurrency(r.kpis.adSpend, currency)}
                          </td>
                          <td
                            className={`p-3 text-right tabular font-black ${
                              r.kpis.netProfit < 0 ? "text-accent" : ""
                            }`}
                          >
                            {formatCurrency(r.kpis.netProfit, currency)}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${color}`}
                            >
                              <span>{icon}</span>
                              <span>{label}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  className,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div className={`p-4 md:p-6 ${className ?? ""}`}>
      <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-muted-foreground">
        {label}
      </div>
      <div
        className={`text-2xl md:text-4xl font-black tabular tracking-tight mt-1 break-words ${
          accent ? "text-accent" : ""
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
        {sub}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-foreground/20 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold tabular ${negative ? "text-accent" : ""}`}>{value}</span>
    </div>
  );
}

function CodInsights({
  ranking,
  kpis,
  currency,
  onSelectProduct,
}: {
  ranking: { product: { id: string; name: string }; kpis: CodKpis }[];
  kpis: CodKpis;
  currency: string;
  onSelectProduct: (id: string) => void;
}) {
  const alerts: InsightAlert[] = [];
  if (kpis.netProfit < 0) {
    alerts.push({
      kind: "loss",
      title: "Période en perte",
      message: `Profit net ${formatCurrency(kpis.netProfit, currency)} — vérifie le taux de livraison.`,
      cta: { label: "Saisir / corriger", to: "/entries" },
    });
  }
  if (kpis.received > 0 && kpis.deliveryRate < 50) {
    alerts.push({
      kind: "warn",
      title: `Taux de livraison faible (${kpis.deliveryRate.toFixed(0)}%)`,
      message: "Optimise ton call center ou ta logistique pour augmenter la marge.",
    });
  }
  const losers = ranking.filter((r) => r.kpis.netProfit < 0).length;
  if (losers > 0) {
    alerts.push({
      kind: "warn",
      title: `${losers} produit${losers > 1 ? "s" : ""} en perte`,
      message: "Coupe la pub ou ajuste le prix sur ces produits.",
    });
  }
  const top = ranking.slice(0, 3).map((r) => ({
    id: r.product.id,
    name: r.product.name,
    netProfit: r.kpis.netProfit,
  }));
  if (top.length === 0 && alerts.length === 0) return null;
  return (
    <DashboardInsights
      topProducts={top}
      alerts={alerts}
      currency={currency}
      onSelectProduct={onSelectProduct}
    />
  );
}
