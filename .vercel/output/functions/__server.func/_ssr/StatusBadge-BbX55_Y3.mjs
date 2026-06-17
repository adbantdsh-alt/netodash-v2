import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function StatusBadge({ status }) {
  const map = {
    active: { tone: "success", label: "Actif" },
    suspended: { tone: "warning", label: "Suspendu" },
    banned: { tone: "danger", label: "Banni" },
    pro: { tone: "accent", label: "PRO" },
    starter: { tone: "neutral", label: "Starter" },
    basic: { tone: "neutral", label: "Basic" },
    trial: { tone: "warning", label: "Trial" },
    free: { tone: "neutral", label: "Gratuit" },
    succeeded: { tone: "success", label: "Payé" },
    paid: { tone: "success", label: "Payé" },
    failed: { tone: "danger", label: "Échoué" },
    refunded: { tone: "warning", label: "Remboursé" }
  };
  const m = map[status] ?? { tone: "neutral", label: status };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": m.tone, children: m.label });
}
export {
  StatusBadge as S
};
