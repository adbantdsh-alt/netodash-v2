import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as COPY$1 } from "./router-CzeTO2qA.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-jk6XecbE.mjs";
import { B as BetaCtaButton } from "./BetaCtaButton-CRBDQVwZ.mjs";
import { T as TrustStats, C as CompetitorComparison, P as Pillars, B as BeforeAfter, a as ProductRanking, D as DecisionEngine, b as Testimonials, c as TrustSecurity, d as Pricing, F as FinalCta } from "./SharedSections-MbFRQHAK.mjs";
import "../_libs/sonner.mjs";
import "../_libs/stripe.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const heroDropshipping = "/assets/hero-dropshipping-DCmxGFkB.jpg";
function RoasCalculator() {
  const [revenue, setRevenue] = reactExports.useState(12e3);
  const [adSpend, setAdSpend] = reactExports.useState(5e3);
  const [cogsPct, setCogsPct] = reactExports.useState(32);
  const [adTaxPct, setAdTaxPct] = reactExports.useState(18);
  const out = reactExports.useMemo(() => {
    const cogs = revenue * cogsPct / 100;
    const adTax = adSpend * adTaxPct / 100;
    const stripe = revenue * 0.029 + 30;
    const refunds = revenue * 0.04;
    const cashIn = revenue - stripe - refunds;
    const totalCosts = cogs + adSpend + adTax;
    const profit = cashIn - totalCosts;
    const margin = revenue > 0 ? profit / revenue * 100 : 0;
    const roasMeta = adSpend > 0 ? revenue / adSpend : 0;
    const roasNet = adSpend > 0 ? cashIn / (adSpend + adTax) : 0;
    return { cogs, adTax, stripe, refunds, cashIn, profit, margin, roasMeta, roasNet };
  }, [revenue, adSpend, cogsPct, adTaxPct]);
  const profitable = out.profit > 0;
  const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-accent font-bold mb-3", children: "▍ ROAS NET CALCULATOR · LIVE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl", children: [
      "BOUGE LES SLIDERS. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "VOIS CE QUE TU GARDES VRAIMENT." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-5 max-w-2xl text-base md:text-lg", children: "Le ROAS Meta dit une chose. Ta banque dit autre chose. Joue avec ton CA, ton budget pub et ton COGS — on calcule la marge nette réelle, après taxes pub, frais Stripe et refunds." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-6 mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 brutal-border p-6 md:p-8 bg-background space-y-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderRow,
          {
            label: "CA Shopify (30j)",
            value: revenue,
            min: 1e3,
            max: 1e5,
            step: 500,
            format: fmt,
            onChange: setRevenue
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderRow,
          {
            label: "Budget pub (Meta / TikTok / Google)",
            value: adSpend,
            min: 500,
            max: 5e4,
            step: 250,
            format: fmt,
            onChange: setAdSpend
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderRow,
          {
            label: "COGS + fulfillment (% du CA)",
            value: cogsPct,
            min: 10,
            max: 70,
            step: 1,
            format: (v) => v + " %",
            onChange: setCogsPct
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderRow,
          {
            label: "Taxe pub Meta (% du budget)",
            value: adTaxPct,
            min: 0,
            max: 25,
            step: 1,
            format: (v) => v + " %",
            onChange: setAdTaxPct,
            hint: "≈ 18 % au Sénégal, 0 % aux US"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-6 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold", children: "Ce que Meta t'affiche" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-5xl font-black tracking-tighter mt-1 line-through opacity-60", children: [
            out.roasMeta.toFixed(2),
            "x"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "ROAS affiché" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `brutal-border p-6 ${profitable ? "border-accent bg-accent/5" : "border-foreground bg-foreground text-background"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-[10px] font-mono uppercase tracking-widest font-bold ${profitable ? "text-accent" : "text-background/70"}`,
                  children: "Ta réalité"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-4xl md:text-5xl font-black tracking-tighter ${profitable ? "text-accent" : "text-background"}`, children: [
                    out.roasNet.toFixed(2),
                    "x"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] uppercase tracking-widest ${profitable ? "text-muted-foreground" : "text-background/70"}`, children: "ROAS net réel" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-4xl md:text-5xl font-black tracking-tighter ${profitable ? "" : "text-background"}`, children: [
                    out.margin.toFixed(1),
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] uppercase tracking-widest ${profitable ? "text-muted-foreground" : "text-background/70"}`, children: "Marge nette" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-5 pt-5 border-t ${profitable ? "border-foreground/20" : "border-background/30"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] uppercase tracking-widest font-bold ${profitable ? "text-muted-foreground" : "text-background/70"}`, children: "Profit net 30j" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl md:text-4xl font-black tracking-tighter mt-1 tabular", children: out.profit >= 0 ? fmt(out.profit) : "− " + fmt(-out.profit) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 font-mono text-[11px] text-muted-foreground space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { k: "− COGS / fulfillment", v: "− " + fmt(out.cogs) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { k: "− Taxe pub", v: "− " + fmt(out.adTax) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { k: "− Frais Stripe", v: "− " + fmt(out.stripe) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { k: "− Refunds (~4%)", v: "− " + fmt(out.refunds) })
        ] })
      ] })
    ] })
  ] }) });
}
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-black text-lg tabular text-accent", children: format(value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        className: "w-full accent-[color:var(--accent)] cursor-pointer"
      }
    ),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1", children: hint })
  ] });
}
function Line({ k, v }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black tabular", children: v })
  ] });
}
function DropshippingLanding() {
  reactExports.useEffect(() => {
    document.documentElement.setAttribute("data-mode", "dropshipping");
    try {
      localStorage.setItem("netodash:landing-pref", "dropshipping");
    } catch {
    }
    return () => {
      document.documentElement.setAttribute("data-mode", "cod");
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { variant: "dropshipping" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "top", className: "brutal-grid scroll-mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin inline-block px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest font-bold font-mono bg-accent text-accent-foreground border-accent mb-6", children: COPY$1.heroBadge }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-black tracking-tighter leading-[0.95] text-balance", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl", children: COPY$1.heroH1Line1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-accent text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl", children: COPY$1.heroH1Line2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 md:mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed", children: [
        COPY$1.heroSubtitle,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: COPY$1.heroSubtitleBold })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "hero" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#pricing", className: "brutal-border px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base text-center hover:bg-foreground hover:text-background", children: COPY$1.heroCtaSecondary })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-mono text-[11px] md:text-xs text-muted-foreground", children: COPY$1.heroSmallprint })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RoasCalculator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background brutal-grid relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1500px] mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-5 gap-10 md:gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "order-2 md:order-1 md:col-span-3 flex justify-center md:justify-start animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-[820px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-3 bg-accent/10 -z-10 brutal-border-thin border-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroDropshipping, alt: "Aperçu du dashboard Netodash — ROAS net, profit et ranking produits Shopify", width: 1408, height: 1024, loading: "lazy", decoding: "async", className: "w-full h-auto brutal-border bg-background shadow-[12px_12px_0_0_hsl(var(--accent))]" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "order-1 md:order-2 md:col-span-2 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-accent mb-3", children: COPY$1.showcaseEyebrow }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black leading-[0.95] tracking-tight mb-5", children: [
          COPY$1.showcaseTitleHtml.before,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: COPY$1.showcaseTitleHtml.accent }),
          COPY$1.showcaseTitleHtml.after
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-lg text-muted-foreground mb-6", children: COPY$1.showcaseLead }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm md:text-base font-bold", children: COPY$1.showcaseList.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "→" }),
          " ",
          item
        ] }, item)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustStats, { stats: COPY$1.trustStats }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompetitorComparison, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Pillars, { pillars: COPY$1.pillars }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BeforeAfter, { copy: COPY$1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRanking, { copy: COPY$1, mode: "dropshipping" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DecisionEngine, { copy: COPY$1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Testimonials, { copy: COPY$1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustSecurity, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Pricing, { copy: COPY$1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalCta, { copy: COPY$1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { tagline: COPY$1.footerTagline, baseline: COPY$1.footerBaseline })
  ] });
}
export {
  DropshippingLanding as component
};
