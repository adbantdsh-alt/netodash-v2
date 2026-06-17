import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const SplitErrorComponent = ({
  error,
  reset
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black", children: "Erreur" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-mono", children: error.message }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "mt-6 brutal-border px-6 py-3 font-bold uppercase", children: "Réessayer" })
] }) });
export {
  SplitErrorComponent as errorComponent
};
