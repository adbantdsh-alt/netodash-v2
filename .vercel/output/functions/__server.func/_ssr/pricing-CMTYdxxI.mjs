import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as COD_PLAN } from "./PlanCards-BVPvVBqx.mjs";
import { B as BetaCtaButton } from "./BetaCtaButton-CRBDQVwZ.mjs";
import "../_libs/sonner.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./createSsrRpc-DbtoQF38.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/lucide-react.mjs";
import "./button-DWfIo_Ug.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const DROPSHIP_PLANS = [{
  name: "Starter",
  monthly: 12,
  tagline: "Démarrer en Drop avec le COD inclus",
  features: ["3 produits Dropshipping max", "Mode COD inclus (dashboard basique)", "Produits COD illimités", "ROAS net multi-plateformes", "Historique Drop 60 jours", "1 zone de livraison COD"],
  cta: "Choisir Starter",
  highlight: false
}, {
  name: "Pro",
  monthly: 29,
  tagline: "Valider plusieurs winners Drop + COD avancé",
  features: ["10 produits Dropshipping max", "Drop ET COD en parallèle", "Upsells · Multi-zones COD · Export CSV", "Capture mobile · Historique illimité", "Support email + WhatsApp"],
  cta: "Choisir Pro",
  highlight: true
}, {
  name: "Scale",
  monthly: 79,
  tagline: "Scaler avec Analytics Pro & Decision Engine",
  features: ["Produits Dropshipping illimités", "Tout Pro + Analytics Pro EXCLUSIF", "Decision Engine · Scoring · Waterfall", "Break-even · Simulateur · Insights auto", "Support WhatsApp prioritaire"],
  cta: "Choisir Scale",
  highlight: false
}];
function PricingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "brutal-border-thin border-t-0 border-l-0 border-r-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/netodash-logo.png", alt: "NETODASH", className: "h-9 w-auto object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent", children: "Connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "header" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "TARIFS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mt-2 max-w-3xl", children: [
        "UN PRIX ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "JUSTE." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "PAS DE PIÈGE."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm md:text-base text-muted-foreground mt-6 max-w-2xl", children: "14 jours d'essai gratuit avec accès complet (plan Pro débloqué), sans carte bancaire. Puis COD $10, Starter $12, Pro $29 ou Scale $79 — facturation mensuelle par carte Stripe." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-7 flex flex-col brutal-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "PLAN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black tracking-tight mt-1", children: "Essai gratuit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 my-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl font-black tracking-tighter", children: "0 $" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "/ 14 jours" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: "Accès complet 14 jours — peu importe le mode choisi au signup" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "card" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter mb-2", children: "JE FAIS DU COD UNIQUEMENT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground mb-6 max-w-2xl", children: "Piloter ton call center sans Dropshipping — produits COD illimités, dashboard 7j / 30j." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-7 flex flex-col max-w-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "PLAN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black tracking-tight mt-1", children: COD_PLAN.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 my-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-5xl font-black tracking-tighter", children: [
              "$",
              COD_PLAN.price
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "/mois" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: COD_PLAN.tagline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 mb-5 flex-1", children: COD_PLAN.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
          ] }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "card" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter mb-2", children: "JE FAIS DU DROPSHIPPING" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground mb-6 max-w-2xl", children: "Starter, Pro ou Scale — le mode COD est inclus dans chaque plan Drop." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: DROPSHIP_PLANS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-7 flex flex-col ${p.highlight ? "brutal-border border-accent bg-accent/5" : "brutal-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "PLAN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black tracking-tight mt-1", children: p.name })
            ] }),
            p.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent text-accent-foreground border-accent", children: "Recommandé" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-5xl font-black tracking-tighter", children: [
              "$",
              p.monthly
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "/mois" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: p.tagline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 mb-5 flex-1", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
          ] }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: p.highlight ? "cardHighlight" : "card" })
        ] }, p.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-black tracking-tighter mb-8", children: "QUESTIONS FRÉQUENTES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-6", children: [{
          q: "Comment fonctionne l'essai gratuit ?",
          a: "14 jours complets, sans carte bancaire, avec accès complet (Pro débloqué) — quel que soit le mode choisi au signup. À la fin, tu choisis COD ($10), Starter, Pro ou Scale."
        }, {
          q: "Quelle différence entre COD, Starter, Pro et Scale ?",
          a: "COD ($10) = mode COD uniquement, produits illimités, dashboard basique. Starter ($12) = 3 produits Drop + COD inclus. Pro ($29) = 10 produits Drop, upsells, multi-zones, export CSV. Scale ($79) = Drop illimité + Analytics Pro & Decision Engine."
        }, {
          q: "Puis-je changer de plan ou annuler ?",
          a: "Oui, à tout moment depuis Mon plan. Paiement par carte via Stripe. Tu passes de COD à Drop (ou inversement), ou tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée."
        }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-lg mb-2", children: item.q }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: item.a })
        ] }, item.q)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " NETODASH · BUILT FOR DROPSHIPPERS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent", children: "← Retour" })
    ] }) })
  ] });
}
export {
  PricingPage as component
};
