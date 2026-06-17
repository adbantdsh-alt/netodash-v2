import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as Route$s, B as BLOG_POSTS } from "./router-CzeTO2qA.mjs";
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
function BlogPostPage() {
  const {
    post
  } = Route$s.useLoaderData();
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { variant: "cod" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Fil d'Ariane", className: "max-w-[1000px] mx-auto px-4 md:px-6 pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-accent", children: "Accueil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "hover:text-accent", children: "Blog" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold truncate", children: post.category })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "max-w-[820px] mx-auto px-4 md:px-6 py-10 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-widest text-accent font-bold mb-4", children: [
        post.category,
        " · ",
        post.readMin,
        " min de lecture"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-[1.05]", children: post.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base md:text-lg text-muted-foreground leading-relaxed", children: post.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose-blog mt-10", dangerouslySetInnerHTML: {
        __html: post.html
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 brutal-border bg-accent text-accent-foreground border-accent p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest font-bold opacity-80", children: "▍ NETODASH" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl md:text-3xl font-black tracking-tight", children: "Calcule ta rentabilité réelle en 5 minutes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm md:text-base opacity-90", children: "Plus jamais d'Excel. ROAS net, marge réelle, taux de livraison COD — Netodash le fait pour toi." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BetaCtaButton, { variant: "hero", className: "mt-5 px-6 py-3 text-sm border-foreground" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter uppercase", children: "À lire aussi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid md:grid-cols-3 gap-5", children: others.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
        slug: o.slug
      }, className: "brutal-border bg-background p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_hsl(var(--accent))] transition-transform block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-widest font-bold text-accent mb-2", children: o.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-base leading-tight", children: o.title })
      ] }, o.slug)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { tagline: "On t'apprend à compter.", baseline: "Pour que tu arrêtes de te mentir." })
  ] });
}
export {
  BlogPostPage as component
};
