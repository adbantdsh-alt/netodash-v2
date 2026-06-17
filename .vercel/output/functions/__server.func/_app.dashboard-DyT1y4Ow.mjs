import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { u as useAuth, f as Route$i } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useSubscription } from "./_ssr/use-subscription-BHAI1fRK.mjs";
import { h as historyDaysFor, g as canUseDecisionEngine } from "./_ssr/plan-limits-BrKNWLKd.mjs";
import { c as useProfile, a as useProducts, b as useEntries, u as useActiveMode } from "./_ssr/queries-BVXaOG3h.mjs";
import { u as useDropshippingFx } from "./_ssr/use-dropshipping-fx-BU2EJUFO.mjs";
import { d as dateRangeForPreset, c as computeKPIs, g as computeDailySeries, h as computeTrend, i as computeProductRanking, j as breakEvenRoas, k as fillDailySeries, b as profitVerdictKind, f as formatCurrency, a as profitVerdictLabel, p as profitVerdictBadgeClass, l as profitVerdictTextClass, e as formatNumber, t as trendArrow, W as WAVE_FEES_PCT, m as convertCurrency } from "./_ssr/calc-DHAnOS6I.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { P as PeriodPicker } from "./_ssr/PeriodPicker-iXK3dC-J.mjs";
import "./_libs/sonner.mjs";
import "./_libs/stripe.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as ReferenceLine, b as Area } from "./_libs/recharts.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/client-IbqXIlEo.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "./_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_ssr/popover-Dkn3wT7t.mjs";
import "./_ssr/button-DWfIo_Ug.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/react-day-picker.mjs";
import "./_libs/date-fns__tz.mjs";
import "./_libs/date-fns.mjs";
import "./_libs/lucide-react.mjs";
import "./_libs/lodash.mjs";
import "./_libs/react-smooth.mjs";
import "./_libs/prop-types.mjs";
import "./_libs/fast-equals.mjs";
import "./_libs/tiny-invariant.mjs";
import "./_libs/react-is.mjs";
import "./_libs/d3-shape.mjs";
import "./_libs/d3-path.mjs";
import "./_libs/victory-vendor.mjs";
import "./_libs/d3-scale.mjs";
import "./_libs/internmap.mjs";
import "./_libs/d3-array.mjs";
import "./_libs/d3-time-format.mjs";
import "./_libs/d3-time.mjs";
import "./_libs/d3-interpolate.mjs";
import "./_libs/d3-color.mjs";
import "./_libs/d3-format.mjs";
import "./_libs/recharts-scale.mjs";
import "./_libs/decimal.js-light.mjs";
import "./_libs/eventemitter3.mjs";
function KpiCard({
  label,
  value,
  sublabel,
  emphasis = "default",
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "brutal-border-thin p-4 md:p-6 flex flex-col justify-between min-h-[120px] md:min-h-[160px] bg-background",
        emphasis === "accent" && "bg-accent text-accent-foreground border-accent",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "text-[10px] md:text-xs uppercase tracking-widest font-bold",
              emphasis === "accent" ? "text-accent-foreground/80" : "text-muted-foreground"
            ),
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl sm:text-3xl md:text-5xl font-black tabular tracking-tighter break-words", children: value }),
          sublabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "mt-2 text-xs font-mono uppercase tracking-wider",
                emphasis === "accent" ? "text-accent-foreground/80" : "text-muted-foreground"
              ),
              children: sublabel
            }
          )
        ] })
      ]
    }
  );
}
function DashboardInsights({
  topProducts,
  alerts,
  currency,
  onSelectProduct
}) {
  if (topProducts.length === 0 && alerts.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3 mb-4", children: [
    topProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 md:p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "🏆 TOP PRODUITS · PROFIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono uppercase tracking-widest text-muted-foreground", children: "CLIQUER POUR FILTRER" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "grid gap-1", children: topProducts.slice(0, 3).map((p, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onSelectProduct?.(p.id),
            className: "w-full flex items-center justify-between gap-3 px-2 py-1.5 hover:bg-foreground/5 text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0", children: medal }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-tight truncate text-sm", children: p.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono font-black tabular text-sm shrink-0 ${p.netProfit < 0 ? "text-accent" : ""}`,
                  children: formatCurrency(p.netProfit, currency)
                }
              )
            ]
          }
        ) }, p.id);
      }) })
    ] }),
    alerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: alerts.slice(0, 3).map((a, i) => {
      const colors = a.kind === "loss" ? "border-accent bg-accent/5 text-accent-foreground" : a.kind === "warn" ? "border-[#eab308] bg-[#eab308]/10" : "border-foreground/40 bg-foreground/5";
      const icon = a.kind === "loss" ? "⚠" : a.kind === "warn" ? "!" : "💡";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `brutal-border-thin p-3 flex flex-wrap items-center justify-between gap-2 ${colors}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono mt-0.5", children: a.message })
            ] }),
            a.cta && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: a.cta.to,
                className: "brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent shrink-0",
                children: [
                  a.cta.label,
                  " →"
                ]
              }
            )
          ]
        },
        i
      );
    }) })
  ] });
}
function computeCodKpis(entries, products, usdToXofRate, metaTaxPct = 0) {
  const productMap = new Map(products.map((p) => [p.id, p]));
  let received = 0, confirmed = 0, delivered = 0, refused = 0, cashCollected = 0, adSpend = 0, cogs = 0, shipping = 0, metaTax = 0, waveFees = 0, upsellRevenue = 0, upsellCogs = 0, upsellUnits = 0;
  for (const e of entries) {
    const p = productMap.get(e.product_id);
    const d = Number(e.delivered_orders ?? 0);
    const rec = e.received_orders ?? e.shopify_orders ?? 0;
    received += Number(rec);
    confirmed += Number(e.confirmed_orders ?? 0);
    delivered += d;
    refused += Number(e.refused_orders ?? 0);
    const cash = Number(e.cash_collected ?? 0);
    cashCollected += cash;
    const ad = convertCurrency(
      Number(e.ad_budget ?? 0),
      e.ad_budget_currency ?? "XOF",
      "XOF",
      usdToXofRate
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
      const zones = Array.isArray(p.shipping_zones) ? p.shipping_zones : [];
      const breakdown = e.delivered_by_zone || {};
      const breakdownTotal = Object.values(breakdown).reduce(
        (s, v) => s + (Number(v) || 0),
        0
      );
      if (zones.length > 0 && breakdownTotal > 0) {
        for (const z of zones) {
          const count = Number(breakdown[z.name] ?? 0);
          shipping += count * Number(z.cost ?? 0);
        }
      } else if (zones.length > 0) {
        const avg = zones.reduce((s, z) => s + Number(z.cost ?? 0), 0) / zones.length;
        shipping += d * avg;
      } else {
        shipping += d * Number(p.shipping_cost ?? 0);
      }
    }
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
  const deliveryRate = received > 0 ? delivered / received * 100 : 0;
  const confirmRate = received > 0 ? confirmed / received * 100 : 0;
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
    upsellUnits
  };
}
function DashboardCod({
  entries,
  products,
  currency,
  range,
  productId,
  setProductId,
  usdToXofRate,
  metaTaxPct = 0
}) {
  const kpis = reactExports.useMemo(
    () => computeCodKpis(entries, products, usdToXofRate, metaTaxPct),
    [entries, products, usdToXofRate, metaTaxPct]
  );
  const ranking = reactExports.useMemo(() => {
    return products.map((p) => {
      const pe = entries.filter((e) => e.product_id === p.id);
      return { product: p, kpis: computeCodKpis(pe, [p], usdToXofRate, metaTaxPct) };
    }).filter((r) => r.kpis.received > 0 || r.kpis.adSpend > 0).sort((a, b) => b.kpis.netProfit - a.kpis.netProfit);
  }, [entries, products, usdToXofRate, metaTaxPct]);
  const hasData = entries.length > 0;
  const isProfit = kpis.netProfit > 0;
  const storyRef = reactExports.useRef(null);
  const [capturing, setCapturing] = reactExports.useState(false);
  async function handleCapture() {
    if (!storyRef.current) return;
    setCapturing(true);
    try {
      const { toPng } = await import("./_libs/html-to-image.mjs");
      const dataUrl = await toPng(storyRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff"
      });
      const link = document.createElement("a");
      link.download = `netodash-cod-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("capture failed", e);
    } finally {
      setCapturing(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "COD · SÉNÉGAL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-5xl font-black tracking-tighter mt-1", children: "LIVRAISON & CASH" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        hasData && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCapture,
            disabled: capturing,
            "aria-label": "Partager",
            className: "md:hidden brutal-border-thin bg-[#FF6A00] text-white border-[#FF6A00] px-3 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-60",
            children: capturing ? "…" : "📸 Share"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: productId,
            onChange: (e) => setProductId(e.target.value),
            className: "brutal-border-thin bg-background px-3 py-2 text-xs uppercase tracking-widest font-bold focus:outline-none focus:border-accent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "TOUS LES PRODUITS" }),
              products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
            ]
          }
        )
      ] })
    ] }),
    !hasData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black mb-3", children: "AUCUNE DONNÉE COD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Crée un produit en mode COD, puis saisis tes livraisons et le cash encaissé." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/products",
            className: "brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent",
            children: "+ Créer un produit"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/entries",
            className: "brutal-border px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background",
            children: "Saisir des livraisons"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CodInsights,
        {
          ranking,
          kpis,
          currency,
          onSelectProduct: setProductId
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: storyRef,
          className: "md:hidden bg-background brutal-border mb-4 overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 py-3 text-white relative overflow-hidden",
                style: {
                  background: "linear-gradient(135deg, #b8470d 0%, #FF6A00 55%, #ff8c3b 100%)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 relative z-10", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: "/netodash-logo.png",
                          alt: "",
                          className: "w-7 h-7 object-contain bg-white p-0.5 rounded-sm"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black tracking-tight text-sm", children: "NETODASH" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-[0.2em] opacity-90", children: "COD · AFRIQUE" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest opacity-90 text-right", children: range.from === range.to ? range.from : `${range.from}
→ ${range.to}` })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "aria-hidden": true,
                      className: "absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20",
                      style: { background: "radial-gradient(circle, #fff 0%, transparent 70%)" }
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `px-4 py-2.5 flex items-center justify-between border-b border-foreground text-white ${isProfit ? "bg-[#16a34a]" : kpis.netProfit === 0 ? "bg-[#eab308] text-foreground" : "bg-accent"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black uppercase tracking-[0.2em]", children: isProfit ? "✓ RENTABLE" : kpis.netProfit === 0 ? "≈ BREAK EVEN" : "✗ PERTE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] uppercase tracking-widest opacity-90", children: [
                    "LIVRAISON ",
                    kpis.deliveryRate.toFixed(0),
                    "%"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1", children: "PROFIT NET" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-5xl font-black tabular tracking-tighter break-words leading-none ${kpis.netProfit < 0 ? "text-accent" : ""}`,
                  children: formatCurrency(kpis.netProfit, currency)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: [
                "CASH ",
                formatCurrency(kpis.cashCollected, currency),
                " · ",
                formatNumber(kpis.delivered),
                " LIVRÉES"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2", children: [
              { label: "CMD REÇUES", value: formatNumber(kpis.received), sub: "LEADS" },
              { label: "CMD LIVRÉES", value: formatNumber(kpis.delivered), sub: `${kpis.deliveryRate.toFixed(0)}% / REÇUES` },
              { label: "CASH ENCAISSÉ", value: formatCurrency(kpis.cashCollected, currency), sub: `${kpis.delivered} LIVRÉES` },
              { label: "BUDGET PUB", value: formatCurrency(kpis.adSpend, currency), sub: `CPA ${formatCurrency(kpis.cpa, currency)}` },
              { label: "COÛT PRODUIT", value: formatCurrency(kpis.cogs, currency), sub: "LIVRÉES × COÛT" },
              { label: "PROFIT / LIVRÉE", value: formatCurrency(kpis.profitPerDelivered, currency), sub: "MARGE / CMD" }
            ].map((k, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `p-3 border-foreground ${i % 2 === 0 ? "border-r" : ""} ${i < 4 ? "border-b" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest font-bold text-muted-foreground leading-tight", children: k.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black tabular tracking-tight mt-1 break-words leading-tight", children: k.value }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5 truncate", children: k.sub })
                ]
              },
              k.label
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-4 py-2.5 text-white text-center",
                style: {
                  background: "linear-gradient(90deg, #b8470d 0%, #FF6A00 50%, #b8470d 100%)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-[11px] uppercase tracking-[0.25em]", children: "netodash.com · Cash & livraison" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `p-5 md:p-7 brutal-border ${isProfit ? "bg-[#16a34a] text-white border-[#16a34a]" : kpis.netProfit === 0 ? "bg-[#eab308] text-foreground border-[#eab308]" : "bg-accent text-accent-foreground border-accent"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold opacity-80 mb-1", children: [
              "VERDICT COD · ",
              range.from === range.to ? range.from : `${range.from} → ${range.to}`
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl md:text-5xl font-black tracking-tight", children: isProfit ? "✓ RENTABLE" : kpis.netProfit === 0 ? "≈ BREAK EVEN" : "✗ NON RENTABLE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 font-mono text-sm opacity-90", children: [
              "Profit net ",
              formatCurrency(kpis.netProfit, currency),
              " · Taux livraison",
              " ",
              kpis.deliveryRate.toFixed(1),
              "%"
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-0 brutal-border border-t-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "PROFIT NET",
            value: formatCurrency(kpis.netProfit, currency),
            sub: "CASH − COÛTS − PUB",
            className: "border-r border-b md:border-b-0 border-foreground",
            accent: kpis.netProfit < 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "CASH ENCAISSÉ",
            value: formatCurrency(kpis.cashCollected, currency),
            sub: `${kpis.delivered} LIVRÉES`,
            className: "border-b md:border-b-0 md:border-r border-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "TAUX DE LIVRAISON",
            value: `${kpis.deliveryRate.toFixed(1)}%`,
            sub: `${kpis.delivered} / ${kpis.received} CMD`,
            className: "border-r border-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "BUDGET PUB",
            value: formatCurrency(kpis.adSpend, currency),
            sub: `CPA ${formatCurrency(kpis.cpa, currency)}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-0 brutal-border border-t-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "CMD REÇUES",
            value: formatNumber(kpis.received),
            sub: "LEADS / APPELS",
            className: "border-r border-b md:border-b-0 border-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "CMD CONFIRMÉES",
            value: formatNumber(kpis.confirmed),
            sub: `${kpis.confirmRate.toFixed(0)}% CLOSING`,
            className: "border-r border-b md:border-b-0 border-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "CMD LIVRÉES",
            value: formatNumber(kpis.delivered),
            sub: `${kpis.deliveryRate.toFixed(0)}% / REÇUES`,
            className: "border-b md:border-b-0 md:border-r border-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "COÛT PRODUIT",
            value: formatCurrency(kpis.cogs, currency),
            sub: `${kpis.delivered} LIVRÉES × COÛT`,
            className: "border-r border-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kpi,
          {
            label: "PROFIT / LIVRÉE",
            value: formatCurrency(kpis.profitPerDelivered, currency),
            sub: "MARGE PAR CMD",
            accent: kpis.profitPerDelivered < 0
          }
        )
      ] }),
      kpis.upsellUnits > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border border-t-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Kpi,
        {
          label: "BÉNÉFICE NET UPSELL",
          value: formatCurrency(kpis.upsellMargin, currency),
          sub: `${kpis.upsellUnits} UNITÉ${kpis.upsellUnits > 1 ? "S" : ""} · CA ${formatCurrency(kpis.upsellRevenue, currency)} − COGS ${formatCurrency(kpis.upsellCogs, currency)}`,
          accent: kpis.upsellMargin < 0
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-t-0 p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black uppercase tracking-tight mb-4", children: "DÉCOMPOSITION DU CALCUL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 font-mono text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Cash encaissé", value: `+ ${formatCurrency(kpis.cashCollected, currency)}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Row,
            {
              label: "Budget pub",
              value: `− ${formatCurrency(kpis.adSpend, currency)}`,
              negative: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Row,
            {
              label: "Coût marchandise (livrées × coût)",
              value: `− ${formatCurrency(kpis.cogs, currency)}`,
              negative: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Row,
            {
              label: "Coût expédition (livrées × frais)",
              value: `− ${formatCurrency(kpis.shipping, currency)}`,
              negative: true
            }
          ),
          kpis.metaTax > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Row,
            {
              label: `Taxe Meta Ads (${formatNumber(metaTaxPct, 0)}% du budget pub)`,
              value: `− ${formatCurrency(kpis.metaTax, currency)}`,
              negative: true
            }
          ),
          kpis.waveFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Row,
            {
              label: `Frais Wave (${WAVE_FEES_PCT}% du cash encaissé)`,
              value: `− ${formatCurrency(kpis.waveFees, currency)}`,
              negative: true
            }
          ),
          kpis.upsellUnits > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 mt-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: [
              "Détail Upsell (",
              kpis.upsellUnits,
              " unité",
              kpis.upsellUnits > 1 ? "s" : "",
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Row,
              {
                label: "CA upsell (inclus dans cash)",
                value: `+ ${formatCurrency(kpis.upsellRevenue, currency)}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Row,
              {
                label: "COGS upsell (inclus dans coût)",
                value: `− ${formatCurrency(kpis.upsellCogs, currency)}`,
                negative: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between md:col-span-2 py-1 border-t border-dashed border-foreground/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase text-xs", children: "↳ Marge upsell" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-black tabular ${kpis.upsellMargin < 0 ? "text-accent" : "text-[#16a34a]"}`, children: formatCurrency(kpis.upsellMargin, currency) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b-2 border-foreground py-2 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase", children: "= Profit net réel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-black tabular text-lg ${kpis.netProfit < 0 ? "text-accent" : ""}`,
                children: formatCurrency(kpis.netProfit, currency)
              }
            )
          ] })
        ] })
      ] }),
      ranking.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-t-0 p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl font-black uppercase tracking-tight mb-4", children: "PRODUITS COD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full font-mono text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs uppercase tracking-widest", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "PRODUIT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "REÇUES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "LIVRÉES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "TAUX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "CASH" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PUB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PROFIT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center p-3", children: "STATUS" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ranking.map((r, i) => {
            const isP = r.kpis.netProfit > 0;
            const isL = r.kpis.netProfit < 0;
            const isBE = !isP && !isL;
            const label = isBE ? "BREAK EVEN" : isP ? "RENTABLE" : "PERTE";
            const icon = isBE ? "≈" : isP ? "✓" : "✕";
            const color = isBE ? "bg-[#eab308] text-foreground" : isP ? "bg-[#16a34a] text-white" : "bg-accent text-accent-foreground";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-foreground hover:bg-foreground/5 cursor-pointer",
                onClick: () => setProductId(r.product.id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold tabular text-muted-foreground", children: i + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold uppercase tracking-tight", children: r.product.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: r.kpis.received }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: r.kpis.delivered }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right tabular", children: [
                    r.kpis.deliveryRate.toFixed(0),
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: formatCurrency(r.kpis.cashCollected, currency) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular text-accent", children: formatCurrency(r.kpis.adSpend, currency) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: `p-3 text-right tabular font-black ${r.kpis.netProfit < 0 ? "text-accent" : ""}`,
                      children: formatCurrency(r.kpis.netProfit, currency)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${color}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
                      ]
                    }
                  ) })
                ]
              },
              r.product.id
            );
          }) })
        ] }) })
      ] })
    ] })
  ] });
}
function Kpi({
  label,
  value,
  sub,
  className,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 md:p-6 ${className ?? ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs uppercase tracking-widest font-bold text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `text-2xl md:text-4xl font-black tabular tracking-tight mt-1 break-words ${accent ? "text-accent" : ""}`,
        children: value
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1", children: sub })
  ] });
}
function Row({
  label,
  value,
  negative
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold tabular ${negative ? "text-accent" : ""}`, children: value })
  ] });
}
function CodInsights({
  ranking,
  kpis,
  currency,
  onSelectProduct
}) {
  const alerts = [];
  if (kpis.netProfit < 0) {
    alerts.push({
      kind: "loss",
      title: "Période en perte",
      message: `Profit net ${formatCurrency(kpis.netProfit, currency)} — vérifie le taux de livraison.`,
      cta: { label: "Saisir / corriger", to: "/entries" }
    });
  }
  if (kpis.received > 0 && kpis.deliveryRate < 50) {
    alerts.push({
      kind: "warn",
      title: `Taux de livraison faible (${kpis.deliveryRate.toFixed(0)}%)`,
      message: "Optimise ton call center ou ta logistique pour augmenter la marge."
    });
  }
  const losers = ranking.filter((r) => r.kpis.netProfit < 0).length;
  if (losers > 0) {
    alerts.push({
      kind: "warn",
      title: `${losers} produit${losers > 1 ? "s" : ""} en perte`,
      message: "Coupe la pub ou ajuste le prix sur ces produits."
    });
  }
  const top = ranking.slice(0, 3).map((r) => ({
    id: r.product.id,
    name: r.product.name,
    netProfit: r.kpis.netProfit
  }));
  if (top.length === 0 && alerts.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DashboardInsights,
    {
      topProducts: top,
      alerts,
      currency,
      onSelectProduct
    }
  );
}
function DashboardPage() {
  const {
    user
  } = useAuth();
  const search = Route$i.useSearch();
  const navigate = Route$i.useNavigate();
  const queryClient = useQueryClient();
  const storyRef = reactExports.useRef(null);
  const [capturing, setCapturing] = reactExports.useState(false);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  async function handleCapture() {
    if (!storyRef.current) return;
    setCapturing(true);
    try {
      const {
        toPng
      } = await import("./_libs/html-to-image.mjs");
      const dataUrl = await toPng(storyRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff"
      });
      const link = document.createElement("a");
      link.download = `netodash-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.png`;
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
  const initialPreset = search.from && search.to ? "custom" : "today";
  const initialRange = search.from && search.to ? {
    from: search.from,
    to: search.to
  } : null;
  const [preset, setPreset] = reactExports.useState(initialPreset);
  const [customRange, setCustomRange] = reactExports.useState(initialRange);
  const [productId, setProductId] = reactExports.useState(search.product ?? "");
  const [showLastEntry, setShowLastEntry] = reactExports.useState(!!search.highlight);
  reactExports.useEffect(() => {
    if (search.from && search.to) {
      setPreset("custom");
      setCustomRange({
        from: search.from,
        to: search.to
      });
    }
    if (search.product) setProductId(search.product);
    if (search.highlight) setShowLastEntry(true);
  }, [search.from, search.to, search.product, search.highlight]);
  const rawRange = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const sub = useSubscription(user?.id);
  const historyDays = historyDaysFor(sub.plan);
  const range = reactExports.useMemo(() => {
    if (!historyDays) return rawRange;
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - historyDays + 1);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return {
      ...rawRange,
      from: rawRange.from < cutoffStr ? cutoffStr : rawRange.from
    };
  }, [rawRange, historyDays]);
  const historyTruncated = !!historyDays && range.from !== rawRange.from;
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range, productId || void 0);
  const {
    mode: activeMode,
    currency: modeCurrency
  } = useActiveMode();
  const profileCurrency = modeCurrency;
  const {
    fx: dropshippingFx,
    codUsdToXofRate
  } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];
  const currency = profileCurrency;
  const kpis = reactExports.useMemo(() => computeKPIs(entries, products, currency, dropshippingFx, metaTaxPct), [entries, products, currency, dropshippingFx, metaTaxPct]);
  const dailySeries = reactExports.useMemo(() => computeDailySeries(entries, products, productId || null, currency, dropshippingFx, metaTaxPct), [entries, products, productId, currency, dropshippingFx, metaTaxPct]);
  const selectedProduct = productId ? products.find((p) => p.id === productId) : null;
  const roasTrend = computeTrend(dailySeries.map((s) => s.roas));
  const productRanking = reactExports.useMemo(() => computeProductRanking(entries, products, currency, dropshippingFx, metaTaxPct), [entries, products, currency, dropshippingFx, metaTaxPct]);
  productRanking.filter((r) => r.kpis.netProfit > 0 && Math.abs(r.marginPct) >= 2).length;
  productRanking.filter((r) => Math.abs(r.marginPct) < 2 && r.kpis.adSpend > 0).length;
  const toKill = productRanking.filter((r) => r.kpis.netProfit < 0).length;
  const showDecisionEngine = activeMode === "dropshipping" && canUseDecisionEngine(sub.plan);
  const marginPct = kpis.revenue > 0 ? kpis.netProfit / kpis.revenue * 100 : 0;
  const beRoas = reactExports.useMemo(() => breakEvenRoas(productId ? products.filter((p) => p.id === productId) : products), [products, productId]);
  const daysInRange = Math.max(1, Math.round((new Date(range.to).getTime() - new Date(range.from).getTime()) / 864e5) + 1);
  const weeklyProfit = kpis.netProfit / daysInRange * 7;
  const chartData = reactExports.useMemo(() => {
    const sorted = dailySeries.map((s) => ({
      date: s.date,
      profit: s.netProfit,
      revenue: s.revenue,
      spend: s.adSpend + s.metaTax
    }));
    if (sorted.length === 0) return [];
    const from = preset === "all" ? sorted[0].date : range.from;
    const to = preset === "all" ? sorted[sorted.length - 1].date : range.to;
    return fillDailySeries(sorted, from, to, (date) => ({
      date,
      profit: 0,
      revenue: 0,
      spend: 0
    }));
  }, [dailySeries, range.from, range.to, preset]);
  const hasData = entries.length > 0;
  const verdictKind = reactExports.useMemo(() => profitVerdictKind(kpis.netProfit, kpis.revenue, hasData), [kpis.netProfit, kpis.revenue, hasData]);
  const dropAlerts = reactExports.useMemo(() => {
    const a = [];
    if (hasData && kpis.netProfit < 0) {
      a.push({
        kind: "loss",
        title: "Période en perte",
        message: `Profit net ${formatCurrency(kpis.netProfit, currency)} — vérifie le ROAS et tes top dépenses.`,
        cta: {
          label: "Voir produits",
          to: "/products"
        }
      });
    }
    if (hasData && kpis.adSpend > 0 && kpis.roas < beRoas && beRoas > 0) {
      a.push({
        kind: "warn",
        title: "ROAS sous le seuil de rentabilité",
        message: `Actuel ${kpis.roas.toFixed(2)}x · break-even ${beRoas.toFixed(2)}x`
      });
    }
    if (showDecisionEngine && toKill > 0) {
      a.push({
        kind: "warn",
        title: `${toKill} produit${toKill > 1 ? "s" : ""} à arrêter`,
        message: "Profit net négatif sur la période. Coupe la pub ou ajuste le prix."
      });
    }
    return a;
  }, [hasData, kpis, beRoas, toKill, currency, showDecisionEngine]);
  if (activeMode === "cod") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodPicker, { value: preset, onChange: (p) => {
          setPreset(p);
          if (p !== "custom") setCustomRange(null);
        }, customRange, onCustomChange: setCustomRange }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRefresh, disabled: refreshing, className: "brutal-border-thin bg-background px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: refreshing ? "inline-block animate-spin mr-1" : "inline-block mr-1", children: "↻" }),
          "Rafraîchir"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardCod, { entries, products, currency, range, productId, setProductId, usdToXofRate: codUsdToXofRate, metaTaxPct })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10", children: [
    historyTruncated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-accent bg-accent/5 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest text-accent mr-2", children: "PLAN FREE" }),
        "Historique limité aux ",
        historyDays,
        " derniers jours."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:border-accent", children: "Débloquer →" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden mb-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none", children: "DASHBOARD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black tracking-tighter mt-0.5", children: "RENTABILITÉ" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRefresh, disabled: refreshing, "aria-label": "Rafraîchir", className: "brutal-border-thin bg-background px-3 py-2 text-base font-black active:bg-foreground/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: refreshing ? "inline-block animate-spin" : "inline-block", children: "↻" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCapture, disabled: capturing, "aria-label": "Partager", className: "brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-black uppercase tracking-widest", children: capturing ? "…" : "📸 Share" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: productId, onChange: (e) => setProductId(e.target.value), className: "w-full brutal-border-thin bg-background px-3 py-2 text-xs uppercase tracking-widest font-bold focus:outline-none focus:border-accent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "TOUS LES PRODUITS" }),
        products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-4 px-4 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodPicker, { value: preset, onChange: (p) => {
        setPreset(p);
        if (p !== "custom") setCustomRange(null);
      }, customRange, onCustomChange: setCustomRange }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "DASHBOARD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "RENTABILITÉ RÉELLE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: productId, onChange: (e) => setProductId(e.target.value), className: "brutal-border-thin bg-background px-3 py-2 text-xs uppercase tracking-widest font-bold focus:outline-none focus:border-accent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "TOUS LES PRODUITS" }),
          products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodPicker, { value: preset, onChange: (p) => {
          setPreset(p);
          if (p !== "custom") setCustomRange(null);
        }, customRange, onCustomChange: setCustomRange })
      ] })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardInsights, { topProducts: productRanking.slice(0, 3).map((r) => ({
      id: r.product.id,
      name: r.product.name,
      netProfit: r.kpis.netProfit
    })), alerts: dropAlerts, currency, onSelectProduct: setProductId }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: storyRef, className: "md:hidden bg-background brutal-border mb-4 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 text-white relative overflow-hidden", style: {
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/netodash-logo.png", alt: "", className: "w-7 h-7 object-contain bg-white p-0.5 rounded-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black tracking-tight text-sm", children: "NETODASH" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-[0.2em] opacity-80", children: "DROPSHIPPING" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest opacity-90 text-right", children: range.from === range.to ? range.from : `${range.from}
→ ${range.to}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20", style: {
          background: "radial-gradient(circle, #fff 0%, transparent 70%)"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 flex items-center justify-between border-b border-foreground bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.15em] brutal-border-thin ${profitVerdictBadgeClass(verdictKind)}`, children: profitVerdictLabel(verdictKind) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: [
          "ROAS ",
          kpis.adSpend > 0 ? kpis.roas.toFixed(2) + "x" : "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1", children: "MARGE NETTE RÉELLE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-5xl font-black tabular tracking-tighter break-words leading-none ${profitVerdictTextClass(verdictKind)}`, children: formatCurrency(kpis.netProfit, currency) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: [
          "CA ",
          formatCurrency(kpis.revenue, currency),
          " · ",
          kpis.shopifyOrders,
          " CMD"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Coûts produits livrés" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
              "− ",
              formatCurrency(kpis.cogs, currency)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dont expédition" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular text-foreground font-bold", children: formatCurrency(kpis.shippingCost, currency) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pub (ads)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
              "− ",
              formatCurrency(kpis.adSpend, currency)
            ] })
          ] }),
          kpis.metaTax > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Taxe Meta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
              "− ",
              formatCurrency(kpis.metaTax, currency)
            ] })
          ] }),
          kpis.shopifyFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frais Shopify" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
              "− ",
              formatCurrency(kpis.shopifyFees, currency)
            ] })
          ] }),
          kpis.waveFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frais Wave" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
              "− ",
              formatCurrency(kpis.waveFees, currency)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2", children: [{
        label: "ROAS RÉEL",
        value: kpis.adSpend > 0 ? kpis.roas.toFixed(2) : "—",
        sub: `PUB ${formatCurrency(kpis.adSpend, currency)}`
      }, {
        label: "COMMANDES",
        value: formatNumber(kpis.shopifyOrders),
        sub: "PAYÉES"
      }, {
        label: "CA ENCAISSÉ",
        value: formatCurrency(kpis.revenue, currency),
        sub: `${kpis.shopifyOrders} CMD`
      }, {
        label: "PANIER MOYEN",
        value: formatCurrency(kpis.shopifyOrders > 0 ? kpis.revenue / kpis.shopifyOrders : 0, currency),
        sub: "CA / CMD"
      }, {
        label: "COÛT D'ACQUISITION",
        value: formatCurrency(kpis.shopifyOrders > 0 ? (kpis.adSpend + kpis.metaTax) / kpis.shopifyOrders : 0, currency),
        sub: "PUB / CMD"
      }, {
        label: "MARGE / CMD",
        value: formatCurrency(kpis.shopifyOrders > 0 ? kpis.netProfit / kpis.shopifyOrders : 0, currency),
        sub: "PROFIT NET / CMD"
      }].map((k, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 border-foreground ${i % 2 === 0 ? "border-r" : ""} ${i < 4 ? "border-b" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest font-bold text-muted-foreground leading-tight", children: k.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black tabular tracking-tight mt-1 break-words leading-tight", children: k.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5 truncate", children: k.sub })
      ] }, k.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 text-white text-center", style: {
        background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-[11px] uppercase tracking-[0.25em]", children: "netodash.com · Pilote ton e-commerce" }) })
    ] }),
    showLastEntry && hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border bg-background p-5 md:p-6 mb-6 flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[260px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: "✓ DERNIÈRE SAISIE — RÉSUMÉ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${profitVerdictBadgeClass(verdictKind)}`, children: profitVerdictLabel(verdictKind) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg md:text-xl font-black uppercase tracking-tight mb-3", children: [
          selectedProduct ? selectedProduct.name : "Tous produits",
          " · ",
          range.from === range.to ? range.from : `${range.from} → ${range.to}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70 uppercase tracking-widest", children: "Commandes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold tabular text-base", children: kpis.shopifyOrders })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70 uppercase tracking-widest", children: "CA encaissé" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold tabular text-base", children: formatCurrency(kpis.revenue, currency) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70 uppercase tracking-widest", children: "Pub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold tabular text-base", children: formatCurrency(kpis.adSpend, currency) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70 uppercase tracking-widest", children: "Marge nette" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-bold tabular text-base ${profitVerdictTextClass(verdictKind)}`, children: formatCurrency(kpis.netProfit, currency) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setShowLastEntry(false);
        navigate({
          search: {
            highlight: void 0,
            product: search.product,
            from: search.from,
            to: search.to
          },
          replace: true
        });
      }, className: "text-[10px] uppercase tracking-widest font-bold px-3 py-2 brutal-border-thin border-current hover:bg-current/10", children: "Fermer" })
    ] }),
    !hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-10 text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black mb-3", children: "AUCUNE DONNÉE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Crée d'abord un produit, puis saisis tes commandes du jour." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products", className: "brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent", children: "+ Créer un produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/entries", className: "brutal-border px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background", children: "Saisir des données" })
      ] })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 md:p-7 mb-0 brutal-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2", children: [
        "VERDICT ",
        selectedProduct ? `· ${selectedProduct.name}` : "· TOUS PRODUITS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-3 py-1.5 text-sm md:text-base font-black uppercase tracking-widest brutal-border-thin ${profitVerdictBadgeClass(verdictKind)}`, children: profitVerdictLabel(verdictKind) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 font-mono text-sm text-muted-foreground", children: [
        "Marge nette",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold tabular ${profitVerdictTextClass(verdictKind)}`, children: formatCurrency(kpis.netProfit, currency) }),
        " · ",
        "ROAS ",
        kpis.adSpend > 0 ? kpis.roas.toFixed(2) + "x" : "—"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-tour": "dashboard-kpis", className: "hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 brutal-border mb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 lg:col-span-2 brutal-border-thin border-0 md:border-r border-foreground p-5 md:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "MARGE NETTE RÉELLE" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tabular tracking-tighter break-words ${profitVerdictTextClass(verdictKind)}`, children: formatCurrency(kpis.netProfit, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs font-mono uppercase tracking-wider text-muted-foreground", children: [
            "CA ",
            formatCurrency(kpis.revenue, currency),
            " − Coûts ",
            formatCurrency(kpis.revenue - kpis.netProfit, currency)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Coûts produits livrés" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
                "− ",
                formatCurrency(kpis.cogs, currency)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dont expédition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular text-foreground font-bold", children: formatCurrency(kpis.shippingCost, currency) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pub (ads)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
                "− ",
                formatCurrency(kpis.adSpend, currency)
              ] })
            ] }),
            kpis.metaTax > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Taxe Meta" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
                "− ",
                formatCurrency(kpis.metaTax, currency)
              ] })
            ] }),
            kpis.shopifyFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frais Shopify (2.9%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
                "− ",
                formatCurrency(kpis.shopifyFees, currency)
              ] })
            ] }),
            kpis.waveFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dashed border-muted-foreground/30 pb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frais Wave (1%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-foreground font-bold", children: [
                "− ",
                formatCurrency(kpis.waveFees, currency)
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "ROAS RÉEL", value: kpis.adSpend > 0 ? kpis.roas.toFixed(2) : "—", sublabel: `PUB ${formatCurrency(kpis.adSpend, currency)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "COMMANDES", value: formatNumber(kpis.shopifyOrders), sublabel: "PAYÉES" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-2 md:grid-cols-4 gap-0 brutal-border border-t-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "CA ENCAISSÉ", value: formatCurrency(kpis.revenue, currency), sublabel: `${kpis.shopifyOrders} CMD`, className: "border-r border-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "PANIER MOYEN", value: formatCurrency(kpis.shopifyOrders > 0 ? kpis.revenue / kpis.shopifyOrders : 0, currency), sublabel: "CA / COMMANDE", className: "border-r border-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "COÛT D'ACQUISITION", value: formatCurrency(kpis.shopifyOrders > 0 ? (kpis.adSpend + kpis.metaTax) / kpis.shopifyOrders : 0, currency), sublabel: "PUB / CMD", className: "border-r border-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "MARGE / CMD", value: formatCurrency(kpis.shopifyOrders > 0 ? kpis.netProfit / kpis.shopifyOrders : 0, currency), sublabel: "PROFIT NET / CMD" })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 brutal-border border-t-0", children: [
      daysInRange >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "PROFIT 7J", value: formatCurrency(weeklyProfit, currency), sublabel: "MOYENNE × 7", className: "border-r border-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "PROFIT MARGIN", value: `${marginPct.toFixed(1)}%`, sublabel: "NET / CA", className: "border-r border-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "BREAK-EVEN ROAS", value: beRoas > 0 ? beRoas.toFixed(2) : "—", sublabel: "SEUIL RENTABILITÉ", className: kpis.upsellUnits > 0 ? "border-r border-foreground" : "" }),
      kpis.upsellUnits > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "BÉNÉFICE UPSELL", value: formatCurrency(kpis.upsellMargin, currency), sublabel: `${kpis.upsellUnits} UNITÉ${kpis.upsellUnits > 1 ? "S" : ""} VENDUE${kpis.upsellUnits > 1 ? "S" : ""}` })
    ] }),
    hasData && showDecisionEngine && productRanking.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-t-0 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6 flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl font-black uppercase tracking-tight", children: "PRODUCT PROFIT RANKING" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground", children: "TRIÉ PAR PROFIT NET" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full font-mono text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "PRODUIT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "CA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PUB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PROFIT NET" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "MARGE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "ROAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center p-3", children: "STATUS" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: productRanking.map((r, i) => {
          const rowVerdict = profitVerdictKind(r.kpis.netProfit, r.kpis.revenue, r.kpis.adSpend > 0 || r.kpis.revenue > 0);
          const statusLabel = profitVerdictLabel(rowVerdict);
          const statusIcon = rowVerdict === "break_even" ? "≈" : rowVerdict === "profit" ? "✓" : rowVerdict === "loss" ? "✕" : "—";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-foreground hover:bg-foreground/5 cursor-pointer", onClick: () => setProductId(r.product.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold tabular text-muted-foreground", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold uppercase tracking-tight", children: r.product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: formatCurrency(r.kpis.revenue, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular text-accent", children: formatCurrency(r.kpis.adSpend, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `p-3 text-right tabular font-black ${profitVerdictTextClass(rowVerdict)}`, children: formatCurrency(r.kpis.netProfit, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right tabular", children: [
              r.marginPct.toFixed(1),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: r.kpis.adSpend > 0 ? r.kpis.roas.toFixed(2) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${profitVerdictBadgeClass(rowVerdict)}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: statusIcon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: statusLabel })
            ] }) })
          ] }, r.product.id);
        }) })
      ] }) })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-t-0 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black uppercase tracking-tight", children: "DÉCOMPOSITION DU CALCUL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground", children: range.from === range.to ? `JOUR ${range.from}` : `${range.from} → ${range.to}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 font-mono text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "CA Encaissé (Livrées × Prix)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular", children: [
            "+ ",
            formatCurrency(kpis.revenue, currency)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Budget Pub" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
            "− ",
            formatCurrency(kpis.adSpend, currency)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Coûts produits livrés (Cmd × achat + expé)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
            "− ",
            formatCurrency(kpis.cogs, currency)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Dont expédition déjà incluse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold tabular", children: formatCurrency(kpis.shippingCost, currency) })
        ] }),
        kpis.metaTax > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Taxe Meta Ads (",
            formatNumber(metaTaxPct, 0),
            "% du budget pub)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
            "− ",
            formatCurrency(kpis.metaTax, currency)
          ] })
        ] }),
        kpis.shopifyFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Frais Shopify/Stripe (2,9% du CA)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
            "− ",
            formatCurrency(kpis.shopifyFees, currency)
          ] })
        ] }),
        kpis.waveFees > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Frais Wave (1% du CA)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
            "− ",
            formatCurrency(kpis.waveFees, currency)
          ] })
        ] }),
        (kpis.refundedOrders > 0 || kpis.refundedAmount > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-foreground/20 py-2 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Remboursements",
            kpis.refundedOrders > 0 && ` · ↩ ${kpis.refundedOrders} remb.`,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] uppercase tracking-widest", children: "(déjà déduit du CA)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
            "− ",
            formatCurrency(kpis.refundedAmount, currency)
          ] })
        ] }),
        kpis.upsellUnits > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 mt-2 p-3 border-2 border-dashed border-foreground/40 bg-foreground/[0.02]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2", children: [
            "Détail Upsell / cadeau (",
            kpis.upsellUnits,
            " unité",
            kpis.upsellUnits > 1 ? "s" : "",
            ") — inclus dans CA & coût produit livré"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "CA upsell" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular", children: [
                "+ ",
                formatCurrency(kpis.upsellRevenue, currency)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Coût livré upsell/cadeau" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular text-accent", children: [
                "− ",
                formatCurrency(kpis.upsellCogs, currency)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase", children: "↳ Marge upsell" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-black tabular ${kpis.upsellMargin < 0 ? "text-accent" : "text-[#16a34a]"}`, children: formatCurrency(kpis.upsellMargin, currency) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b-2 border-foreground py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase", children: "= Marge Nette Réelle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-black tabular text-lg ${profitVerdictTextClass(verdictKind)}`, children: formatCurrency(kpis.netProfit, currency) })
        ] })
      ] })
    ] }),
    selectedProduct && dailySeries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-t-0 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-4 flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black uppercase tracking-tight", children: "ÉVOLUTION JOUR PAR JOUR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "ROAS ",
          trendArrow(roasTrend)
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full font-mono text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "JOUR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "DATE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PUB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "CA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PROFIT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "ROAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "CMD" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: dailySeries.map((s, i) => {
          const prev = i > 0 ? dailySeries[i - 1] : null;
          const profitArrow = prev ? s.netProfit > prev.netProfit ? "↑" : s.netProfit < prev.netProfit ? "↓" : "→" : "";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-foreground hover:bg-foreground/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 font-bold", children: [
              "J",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 tabular text-muted-foreground", children: s.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: formatCurrency(s.adSpend, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: formatCurrency(s.revenue, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `p-3 text-right tabular font-bold ${profitVerdictTextClass(profitVerdictKind(s.netProfit, s.revenue, s.adSpend > 0 || s.revenue > 0))}`, children: [
              formatCurrency(s.netProfit, currency),
              " ",
              profitArrow
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: s.adSpend > 0 ? s.roas.toFixed(2) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: s.shopifyOrders })
          ] }, s.date);
        }) })
      ] }) })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-t-0 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6 flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black uppercase tracking-tight", children: "ÉVOLUTION DU PROFIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground", children: [
          chartData.length,
          " ",
          chartData.length > 1 ? "JOURS" : "JOUR",
          chartData.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " · ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold tabular ${profitVerdictTextClass(verdictKind)}`, children: [
              "TOTAL ",
              formatCurrency(kpis.netProfit, currency)
            ] })
          ] })
        ] })
      ] }),
      chartData.length === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-foreground/30 p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2", children: "UN SEUL JOUR DE DONNÉES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Saisis les jours suivants ou élargis la période pour voir l'évolution." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "100%",
        height: 280
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, margin: {
        top: 10,
        right: 10,
        left: 0,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "profitFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#FF4500", stopOpacity: 0.4 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#FF4500", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "2 4", stroke: "hsl(var(--foreground) / 0.15)", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "hsl(var(--muted-foreground))", tick: {
          fontSize: 11,
          fontFamily: "JetBrains Mono"
        }, tickFormatter: (d) => {
          const [, m, day] = d.split("-");
          return `${day}/${m}`;
        }, minTickGap: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "hsl(var(--muted-foreground))", tick: {
          fontSize: 11,
          fontFamily: "JetBrains Mono"
        }, tickFormatter: (v) => Math.abs(v) >= 1e3 ? Math.round(v / 1e3) + "K" : String(v), width: 50 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "hsl(var(--background))",
          border: "2px solid hsl(var(--foreground))",
          borderRadius: 0,
          fontFamily: "JetBrains Mono",
          fontSize: 12
        }, formatter: (v, name) => [formatCurrency(v, currency), name], labelFormatter: (d) => {
          const [y, m, day] = String(d).split("-");
          return `${day}/${m}/${y}`;
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceLine, { y: 0, stroke: "hsl(var(--foreground))", strokeWidth: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "profit", stroke: "#FF4500", strokeWidth: 2.5, fill: "url(#profitFill)", dot: {
          fill: "#FF4500",
          r: 3
        }, activeDot: {
          r: 5
        }, name: "Profit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "hsl(var(--foreground))", strokeWidth: 1.5, fill: "transparent", dot: false, name: "CA" })
      ] }) }) })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 brutal-border p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2", children: "VERDICT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-3 py-1.5 text-2xl md:text-3xl font-black uppercase tracking-tight brutal-border-thin ${profitVerdictBadgeClass(verdictKind)}`, children: profitVerdictLabel(verdictKind) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1", children: "Marge nette" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl md:text-3xl font-black tabular tracking-tight ${profitVerdictTextClass(verdictKind)}`, children: formatCurrency(kpis.netProfit, currency) })
      ] })
    ] })
  ] });
}
export {
  DashboardPage as component
};
