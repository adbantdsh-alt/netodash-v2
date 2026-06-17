import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-CzeTO2qA.mjs";
import { L as Logo } from "./Logo-DK9rHYhn.mjs";
import { B as BetaCtaButton } from "./BetaCtaButton-CRBDQVwZ.mjs";
function SiteHeader({ variant }) {
  const { user, loading } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const other = variant === "dropshipping" ? "cod" : "dropshipping";
  const otherLabel = other === "cod" ? "Tu fais du COD ?" : "Tu fais du Dropshipping ?";
  const otherHref = `/${other}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 bg-background brutal-border-thin border-t-0 border-l-0 border-r-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#top", className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Logo,
          {
            mode: variant,
            priority: true,
            className: "h-8 md:h-10 w-auto object-contain shrink-0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden lg:inline ml-1 brutal-border-thin px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono bg-accent text-accent-foreground border-accent", children: variant === "cod" ? "COD · FCFA" : "Dropshipping" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: otherHref,
            className: "px-3 py-2 font-bold uppercase tracking-wider text-xs hover:text-accent underline underline-offset-4 decoration-dotted",
            children: [
              otherLabel,
              " →"
            ]
          }
        ),
        !loading && user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/dashboard",
            className: "brutal-border bg-accent text-accent-foreground px-5 py-2.5 font-bold uppercase tracking-wider text-sm border-accent",
            children: "Dashboard →"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/calculateur-roas",
              className: "px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent",
              children: "Calc. ROAS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "#pricing",
              className: "px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent",
              children: "Tarifs"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/contact",
              className: "px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent",
              children: "Contact"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/auth",
              className: "px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent",
              children: "Connexion"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "header" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:hidden items-center gap-2", children: [
        !loading && user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/dashboard",
            className: "brutal-border bg-accent text-accent-foreground border-accent px-3 py-2 font-bold uppercase tracking-wider text-xs",
            children: "Dashboard →"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "headerMobile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setOpen((v) => !v),
            "aria-label": "Menu",
            "aria-expanded": open,
            className: "brutal-border-thin px-3 py-2 font-black",
            children: open ? "✕" : "☰"
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "max-w-[1400px] mx-auto px-4 py-3 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: otherHref,
          onClick: () => setOpen(false),
          className: "px-2 py-3 font-bold uppercase tracking-wider text-xs border-b border-foreground/20 text-accent",
          children: [
            otherLabel,
            " →"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/calculateur-roas",
          onClick: () => setOpen(false),
          className: "px-2 py-3 font-bold uppercase tracking-wider text-sm border-b border-foreground/20",
          children: "Calculateur ROAS gratuit"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#pricing",
          onClick: () => setOpen(false),
          className: "px-2 py-3 font-bold uppercase tracking-wider text-sm border-b border-foreground/20",
          children: "Tarifs"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/contact",
          onClick: () => setOpen(false),
          className: "px-2 py-3 font-bold uppercase tracking-wider text-sm border-b border-foreground/20",
          children: "Contact"
        }
      ),
      !loading && !user && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/auth",
          onClick: () => setOpen(false),
          className: "px-2 py-3 font-bold uppercase tracking-wider text-sm",
          children: "Connexion"
        }
      )
    ] }) })
  ] });
}
function SiteFooter({
  tagline,
  baseline
}) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t-2 border-foreground bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/netodash-logo.png",
              alt: "NETODASH",
              width: 40,
              height: 40,
              loading: "lazy",
              decoding: "async",
              className: "w-10 h-10 object-contain"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-xl tracking-tight", children: "NETODASH" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-background/70 leading-relaxed", children: tagline })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black uppercase tracking-widest text-xs mb-4", children: "Produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 font-mono text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dropshipping", className: "text-background/70 hover:text-accent", children: "Pour Dropshipping" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cod", className: "text-background/70 hover:text-accent", children: "Pour COD (Afrique)" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/calculateur-roas", className: "text-background/70 hover:text-accent", children: "Calculateur ROAS gratuit" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "text-background/70 hover:text-accent", children: "Blog" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "text-background/70 hover:text-accent", children: "Tarifs" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-background/70 hover:text-accent", children: "Contact" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black uppercase tracking-widest text-xs mb-4", children: "Légal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 font-mono text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/mentions", className: "text-background/70 hover:text-accent", children: "Mentions légales" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/cgu", className: "text-background/70 hover:text-accent", children: "CGU" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/cgv", className: "text-background/70 hover:text-accent", children: "CGV" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/privacy", className: "text-background/70 hover:text-accent", children: "Confidentialité" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/legal/cookies", className: "text-background/70 hover:text-accent", children: "Cookies" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black uppercase tracking-widest text-xs mb-4", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 font-mono text-sm text-background/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:support@netodash.com", className: "hover:text-accent break-all", children: "support@netodash.com" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Éditeur : NETODASH" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Hébergeur : Cloudflare, Inc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Paiements : Stripe 🔒" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-widest text-background/70", children: [
        "© ",
        year,
        " NETODASH · ",
        baseline
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-background/70", children: "Tous droits réservés." })
    ] })
  ] }) });
}
export {
  SiteHeader as S,
  SiteFooter as a
};
