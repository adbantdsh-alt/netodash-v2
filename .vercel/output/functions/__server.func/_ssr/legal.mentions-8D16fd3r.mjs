import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
function MentionsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalShell, { title: "Mentions légales", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Éditeur" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "NETODASH — service en ligne d'analyse de rentabilité COD." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Contact : support@netodash.com" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Directeur de la publication" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Le représentant légal de NETODASH." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Hébergement" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Cloudflare, Inc. — 101 Townsend Street, San Francisco, CA 94107, USA." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Propriété intellectuelle" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "L'ensemble des contenus du site (textes, logos, graphismes, code) sont la propriété exclusive de NETODASH, sauf mention contraire. Toute reproduction sans autorisation est interdite." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Responsabilité" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "NETODASH met tout en œuvre pour fournir des informations fiables, mais ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur le site." })
  ] });
}
function LegalShell({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "brutal-border-thin border-t-0 border-l-0 border-r-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/netodash-logo.png", alt: "NETODASH", className: "h-9 w-auto object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-mono text-xs uppercase tracking-widest hover:text-accent", children: "← Retour" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-black tracking-tighter mb-10", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5 font-mono text-sm leading-relaxed text-muted-foreground [&>h2]:text-foreground [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:text-base [&>h2]:mt-8 [&>h2]:mb-2", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-foreground mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-6 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " NETODASH"
    ] }) })
  ] });
}
export {
  LegalShell,
  MentionsPage as component
};
