import { j as jsxRuntimeExports } from "./_libs/react.mjs";
function AppErrorBoundary({
  error,
  reset
}) {
  if (typeof console !== "undefined") {
    console.error("[_app errorBoundary]", error);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 md:px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "ERREUR" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight", children: "Cette page n'a pas pu charger." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Un problème est survenu côté serveur ou réseau. Tes données ne sont pas perdues." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => reset(), className: "brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent", children: "Réessayer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/dashboard", className: "brutal-border px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background", children: "Retour dashboard" })
    ] })
  ] }) });
}
export {
  AppErrorBoundary as errorComponent
};
