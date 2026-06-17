import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as BLOG_POSTS } from "./router-CzeTO2qA.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-jk6XecbE.mjs";
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
import "./BetaCtaButton-CRBDQVwZ.mjs";
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
function BlogIndex() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { variant: "cod" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "brutal-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4", children: "▍ BLOG · GUIDES RENTABILITÉ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]", children: [
        "Le blog qui te dit la ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "vérité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "sur ta rentabilité e-commerce."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base md:text-lg max-w-2xl text-muted-foreground", children: "Pas de promesse magique. Des formules, des benchmarks, des stratégies qui marchent en Dropshipping et en COD Afrique." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-[1200px] mx-auto px-4 md:px-6 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: BLOG_POSTS.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "brutal-border bg-background p-6 flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0_0_hsl(var(--accent))] transition-transform", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-widest font-bold text-accent mb-3", children: [
        post.category,
        " · ",
        post.readMin,
        " min"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl font-black tracking-tight leading-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog/$slug", params: {
        slug: post.slug
      }, className: "hover:text-accent", children: post.title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed flex-1", children: post.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog/$slug", params: {
        slug: post.slug
      }, className: "mt-5 inline-block brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-accent-foreground hover:border-accent", children: "Lire l'article →" })
    ] }, post.slug)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { tagline: "On t'apprend à compter.", baseline: "Pour que tu arrêtes de te mentir." })
  ] });
}
export {
  BlogIndex as component
};
