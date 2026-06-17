import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import { C as ConfirmDialog } from "./_ssr/ConfirmDialog-0O7-VzQ4.mjs";
import "./_libs/seroval.mjs";
import { Q as Plus, q as Power, t as Trash2 } from "./_libs/lucide-react.mjs";
import { o as objectType, b as booleanType, s as stringType, n as numberType } from "./_libs/zod.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
const getAffiliatesOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("84c2bc4171d1fa57bcb1647c93914165714018ec3c0f0accfa1a900dc7d46965"));
const createAffiliateCode = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  code: stringType().min(2).max(40).regex(/^[a-zA-Z0-9_-]+$/),
  label: stringType().max(120).optional().nullable(),
  trial_days: numberType().int().min(1).max(90).default(5)
})).handler(createSsrRpc("ab5289154fc4378c2ba73d209b6ede80f3e700df5b27bb90f1ea99bd63945399"));
const toggleAffiliateCode = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid(),
  active: booleanType()
})).handler(createSsrRpc("2ea8b7687828bd595f3953a74cd2a21c28a4d7f5a772d8c2717b619863149366"));
const deleteAffiliateCode = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(createSsrRpc("9ac8a4a38987eb55f0fdd493340ef7cec75bebce8c9743c63c7653427f596d39"));
function AffiliatesPage() {
  const fetchAffiliatesOverview = useServerFn(getAffiliatesOverview);
  const createCode = useServerFn(createAffiliateCode);
  const setCodeActive = useServerFn(toggleAffiliateCode);
  const removeCode = useServerFn(deleteAffiliateCode);
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    code: "",
    label: "",
    trial_days: 5
  });
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setData(await fetchAffiliatesOverview());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const doCreate = async () => {
    try {
      await createCode({
        data: {
          code: form.code,
          label: form.label || null,
          trial_days: form.trial_days
        }
      });
      setShowCreate(false);
      setForm({
        code: "",
        label: "",
        trial_days: 5
      });
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const doToggle = async (id, active) => {
    try {
      await setCodeActive({
        data: {
          id,
          active: !active
        }
      });
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await removeCode({
        data: {
          id: deleteId
        }
      });
      setDeleteId(null);
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Croissance" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1", children: "Affiliation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "admin-btn", onClick: () => setShowCreate(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "inline mr-1" }),
        "Nouveau code"
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Codes actifs", value: `${data?.activeCodes ?? 0} / ${data?.totalCodes ?? 0}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Total parrainages", value: `${data?.totalReferrals ?? 0}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Conversions", value: `${data?.conversionCount ?? 0}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Taux de conversion", value: `${data?.conversionRate ?? 0}%` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-black text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Label" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Trial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Usage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Conversions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Taux" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "p-6 text-center", children: "Chargement…" }) }) : (data?.codes ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "p-6 text-center", children: "Aucun code" }) }) : data.codes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-black/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono font-bold uppercase", children: c.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: c.label ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right", children: [
          c.trial_days,
          " j"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-bold", children: c.usage }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: c.conversion }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right", children: [
          c.conversion_rate,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `admin-pill ${c.active ? "bg-green-100 text-green-800" : "bg-black/10"}`, children: c.active ? "Actif" : "Inactif" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost text-xs", onClick: () => doToggle(c.id, c.active), title: c.active ? "Désactiver" : "Activer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost text-xs", onClick: () => setDeleteId(c.id), title: "Supprimer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] })
      ] }, c.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: showCreate, title: "Créer un code d'affiliation", confirmLabel: "Créer", onClose: () => setShowCreate(false), onConfirm: doCreate, disabled: form.code.trim().length < 2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input w-full", placeholder: "ex: SUMMER25", value: form.code, onChange: (e) => setForm({
          ...form,
          code: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Label (interne)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input w-full", value: form.label, onChange: (e) => setForm({
          ...form,
          label: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Jours d'essai" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 90, className: "admin-input w-full", value: form.trial_days, onChange: (e) => setForm({
          ...form,
          trial_days: Number(e.target.value)
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: !!deleteId, title: "Supprimer ce code ?", description: "Cette action est irréversible. Les parrainages déjà créés resteront associés au code historique.", confirmLabel: "Supprimer", destructive: true, onClose: () => setDeleteId(null), onConfirm: doDelete })
  ] });
}
function KPI({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider opacity-70 font-bold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black mt-1", children: value })
  ] });
}
export {
  AffiliatesPage as component
};
