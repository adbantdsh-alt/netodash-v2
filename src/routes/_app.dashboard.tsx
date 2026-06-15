import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { historyDaysFor, canUseDecisionEngine } from "@/lib/plan-limits";
import { Link as RouterLink } from "@tanstack/react-router";
import {
  useEntries,
  useProducts,
  useProfile,
} from "@/lib/queries";
import { useDropshippingFx } from "@/lib/use-dropshipping-fx";
import { useActiveMode } from "@/lib/use-active-mode";
import {
  computeDailySeries,
  computeKPIs,
  computeTrend,
  computeProductRanking,
  breakEvenRoas,
  dateRangeForPreset,
  fillDailySeries,
  formatCurrency,
  formatNumber,
  trendArrow,
} from "@/lib/calc";
import { KpiCard } from "@/components/KpiCard";
import { PeriodPicker, type Preset, type CustomRange } from "@/components/PeriodPicker";
import { DashboardCod } from "@/components/DashboardCod";
import { DashboardInsights, type InsightAlert } from "@/components/DashboardInsights";



const dashboardSearchSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  product: z.string().uuid().optional(),
  highlight: z.coerce.number().optional(),
});

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NETODASH" }] }),
  validateSearch: dashboardSearchSchema,
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const storyRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      link.download = `netodash-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("capture failed", e);
    } finally {
      setCapturing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries();
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  }

  const initialPreset: Preset = search.from && search.to ? "custom" : "today";
  const initialRange: CustomRange =
    search.from && search.to ? { from: search.from, to: search.to } : null;

  const [preset, setPreset] = useState<Preset>(initialPreset);
  const [customRange, setCustomRange] = useState<CustomRange>(initialRange);
  const [productId, setProductId] = useState<string>(search.product ?? "");
  const [showLastEntry, setShowLastEntry] = useState<boolean>(!!search.highlight);

  // Si l'utilisateur revient avec d'autres params plus tard, on re-synchronise
  useEffect(() => {
    if (search.from && search.to) {
      setPreset("custom");
      setCustomRange({ from: search.from, to: search.to });
    }
    if (search.product) setProductId(search.product);
    if (search.highlight) setShowLastEntry(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.from, search.to, search.product, search.highlight]);

  const rawRange = useMemo(
    () => dateRangeForPreset(preset, customRange),
    [preset, customRange],
  );

  // Plan Free → historique limité aux N derniers jours.
  const sub = useSubscription(user?.id);
  const historyDays = historyDaysFor(sub.plan);
  const range = useMemo(() => {
    if (!historyDays) return rawRange;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - historyDays + 1);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return { ...rawRange, from: rawRange.from < cutoffStr ? cutoffStr : rawRange.from };
  }, [rawRange, historyDays]);
  const historyTruncated = !!historyDays && range.from !== rawRange.from;

  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range, productId || undefined);

  const { mode: activeMode, currency: modeCurrency } = useActiveMode();
  const profileCurrency = modeCurrency;
  const { fx: dropshippingFx, codUsdToXofRate } = useDropshippingFx(user?.id);
  const metaTaxPct = Number((profileQ.data as any)?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];

  const currency = profileCurrency;



  const kpis = useMemo(
    () => computeKPIs(entries, products, currency, dropshippingFx, metaTaxPct),
    [entries, products, currency, dropshippingFx, metaTaxPct],
  );

  const dailySeries = useMemo(
    () => computeDailySeries(entries, products, productId || null, currency, dropshippingFx, metaTaxPct),
    [entries, products, productId, currency, dropshippingFx, metaTaxPct],
  );

  const selectedProduct = productId ? products.find((p) => p.id === productId) : null;

  // Trends per metric (used by the per-day table arrows)
  const roasTrend = computeTrend(dailySeries.map((s) => s.roas));

  // === DECISION ENGINE ===
  const productRanking = useMemo(
    () => computeProductRanking(entries, products, currency, dropshippingFx, metaTaxPct),
    [entries, products, currency, dropshippingFx, metaTaxPct],
  );
  const winners = productRanking.filter((r) => r.kpis.netProfit > 0 && Math.abs(r.marginPct) >= 2).length;
  const toWatch = productRanking.filter((r) => Math.abs(r.marginPct) < 2 && r.kpis.adSpend > 0).length;
  const toKill = productRanking.filter((r) => r.kpis.netProfit < 0).length;
  const showDecisionEngine =
    activeMode === "dropshipping" && canUseDecisionEngine(sub.plan);

  const marginPct = kpis.revenue > 0 ? (kpis.netProfit / kpis.revenue) * 100 : 0;
  const beRoas = useMemo(
    () => breakEvenRoas(productId ? products.filter((p) => p.id === productId) : products),
    [products, productId],
  );
  const daysInRange = Math.max(
    1,
    Math.round((new Date(range.to).getTime() - new Date(range.from).getTime()) / 86400000) + 1,
  );
  const weeklyProfit = (kpis.netProfit / daysInRange) * 7;




  // Chart data: aggregate per day, then fill missing days so the chart
  // is a continuous timeline (otherwise 1-2 sparse points look broken).
  const chartData = useMemo(() => {
    const sorted = dailySeries.map((s) => ({
      date: s.date,
      profit: s.netProfit,
      revenue: s.revenue,
      spend: s.adSpend + s.metaTax,
    }));
    if (sorted.length === 0) return [];
    // Use the actual data range (or the selected range when reasonable)
    // for "all" preset we just use the data span to avoid huge gaps.
    const from = preset === "all" ? sorted[0].date : range.from;
    const to = preset === "all" ? sorted[sorted.length - 1].date : range.to;
    return fillDailySeries(sorted, from, to, (date) => ({
      date,
      profit: 0,
      revenue: 0,
      spend: 0,
    }));
  }, [dailySeries, range.from, range.to, preset]);

  const hasData = entries.length > 0;

  // Alertes contextuelles dropshipping (calculées localement, pas de fetch)
  const dropAlerts = useMemo<InsightAlert[]>(() => {
    const a: InsightAlert[] = [];
    if (hasData && kpis.netProfit < 0) {
      a.push({
        kind: "loss",
        title: "Période en perte",
        message: `Profit net ${formatCurrency(kpis.netProfit, currency)} — vérifie le ROAS et tes top dépenses.`,
        cta: { label: "Voir produits", to: "/products" },
      });
    }
    if (hasData && kpis.adSpend > 0 && kpis.roas < beRoas && beRoas > 0) {
      a.push({
        kind: "warn",
        title: "ROAS sous le seuil de rentabilité",
        message: `Actuel ${kpis.roas.toFixed(2)}x · break-even ${beRoas.toFixed(2)}x`,
      });
    }
    if (showDecisionEngine && toKill > 0) {
      a.push({
        kind: "warn",
        title: `${toKill} produit${toKill > 1 ? "s" : ""} à arrêter`,
        message: "Profit net négatif sur la période. Coupe la pub ou ajuste le prix.",
      });
    }
    return a;
  }, [hasData, kpis, beRoas, toKill, currency, showDecisionEngine]);

  // === Branche dédiée mode COD ===
  if (activeMode === "cod") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <PeriodPicker
            value={preset}
            onChange={(p) => {
              setPreset(p);
              if (p !== "custom") setCustomRange(null);
            }}
            customRange={customRange}
            onCustomChange={setCustomRange}
          />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="brutal-border-thin bg-background px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            <span className={refreshing ? "inline-block animate-spin mr-1" : "inline-block mr-1"}>↻</span>
            Rafraîchir
          </button>
        </div>
        <DashboardCod
          entries={entries as any}
          products={products as any}
          currency={currency}
          range={range}
          productId={productId}
          setProductId={setProductId}
          usdToXofRate={codUsdToXofRate}
          metaTaxPct={metaTaxPct}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">

      {historyTruncated && (
        <div className="brutal-border-thin border-accent bg-accent/5 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono">
            <span className="font-bold uppercase tracking-widest text-accent mr-2">PLAN FREE</span>
            Historique limité aux {historyDays} derniers jours.
          </div>
          <RouterLink
            to="/plan"
            className="brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:border-accent"
          >
            Débloquer →
          </RouterLink>
        </div>
      )}
      {/* === MOBILE TOOLBAR === */}
      <div className="md:hidden mb-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">
              DASHBOARD
            </div>
            <h1 className="text-2xl font-black tracking-tighter mt-0.5">
              RENTABILITÉ
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Rafraîchir"
              className="brutal-border-thin bg-background px-3 py-2 text-base font-black active:bg-foreground/10"
            >
              <span className={refreshing ? "inline-block animate-spin" : "inline-block"}>↻</span>
            </button>
            <button
              onClick={handleCapture}
              disabled={capturing}
              aria-label="Partager"
              className="brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-black uppercase tracking-widest"
            >
              {capturing ? "…" : "📸 Share"}
            </button>
          </div>
        </div>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full brutal-border-thin bg-background px-3 py-2 text-xs uppercase tracking-widest font-bold focus:outline-none focus:border-accent"
        >
          <option value="">TOUS LES PRODUITS</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="overflow-x-auto -mx-4 px-4 pb-1">
          <PeriodPicker
            value={preset}
            onChange={(p) => {
              setPreset(p);
              if (p !== "custom") setCustomRange(null);
            }}
            customRange={customRange}
            onCustomChange={setCustomRange}
          />
        </div>
      </div>

      {/* === DESKTOP TOOLBAR === */}
      <div className="hidden md:flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            DASHBOARD
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">
            RENTABILITÉ RÉELLE
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          
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
          <PeriodPicker
            value={preset}
            onChange={(p) => {
              setPreset(p);
              if (p !== "custom") setCustomRange(null);
            }}
            customRange={customRange}
            onCustomChange={setCustomRange}
          />
        </div>
      </div>

      {hasData && (
        <DashboardInsights
          topProducts={productRanking.slice(0, 3).map((r) => ({
            id: r.product.id,
            name: r.product.name,
            netProfit: r.kpis.netProfit,
          }))}
          alerts={dropAlerts}
          currency={currency}
          onSelectProduct={setProductId}
        />
      )}


      {/* === MOBILE STORY CARD (Dropshipping — Netodash blue) === */}
      {hasData && (
        <div
          ref={storyRef}
          className="md:hidden bg-background brutal-border mb-4 overflow-hidden"
        >
          {/* Header — bandeau bleu Netodash */}
          <div
            className="px-4 py-3 text-white relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)",
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
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-80">
                    DROPSHIPPING
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-90 text-right">
                {range.from === range.to ? range.from : `${range.from}\n→ ${range.to}`}
              </span>
            </div>
            {/* Halo décoratif */}
            <div
              aria-hidden
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
            />
          </div>

          {/* Verdict pill */}
          <div
            className={`px-4 py-2.5 flex items-center justify-between border-b border-foreground text-white ${
              kpis.netProfit > 0
                ? "bg-[#16a34a]"
                : kpis.netProfit === 0
                  ? "bg-[#eab308] text-foreground"
                  : "bg-accent"
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
              {kpis.netProfit > 0
                ? "✓ RENTABLE"
                : kpis.netProfit === 0
                  ? "≈ BREAK EVEN"
                  : "✗ PERTE"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-90">
              ROAS {kpis.adSpend > 0 ? kpis.roas.toFixed(2) + "x" : "—"}
            </span>
          </div>

          {/* Hero — Marge nette */}
          <div className="p-4 border-b border-foreground">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
              MARGE NETTE RÉELLE
            </div>
            <div
              className={`text-5xl font-black tabular tracking-tighter break-words leading-none ${
                kpis.netProfit < 0 ? "text-accent" : ""
              }`}
            >
              {formatCurrency(kpis.netProfit, currency)}
            </div>
            <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              CA {formatCurrency(kpis.revenue, currency)} · {kpis.shopifyOrders} CMD
            </div>
            <div className="mt-3 space-y-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                <span>Coûts produits livrés</span>
                <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.cogs, currency)}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                <span>Dont expédition</span>
                <span className="tabular text-foreground font-bold">{formatCurrency(kpis.shippingCost, currency)}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                <span>Pub (ads)</span>
                <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.adSpend, currency)}</span>
              </div>
              {kpis.metaTax > 0 && (
                <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                  <span>Taxe Meta</span>
                  <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.metaTax, currency)}</span>
                </div>
              )}
              {kpis.shopifyFees > 0 && (
                <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                  <span>Frais Shopify</span>
                  <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.shopifyFees, currency)}</span>
                </div>
              )}
              {kpis.waveFees > 0 && (
                <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                  <span>Frais Wave</span>
                  <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.waveFees, currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Grid 2x3 — 6 KPIs */}
          <div className="grid grid-cols-2">
            {[
              {
                label: "ROAS RÉEL",
                value: kpis.adSpend > 0 ? kpis.roas.toFixed(2) : "—",
                sub: `PUB ${formatCurrency(kpis.adSpend, currency)}`,
              },
              {
                label: "COMMANDES",
                value: formatNumber(kpis.shopifyOrders),
                sub: "PAYÉES",
              },
              {
                label: "CA ENCAISSÉ",
                value: formatCurrency(kpis.revenue, currency),
                sub: `${kpis.shopifyOrders} CMD`,
              },
              {
                label: "PANIER MOYEN",
                value: formatCurrency(
                  kpis.shopifyOrders > 0 ? kpis.revenue / kpis.shopifyOrders : 0,
                  currency,
                ),
                sub: "CA / CMD",
              },
              {
                label: "COÛT D'ACQUISITION",
                value: formatCurrency(
                  kpis.shopifyOrders > 0 ? (kpis.adSpend + kpis.metaTax) / kpis.shopifyOrders : 0,
                  currency,
                ),
                sub: "PUB / CMD",
              },
              {
                label: "MARGE / CMD",
                value: formatCurrency(
                  kpis.shopifyOrders > 0 ? kpis.netProfit / kpis.shopifyOrders : 0,
                  currency,
                ),
                sub: "PROFIT NET / CMD",
              },
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

          {/* Footer — bleu Netodash */}
          <div
            className="px-4 py-2.5 text-white text-center"
            style={{
              background:
                "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)",
            }}
          >
            <span className="font-black text-[11px] uppercase tracking-[0.25em]">
              netodash.com · Pilote ton e-commerce
            </span>
          </div>
        </div>
      )}




      {/* Bannière "Dernière saisie" — affichée après une saisie depuis /entries */}
      {showLastEntry && hasData && (
        <div className="brutal-border bg-accent text-accent-foreground border-accent p-5 md:p-6 mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-[260px]">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">
              ✓ DERNIÈRE SAISIE — RÉSUMÉ
            </div>
            <div className="text-lg md:text-xl font-black uppercase tracking-tight mb-3">
              {selectedProduct ? selectedProduct.name : "Tous produits"}
              {" · "}
              {range.from === range.to
                ? range.from
                : `${range.from} → ${range.to}`}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-xs">
              <div>
                <div className="opacity-70 uppercase tracking-widest">Commandes</div>
                <div className="font-bold tabular text-base">
                  {kpis.shopifyOrders}
                </div>
              </div>
              <div>
                <div className="opacity-70 uppercase tracking-widest">CA encaissé</div>
                <div className="font-bold tabular text-base">
                  {formatCurrency(kpis.revenue, currency)}
                </div>
              </div>
              <div>
                <div className="opacity-70 uppercase tracking-widest">Pub</div>
                <div className="font-bold tabular text-base">
                  {formatCurrency(kpis.adSpend, currency)}
                </div>
              </div>
              <div>
                <div className="opacity-70 uppercase tracking-widest">Marge nette</div>
                <div className="font-bold tabular text-base">
                  {formatCurrency(kpis.netProfit, currency)}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setShowLastEntry(false);
              navigate({ search: { highlight: undefined } as any, replace: true });
            }}
            className="text-[10px] uppercase tracking-widest font-bold px-3 py-2 brutal-border-thin border-current hover:bg-current/10"
          >
            Fermer
          </button>
        </div>
      )}

      {!hasData && (
        <div className="brutal-border p-10 text-center mb-8">
          <h2 className="text-3xl font-black mb-3">AUCUNE DONNÉE</h2>
          <p className="text-muted-foreground mb-6">
            Crée d'abord un produit, puis saisis tes commandes du jour.
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
              Saisir des données
            </Link>
          </div>
        </div>
      )}

      {/* Verdict simple : Rentable / Non Rentable — en TÊTE du dashboard */}
      {hasData && (
        <div
          className={`p-5 md:p-7 mb-0 brutal-border ${
            kpis.netProfit >= 0
              ? "bg-[#16a34a] text-white border-[#16a34a]"
              : "bg-accent text-accent-foreground border-accent"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
                VERDICT {selectedProduct ? `· ${selectedProduct.name}` : "· TOUS PRODUITS"}
              </div>
              <div className="text-3xl md:text-5xl font-black tracking-tight">
                {kpis.netProfit >= 0 ? "✓ RENTABLE" : "✗ NON RENTABLE"}
              </div>
              <div className="mt-2 font-mono text-sm opacity-90">
                Marge nette {formatCurrency(kpis.netProfit, currency)} ·{" "}
                ROAS {kpis.adSpend > 0 ? kpis.roas.toFixed(2) + "x" : "—"}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Hero KPIs */}

      <div data-tour="dashboard-kpis" className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 brutal-border mb-0">
        <div className="md:col-span-2 lg:col-span-2 brutal-border-thin border-0 md:border-r border-foreground p-5 md:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              MARGE NETTE RÉELLE
            </div>
            
          </div>
          <div>
            <div
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tabular tracking-tighter break-words ${
                kpis.netProfit < 0 ? "text-accent" : ""
              }`}
            >
              {formatCurrency(kpis.netProfit, currency)}
            </div>
            <div className="mt-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              CA {formatCurrency(kpis.revenue, currency)} − Coûts {formatCurrency(kpis.revenue - kpis.netProfit, currency)}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                <span>Coûts produits livrés</span>
                <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.cogs, currency)}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                <span>Dont expédition</span>
                <span className="tabular text-foreground font-bold">{formatCurrency(kpis.shippingCost, currency)}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                <span>Pub (ads)</span>
                <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.adSpend, currency)}</span>
              </div>
              {kpis.metaTax > 0 && (
                <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                  <span>Taxe Meta</span>
                  <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.metaTax, currency)}</span>
                </div>
              )}
              {kpis.shopifyFees > 0 && (
                <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                  <span>Frais Shopify (2.9%)</span>
                  <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.shopifyFees, currency)}</span>
                </div>
              )}
              {kpis.waveFees > 0 && (
                <div className="flex justify-between border-b border-dashed border-muted-foreground/30 pb-1">
                  <span>Frais Wave (1%)</span>
                  <span className="tabular text-foreground font-bold">− {formatCurrency(kpis.waveFees, currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <KpiCard
          label="ROAS RÉEL"
          value={kpis.adSpend > 0 ? kpis.roas.toFixed(2) : "—"}
          sublabel={`PUB ${formatCurrency(kpis.adSpend, currency)}`}
        />
        <KpiCard
          label="COMMANDES"
          value={formatNumber(kpis.shopifyOrders)}
          sublabel="PAYÉES"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-0 brutal-border border-t-0">
        <KpiCard
          label="CA ENCAISSÉ"
          value={formatCurrency(kpis.revenue, currency)}
          sublabel={`${kpis.shopifyOrders} CMD`}
          className="border-r border-foreground"
        />
        <KpiCard
          label="PANIER MOYEN"
          value={formatCurrency(
            kpis.shopifyOrders > 0 ? kpis.revenue / kpis.shopifyOrders : 0,
            currency,
          )}
          sublabel="CA / COMMANDE"
          className="border-r border-foreground"
        />
        <KpiCard
          label="COÛT D'ACQUISITION"
          value={formatCurrency(
            kpis.shopifyOrders > 0 ? (kpis.adSpend + kpis.metaTax) / kpis.shopifyOrders : 0,
            currency,
          )}
          sublabel="PUB / CMD"
          className="border-r border-foreground"
        />
        <KpiCard
          label="MARGE / CMD"
          value={formatCurrency(
            kpis.shopifyOrders > 0 ? kpis.netProfit / kpis.shopifyOrders : 0,
            currency,
          )}
          sublabel="PROFIT NET / CMD"
        />
      </div>

      {/* Operator KPIs row — Marge / Break-even (+ Weekly si ≥ 7 jours de données) */}
      {hasData && (
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 brutal-border border-t-0">
          {daysInRange >= 7 && (
            <KpiCard
              label="PROFIT 7J"
              value={formatCurrency(weeklyProfit, currency)}
              sublabel="MOYENNE × 7"
              className="border-r border-foreground"
            />
          )}
          <KpiCard
            label="PROFIT MARGIN"
            value={`${marginPct.toFixed(1)}%`}
            sublabel="NET / CA"
            className="border-r border-foreground"
          />
          <KpiCard
            label="BREAK-EVEN ROAS"
            value={beRoas > 0 ? beRoas.toFixed(2) : "—"}
            sublabel="SEUIL RENTABILITÉ"
            className={kpis.upsellUnits > 0 ? "border-r border-foreground" : ""}
          />
          {kpis.upsellUnits > 0 && (
            <KpiCard
              label="BÉNÉFICE UPSELL"
              value={formatCurrency(kpis.upsellMargin, currency)}
              sublabel={`${kpis.upsellUnits} UNITÉ${kpis.upsellUnits > 1 ? "S" : ""} VENDUE${kpis.upsellUnits > 1 ? "S" : ""}`}
            />
          )}
        </div>
      )}


      {/* === PRODUCT PROFIT RANKING === */}
      {hasData && showDecisionEngine && productRanking.length > 0 && (
        <div className="brutal-border border-t-0 p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              PRODUCT PROFIT RANKING
            </h2>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              TRIÉ PAR PROFIT NET
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead className="bg-foreground text-background">
                <tr className="text-xs uppercase tracking-widest">
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">PRODUIT</th>
                  <th className="text-right p-3">CA</th>
                  <th className="text-right p-3">PUB</th>
                  <th className="text-right p-3">PROFIT NET</th>
                  <th className="text-right p-3">MARGE</th>
                  <th className="text-right p-3">ROAS</th>
                  <th className="text-center p-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {productRanking.map((r, i) => {
                  const isProfit = r.kpis.netProfit > 0;
                  const isLoss = r.kpis.netProfit < 0;
                  const marginAbs = Math.abs(r.marginPct);
                  const isBreakEven = !isLoss && !isProfit || (isProfit && marginAbs < 2);
                  const statusLabel = isBreakEven
                    ? "BREAK EVEN"
                    : isProfit
                      ? "RENTABLE"
                      : "PERTE";
                  const statusIcon = isBreakEven ? "≈" : isProfit ? "✓" : "✕";
                  const badgeColor = isBreakEven
                    ? "bg-[#eab308] text-foreground"
                    : isProfit
                      ? "bg-[#16a34a] text-white"
                      : "bg-accent text-accent-foreground";
                  return (
                    <tr
                      key={r.product.id}
                      className="border-t border-foreground hover:bg-foreground/5 cursor-pointer"
                      onClick={() => setProductId(r.product.id)}
                    >
                      <td className="p-3 font-bold tabular text-muted-foreground">{i + 1}</td>
                      <td className="p-3 font-bold uppercase tracking-tight">{r.product.name}</td>
                      <td className="p-3 text-right tabular">
                        {formatCurrency(r.kpis.revenue, currency)}
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
                      <td className="p-3 text-right tabular">
                        {r.marginPct.toFixed(1)}%
                      </td>
                      <td className="p-3 text-right tabular">
                        {r.kpis.adSpend > 0 ? r.kpis.roas.toFixed(2) : "—"}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${badgeColor}`}
                        >
                          <span>{statusIcon}</span>
                          <span>{statusLabel}</span>
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

      {/* Cost breakdown — vérification transparente du calcul */}

      {hasData && (
        <div className="brutal-border border-t-0 p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight">
              DÉCOMPOSITION DU CALCUL
            </h2>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {range.from === range.to ? `JOUR ${range.from}` : `${range.from} → ${range.to}`}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 font-mono text-sm">
            <div className="flex justify-between border-b border-foreground/20 py-2">
              <span className="text-muted-foreground">CA Encaissé (Livrées × Prix)</span>
              <span className="font-bold tabular">+ {formatCurrency(kpis.revenue, currency)}</span>
            </div>
            <div className="flex justify-between border-b border-foreground/20 py-2">
              <span className="text-muted-foreground">Budget Pub</span>
              <span className="font-bold tabular text-accent">− {formatCurrency(kpis.adSpend, currency)}</span>
            </div>
            <div className="flex justify-between border-b border-foreground/20 py-2">
              <span className="text-muted-foreground">Coûts produits livrés (Cmd × achat + expé)</span>
              <span className="font-bold tabular text-accent">− {formatCurrency(kpis.cogs, currency)}</span>
            </div>
            <div className="flex justify-between border-b border-foreground/20 py-2">
              <span className="text-muted-foreground">Dont expédition déjà incluse</span>
              <span className="font-bold tabular">{formatCurrency(kpis.shippingCost, currency)}</span>
            </div>
            {kpis.metaTax > 0 && (
              <div className="flex justify-between border-b border-foreground/20 py-2">
                <span className="text-muted-foreground">Taxe Meta Ads ({formatNumber(metaTaxPct, 0)}% du budget pub)</span>
                <span className="font-bold tabular text-accent">− {formatCurrency(kpis.metaTax, currency)}</span>
              </div>
            )}
            {kpis.shopifyFees > 0 && (
              <div className="flex justify-between border-b border-foreground/20 py-2">
                <span className="text-muted-foreground">Frais Shopify/Stripe (2,9% du CA)</span>
                <span className="font-bold tabular text-accent">− {formatCurrency(kpis.shopifyFees, currency)}</span>
              </div>
            )}
            {kpis.waveFees > 0 && (
              <div className="flex justify-between border-b border-foreground/20 py-2">
                <span className="text-muted-foreground">Frais Wave (1% du CA)</span>
                <span className="font-bold tabular text-accent">− {formatCurrency(kpis.waveFees, currency)}</span>
              </div>
            )}
            {(kpis.refundedOrders > 0 || kpis.refundedAmount > 0) && (
              <div className="flex justify-between border-b border-foreground/20 py-2 md:col-span-2">
                <span className="text-muted-foreground">
                  Remboursements
                  {kpis.refundedOrders > 0 && ` · ↩ ${kpis.refundedOrders} remb.`}
                  <span className="ml-1 text-[10px] uppercase tracking-widest">(déjà déduit du CA)</span>
                </span>
                <span className="font-bold tabular text-accent">
                  − {formatCurrency(kpis.refundedAmount, currency)}
                </span>
              </div>
            )}
            {kpis.upsellUnits > 0 && (
              <div className="md:col-span-2 mt-2 p-3 border-2 border-dashed border-foreground/40 bg-foreground/[0.02]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
                  Détail Upsell / cadeau ({kpis.upsellUnits} unité{kpis.upsellUnits > 1 ? "s" : ""}) — inclus dans CA & coût produit livré
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CA upsell</span>
                    <span className="font-bold tabular">+ {formatCurrency(kpis.upsellRevenue, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coût livré upsell/cadeau</span>
                    <span className="font-bold tabular text-accent">− {formatCurrency(kpis.upsellCogs, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold uppercase">↳ Marge upsell</span>
                    <span className={`font-black tabular ${kpis.upsellMargin < 0 ? "text-accent" : "text-[#16a34a]"}`}>
                      {formatCurrency(kpis.upsellMargin, currency)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between border-b-2 border-foreground py-2">
              <span className="font-bold uppercase">= Marge Nette Réelle</span>
              <span className={`font-black tabular text-lg ${kpis.netProfit < 0 ? "text-accent" : ""}`}>
                {formatCurrency(kpis.netProfit, currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mini-tableau évolution journalière (par produit sélectionné) */}
      {selectedProduct && dailySeries.length > 0 && (
        <div className="brutal-border border-t-0 p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-black uppercase tracking-tight">
              ÉVOLUTION JOUR PAR JOUR
            </h2>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex gap-3">
              <span>ROAS {trendArrow(roasTrend)}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead className="bg-foreground text-background">
                <tr className="text-xs uppercase tracking-widest">
                  <th className="text-left p-3">JOUR</th>
                  <th className="text-left p-3">DATE</th>
                  <th className="text-right p-3">PUB</th>
                  <th className="text-right p-3">CA</th>
                  <th className="text-right p-3">PROFIT</th>
                  <th className="text-right p-3">ROAS</th>
                  <th className="text-right p-3">CMD</th>
                </tr>
              </thead>
              <tbody>
                {dailySeries.map((s, i) => {
                  const prev = i > 0 ? dailySeries[i - 1] : null;
                  const profitArrow = prev
                    ? s.netProfit > prev.netProfit
                      ? "↑"
                      : s.netProfit < prev.netProfit
                        ? "↓"
                        : "→"
                    : "";
                  return (
                    <tr key={s.date} className="border-t border-foreground hover:bg-foreground/5">
                      <td className="p-3 font-bold">J{i + 1}</td>
                      <td className="p-3 tabular text-muted-foreground">{s.date}</td>
                      <td className="p-3 text-right tabular">
                        {formatCurrency(s.adSpend, currency)}
                      </td>
                      <td className="p-3 text-right tabular">
                        {formatCurrency(s.revenue, currency)}
                      </td>
                      <td
                        className={`p-3 text-right tabular font-bold ${
                          s.netProfit < 0 ? "text-accent" : ""
                        }`}
                      >
                        {formatCurrency(s.netProfit, currency)} {profitArrow}
                      </td>
                      <td className="p-3 text-right tabular">
                        {s.adSpend > 0 ? s.roas.toFixed(2) : "—"}
                      </td>
                      <td className="p-3 text-right tabular">{s.shopifyOrders}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chart */}
      {hasData && (
        <div className="brutal-border border-t-0 p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">ÉVOLUTION DU PROFIT</h2>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {chartData.length} {chartData.length > 1 ? "JOURS" : "JOUR"}
              {chartData.length > 1 && (
                <>
                  {" · "}
                  <span className={kpis.netProfit >= 0 ? "" : "text-accent"}>
                    TOTAL {formatCurrency(kpis.netProfit, currency)}
                  </span>
                </>
              )}
            </div>
          </div>
          {chartData.length === 1 ? (
            <div className="border-2 border-dashed border-foreground/30 p-8 text-center">
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">
                UN SEUL JOUR DE DONNÉES
              </p>
              <p className="text-xs text-muted-foreground">
                Saisis les jours suivants ou élargis la période pour voir l'évolution.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4500" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#FF4500" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--foreground) / 0.15)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                    tickFormatter={(d) => {
                      const [, m, day] = d.split("-");
                      return `${day}/${m}`;
                    }}
                    minTickGap={20}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                    tickFormatter={(v) =>
                      Math.abs(v) >= 1000 ? Math.round(v / 1000) + "K" : String(v)
                    }
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "2px solid hsl(var(--foreground))",
                      borderRadius: 0,
                      fontFamily: "JetBrains Mono",
                      fontSize: 12,
                    }}
                    formatter={(v: number, name: string) => [formatCurrency(v, currency), name]}
                    labelFormatter={(d) => {
                      const [y, m, day] = String(d).split("-");
                      return `${day}/${m}/${y}`;
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#FF4500"
                    strokeWidth={2.5}
                    fill="url(#profitFill)"
                    dot={{ fill: "#FF4500", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Profit"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={1.5}
                    fill="transparent"
                    dot={false}
                    name="CA"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Verdict simple : Rentable / Non rentable */}
      {hasData && (
        <div
          className={`mt-8 brutal-border p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 ${
            kpis.netProfit >= 0
              ? "bg-[#16a34a] text-white border-[#16a34a]"
              : "bg-accent text-accent-foreground border-accent"
          }`}
        >
          <div>
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
              VERDICT
            </div>
            <div className="text-3xl md:text-5xl font-black tracking-tight">
              {kpis.netProfit >= 0 ? "✓ RENTABLE" : "✗ NON RENTABLE"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
              Marge nette
            </div>
            <div className="text-2xl md:text-3xl font-black tabular tracking-tight">
              {formatCurrency(kpis.netProfit, currency)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
