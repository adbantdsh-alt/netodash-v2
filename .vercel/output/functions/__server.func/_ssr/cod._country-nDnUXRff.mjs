import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as Route$t, c as COD_COUNTRIES } from "./router-CzeTO2qA.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-jk6XecbE.mjs";
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
function CountryPage() {
  const {
    country: c
  } = Route$t.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { variant: "cod" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Fil d'Ariane", className: "max-w-[1400px] mx-auto px-4 md:px-6 pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-accent", children: "Accueil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cod", className: "hover:text-accent", children: "COD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: c.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "brutal-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin inline-block px-3 py-1 text-xs uppercase tracking-widest font-bold font-mono bg-accent text-accent-foreground border-accent mb-4", children: [
        "▍ COD · ",
        c.currency
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", children: "DROPSHIPPING COD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-accent mt-2", children: [
          c.flag,
          " ",
          c.name.toUpperCase()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed", children: c.intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Capitale", value: c.capital }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Population", value: c.population }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Devise", value: c.currency }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { label: "Taux livraison", value: c.averageDeliveryRate, accent: true })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter", children: "Zones de livraison & tarifs livreurs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground font-mono uppercase tracking-widest", children: "Coûts indicatifs à intégrer dans Netodash pour ton calcul de marge" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid md:grid-cols-2 gap-4", children: c.zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border bg-background p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg", children: z.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-mono text-sm text-accent font-bold", children: z.price })
      ] }, z.name)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-black tracking-tighter", children: "Moyens de paiement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3", children: c.paymentMethods.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: p })
        ] }, p)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-black tracking-tighter", children: "Transporteurs / livreurs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3", children: c.carriers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: p })
        ] }, p)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter", children: [
        "Niches qui marchent au ",
        c.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: c.marketSize }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap gap-2", children: c.topNiches.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-sm bg-background", children: n }, n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter", children: [
        "Les 3 pièges du COD au ",
        c.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid md:grid-cols-3 gap-5", children: c.challenges.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-6 bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-accent font-black text-4xl tracking-tighter", children: [
          "0",
          i + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-black text-lg", children: ch.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: ch.text })
      ] }, ch.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter", children: [
        "Comment Netodash gère le COD ",
        c.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-8 space-y-4", children: c.netodashAngle.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black text-2xl mt-[-4px]", children: "→" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base md:text-lg font-bold", children: p })
      ] }, p)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "hero", className: "px-8 py-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/calculateur-roas", className: "brutal-border px-8 py-4 font-black uppercase tracking-wider", children: "Calculateur ROAS gratuit →" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter", children: [
        "FAQ COD ",
        c.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-4 max-w-3xl", children: c.faq.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "brutal-border bg-background p-5 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "font-black text-base md:text-lg cursor-pointer flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.q }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-xl group-open:rotate-45 transition-transform", children: "+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm md:text-base text-muted-foreground leading-relaxed", children: f.a })
      ] }, f.q)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl font-black tracking-tight uppercase", children: "Autres pays COD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: COD_COUNTRIES.filter((o) => o.slug !== c.slug).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cod/$country", params: {
        country: o.slug
      }, className: "brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-sm bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: o.flag }),
        " ",
        o.name
      ] }, o.slug)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { tagline: "COD piloté à la commande livrée.", baseline: "Pas à la commande Shopify." })
  ] });
}
function StatBox({
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-4 ${accent ? "bg-accent text-accent-foreground border-accent" : "bg-background"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest font-bold opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-lg md:text-xl font-black tracking-tight", children: value })
  ] });
}
export {
  CountryPage as component
};
