import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  variant,
  destructive,
  requireReason = false,
  disabled = false,
  children,
  onConfirm,
  onCancel,
  onClose
}) {
  const [reason, setReason] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  if (!open) return null;
  const close = onCancel ?? onClose ?? (() => {
  });
  const v = variant ?? (destructive ? "danger" : "accent");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.6)" },
      onClick: close,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "admin-card w-full max-w-md",
          style: { background: "#fff" },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2", children: title }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mb-4", style: { color: "#444" }, children: description }),
            requireReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Raison (obligatoire)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  className: "admin-input w-full",
                  rows: 3,
                  value: reason,
                  onChange: (e) => setReason(e.target.value)
                }
              )
            ] }),
            children,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn", "data-variant": "outline", onClick: close, children: "Annuler" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "admin-btn",
                  "data-variant": v,
                  disabled: loading || disabled || requireReason && reason.trim().length < 3,
                  onClick: async () => {
                    setLoading(true);
                    try {
                      await onConfirm(requireReason ? reason : void 0);
                    } finally {
                      setLoading(false);
                      setReason("");
                    }
                  },
                  children: loading ? "..." : confirmLabel
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
export {
  ConfirmDialog as C
};
