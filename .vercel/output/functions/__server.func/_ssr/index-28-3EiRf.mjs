import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo } from "./Logo-DK9rHYhn.mjs";
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
function LandingChooser() {
  reactExports.useEffect(() => {
    document.documentElement.setAttribute("data-mode", "cod");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "brutal-border-thin border-t-0 border-l-0 border-r-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { mode: "cod", priority: true, className: "h-8 md:h-10 w-auto object-contain shrink-0" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/calculateur-roas", className: "hidden sm:inline-block brutal-border-thin px-3 py-2 font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-accent-foreground hover:border-accent", children: "Calc. ROAS gratuit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "hidden sm:inline-block px-3 py-2 font-bold uppercase tracking-wider text-xs hover:text-accent", children: "Connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "brutal-border-thin px-3 py-2 font-bold uppercase tracking-wider text-xs", children: "Contact" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 brutal-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto text-center mb-12 md:mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4", children: "▍ BIENVENUE SUR NETODASH" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]", children: [
          "L'OUTIL DE ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "RENTABILITÉ 360°" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "POUR DROPSHIPPING & COD"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto", children: "ROAS net, marge réelle, CPA max, taux de livraison COD — toute ta rentabilité dans un seul dashboard. Choisis ton mode pour commencer." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChoiceCard, { to: "/dropshipping", pref: "dropshipping", kicker: "INTERNATIONAL · USD · €", title: "DROPSHIPPING", tagline: "Shopify · Meta · TikTok · Google Ads", points: ["ROAS net après taxes pub Meta", "Marge réelle après Stripe + refunds", "Product Ranking : Rentable / Break Even / Pas rentable", "Analytics Pro avancée (plan Scale)"], cta: "Voir Netodash Dropshipping →", colorClass: "dropshipping" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChoiceCard, { to: "/cod", pref: "cod", kicker: "AFRIQUE DE L'OUEST · FCFA", title: "COD", tagline: "Cash on Delivery · Call center · Livreurs", points: ["Taux confirmation & livraison par produit", "Coût livraison ventilé par zone", "Profit net en FCFA, par jour, par zone", "Sénégal · CI · Mali · Bénin · Burkina · Togo"], cta: "Voir Netodash COD →", colorClass: "cod" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center font-mono text-xs text-muted-foreground mt-12", children: [
        "Tu fais les deux ? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "inline" }),
        " — dès le plan Starter Drop ($12), COD et Dropshipping inclus. Bêta : Scale 6 mois gratuits + -50 % à vie."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 md:mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-4", "aria-label": "SEO calculateur ROAS", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoCard, { title: "Break-Even ROAS", text: "Le ROAS minimum à atteindre pour ne pas perdre d'argent sur une vente." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoCard, { title: "ROAS actuel", text: "Le ratio entre ton chiffre d'affaires et ta dépense publicitaire réelle." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoCard, { title: "CPA max", text: "La dépense publicitaire maximale par commande pour rester rentable." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-foreground bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " NETODASH · BUILT FOR DROPSHIPPING & COD"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 font-mono text-xs uppercase tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "text-muted-foreground hover:text-accent", children: "Tarifs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/mentions", className: "text-muted-foreground hover:text-accent", children: "Mentions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/privacy", className: "text-muted-foreground hover:text-accent", children: "Confidentialité" })
      ] })
    ] }) })
  ] });
}
function ChoiceCard({
  to,
  pref,
  kicker,
  title,
  tagline,
  points,
  cta,
  colorClass
}) {
  const remember = () => {
    try {
      localStorage.setItem("netodash:landing-pref", pref);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, onClick: remember, "data-mode": colorClass, className: "group block brutal-border bg-background p-7 md:p-9 transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_hsl(var(--accent))]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold text-accent mb-3", children: kicker }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl md:text-6xl font-black tracking-tighter leading-none", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-mono text-xs md:text-sm text-muted-foreground", children: tagline }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-2.5", children: points.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "→" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p })
    ] }, p)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 brutal-border bg-accent text-accent-foreground border-accent px-5 py-3 font-black uppercase tracking-wider text-sm text-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground", children: cta })
  ] });
}
function SeoCard({
  title,
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "brutal-border-thin bg-background p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-mono text-xs leading-relaxed text-muted-foreground", children: text })
  ] });
}
export {
  LandingChooser as component
};
