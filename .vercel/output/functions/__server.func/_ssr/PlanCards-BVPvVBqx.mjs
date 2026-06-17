import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
const COD_PLAN = {
  name: "COD",
  price: 10,
  priceId: "cod_monthly_v1",
  tagline: "Piloter ton call center sans Dropshipping",
  features: [
    "Mode COD uniquement",
    "Produits COD illimités",
    "Saisie quotidienne & dashboard basique",
    "Suivi 7 jours / 30 jours",
    "Zones de livraison (1 zone)"
  ],
  notIncluded: [
    "Dropshipping",
    "Analytics Pro & Decision Engine",
    "Upsells · Export CSV · Multi-zones"
  ]
};
const DROPSHIP_PLAN_PRICING = {
  basic: { monthly: 12, yearly: 115, monthlyEquivalent: "9,58" },
  starter: { monthly: 29, yearly: 278, monthlyEquivalent: "23,17" },
  pro: { monthly: 79, yearly: 756, monthlyEquivalent: "63,00" }
};
function DropshippingPlanCards({
  highlightPro = true,
  showCurrentBadge = null,
  variant = "default",
  cycle = "monthly",
  onSelectPlan
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `grid md:grid-cols-3 gap-6 ${variant === "compact" ? "" : "max-w-6xl"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropshipPlanCard,
          {
            name: "Starter",
            planKey: "basic",
            cycle,
            tagline: "Démarrer en Drop avec le COD inclus",
            features: [
              "Dropshipping complet",
              "Mode COD inclus (dashboard basique)",
              "3 produits Dropshipping max",
              "Produits COD illimités",
              "ROAS net · Dashboard rentabilité",
              "Historique Drop 60 jours"
            ],
            notIncluded: [
              "Upsells · Export CSV · Multi-zones",
              "Analytics Pro · Decision Engine"
            ],
            cta: "Choisir Starter",
            onSelectPlan,
            current: showCurrentBadge === "basic"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropshipPlanCard,
          {
            name: "Pro",
            planKey: "starter",
            cycle,
            tagline: "Valider plusieurs winners Drop + COD avancé",
            features: [
              "Dropshipping complet",
              "Mode COD inclus",
              "10 produits Dropshipping max",
              "Produits COD illimités",
              "Upsells · Multi-zones COD · Export CSV",
              "Capture mobile · Historique illimité",
              "Support email + WhatsApp"
            ],
            notIncluded: ["Analytics Pro · Decision Engine"],
            cta: "Choisir Pro",
            onSelectPlan,
            highlight: highlightPro,
            current: showCurrentBadge === "starter"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropshipPlanCard,
          {
            name: "Scale",
            planKey: "pro",
            cycle,
            tagline: "Scaler avec Analytics Pro & Decision Engine",
            features: [
              "Dropshipping complet + Analytics Pro",
              "Mode COD inclus",
              "Produits Dropshipping illimités",
              "Produits COD illimités",
              "Decision Engine · Scoring · Waterfall",
              "Break-even · Simulateur · Insights auto",
              "Tout Pro + support WhatsApp prioritaire"
            ],
            notIncluded: [],
            cta: "Choisir Scale",
            onSelectPlan,
            current: showCurrentBadge === "pro"
          }
        )
      ]
    }
  );
}
function CodPlanCard({ showCurrent = false, onSelectPlan }) {
  const p = COD_PLAN;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-7 flex flex-col max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "PLAN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black tracking-tight mt-1", children: p.name })
      ] }),
      showCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-foreground text-background", children: "Actuel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-5xl font-black tracking-tighter", children: [
        "$",
        p.price
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "/mois" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: p.tagline }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 mb-5 flex-1", children: [
      p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "✓" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
      ] }, f)),
      p.notIncluded.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground line-through", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black mt-0.5", children: "✗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
      ] }, f))
    ] }),
    onSelectPlan ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onSelectPlan,
        className: "block w-full text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:border-accent",
        children: showCurrent ? "Renouveler" : "Choisir COD"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/plan",
        className: "block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:border-accent",
        children: "Choisir COD"
      }
    )
  ] });
}
function DropshipPlanCard({
  name,
  planKey,
  cycle,
  tagline,
  features,
  notIncluded,
  cta,
  onSelectPlan,
  highlight = false,
  current = false
}) {
  const pricing = DROPSHIP_PLAN_PRICING[planKey];
  const accent = highlight ? "brutal-border border-accent bg-accent/5" : "brutal-border";
  const mainPrice = `$${pricing.monthly}`;
  const mainPeriod = "/mois";
  const secondary = null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${accent} p-7 flex flex-col`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "PLAN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black tracking-tight mt-1", children: name })
      ] }),
      current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-foreground text-background", children: "Actuel" }),
      highlight && !current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent text-accent-foreground border-accent", children: "Recommandé" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl font-black tracking-tighter", children: mainPrice }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: mainPeriod })
    ] }),
    secondary,
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: tagline }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 mb-5 flex-1", children: [
      features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "✓" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
      ] }, f)),
      notIncluded.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground line-through", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black mt-0.5", children: "✗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
      ] }, f))
    ] }),
    onSelectPlan ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onSelectPlan(planKey),
        className: `block w-full text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider ${highlight ? "bg-accent text-accent-foreground border-accent hover:opacity-90" : "bg-foreground text-background hover:bg-accent hover:border-accent"}`,
        children: current ? "Renouveler" : cta
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/plan",
        className: `block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider ${highlight ? "bg-accent text-accent-foreground border-accent hover:opacity-90" : "bg-foreground text-background hover:bg-accent hover:border-accent"}`,
        children: current ? "Gérer mon plan" : cta
      }
    )
  ] });
}
export {
  COD_PLAN as C,
  DropshippingPlanCards as D,
  CodPlanCard as a
};
