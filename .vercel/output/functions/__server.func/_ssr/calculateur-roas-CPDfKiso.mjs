import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-jk6XecbE.mjs";
import { f as formatCurrency } from "./calc-DHAnOS6I.mjs";
import { B as BetaCtaButton } from "./BetaCtaButton-CRBDQVwZ.mjs";
import "../_libs/sonner.mjs";
import "../_libs/stripe.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./router-CzeTO2qA.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-IbqXIlEo.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-CcppqNZQ.mjs";
import "./shopify-sync.server-B3mu1MxO.mjs";
import "./stripe.server-D419Yq3N.mjs";
import "../_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./Logo-DK9rHYhn.mjs";
import "./dropshipping-fx-BpQqYaq9.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./createSsrRpc-DbtoQF38.mjs";
import "./dialog-DAFZrS93.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/lucide-react.mjs";
import "./button-DWfIo_Ug.mjs";
import "../_libs/class-variance-authority.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const CURRENCIES = [
  { code: "EUR", label: "EUR €" },
  { code: "USD", label: "USD $" },
  { code: "GBP", label: "GBP £" },
  { code: "XOF", label: "FCFA" }
];
function PublicRoasCalculator({ compact = false }) {
  const [mode, setMode] = reactExports.useState("breakeven");
  const [currency, setCurrency] = reactExports.useState("USD");
  const [productName, setProductName] = reactExports.useState("");
  const [salePrice, setSalePrice] = reactExports.useState("45");
  const [costPrice, setCostPrice] = reactExports.useState("13");
  const [adSpend, setAdSpend] = reactExports.useState("100");
  const [orders, setOrders] = reactExports.useState("5");
  const [targetMargin, setTargetMargin] = reactExports.useState("10");
  const [showAdvanced, setShowAdvanced] = reactExports.useState(false);
  const [shipping, setShipping] = reactExports.useState("0");
  const [otherFees, setOtherFees] = reactExports.useState("0");
  const [transactionPct, setTransactionPct] = reactExports.useState("0");
  const n = (v) => v === "" ? 0 : Number(v);
  const res = reactExports.useMemo(() => {
    const sale = n(salePrice);
    const cost = n(costPrice);
    const ship = n(shipping);
    const other = n(otherFees);
    const txPct = n(transactionPct);
    const ad = n(adSpend);
    const ord = n(orders);
    const variablePerOrder = cost + ship + other;
    const grossMarginPerOrder = sale - variablePerOrder - sale * (txPct / 100);
    const beDen = sale * (1 - txPct / 100) - variablePerOrder;
    const breakEvenRoas = beDen > 0 ? sale / beDen : 0;
    const desiredNetPerOrder = sale * (n(targetMargin) / 100);
    const maxCpaTarget = grossMarginPerOrder - desiredNetPerOrder;
    const targetRoas = maxCpaTarget > 0 ? sale / maxCpaTarget : 0;
    const revenue = sale * ord;
    const transactionFees = revenue * (txPct / 100);
    const totalCosts = variablePerOrder * ord + transactionFees + ad;
    const netProfit = revenue - totalCosts;
    const roas = ad > 0 ? revenue / ad : 0;
    const cpa = ord > 0 ? ad / ord : 0;
    const margePct = revenue > 0 ? netProfit / revenue * 100 : 0;
    return {
      breakEvenRoas,
      targetRoas,
      grossMarginPerOrder,
      maxCpaBE: beDen,
      maxCpaTarget,
      desiredNetPerOrder,
      revenue,
      totalCosts,
      netProfit,
      roas,
      cpa,
      margePct
    };
  }, [salePrice, costPrice, shipping, otherFees, transactionPct, adSpend, orders, targetMargin]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "OUTIL — Pour COD & Dropshipping" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "ROAS CALCULATOR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground max-w-2xl", children: "Calcule ton Break-Even ROAS, ton ROAS actuel et ton CPA max avec les données essentielles." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-6", role: "tablist", "aria-label": "Calculateurs ROAS", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModeButton, { active: mode === "breakeven", onClick: () => setMode("breakeven"), children: "⚖ Break-Even ROAS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModeButton, { active: mode === "actual", onClick: () => setMode("actual"), children: "📊 Calculer mon ROAS actuel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModeButton, { active: mode === "target", onClick: () => setMode("target"), children: "🎯 Trouver mon CPA max" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "brutal-border p-6 grid gap-4 bg-background", onSubmit: (e) => e.preventDefault(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-[1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Produit (optionnel)", value: productName, onChange: setProductName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Devise" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: currency,
                onChange: (e) => setCurrency(e.target.value),
                className: "w-full bg-background brutal-border-thin px-3 py-3 font-mono focus:border-accent focus:border-2 outline-none",
                children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.code, children: c.label }, c.code))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Prix de vente (${currency})`, type: "number", value: salePrice, onChange: setSalePrice }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Coût produit (${currency})`, type: "number", value: costPrice, onChange: setCostPrice }),
          mode === "actual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Dépense pub totale (${currency})`, type: "number", value: adSpend, onChange: setAdSpend }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nombre de commandes", type: "number", value: orders, onChange: setOrders })
          ] }),
          (mode === "target" || mode === "breakeven") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: mode === "target" ? "Marge nette cible (%)" : "Marge nette visée (%) — optionnel",
              type: "number",
              value: targetMargin,
              onChange: setTargetMargin,
              hint: "Ex : 10% ou 20% du chiffre d'affaires"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowAdvanced((v) => !v),
              className: "w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚙ Coûts avancés (optionnel)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: showAdvanced ? "−" : "+" })
              ]
            }
          ),
          showAdvanced && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4 p-4 border-t border-foreground/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Expédition / cmd (${currency})`, type: "number", value: shipping, onChange: setShipping }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Frais cachés / cmd (${currency})`, type: "number", value: otherFees, onChange: setOtherFees }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Frais transaction (%)", type: "number", value: transactionPct, onChange: setTransactionPct })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-6 grid gap-3 bg-foreground/[0.02]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "Résultat" }),
        mode === "breakeven" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "⚖ Break-Even ROAS", value: res.breakEvenRoas > 0 ? `${res.breakEvenRoas.toFixed(2)}x` : "—", emphasis: "good", hint: "ROAS minimum pour ne pas perdre d'argent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 Target ROAS", value: res.targetRoas > 0 ? `${res.targetRoas.toFixed(2)}x` : "—", hint: `Pour viser ${n(targetMargin) || 0}% de marge nette` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Marge brute / commande", value: formatCurrency(res.grossMarginPerOrder, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CPA max break-even", value: formatCurrency(res.maxCpaBE, currency) })
        ] }),
        mode === "actual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "ROAS", value: `${res.roas.toFixed(2)}x`, emphasis: res.roas >= res.breakEvenRoas ? "good" : "bad", hint: res.roas >= res.breakEvenRoas ? "Rentable" : "Sous le seuil de rentabilité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Profit net", value: formatCurrency(res.netProfit, currency), emphasis: res.netProfit >= 0 ? "good" : "bad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Marge nette (%)", value: `${res.margePct.toFixed(1)}%`, emphasis: res.margePct >= 0 ? "good" : "bad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CA total", value: formatCurrency(res.revenue, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CPA actuel", value: formatCurrency(res.cpa, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Break-even ROAS", value: res.breakEvenRoas > 0 ? `${res.breakEvenRoas.toFixed(2)}x` : "—" })
        ] }),
        mode === "target" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Marge brute / commande", value: formatCurrency(res.grossMarginPerOrder, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Profit net visé / commande", value: formatCurrency(res.desiredNetPerOrder, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 CPA max", value: res.maxCpaTarget > 0 ? formatCurrency(res.maxCpaTarget, currency) : "Impossible", emphasis: res.maxCpaTarget > 0 ? "good" : "bad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 ROAS cible", value: res.targetRoas > 0 ? `${res.targetRoas.toFixed(2)}x` : "—", emphasis: "good" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Break-even ROAS", value: res.breakEvenRoas > 0 ? `${res.breakEvenRoas.toFixed(2)}x` : "—" })
        ] })
      ] })
    ] })
  ] });
}
function ModeButton({ active, onClick, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: `brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${active ? "bg-foreground text-background border-foreground" : "hover:bg-foreground hover:text-background"}`,
      children
    }
  );
}
function Field({ label, value, onChange, type = "text", hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        value,
        onChange: (e) => onChange(e.target.value),
        min: type === "number" ? 0 : void 0,
        step: type === "number" ? "0.01" : void 0,
        className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
      }
    ),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground mt-1", children: hint })
  ] });
}
function ResultRow({ label, value, hint, emphasis }) {
  const color = emphasis === "bad" ? "text-accent" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: label }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: hint })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xl md:text-2xl font-black tabular text-right ${color}`, children: value })
  ] });
}
function CalculateurRoasPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { variant: "dropshipping" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-foreground/15", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block brutal-border-thin px-3 py-1 text-[10px] uppercase tracking-widest font-mono bg-accent text-accent-foreground border-accent mb-4", children: "100 % gratuit · Sans inscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]", children: [
          "Calculateur ROAS",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Break-Even & Target" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed", children: "Avant de lancer une campagne Meta, TikTok ou Google Ads, sache à partir de quel ROAS tu commences à gagner de l'argent. Utilise les trois calculateurs gratuits : Break-Even ROAS, ROAS actuel et CPA max." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-10 md:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PublicRoasCalculator, { compact: true }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-foreground/15 py-12 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-6 md:gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-accent", children: "01 / Définition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tight mt-2", children: "Qu'est-ce que le Break-Even ROAS ?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm md:text-base font-mono leading-relaxed text-muted-foreground", children: [
            "Le ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Break-Even ROAS" }),
            " ",
            "(ou ROAS de rentabilité) est le seuil minimum à atteindre pour que ta campagne publicitaire ne te fasse pas perdre d'argent. Formule :"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 brutal-border-thin p-4 bg-foreground/[0.02] font-mono text-sm", children: "BE ROAS = Prix de vente ÷ (Prix de vente − Coût produit)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm font-mono leading-relaxed text-muted-foreground", children: [
            "Exemple : produit vendu 45 $, coût 13 $ → BE ROAS =",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
              (45 / (45 - 13)).toFixed(2),
              "x"
            ] }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-accent", children: "02 / Définition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tight mt-2", children: "Qu'est-ce que le Target ROAS ?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm md:text-base font-mono leading-relaxed text-muted-foreground", children: [
            "Le ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Target ROAS" }),
            " est le ROAS à viser pour atteindre une",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "marge nette" }),
            " précise (souvent 10 à 25%). Il est toujours supérieur au Break-Even. Formule :"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 brutal-border-thin p-4 bg-foreground/[0.02] font-mono text-sm", children: "Target ROAS = Prix ÷ (Prix − Coût − Marge visée)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-mono leading-relaxed text-muted-foreground", children: "Utilise-le comme objectif de scaling. En dessous : audit. Bien au-dessus : scale x2." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-foreground bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6 py-14 md:py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block brutal-border-thin border-accent px-3 py-1 text-[10px] uppercase tracking-widest font-mono bg-accent text-accent-foreground mb-5", children: "Tu veux aller plus loin ?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter", children: [
          "Suis ton ROAS ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "en temps réel" }),
          " ",
          "dans Netodash"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 max-w-2xl mx-auto text-base text-background/70 font-mono leading-relaxed", children: [
          "Ce calculateur fait des projections. Pour suivre ton ROAS, ta marge nette et ton CPA ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "jour par jour" }),
          " sur tous tes produits, crée un compte Netodash en 30 secondes."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex flex-wrap items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "hero", className: "px-6 py-3 text-sm hover:opacity-90" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dropshipping", className: "brutal-border-thin border-background px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-background hover:text-foreground", children: "Découvrir Netodash" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[900px] mx-auto px-4 md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-black tracking-tighter mb-8", children: "Questions fréquentes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Faq, { q: "Le calculateur est-il vraiment gratuit ?", children: "Oui, 100% gratuit et sans inscription. Tu peux l'utiliser autant de fois que tu veux. Si tu veux suivre tes calculs et ton ROAS au quotidien, crée un compte Netodash." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Faq, { q: "Sur quels coûts se base le calcul ?", children: "Le calcul utilise uniquement le prix de vente et le coût produit (achat + livraison vers le client). Pour intégrer frais Shopify, SAV, retours, etc., utilise la version avancée dans l'app Netodash." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Faq, { q: "Ça marche pour le COD en Afrique ?", children: "Oui. Sélectionne FCFA comme devise et entre tes valeurs. Le calcul est identique : sale_price ÷ (sale_price − coût) = ROAS de rentabilité." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Faq, { q: "Pourquoi mon Target ROAS dit 'Impossible' ?", children: "Parce que ta marge nette visée dépasse ta marge brute. Baisse ton coût produit, augmente ton prix de vente, ou réduis la marge cible." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { tagline: "Le seul outil de suivi rentabilité pensé pour le dropshipping et le COD.", baseline: "ROAS, marge nette et CPA en temps réel." })
  ] });
}
function Faq({
  q,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "brutal-border-thin p-4 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "cursor-pointer font-black uppercase tracking-wide text-sm flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: q }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-xl group-open:rotate-45 transition-transform", children: "+" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-mono text-sm leading-relaxed text-muted-foreground", children })
  ] });
}
export {
  CalculateurRoasPage as component
};
