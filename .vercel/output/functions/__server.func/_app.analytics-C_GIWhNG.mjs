import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useSubscription } from "./_ssr/use-subscription-BHAI1fRK.mjs";
import { u as useActiveMode, c as useProfile, a as useProducts, b as useEntries } from "./_ssr/queries-BVXaOG3h.mjs";
import { a as CodPlanCard, D as DropshippingPlanCards } from "./_ssr/PlanCards-BVPvVBqx.mjs";
import { P as PeriodPicker } from "./_ssr/PeriodPicker-iXK3dC-J.mjs";
import { R as Root2, L as List, C as Content, T as Trigger } from "./_libs/radix-ui__react-tabs.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { u as useDropshippingFx } from "./_ssr/use-dropshipping-fx-BU2EJUFO.mjs";
import { d as dateRangeForPreset, c as computeKPIs, g as computeDailySeries, f as formatCurrency, e as formatNumber, k as fillDailySeries } from "./_ssr/calc-DHAnOS6I.mjs";
import { c as convertDropshippingCurrency } from "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { i as canExportCsv } from "./_ssr/plan-limits-BrKNWLKd.mjs";
import "./_libs/sonner.mjs";
import "./_libs/stripe.mjs";
import { R as ResponsiveContainer, L as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, c as Legend, d as Line } from "./_libs/recharts.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
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
import "crypto";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "./_libs/zod.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "events";
import "http";
import "https";
import "os";
import "./_ssr/popover-Dkn3wT7t.mjs";
import "./_ssr/button-DWfIo_Ug.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
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
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/tailwind-merge.mjs";
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
function Paywall({ variant, trialDaysLeft }) {
  if (variant === "trial-expired") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-accent p-6 mb-6 bg-accent/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-accent mb-1", children: "ESSAI TERMINÉ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black tracking-tight", children: "Choisis un plan pour continuer à utiliser NETODASH" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3", children: "Je fais du COD uniquement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CodPlanCard, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3", children: "Je fais du Dropshipping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropshippingPlanCards, { highlightPro: true })
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-accent p-6 md:p-8 bg-accent/[0.06] relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 px-3 py-1 bg-accent text-accent-foreground text-[10px] uppercase tracking-widest font-mono font-bold", children: "🔒 Accès bloqué" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-accent mb-2 mt-2", children: "ANALYTICS PRO · EXCLUSIF AU PLAN SCALE ($79)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter mb-3", children: [
        "TON PLAN ACTUEL N'A PAS ACCÈS",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "À ANALYTICS PRO"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground max-w-2xl", children: [
        "Tu vois les chiffres bruts, mais pas ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "la lecture qui transforme un test en winner" }),
        ". Passe au plan ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Scale" }),
        " pour débloquer le hub de rentabilité avancée."
      ] }),
      trialDaysLeft != null && trialDaysLeft <= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-accent mt-4 font-bold", children: [
        "⚠ Ton essai gratuit se termine dans ",
        trialDaysLeft,
        " jour",
        trialDaysLeft > 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-foreground/20 bg-foreground/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-mono font-bold text-muted-foreground", children: "CE QUE TU LOUPES SANS ANALYTICS PRO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl md:text-2xl font-black tracking-tighter mt-1", children: "6 perspectives qui font passer du chiffre à la décision" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-foreground/10", children: [
        {
          icon: "🏆",
          title: "Score de rentabilité",
          desc: "Chaque produit noté 0-100 selon marge nette, ROAS vs break-even, € profit / € pub et taux de remboursement. Winners et losers identifiés en un coup d'œil."
        },
        {
          icon: "💰",
          title: "Waterfall du bénéfice",
          desc: "Visualise où part chaque euro : CA → COGS → pub → frais → bénéfice net. Tu sais EXACTEMENT quel coût tue ta rentabilité."
        },
        {
          icon: "📈",
          title: "Tendances & cohortes",
          desc: "Comparaison période vs précédente, heatmap des jours profitables, streaks. Détecte les patterns invisibles dans le chiffre brut."
        },
        {
          icon: "🎯",
          title: "Break-even par produit",
          desc: "ROAS minimum et CPA max calculés produit par produit. Tu sais à partir de quel chiffre tu deviens rentable, ou tu coules."
        },
        {
          icon: "🧪",
          title: "Simulateur de scénarios",
          desc: "« Si je passe le budget de 50 à 200 € avec un CPA de 12 € → bénéfice net projeté = X ». Décide avant de cramer le budget."
        },
        {
          icon: "🚨",
          title: "Insights & alertes auto",
          desc: "« Ton ROAS chute de 30 % sur 7j », « Produit Y est scaling-ready », « 60 % du budget va sur le pire produit ». Le raisonnement est déjà fait pour toi."
        }
      ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: f.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-black tracking-tight uppercase", children: f.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: f.desc })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-3", children: [
      { kpi: "+38%", label: "de marge nette en moyenne pour les users qui suivent les Insights" },
      { kpi: "−2h/j", label: "de temps perdu à reconstruire les calculs dans un tableur" },
      { kpi: "0 €", label: "cramé sur un produit que le score avait flaggé loser" }
    ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black tracking-tighter text-accent", children: p.kpi }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-muted-foreground mt-1", children: p.label })
    ] }, p.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3", children: "→ Choisis ton plan pour débloquer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropshippingPlanCards, { highlightPro: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-5 text-xs font-mono text-muted-foreground", children: [
      "💡 Les plans ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Starter" }),
      " et ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Pro" }),
      " restent pleins d'outils utiles : Dashboard, Produits, Saisies, ROAS net, Calculateur. Analytics Pro vise ceux qui scalent plusieurs produits en parallèle et veulent une lecture experte de leurs chiffres."
    ] })
  ] });
}
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function rankProducts(products, entries, currency, fx, metaTaxPct = 0) {
  return products.map((p) => {
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
    const grossMarginPct = sale > 0 ? (sale - landedCost) / sale : 0;
    const breakEvenRoas = grossMarginPct > 0 ? 1 / grossMarginPct : 0;
    let score = 50;
    if (kpis.shopifyOrders === 0 && totalAd === 0) {
      return { product: p, kpis, marginPct, unitMargin, aov, costPerOrder, refundRate, profitPerAdEuro, breakEvenRoas, score: 0, verdict: "no-data" };
    }
    score += Math.min(30, marginPct * 100);
    score += Math.min(20, profitPerAdEuro * 10);
    score -= Math.min(20, refundRate * 100);
    if (kpis.roas > breakEvenRoas && breakEvenRoas > 0) score += 10;
    if (kpis.netProfit < 0) score -= 30;
    score = Math.max(0, Math.min(100, Math.round(score)));
    const verdict = score >= 65 ? "winner" : score >= 40 ? "watch" : "loser";
    return { product: p, kpis, marginPct, unitMargin, aov, costPerOrder, refundRate, profitPerAdEuro, breakEvenRoas, score, verdict };
  }).sort((a, b) => b.kpis.netProfit - a.kpis.netProfit);
}
function computeBreakdown(kpis) {
  const rev = kpis.revenue;
  const pct = (v) => rev > 0 ? v / rev : 0;
  const steps = [
    { label: "Chiffre d'affaires", value: rev, kind: "revenue", pctOfRevenue: 1 },
    { label: "Coûts produits livrés", value: -kpis.cogs, kind: "cost", pctOfRevenue: -pct(kpis.cogs) },
    { label: "Dépense publicitaire", value: -kpis.adSpend, kind: "cost", pctOfRevenue: -pct(kpis.adSpend) },
    { label: "Taxe Meta", value: -kpis.metaTax, kind: "cost", pctOfRevenue: -pct(kpis.metaTax) },
    { label: "Frais Shopify/Stripe", value: -kpis.shopifyFees, kind: "cost", pctOfRevenue: -pct(kpis.shopifyFees) },
    { label: "Frais Wave (COD)", value: -kpis.waveFees, kind: "cost", pctOfRevenue: -pct(kpis.waveFees) },
    { label: "Remboursés", value: -kpis.refundedAmount, kind: "cost", pctOfRevenue: -pct(kpis.refundedAmount) }
  ];
  let cum = 0;
  const result = steps.map((s) => {
    cum += s.value;
    return { ...s, cumulative: cum };
  });
  result.push({
    label: "Bénéfice net",
    value: kpis.netProfit,
    cumulative: kpis.netProfit,
    pctOfRevenue: pct(kpis.netProfit),
    kind: "result"
  });
  return result;
}
function previousRange(range) {
  const from = /* @__PURE__ */ new Date(range.from + "T00:00:00");
  const to = /* @__PURE__ */ new Date(range.to + "T00:00:00");
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 864e5) + 1);
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - (days - 1));
  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  return { from: toISO(prevFrom), to: toISO(prevTo) };
}
function deltaPct(current, previous) {
  if (previous === 0) {
    if (current === 0) return 0;
    return null;
  }
  return (current - previous) / Math.abs(previous);
}
function longestProfitableStreak(daily) {
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
function currentStreak(daily) {
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
function generateInsights(args) {
  const out = [];
  const { rankings, globalKpis, prevKpis, dailyGlobal, entries } = args;
  const dRoas = deltaPct(globalKpis.roas, prevKpis.roas);
  if (dRoas != null && dRoas <= -0.2 && globalKpis.adSpend > 0) {
    out.push({
      id: "roas-drop",
      severity: "warning",
      title: `ROAS en baisse de ${Math.round(Math.abs(dRoas) * 100)}%`,
      body: `Ton ROAS global a chuté vs la période précédente (${prevKpis.roas.toFixed(2)} → ${globalKpis.roas.toFixed(2)}). Vérifie les créas qui fatiguent.`
    });
  }
  if (dRoas != null && dRoas >= 0.2 && globalKpis.adSpend > 0) {
    out.push({
      id: "roas-up",
      severity: "good",
      title: `ROAS en hausse de ${Math.round(dRoas * 100)}%`,
      body: `Bonne dynamique vs période précédente. Si la tendance tient 2-3 jours, c'est un signal scale.`
    });
  }
  const winners = rankings.filter((r) => r.verdict === "winner");
  const losers = rankings.filter((r) => r.verdict === "loser" && r.kpis.adSpend > 0);
  for (const w of winners.slice(0, 2)) {
    out.push({
      id: `winner-${w.product.id}`,
      severity: "good",
      title: `${w.product.name} : candidat scale`,
      body: `Score ${w.score}/100, marge ${(w.marginPct * 100).toFixed(0)}%, ${w.profitPerAdEuro.toFixed(2)}€ de bénéfice par € de pub. Tu peux augmenter le budget progressivement (+20%/jour).`,
      actionLabel: "Voir le produit",
      actionTo: `/products`
    });
  }
  for (const l of losers.slice(0, 2)) {
    out.push({
      id: `loser-${l.product.id}`,
      severity: "danger",
      title: `${l.product.name} : à couper`,
      body: `Score ${l.score}/100, ROAS ${l.kpis.roas.toFixed(2)} (break-even ${l.breakEvenRoas.toFixed(2)}). Tu perds de l'argent sur chaque commande.`,
      actionLabel: "Voir le produit",
      actionTo: `/products`
    });
  }
  for (const r of rankings) {
    if (r.refundRate > 0.08 && r.kpis.shopifyOrders >= 5) {
      out.push({
        id: `refund-${r.product.id}`,
        severity: "warning",
        title: `${r.product.name} : ${(r.refundRate * 100).toFixed(0)}% de remboursements`,
        body: `Au-dessus de 8%, vérifie la qualité produit, le délai de livraison ou la description.`
      });
    }
  }
  if (rankings.length >= 2 && globalKpis.adSpend > 0 && globalKpis.netProfit > 0) {
    for (const r of rankings) {
      const adShare = (r.kpis.adSpend + r.kpis.metaTax) / (globalKpis.adSpend + globalKpis.metaTax);
      const profitShare = r.kpis.netProfit > 0 ? r.kpis.netProfit / globalKpis.netProfit : 0;
      if (adShare > 0.3 && profitShare < adShare - 0.2) {
        out.push({
          id: `misalloc-${r.product.id}`,
          severity: "warning",
          title: `${r.product.name} : pub mal allouée`,
          body: `Ce produit consomme ${(adShare * 100).toFixed(0)}% de ton budget pub mais ne génère que ${(profitShare * 100).toFixed(0)}% du bénéfice. Rééquilibre.`
        });
      }
    }
  }
  const streak = currentStreak(dailyGlobal);
  if (streak.kind === "profit" && streak.days >= 5) {
    out.push({
      id: "streak-profit",
      severity: "good",
      title: `${streak.days} jours rentables d'affilée 🚀`,
      body: `Momentum solide. C'est le bon moment pour tester une augmentation de budget.`
    });
  }
  if (streak.kind === "loss" && streak.days >= 3) {
    out.push({
      id: "streak-loss",
      severity: "danger",
      title: `${streak.days} jours de perte d'affilée`,
      body: `Pause et audit nécessaire : créas, ciblage, prix, fournisseur. Ne laisse pas filer.`
    });
  }
  if (entries.length === 0) {
    out.push({
      id: "no-data",
      severity: "info",
      title: "Pas de saisies sur la période",
      body: "Ajoute tes données dans Saisies pour générer des insights pertinents.",
      actionLabel: "Saisir maintenant",
      actionTo: "/entries"
    });
  } else {
    const lastDate = entries.map((e) => e.entry_date).sort().pop();
    if (lastDate) {
      const last = /* @__PURE__ */ new Date(lastDate + "T00:00:00");
      const days = Math.floor((Date.now() - last.getTime()) / 864e5);
      if (days >= 3) {
        out.push({
          id: "stale-data",
          severity: "warning",
          title: `Aucune saisie depuis ${days} jours`,
          body: `Tes analyses perdent en pertinence sans données fraîches.`,
          actionLabel: "Saisir aujourd'hui",
          actionTo: "/entries"
        });
      }
    }
  }
  return out;
}
function downloadCSV(filename, rows) {
  const csv = rows.map(
    (r) => r.map((c) => {
      const s = String(c ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  ).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
const PALETTE = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0891b2",
  "#ca8a04",
  "#db2777",
  "#65a30d",
  "#7c3aed",
  "#0d9488",
  "#e11d48"
];
const METRICS = [
  { key: "netProfit", label: "Bénéfice net", isCurrency: true },
  { key: "revenue", label: "Chiffre d'affaires", isCurrency: true },
  { key: "adSpend", label: "Dépense pub", isCurrency: true },
  { key: "roas", label: "ROAS" },
  { key: "shopifyOrders", label: "Commandes" }
];
function MetricsView() {
  const { user } = useAuth();
  const [preset, setPreset] = reactExports.useState("yesterday");
  const [customRange, setCustomRange] = reactExports.useState(null);
  const [metric, setMetric] = reactExports.useState("netProfit");
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const isSingleDay = range.from === range.to;
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);
  const { currency } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];
  const productColors = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    products.forEach((p, i) => map.set(p.id, PALETTE[i % PALETTE.length]));
    return map;
  }, [products]);
  const [selected, setSelected] = reactExports.useState(null);
  const selectedSet = selected ?? new Set(products.map((p) => p.id));
  const toggle = (id) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const globalKpis = reactExports.useMemo(() => {
    const filteredProducts = products.filter((p) => selectedSet.has(p.id));
    const filteredEntries = entries.filter(
      (e) => filteredProducts.some((p) => p.id === e.product_id)
    );
    return computeKPIs(filteredEntries, filteredProducts, currency, dropshippingFx, metaTaxPct);
  }, [products, selectedSet, entries, currency, dropshippingFx, metaTaxPct]);
  const chartData = reactExports.useMemo(() => {
    if (products.length === 0) return [];
    const dayMap = /* @__PURE__ */ new Map();
    for (const p of products) {
      if (!selectedSet.has(p.id)) continue;
      const series = computeDailySeries(entries, products, p.id, currency, dropshippingFx, metaTaxPct);
      const filled = fillDailySeries(series, range.from, range.to, (date) => ({
        date,
        revenue: 0,
        adSpend: 0,
        metaTax: 0,
        netProfit: 0,
        roas: 0,
        shopifyOrders: 0,
        notes: null
      }));
      for (const s of filled) {
        if (!dayMap.has(s.date)) dayMap.set(s.date, { date: s.date });
        dayMap.get(s.date)[p.id] = Math.round(Number(s[metric] ?? 0) * 100) / 100;
      }
    }
    return Array.from(dayMap.values()).sort(
      (a, b) => String(a.date).localeCompare(String(b.date))
    );
  }, [products, selectedSet, entries, currency, dropshippingFx, metaTaxPct, range.from, range.to, metric]);
  const productRows = reactExports.useMemo(() => {
    return products.filter((p) => selectedSet.has(p.id)).map((p) => {
      const pEntries = entries.filter((e) => e.product_id === p.id);
      const k = computeKPIs(pEntries, products, currency, dropshippingFx, metaTaxPct);
      const series = computeDailySeries(pEntries, products, p.id, currency, dropshippingFx, metaTaxPct);
      const profitableDays = series.filter((s) => s.netProfit > 0).length;
      const lossDays = series.filter((s) => s.netProfit < 0).length;
      return { product: p, kpis: k, profitableDays, lossDays, totalDays: series.length };
    });
  }, [products, selectedSet, entries, currency, dropshippingFx, metaTaxPct]);
  const dailyAgg = reactExports.useMemo(() => {
    const filteredProducts = products.filter((p) => selectedSet.has(p.id));
    const filteredEntries = entries.filter(
      (e) => filteredProducts.some((p) => p.id === e.product_id)
    );
    return computeDailySeries(filteredEntries, filteredProducts, null, currency, dropshippingFx, metaTaxPct).slice().reverse();
  }, [products, selectedSet, entries, currency, dropshippingFx, metaTaxPct]);
  const fmt = (v) => METRICS.find((m) => m.key === metric)?.isCurrency ? formatCurrency(v, currency) : formatNumber(v, metric === "roas" ? 2 : 0);
  const hasData = entries.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Compare tes produits jour par jour" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PeriodPicker,
        {
          value: preset,
          onChange: setPreset,
          customRange,
          onCustomChange: setCustomRange
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold mb-3", children: [
        "Produits (",
        selectedSet.size,
        "/",
        products.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        products.map((p) => {
          const active = selectedSet.has(p.id);
          const color = productColors.get(p.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => toggle(p.id),
              className: `flex items-center gap-2 px-3 py-1.5 brutal-border-thin text-xs font-bold uppercase tracking-wider ${active ? "bg-foreground text-background" : "bg-background"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { backgroundColor: color, opacity: active ? 1 : 0.3 }
                  }
                ),
                p.name
              ]
            },
            p.id
          );
        }),
        products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Aucun produit. Crée tes produits pour les comparer ici." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiBox,
        {
          label: "Bénéfice net",
          value: formatCurrency(globalKpis.netProfit, currency),
          accent: globalKpis.netProfit > 0 ? "good" : globalKpis.netProfit < 0 ? "bad" : "neutral"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "CA", value: formatCurrency(globalKpis.revenue, currency) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "Pub + taxe", value: formatCurrency(globalKpis.adSpend + globalKpis.metaTax, currency) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "ROAS", value: globalKpis.roas.toFixed(2) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "Commandes", value: formatNumber(globalKpis.shopifyOrders) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "Remboursées", value: formatNumber(globalKpis.refundedOrders) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "Mt remboursé", value: formatCurrency(globalKpis.refundedAmount, currency) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiBox, { label: "Coût/cmd", value: formatCurrency(globalKpis.shopifyOrders > 0 ? (globalKpis.adSpend + globalKpis.metaTax) / globalKpis.shopifyOrders : 0, currency) })
    ] }),
    !isSingleDay && hasData && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: METRICS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setMetric(m.key),
          className: `px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin ${metric === m.key ? "bg-foreground text-background" : "bg-background"}`,
          children: m.label
        },
        m.key
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold mb-3", children: [
          METRICS.find((m) => m.key === metric)?.label,
          " par produit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[380px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: chartData, margin: { top: 8, right: 16, left: 0, bottom: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", tick: { fontSize: 10 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 10 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              formatter: (v) => fmt(Number(v)),
              contentStyle: { fontSize: 12 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: 11 } }),
          products.filter((p) => selectedSet.has(p.id)).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Line,
            {
              type: "monotone",
              dataKey: p.id,
              name: p.name,
              stroke: productColors.get(p.id),
              strokeWidth: 2,
              dot: false
            },
            p.id
          ))
        ] }) }) })
      ] })
    ] }),
    isSingleDay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin p-4 bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground", children: "Graphique masqué : un seul jour sélectionné. Choisis 7J / 30J / Mois pour voir les courbes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin overflow-x-auto bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border", children: "Récap par produit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[800px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Produit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "CA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Pub" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Bénéfice net" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "ROAS" }),
          !isSingleDay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "J. rentables" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "J. perte" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          productRows.map(({ product, kpis, profitableDays, lossDays, totalDays }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-3 h-3 rounded-full shrink-0",
                  style: { backgroundColor: productColors.get(product.id) }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: product.name })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(kpis.revenue, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(kpis.adSpend, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right tabular-nums font-bold ${kpis.netProfit > 0 ? "text-emerald-600" : kpis.netProfit < 0 ? "text-red-600" : ""}`,
                children: formatCurrency(kpis.netProfit, currency)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: kpis.roas.toFixed(2) }),
            !isSingleDay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right tabular-nums text-emerald-600", children: [
                profitableDays,
                "/",
                totalDays
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-red-600", children: lossDays })
            ] })
          ] }, product.id)),
          productRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: isSingleDay ? 5 : 7, className: "px-3 py-6 text-center text-muted-foreground", children: "Pas de données sur cette période" }) })
        ] })
      ] })
    ] }),
    !isSingleDay && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin overflow-x-auto bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border", children: [
        "Détail jour par jour (",
        dailyAgg.length,
        " jours)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[700px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "CA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Pub" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Bénéfice" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "ROAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-center", children: "Verdict" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          dailyAgg.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs", children: d.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(d.revenue, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(d.adSpend, currency) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-3 py-2 text-right tabular-nums font-bold ${d.netProfit > 0 ? "text-emerald-600" : d.netProfit < 0 ? "text-red-600" : ""}`,
                children: formatCurrency(d.netProfit, currency)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: d.roas.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${d.netProfit > 0 ? "bg-emerald-600 text-white" : d.netProfit < 0 ? "bg-red-600 text-white" : "bg-muted"}`,
                children: d.netProfit > 0 ? "Rentable" : d.netProfit < 0 ? "Perte" : "—"
              }
            ) })
          ] }, d.date)),
          dailyAgg.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-3 py-6 text-center text-muted-foreground", children: "Pas de saisies sur cette période" }) })
        ] })
      ] })
    ] })
  ] });
}
function KpiBox({
  label,
  value,
  accent
}) {
  const cls = accent === "good" ? "bg-emerald-600 text-white" : accent === "bad" ? "bg-red-600 text-white" : "bg-card";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-3 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold opacity-80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1 tabular-nums", children: value })
  ] });
}
function OverviewTab({ preset, customRange }) {
  const { user } = useAuth();
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const prev = reactExports.useMemo(() => previousRange(range), [range]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const curEntriesQ = useEntries(user?.id, range);
  const prevEntriesQ = useEntries(user?.id, prev);
  const { currency } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const cur = reactExports.useMemo(
    () => computeKPIs(curEntriesQ.data ?? [], products, currency, dropshippingFx, metaTaxPct),
    [curEntriesQ.data, products, currency, dropshippingFx, metaTaxPct]
  );
  const prevK = reactExports.useMemo(
    () => computeKPIs(prevEntriesQ.data ?? [], products, currency, dropshippingFx, metaTaxPct),
    [prevEntriesQ.data, products, currency, dropshippingFx, metaTaxPct]
  );
  const deltas = [
    { label: "Bénéfice net", cur: cur.netProfit, prev: prevK.netProfit, fmt: (v) => formatCurrency(v, currency) },
    { label: "Chiffre d'affaires", cur: cur.revenue, prev: prevK.revenue, fmt: (v) => formatCurrency(v, currency) },
    { label: "Dépense pub", cur: cur.adSpend + cur.metaTax, prev: prevK.adSpend + prevK.metaTax, fmt: (v) => formatCurrency(v, currency) },
    { label: "ROAS", cur: cur.roas, prev: prevK.roas, fmt: (v) => v.toFixed(2) },
    { label: "Commandes", cur: cur.shopifyOrders, prev: prevK.shopifyOrders, fmt: (v) => formatNumber(v) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: deltas.map((d) => {
      const delta = deltaPct(d.cur, d.prev);
      const arrow = delta == null ? "" : delta > 0.02 ? "▲" : delta < -0.02 ? "▼" : "→";
      const tone = delta == null ? "text-muted-foreground" : delta > 0.02 ? "text-emerald-600" : delta < -0.02 ? "text-red-600" : "text-muted-foreground";
      const isCost = d.label.includes("pub");
      const finalTone = isCost && delta != null ? delta < -0.02 ? "text-emerald-600" : delta > 0.02 ? "text-amber-600" : "text-muted-foreground" : tone;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold opacity-80", children: d.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1 tabular-nums", children: d.fmt(d.cur) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] font-mono mt-1 ${finalTone}`, children: delta == null ? "— vs précédent" : `${arrow} ${(Math.abs(delta) * 100).toFixed(0)}% vs précédent` })
      ] }, d.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MetricsView, {})
  ] });
}
function ProductRankingTab({ preset, customRange }) {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);
  const { currency, mode: activeMode } = useActiveMode();
  const csvAllowed = canExportCsv(sub.plan, activeMode);
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const [sort, setSort] = reactExports.useState("score");
  const [dir, setDir] = reactExports.useState("desc");
  const rankings = reactExports.useMemo(
    () => rankProducts(productsQ.data ?? [], entriesQ.data ?? [], currency, dropshippingFx, metaTaxPct),
    [productsQ.data, entriesQ.data, currency, dropshippingFx, metaTaxPct]
  );
  const sorted = reactExports.useMemo(() => {
    const cp = [...rankings];
    cp.sort((a, b) => {
      const va = readSortVal(a, sort);
      const vb = readSortVal(b, sort);
      return dir === "desc" ? vb - va : va - vb;
    });
    return cp;
  }, [rankings, sort, dir]);
  const setSortKey = (k) => {
    if (sort === k) setDir((d) => d === "desc" ? "asc" : "desc");
    else {
      setSort(k);
      setDir("desc");
    }
  };
  const handleExport = () => {
    const rows = [
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
        r.breakEvenRoas.toFixed(2)
      ])
    ];
    downloadCSV(`netodash-ranking-${range.from}_${range.to}.csv`, rows);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tight", children: "Classement produits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1", children: "Trie par score, marge, ROAS… Identifie tes winners & losers en un coup d'œil." })
      ] }),
      csvAllowed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleExport,
          className: "px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin hover:bg-foreground hover:text-background",
          children: "↓ Export CSV"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "🔒 Export CSV · plan Pro Drop" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin overflow-x-auto bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[1000px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "Score", k: "score", sort, dir, onClick: setSortKey }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Verdict" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "CA", k: "revenue", sort, dir, onClick: setSortKey, align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "Bénéfice", k: "netProfit", sort, dir, onClick: setSortKey, align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "Marge %", k: "marginPct", sort, dir, onClick: setSortKey, align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "ROAS", k: "roas", sort, dir, onClick: setSortKey, align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "€ profit/€ pub", k: "profitPerAdEuro", sort, dir, onClick: setSortKey, align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableTh, { label: "Remb. %", k: "refundRate", sort, dir, onClick: setSortKey, align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { align: "right", children: "Cmds" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { align: "center", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        sorted.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold", children: r.product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: r.score }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerdictBadge, { v: r.verdict }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(r.kpis.revenue, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-3 py-2 text-right tabular-nums font-bold ${r.kpis.netProfit > 0 ? "text-emerald-600" : r.kpis.netProfit < 0 ? "text-red-600" : ""}`, children: formatCurrency(r.kpis.netProfit, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right tabular-nums", children: [
            (r.marginPct * 100).toFixed(0),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: r.kpis.roas.toFixed(2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: r.profitPerAdEuro.toFixed(2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `px-3 py-2 text-right tabular-nums ${r.refundRate > 0.08 ? "text-amber-600 font-bold" : ""}`, children: [
            (r.refundRate * 100).toFixed(0),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatNumber(r.kpis.shopifyOrders) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products", className: "text-[10px] uppercase tracking-widest font-bold underline", children: "Gérer" }) })
        ] }, r.product.id)),
        sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "px-3 py-8 text-center text-muted-foreground", children: "Aucun produit" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-muted/30 text-xs font-mono text-muted-foreground space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Score" }),
        " : pondère marge nette, bénéfice/€ pub, ROAS vs break-even et taux de remboursement."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "€ profit/€ pub" }),
        " : combien tu gagnes par euro investi en publicité (le KPI roi du dropshipping)."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Verdicts" }),
        " : 🟢 winner ≥65 · 🟡 watch 40-64 · 🔴 loser <40."
      ] })
    ] })
  ] });
}
function readSortVal(r, k) {
  switch (k) {
    case "score":
      return r.score;
    case "netProfit":
      return r.kpis.netProfit;
    case "revenue":
      return r.kpis.revenue;
    case "roas":
      return r.kpis.roas;
    case "marginPct":
      return r.marginPct;
    case "refundRate":
      return r.refundRate;
    case "profitPerAdEuro":
      return r.profitPerAdEuro;
  }
}
function Th({ children, align = "left" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `px-3 py-2 text-xs uppercase tracking-widest text-${align}`, children });
}
function SortableTh({ label, k, sort, dir, onClick, align = "left" }) {
  const active = sort === k;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `px-3 py-2 text-xs uppercase tracking-widest text-${align}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onClick(k), className: `inline-flex items-center gap-1 ${active ? "underline" : ""}`, children: [
    label,
    " ",
    active && (dir === "desc" ? "▼" : "▲")
  ] }) });
}
function ScoreBar({ score }) {
  const color = score >= 65 ? "bg-emerald-600" : score >= 40 ? "bg-amber-500" : score > 0 ? "bg-red-600" : "bg-muted-foreground/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-2 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${color}`, style: { width: `${score}%` } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold tabular-nums w-7", children: score })
  ] });
}
function VerdictBadge({ v }) {
  const map = {
    winner: { label: "WINNER", cls: "bg-emerald-600 text-white" },
    watch: { label: "WATCH", cls: "bg-amber-500 text-black" },
    loser: { label: "LOSER", cls: "bg-red-600 text-white" },
    "no-data": { label: "—", cls: "bg-muted text-muted-foreground" }
  };
  const x = map[v];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${x.cls}`, children: x.label });
}
function ProfitBreakdownTab({ preset, customRange }) {
  const { user } = useAuth();
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);
  const { currency } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];
  const [productId, setProductId] = reactExports.useState("all");
  const filteredEntries = productId === "all" ? entries : entries.filter((e) => e.product_id === productId);
  const filteredProducts = productId === "all" ? products : products.filter((p) => p.id === productId);
  const kpis = reactExports.useMemo(
    () => computeKPIs(filteredEntries, filteredProducts, currency, dropshippingFx, metaTaxPct),
    [filteredEntries, filteredProducts, currency, dropshippingFx, metaTaxPct]
  );
  const steps = reactExports.useMemo(() => computeBreakdown(kpis), [kpis]);
  const maxVal = Math.max(kpis.revenue, 1);
  const costs = [
    { label: "Coûts produits livrés", value: kpis.cogs, color: "hsl(0 75% 55%)" },
    { label: "Pub", value: kpis.adSpend, color: "hsl(220 75% 55%)" },
    { label: "Taxe Meta", value: kpis.metaTax, color: "hsl(260 60% 55%)" },
    { label: "Shopify/Stripe", value: kpis.shopifyFees, color: "hsl(180 60% 45%)" },
    { label: "Wave", value: kpis.waveFees, color: "hsl(280 55% 50%)" },
    { label: "Remboursés", value: kpis.refundedAmount, color: "hsl(340 60% 50%)" },
    { label: "Bénéfice net", value: Math.max(0, kpis.netProfit), color: "hsl(150 70% 40%)" }
  ].filter((s) => s.value > 0);
  const totalCost = costs.reduce((a, b) => a + b.value, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tight", children: "Décomposition du bénéfice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1", children: "Où part chaque euro de CA. Identifie les postes qui pèsent." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: productId,
          onChange: (e) => setProductId(e.target.value),
          className: "brutal-border-thin px-3 py-2 text-xs uppercase tracking-widest font-bold bg-background",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous les produits" }),
            products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-5 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-4", children: "Waterfall — du CA au bénéfice net" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: steps.map((s) => {
        const abs = Math.abs(s.value);
        const widthPct = Math.min(100, abs / maxVal * 100);
        const isCost = s.kind === "cost";
        const isResult = s.kind === "result";
        const tone = isResult ? s.value >= 0 ? "bg-emerald-600 text-white" : "bg-red-600 text-white" : isCost ? "bg-red-500/80 text-white" : "bg-foreground text-background";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-44 text-xs font-bold tracking-wide", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-7 bg-muted relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${tone} flex items-center px-2`, style: { width: `${widthPct}%` }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold tabular-nums whitespace-nowrap", children: [
            isCost ? "−" : "",
            formatCurrency(abs, currency)
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-16 text-right text-xs tabular-nums text-muted-foreground", children: [
            (s.pctOfRevenue * 100).toFixed(0),
            "%"
          ] })
        ] }, s.label);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-5 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-4", children: "Où part chaque euro de CA" }),
      totalCost > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 brutal-border-thin overflow-hidden", children: costs.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: { width: `${c.value / totalCost * 100}%`, backgroundColor: c.color },
            title: `${c.label} — ${formatCurrency(c.value, currency)}`
          },
          c.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2 mt-4", children: costs.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 shrink-0", style: { backgroundColor: c.color } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold truncate", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto tabular-nums text-muted-foreground", children: [
            (c.value / totalCost * 100).toFixed(0),
            "%"
          ] })
        ] }, c.label)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Pas de données sur cette période" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$2, { label: "CA", value: formatCurrency(kpis.revenue, currency) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$2, { label: "Total coûts", value: formatCurrency(kpis.revenue - kpis.netProfit, currency) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$2, { label: "Dont expédition", value: formatCurrency(kpis.shippingCost, currency) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$2, { label: "Bénéfice net", value: formatCurrency(kpis.netProfit, currency), tone: kpis.netProfit > 0 ? "good" : kpis.netProfit < 0 ? "bad" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$2, { label: "Marge nette", value: kpis.revenue > 0 ? `${(kpis.netProfit / kpis.revenue * 100).toFixed(1)}%` : "—" })
    ] })
  ] });
}
function Box$2({ label, value, tone }) {
  const cls = tone === "good" ? "bg-emerald-600 text-white" : tone === "bad" ? "bg-red-600 text-white" : "bg-card";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-3 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold opacity-80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1 tabular-nums", children: value })
  ] });
}
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
function TrendsTab({ preset, customRange }) {
  const { user } = useAuth();
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const prev = reactExports.useMemo(() => previousRange(range), [range]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const curQ = useEntries(user?.id, range);
  const prevQ = useEntries(user?.id, prev);
  const { currency } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const curSeries = reactExports.useMemo(
    () => fillDailySeries(
      computeDailySeries(curQ.data ?? [], products, null, currency, dropshippingFx, metaTaxPct),
      range.from,
      range.to,
      (date) => ({ date, revenue: 0, adSpend: 0, metaTax: 0, netProfit: 0, roas: 0, shopifyOrders: 0, notes: null })
    ),
    [curQ.data, products, currency, dropshippingFx, metaTaxPct, range.from, range.to]
  );
  const prevSeries = reactExports.useMemo(
    () => fillDailySeries(
      computeDailySeries(prevQ.data ?? [], products, null, currency, dropshippingFx, metaTaxPct),
      prev.from,
      prev.to,
      (date) => ({ date, revenue: 0, adSpend: 0, metaTax: 0, netProfit: 0, roas: 0, shopifyOrders: 0, notes: null })
    ),
    [prevQ.data, products, currency, dropshippingFx, metaTaxPct, prev.from, prev.to]
  );
  const overlayData = curSeries.map((d, i) => ({
    label: `J${i + 1}`,
    actuel: Math.round(d.netProfit),
    precedent: Math.round(prevSeries[i]?.netProfit ?? 0),
    date: d.date
  }));
  const sortedByProfit = [...curSeries].filter((d) => d.revenue > 0 || d.adSpend > 0).sort((a, b) => b.netProfit - a.netProfit);
  const bestDay = sortedByProfit[0];
  const worstDay = sortedByProfit[sortedByProfit.length - 1];
  const heatmap = reactExports.useMemo(() => buildWeekdayHeatmap(curSeries), [curSeries]);
  const maxAbsHeat = heatmap.weeks.length ? Math.max(1, ...heatmap.weeks.flatMap((w) => w.cells.map((c) => Math.abs(c?.profit ?? 0)))) : 1;
  const bestStreak = longestProfitableStreak(curSeries);
  const cur = currentStreak(curSeries);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tight", children: "Tendances & Cohortes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1", children: "Compare période actuelle vs précédente. Repère tes meilleurs jours." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$1, { label: "Meilleur jour", value: bestDay ? formatCurrency(bestDay.netProfit, currency) : "—", sub: bestDay?.date ?? "", tone: "good" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$1, { label: "Pire jour", value: worstDay && worstDay.netProfit < 0 ? formatCurrency(worstDay.netProfit, currency) : "—", sub: worstDay && worstDay.netProfit < 0 ? worstDay.date : "", tone: worstDay && worstDay.netProfit < 0 ? "bad" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$1, { label: "Meilleur streak", value: `${bestStreak} j`, sub: "jours rentables d'affilée" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box$1, { label: "Streak actuel", value: `${cur.days} j`, sub: cur.kind === "profit" ? "rentables ✓" : cur.kind === "loss" ? "en perte ⚠" : "neutre", tone: cur.kind === "profit" ? "good" : cur.kind === "loss" ? "bad" : void 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-3", children: "Bénéfice net : période actuelle vs précédente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[320px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: overlayData, margin: { top: 8, right: 16, left: 0, bottom: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", tick: { fontSize: 10 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 10 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatCurrency(Number(v), currency), contentStyle: { fontSize: 12 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: 11 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "actuel", name: "Période actuelle", stroke: "hsl(150 70% 40%)", strokeWidth: 2.5, dot: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "precedent", name: "Période précédente", stroke: "hsl(var(--muted-foreground))", strokeWidth: 2, strokeDasharray: "4 4", dot: false })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-card overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-3", children: "Heatmap — Bénéfice par jour de la semaine" }),
      heatmap.weeks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Pas assez de données" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left pr-2 font-mono text-muted-foreground", children: "Semaine" }),
          WEEKDAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1 font-mono text-muted-foreground", children: d }, d))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: heatmap.weeks.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pr-2 font-mono text-muted-foreground", children: w.label }),
          w.cells.map((c, i) => {
            if (!c) return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-8 bg-muted/40" }) }, i);
            const intensity = Math.min(1, Math.abs(c.profit) / maxAbsHeat);
            const bg = c.profit >= 0 ? `rgba(34, 197, 94, ${0.15 + intensity * 0.75})` : `rgba(239, 68, 68, ${0.15 + intensity * 0.75})`;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-10 h-8 flex items-center justify-center text-[9px] font-bold tabular-nums",
                style: { backgroundColor: bg, color: intensity > 0.5 ? "white" : "inherit" },
                title: `${c.date} — ${formatCurrency(c.profit, currency)}`,
                children: [
                  Math.round(c.profit / 1e3),
                  "k"
                ]
              }
            ) }, i);
          })
        ] }, w.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground mt-3", children: "Plus c'est vert/foncé, plus le jour est rentable. Identifie les jours où concentrer ton budget." })
    ] })
  ] });
}
function buildWeekdayHeatmap(series) {
  if (series.length === 0) return { weeks: [] };
  const weeks = [];
  let current = null;
  for (const d of series) {
    const dt = /* @__PURE__ */ new Date(d.date + "T00:00:00");
    const wd = (dt.getDay() + 6) % 7;
    if (!current || wd === 0) {
      current = { label: shortISOWeek(dt), cells: Array(7).fill(null) };
      weeks.push(current);
    }
    current.cells[wd] = { date: d.date, profit: d.netProfit };
  }
  return { weeks };
}
function shortISOWeek(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${m}`;
}
function Box$1({ label, value, sub, tone }) {
  const cls = tone === "good" ? "bg-emerald-600 text-white" : tone === "bad" ? "bg-red-600 text-white" : "bg-card";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-3 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold opacity-80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1 tabular-nums", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] mt-1 opacity-70", children: sub })
  ] });
}
function BreakEvenTab({ preset, customRange }) {
  const { user } = useAuth();
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);
  const { currency } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = entriesQ.data ?? [];
  const rows = products.map((p) => {
    const sale = convertDropshippingCurrency(Number(p.sale_price ?? 0), p.currency ?? currency, currency, dropshippingFx);
    const cost = convertDropshippingCurrency(Number(p.cost_price ?? 0), p.currency ?? currency, currency, dropshippingFx);
    const ship = convertDropshippingCurrency(Number(p.shipping_cost ?? 0), p.currency ?? currency, currency, dropshippingFx);
    const unitMargin = sale - cost - ship;
    const grossPct = sale > 0 ? unitMargin / sale : 0;
    const breakEvenRoas = grossPct > 0 ? 1 / grossPct : 0;
    const breakEvenCpa = unitMargin;
    const pEntries = entries.filter((e) => e.product_id === p.id);
    const k = computeKPIs(pEntries, [p], currency, dropshippingFx, metaTaxPct);
    const margin = breakEvenRoas > 0 ? (k.roas - breakEvenRoas) / breakEvenRoas : 0;
    return { product: p, sale, cost, ship, unitMargin, grossPct, breakEvenRoas, breakEvenCpa, actualRoas: k.roas, margin };
  });
  const [simProductId, setSimProductId] = reactExports.useState(products[0]?.id ?? "");
  const [simBudget, setSimBudget] = reactExports.useState(100);
  const [simCpa, setSimCpa] = reactExports.useState(20);
  const simProduct = products.find((p) => p.id === simProductId);
  const simRow = rows.find((r) => r.product.id === simProductId);
  const sim = reactExports.useMemo(() => {
    if (!simProduct || !simRow) return null;
    const orders = simCpa > 0 ? simBudget / simCpa : 0;
    const grossProfit = orders * simRow.unitMargin;
    const netProfit = grossProfit - simBudget;
    const roas = simBudget > 0 ? orders * simRow.sale / simBudget : 0;
    return { orders, grossProfit, netProfit, roas };
  }, [simProduct, simRow, simBudget, simCpa]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tight", children: "Seuils & Simulateur" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1", children: "Connais ton seuil de rentabilité par produit + projette tes scénarios." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin overflow-x-auto bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border", children: "Break-even par produit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[800px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Produit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Prix vente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Marge unité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Marge brute %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "BE ROAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "BE CPA max" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "ROAS actuel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-center", children: "Statut" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          rows.map((r) => {
            const ok = r.actualRoas > 0 && r.actualRoas >= r.breakEvenRoas;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold", children: r.product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(r.sale, currency) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums font-bold", children: formatCurrency(r.unitMargin, currency) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right tabular-nums", children: [
                (r.grossPct * 100).toFixed(0),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: r.breakEvenRoas ? r.breakEvenRoas.toFixed(2) : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(r.breakEvenCpa, currency) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-3 py-2 text-right tabular-nums font-bold ${ok ? "text-emerald-600" : r.actualRoas > 0 ? "text-red-600" : ""}`, children: r.actualRoas > 0 ? r.actualRoas.toFixed(2) : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${r.actualRoas === 0 ? "bg-muted text-muted-foreground" : ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`, children: r.actualRoas === 0 ? "—" : ok ? "RENTABLE" : "EN PERTE" }) })
            ] }, r.product.id);
          }),
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-3 py-8 text-center text-muted-foreground", children: "Aucun produit" }) })
        ] })
      ] })
    ] }),
    products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-5 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-1", children: "🧪 Simulateur de scénario" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "« Si je dépense X en pub avec un CPA de Y, combien je gagne ? »" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Produit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: simProductId,
            onChange: (e) => setSimProductId(e.target.value),
            className: "brutal-border-thin px-3 py-2 text-sm font-bold bg-background w-full",
            children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Budget pub (${currency})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: 0,
            value: simBudget,
            onChange: (e) => setSimBudget(Number(e.target.value) || 0),
            className: "brutal-border-thin px-3 py-2 text-sm font-bold bg-background w-full tabular-nums"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Coût/commande visé (${currency})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: 0,
            value: simCpa,
            onChange: (e) => setSimCpa(Number(e.target.value) || 0),
            className: "brutal-border-thin px-3 py-2 text-sm font-bold bg-background w-full tabular-nums"
          }
        ) })
      ] }),
      sim && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { label: "Commandes", value: sim.orders.toFixed(1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { label: "Marge brute", value: formatCurrency(sim.grossProfit, currency) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { label: "Bénéfice net", value: formatCurrency(sim.netProfit, currency), tone: sim.netProfit > 0 ? "good" : sim.netProfit < 0 ? "bad" : void 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { label: "ROAS projeté", value: sim.roas.toFixed(2) })
      ] }),
      simRow && simCpa > simRow.breakEvenCpa && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 brutal-border-thin border-red-600 p-3 text-xs font-mono text-red-600 bg-red-50 dark:bg-red-950/30", children: [
        "⚠ CPA visé (",
        formatCurrency(simCpa, currency),
        ") supérieur au CPA max (",
        formatCurrency(simRow.breakEvenCpa, currency),
        ") — tu perds de l'argent sur chaque commande."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-muted/30 text-xs font-mono text-muted-foreground space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "BE ROAS" }),
        " = 1 / marge brute. C'est le ROAS minimum pour ne pas perdre."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "BE CPA" }),
        " = marge unitaire. Au-dessus, chaque commande te coûte de l'argent."
      ] })
    ] })
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-1", children: label }),
    children
  ] });
}
function Box({ label, value, tone }) {
  const cls = tone === "good" ? "bg-emerald-600 text-white" : tone === "bad" ? "bg-red-600 text-white" : "bg-background brutal-border-thin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold opacity-80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1 tabular-nums", children: value })
  ] });
}
function InsightsTab({ preset, customRange }) {
  const { user } = useAuth();
  const range = reactExports.useMemo(() => dateRangeForPreset(preset, customRange), [preset, customRange]);
  const prev = reactExports.useMemo(() => previousRange(range), [range]);
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const curQ = useEntries(user?.id, range);
  const prevQ = useEntries(user?.id, prev);
  const { currency } = useActiveMode();
  const { fx: dropshippingFx } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const products = productsQ.data ?? [];
  const entries = curQ.data ?? [];
  const prevEntries = prevQ.data ?? [];
  const insights = reactExports.useMemo(() => {
    const globalKpis = computeKPIs(entries, products, currency, dropshippingFx, metaTaxPct);
    const prevKpis = computeKPIs(prevEntries, products, currency, dropshippingFx, metaTaxPct);
    const rankings = rankProducts(products, entries, currency, dropshippingFx, metaTaxPct);
    const dailyGlobal = computeDailySeries(entries, products, null, currency, dropshippingFx, metaTaxPct);
    return generateInsights({ rankings, entries, globalKpis, prevKpis, dailyGlobal });
  }, [entries, prevEntries, products, currency, dropshippingFx, metaTaxPct]);
  const grouped = {
    danger: insights.filter((i) => i.severity === "danger"),
    warning: insights.filter((i) => i.severity === "warning"),
    good: insights.filter((i) => i.severity === "good"),
    info: insights.filter((i) => i.severity === "info")
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tight", children: "Alertes & Insights auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1", children: "Ce que NETODASH a remarqué sur tes données. Trié par urgence." })
    ] }),
    insights.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-8 bg-card text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "✓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Tout va bien" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Aucune alerte sur cette période. Continue comme ça." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "🛑 À traiter en priorité", items: grouped.danger }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "⚠ À surveiller", items: grouped.warning }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "✅ Bonnes nouvelles", items: grouped.good }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "ℹ Infos", items: grouped.info })
  ] });
}
function Section({ title, items }) {
  if (items.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(InsightCard, { insight: i }, i.id)) })
  ] });
}
function InsightCard({ insight }) {
  const tones = {
    danger: "border-l-4 border-l-red-600",
    warning: "border-l-4 border-l-amber-500",
    good: "border-l-4 border-l-emerald-600",
    info: "border-l-4 border-l-blue-500"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin bg-card p-4 ${tones[insight.severity]}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold mb-1", children: insight.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: insight.body }),
    insight.actionLabel && insight.actionTo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: insight.actionTo,
        className: "inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold brutal-border-thin hover:bg-foreground hover:text-background",
        children: [
          insight.actionLabel,
          " →"
        ]
      }
    )
  ] });
}
function AnalyticsPage() {
  const {
    user
  } = useAuth();
  const sub = useSubscription(user?.id);
  const {
    mode,
    currency
  } = useActiveMode();
  const [preset, setPreset] = reactExports.useState("7d");
  const [customRange, setCustomRange] = reactExports.useState(null);
  if (sub.loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Chargement…" }) });
  }
  if (mode === "cod") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "ANALYTICS PRO · MODE COD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "METRICS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border p-6 md:p-8 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground max-w-2xl", children: [
        "Analytics Pro est réservé au mode ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Dropshipping" }),
        " (plan Scale $79). En mode COD, utilise le dashboard basique (7j / 30j) inclus dans ton plan."
      ] }) })
    ] });
  }
  if (!sub.hasAnalyticsAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "ANALYTICS PRO · ACCÈS BLOQUÉ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "METRICS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paywall, { variant: "analytics", trialDaysLeft: sub.trialDaysLeft })
    ] });
  }
  const modeLabel = mode === "cod" ? "MODE COD · FCFA" : "MODE DROPSHIPPING · " + currency;
  const modeHint = mode === "cod" ? "Analyses calibrées pour ton activité COD : taux de livraison, coût/commande livrée, marge nette après retours et frais courrier." : "Analyses calibrées pour ton activité dropshipping : € profit / € pub, ROAS vs break-even, taux de remboursement et scaling.";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "ANALYTICS PRO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 brutal-border-thin bg-accent text-accent-foreground border-accent font-mono font-bold", children: modeLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "METRICS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs md:text-sm font-mono text-muted-foreground mt-2 max-w-2xl", children: modeHint })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodPicker, { value: preset, onChange: setPreset, customRange, onCustomChange: setCustomRange })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 bg-foreground/[0.03] text-[11px] font-mono text-muted-foreground flex flex-wrap gap-x-4 gap-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Vue d'ensemble" }),
          " · KPI + Δ vs période précédente"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Classement" }),
          " · score 0-100 winners/losers"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Décomposition" }),
          " · où part chaque ",
          currency
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Tendances" }),
          " · cohortes & heatmap"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Seuils" }),
          " · break-even & simulateur"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Insights" }),
          " · alertes auto contextuelles"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "insights", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex flex-wrap h-auto justify-start gap-1 bg-transparent p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabTrig, { value: "insights", children: "🚨 Insights" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabTrig, { value: "overview", children: "📊 Vue d'ensemble" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabTrig, { value: "ranking", children: "🏆 Classement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabTrig, { value: "breakdown", children: "💰 Décomposition" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabTrig, { value: "trends", children: "📈 Tendances" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabTrig, { value: "breakeven", children: "🎯 Seuils & Simu" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "insights", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InsightsTab, { preset, customRange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "overview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { preset, customRange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ranking", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRankingTab, { preset, customRange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "breakdown", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitBreakdownTab, { preset, customRange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "trends", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendsTab, { preset, customRange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "breakeven", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BreakEvenTab, { preset, customRange }) })
    ] })
  ] });
}
function TabTrig({
  value,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value, className: "px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background border-foreground/30", children });
}
export {
  AnalyticsPage as component
};
