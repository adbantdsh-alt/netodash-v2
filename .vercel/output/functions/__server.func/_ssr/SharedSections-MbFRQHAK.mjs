import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as BetaCtaButton } from "./BetaCtaButton-CRBDQVwZ.mjs";
import { b as ShieldCheck, L as Lock, c as CircleX, B as BadgeCheck, d as Server } from "../_libs/lucide-react.mjs";
const stripeLogo = "/assets/stripe-logo-nU66YpgM.png";
function TrustStats({ stats }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl md:text-4xl font-black tracking-tighter text-accent", children: s.v }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-70", children: s.l })
  ] }, s.l)) }) });
}
function Pillars({ pillars }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 grid md:grid-cols-3", children: pillars.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `p-10 ${i < 2 ? "md:border-r border-foreground" : ""} ${i > 0 ? "border-t md:border-t-0 border-foreground" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-accent font-mono font-bold mb-4", children: item.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black mb-3", children: item.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: item.d })
      ]
    },
    item.n
  )) }) });
}
function BeforeAfter({ copy }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: copy.beforeAfterEyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-2 max-w-4xl", children: [
      copy.beforeAfterTitle,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: copy.beforeAfterAccent })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-8 bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin px-3 py-1 inline-block text-[10px] uppercase tracking-widest font-bold mb-5", children: copy.beforeAfterBeforeBadge }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4 font-mono text-sm", children: copy.beforeAfterBeforeRows.map((r, i) => {
          const isLast = i === copy.beforeAfterBeforeRows.length - 1;
          const valueClass = r.mode === "accent" ? "text-accent" : "text-foreground";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: `flex justify-between gap-4 ${isLast ? "" : "border-b border-foreground/20 pb-3"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: r.k }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-black ${valueClass}`, children: r.v })
              ]
            },
            r.k
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-sm text-muted-foreground leading-relaxed", children: [
          copy.beforeAfterBeforeFooter.plain,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: copy.beforeAfterBeforeFooter.bold })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border border-accent p-8 bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-accent bg-accent text-accent-foreground px-3 py-1 inline-block text-[10px] uppercase tracking-widest font-bold mb-5", children: copy.beforeAfterAfterBadge }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4 font-mono text-sm", children: copy.beforeAfterAfterRows.map((r, i) => {
          const isLast = i === copy.beforeAfterAfterRows.length - 1;
          const valueClass = r.mode === "accent" ? "text-accent" : "text-foreground";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: `flex justify-between gap-4 ${isLast ? "" : "border-b border-foreground/20 pb-3"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: r.k }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-black ${valueClass}`, children: r.v })
              ]
            },
            r.k
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-sm text-muted-foreground leading-relaxed", children: [
          copy.beforeAfterAfterFooter.plain,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: copy.beforeAfterAfterFooter.bold })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-10 max-w-3xl font-mono text-sm md:text-base text-muted-foreground", children: [
      copy.beforeAfterTagline.plain,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: copy.beforeAfterTagline.bold })
    ] })
  ] }) });
}
function ProductRanking({
  copy,
  mode
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3", children: copy.rankingEyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl", children: [
      copy.rankingTitle,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden md:block" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: copy.rankingTitleAccent }),
      " ?"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-5 max-w-2xl text-base md:text-lg", children: copy.rankingLead }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border mt-10 overflow-x-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full font-mono text-sm min-w-[720px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-xs uppercase tracking-widest", children: copy.rankingCols.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: i === 0 ? "text-left p-4" : i === copy.rankingCols.length - 1 ? "text-center p-4" : "text-right p-4",
          children: c
        },
        c
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: copy.rankingRows.map((row) => {
        const statusClass = row.status === "RENTABLE" ? "bg-foreground text-background border-foreground" : row.status === "BREAK EVEN" ? "bg-background text-foreground border-foreground" : "bg-accent text-accent-foreground border-accent";
        const profitGood = mode === "cod" ? row.profit >= 5e5 : row.profit >= 2e3;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-foreground/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-black text-foreground tracking-tight text-base", children: row.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 text-right tabular", children: [
            copy.rankingCurrencyPrefix,
            row.rev.toLocaleString("fr-FR")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 text-right tabular text-muted-foreground", children: [
            copy.rankingCurrencyPrefix,
            row.ads.toLocaleString("fr-FR")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `p-4 text-right tabular font-black ${profitGood ? "text-foreground" : "text-accent"}`, children: [
            copy.rankingCurrencyPrefix,
            row.profit.toLocaleString("fr-FR")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 text-right tabular", children: [
            row.margin.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `brutal-border-thin inline-block px-3 py-1 text-[10px] font-black tracking-widest ${statusClass}`, children: row.status }) })
        ] }, row.name);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-mono text-xs md:text-sm text-muted-foreground max-w-2xl", children: copy.rankingFooter })
  ] }) });
}
function DecisionEngine({ copy }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest opacity-70 font-bold mb-3", children: copy.decisionEyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]", children: [
      copy.decisionTitle.a,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: copy.decisionTitle.b }),
      " ",
      copy.decisionTitle.c
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base md:text-lg opacity-80 max-w-2xl", children: copy.decisionLead }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-0 mt-12 brutal-border border-background", children: copy.decisionRules.map((rule, i) => {
      const isKill = i === 2;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `p-8 md:p-10 ${i < 2 ? "border-b md:border-b-0 md:border-r border-background bg-background text-foreground" : "bg-accent text-accent-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `${i === 0 ? "bg-foreground text-background brutal-border-thin" : isKill ? "bg-accent-foreground text-accent brutal-border-thin border-accent-foreground" : "brutal-border-thin"} px-3 py-1 inline-block text-[10px] font-black tracking-widest mb-5`,
                children: rule.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xl md:text-2xl font-black leading-tight", children: [
              rule.ruleA,
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isKill ? "opacity-70" : "text-muted-foreground", children: rule.ruleConn }),
              " ",
              rule.ruleB
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-5 text-sm ${isKill ? "opacity-90" : "text-muted-foreground"}`, children: rule.copy })
          ]
        },
        rule.name
      );
    }) })
  ] }) });
}
function Testimonials({ copy }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: copy.testimonialsEyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-2 max-w-3xl", children: [
      copy.testimonialsTitle,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: copy.testimonialsTitleAccent })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-5 max-w-2xl text-base md:text-lg", children: copy.testimonialsLead }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12", children: copy.testimonials.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-5 bg-background flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: t.photo,
            alt: t.name,
            width: 48,
            height: 48,
            loading: "lazy",
            className: "w-12 h-12 brutal-border-thin shrink-0 bg-muted object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-sm leading-tight", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
            t.city,
            " · ",
            t.niche
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-0 brutal-border-thin", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-r border-foreground/30 bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground font-bold", children: "Avant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black tracking-tight mt-0.5 line-through opacity-60", children: t.before.v }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground", children: t.before.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-accent text-accent-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest opacity-80 font-bold", children: "Après" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black tracking-tight mt-0.5", children: t.after.v }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest opacity-80", children: t.after.label })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground flex-1", children: [
        "« ",
        t.note,
        " »"
      ] })
    ] }, t.name)) })
  ] }) });
}
function TrustSecurity() {
  const items = [
    { Icon: ShieldCheck, t: "Tes données t'appartiennent", d: "Isolation stricte par compte (RLS Postgres). Personne ne lit tes chiffres. Jamais.", tag: "RLS · AES-256" },
    { Icon: Lock, t: "Shopify en lecture seule", d: "Sync OAuth read-only sur les commandes. Déconnexion en 1 clic. Aucune écriture sur ta boutique.", tag: "OAuth read-only" },
    { Icon: CircleX, t: "Annulation en 1 clic", d: "Sans engagement, sans hotline. L'accès reste actif jusqu'à la fin de la période payée.", tag: "Sans friction" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3", children: "Sécurité & confiance" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-black tracking-tighter mb-12 max-w-3xl", children: [
      "POURQUOI ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "NOUS FAIRE CONFIANCE" }),
      " ?"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-0 brutal-border", children: items.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `p-7 md:p-8 bg-background ${idx < 2 ? "md:border-r md:border-foreground" : ""} ${idx === 1 ? "border-y md:border-y-0 border-foreground" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 brutal-border-thin bg-foreground text-background flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.Icon, { className: "w-7 h-7", strokeWidth: 2.25 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg md:text-xl tracking-tight mb-1", children: c.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-[3px] bg-accent mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs md:text-sm text-muted-foreground leading-relaxed", children: c.d }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 inline-block text-[10px] uppercase tracking-widest font-bold text-accent", children: c.tag })
        ]
      },
      c.t
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 brutal-border-thin px-5 md:px-7 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "w-5 h-5 shrink-0 text-accent", strokeWidth: 2.5 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] md:text-xs uppercase tracking-widest font-bold", children: "Paiements Stripe · Certifié PCI-DSS niveau 1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-5 h-5 shrink-0 text-accent", strokeWidth: 2.5 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] md:text-xs uppercase tracking-widest font-bold", children: "Hébergement Cloudflare · Edge mondial · DDoS protégé" })
      ] })
    ] })
  ] }) });
}
function Pricing({
  copy,
  fcfaEquivalent = false
}) {
  const fcfaMap = {
    "$12": "≈ 7 200 F",
    "$29": "≈ 17 400 F",
    "$79": "≈ 47 400 F"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "pricing", className: "brutal-border-thin border-l-0 border-r-0 border-b-0 scroll-mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: copy.pricingEyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mt-2 max-w-4xl", children: [
      copy.pricingTitle,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: copy.pricingTitleAccent })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm md:text-base text-muted-foreground mt-6 max-w-2xl", children: copy.pricingLead }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 items-stretch", children: copy.plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col relative ${p.highlight ? "brutal-border border-accent bg-background md:scale-[1.04] md:-my-2 shadow-[8px_8px_0_0_hsl(var(--accent))] p-8" : "brutal-border-thin bg-muted/20 p-7 opacity-95"}`,
        children: [
          p.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground brutal-border-thin border-accent px-4 py-1.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap", children: "★ LE CHOIX DES OPÉRATEURS SÉRIEUX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "PLAN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-black tracking-tight mt-1 ${p.highlight ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`, children: p.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-black tracking-tighter ${p.highlight ? "text-6xl md:text-7xl text-accent" : "text-4xl md:text-5xl"}`, children: p.price }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: p.period })
          ] }),
          fcfaEquivalent && fcfaMap[p.price] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-accent font-bold mb-1", children: [
            fcfaMap[p.price],
            " / mois"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: p.tagline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 mb-6 flex-1", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "✓" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
          ] }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: p.highlight ? "cardHighlight" : "card" })
        ]
      },
      p.name
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 brutal-border-thin p-6 md:p-8 bg-muted/40 flex flex-col md:flex-row md:items-center gap-5 md:gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex items-center justify-center bg-background brutal-border-thin px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: stripeLogo, alt: "Stripe", className: "h-8 md:h-10 w-auto object-contain", loading: "lazy" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg md:text-xl tracking-tight mb-1", children: "PAIEMENT 100 % SÉCURISÉ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs md:text-sm text-muted-foreground leading-relaxed", children: [
          "Carte bancaire traitée par ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: "Stripe" }),
          ".",
          fcfaEquivalent && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " Pour l'Afrique : ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: "Wave, Orange Money, Free Money" }),
            " via Mobile Money lors du checkout."
          ] }),
          " ",
          "Aucun engagement, annulation à tout moment."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 shrink-0", children: (fcfaEquivalent ? ["VISA", "WAVE", "OM", "SSL"] : ["VISA", "MASTERCARD", "SSL"]).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin px-2.5 py-1 text-[10px] font-black tracking-widest font-mono", children: b }, b)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl md:text-4xl font-black tracking-tighter mb-8", children: "QUESTIONS FRÉQUENTES" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-6", children: copy.faq.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-lg mb-2", children: item.q }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: item.a })
      ] }, item.q)) })
    ] })
  ] }) });
}
function FinalCta({ copy }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter", children: [
      copy.ctaTitle,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: copy.ctaTitleAccent })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm md:text-base mt-6 text-background/70 max-w-xl mx-auto", children: copy.ctaLead }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "final" }) })
  ] }) });
}
const COMP_ROWS = [
  { label: "Prix d'entrée / mois", netodash: "$12", triple: "$129", beprofit: "$25", lifetimely: "$19", highlight: true },
  { label: "Plan illimité produits", netodash: "$79", triple: "$299+", beprofit: "$99", lifetimely: "$149" },
  { label: "Essai gratuit 14 jours", netodash: true, triple: false, beprofit: true, lifetimely: true },
  { label: "Sans carte bancaire", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "ROAS net (après COGS + frais)", netodash: true, triple: true, beprofit: true, lifetimely: true },
  { label: "Profit / commande en temps réel", netodash: true, triple: true, beprofit: true, lifetimely: true },
  { label: "Ranking produits winners / losers", netodash: true, triple: "Limité", beprofit: false, lifetimely: "Limité" },
  { label: "Décomposition coûts détaillée", netodash: true, triple: true, beprofit: true, lifetimely: true },
  { label: "Break-even & simulateur de scaling", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Insights automatiques (alertes)", netodash: true, triple: true, beprofit: false, lifetimely: false },
  { label: "Mode COD (cash on delivery)", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Multi-devises (USD, EUR, FCFA…)", netodash: true, triple: "USD only", beprofit: "USD only", lifetimely: "USD only" },
  { label: "Saisie manuelle + import", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Interface FR native", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Setup en moins de 60s", netodash: true, triple: false, beprofit: false, lifetimely: false }
];
function CompCellRender({ v, accent }) {
  if (typeof v === "boolean") {
    return v ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accent ? "text-accent font-black text-lg" : "text-foreground/80 font-bold", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 font-mono text-sm", children: "—" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accent ? "text-accent font-black" : "font-mono text-xs md:text-sm text-foreground/80", children: v });
}
function CompetitorComparison() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background brutal-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-3xl mx-auto mb-10 md:mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-accent mb-3", children: "Netodash vs la concurrence" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-4", children: [
        "Pourquoi payer ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through text-muted-foreground", children: "$129/mois" }),
        " ",
        "quand ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "$12" }),
        " suffisent ?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-lg text-muted-foreground", children: "Comparaison honnête face à TripleWhale, BeProfit et Lifetimely. Mêmes métriques essentielles, fraction du prix, pensé pour les dropshippers qui scalent à partir de zéro." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block brutal-border bg-background overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "brutal-border-thin border-l-0 border-r-0 border-t-0 bg-foreground text-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 font-black uppercase tracking-wider text-xs", children: "Fonctionnalité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 bg-accent text-accent-foreground font-black uppercase tracking-wider text-xs", children: "Netodash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 font-black uppercase tracking-wider text-xs", children: "TripleWhale" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 font-black uppercase tracking-wider text-xs", children: "BeProfit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 font-black uppercase tracking-wider text-xs", children: "Lifetimely" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: COMP_ROWS.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: `brutal-border-thin border-l-0 border-r-0 border-t-0 ${i === COMP_ROWS.length - 1 ? "border-b-0" : ""} ${r.highlight ? "bg-accent/5" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm font-bold", children: r.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompCellRender, { v: r.netodash, accent: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompCellRender, { v: r.triple }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompCellRender, { v: r.beprofit }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompCellRender, { v: r.lifetimely }) })
          ]
        },
        r.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden space-y-6", children: ["triple", "beprofit", "lifetimely"].map((comp) => {
      const label = comp === "triple" ? "TripleWhale" : comp === "beprofit" ? "BeProfit" : "Lifetimely";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-foreground text-background px-4 py-3 font-black uppercase tracking-wider text-xs flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Netodash" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "vs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: COMP_ROWS.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `px-4 py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center text-xs ${i !== COMP_ROWS.length - 1 ? "border-b border-foreground/10" : ""} ${r.highlight ? "bg-accent/5" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: r.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center min-w-[40px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompCellRender, { v: r.netodash, accent: true }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center min-w-[40px] opacity-70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompCellRender, { v: r[comp] }) })
            ]
          },
          r.label
        )) })
      ] }, comp);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6", children: [
      { name: "Starter", price: "$12", desc: "3 produits · 1 mode · 60j d'historique" },
      { name: "Pro", price: "$29", desc: "10 produits · Drop + COD · upsells · multi-zones", featured: true },
      { name: "Scale", price: "$79", desc: "Illimité · Analytics Pro · WhatsApp prio" }
    ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `brutal-border p-5 md:p-6 ${p.featured ? "bg-accent text-accent-foreground border-accent" : "bg-background"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono uppercase tracking-widest opacity-70", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl md:text-5xl font-black tracking-tighter mt-1", children: [
            p.price,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold opacity-70", children: "/mois" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-3 opacity-80", children: p.desc })
        ]
      },
      p.name
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "hero" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[11px] font-mono text-muted-foreground", children: "Sans CB · Annulation en 1 clic · Tarifs comparés au 06/2026, susceptibles d'évolution chez les concurrents" })
    ] })
  ] }) });
}
export {
  BeforeAfter as B,
  CompetitorComparison as C,
  DecisionEngine as D,
  FinalCta as F,
  Pillars as P,
  TrustStats as T,
  ProductRanking as a,
  Testimonials as b,
  TrustSecurity as c,
  Pricing as d
};
