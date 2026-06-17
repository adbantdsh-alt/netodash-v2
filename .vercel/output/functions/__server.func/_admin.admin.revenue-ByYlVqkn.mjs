import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import { C as ConfirmDialog } from "./_ssr/ConfirmDialog-0O7-VzQ4.mjs";
import "./_libs/seroval.mjs";
import { f as Search, v as ChevronLeft, u as ChevronRight, J as TrendingUp, N as TrendingDown } from "./_libs/lucide-react.mjs";
import { o as objectType, s as stringType, n as numberType } from "./_libs/zod.mjs";
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
const getRevenueOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("d90db92a5b1aa8cd98e25fa11c454bd02c3a8d66e192de960901e0262fc6c9a4"));
const listTransactions = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).inputValidator(objectType({
  page: numberType().int().min(1).default(1),
  pageSize: numberType().int().min(5).max(100).default(25),
  status: stringType().optional(),
  search: stringType().optional()
})).handler(createSsrRpc("22ba3b1f2142f2f422b91a2404e0e9ce1fb4724f79953143235aefbe10b56763"));
const refundTransaction = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  paymentId: stringType().uuid(),
  reason: stringType().min(3).max(500)
})).handler(createSsrRpc("9a53482d4ce5091fa6af146347ac5479d651f769c91825765a09e8b9f9e4d222"));
const fmt = (n) => `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
function RevenuePage() {
  const fetchRevenueOverview = useServerFn(getRevenueOverview);
  const fetchTransactions = useServerFn(listTransactions);
  const refundPayment = useServerFn(refundTransaction);
  const [overview, setOverview] = reactExports.useState(null);
  const [rows, setRows] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [refundFor, setRefundFor] = reactExports.useState(null);
  const [refundReason, setRefundReason] = reactExports.useState("");
  const pageSize = 25;
  const loadAll = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [ov, tx] = await Promise.all([fetchRevenueOverview(), fetchTransactions({
        data: {
          page,
          pageSize,
          search: search || void 0,
          status: status || void 0
        }
      })]);
      setOverview(ov);
      setRows(tx.rows);
      setTotal(tx.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadAll();
  }, [page, status]);
  const doRefund = async () => {
    if (!refundFor) return;
    try {
      await refundPayment({
        data: {
          paymentId: refundFor.id,
          reason: refundReason
        }
      });
      setRefundFor(null);
      setRefundReason("");
      loadAll();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const maxRev = Math.max(1, ...overview?.series.map((s) => s.revenue) ?? [1]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Finance" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1 mb-6", children: "Revenus" }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "MRR", value: fmt(overview?.mrr ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "ARR", value: fmt(overview?.arr ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Ce mois-ci", value: fmt(overview?.revenueThisMonth ?? 0), trend: overview?.growth }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "LTV moyen", value: fmt(overview?.ltv ?? 0), sub: `${overview?.payingUsers ?? 0} payants` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider mb-4 font-bold", children: "Revenus — 12 derniers mois" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2 h-40", children: (overview?.series ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-black", style: {
          height: `${s.revenue / maxRev * 100}%`,
          minHeight: 2
        }, title: `${s.month} : ${fmt(s.revenue)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono", children: s.month.slice(5) })
      ] }, s.month)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input pl-9 w-full", placeholder: "Référence, transaction ID…", value: search, onChange: (e) => setSearch(e.target.value), onKeyDown: (e) => e.key === "Enter" && (setPage(1), loadAll()) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "admin-input", value: status, onChange: (e) => {
        setPage(1);
        setStatus(e.target.value);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Tous statuts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "succeeded", children: "Succeeded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "Paid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Failed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "refunded", children: "Refunded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn", onClick: () => {
        setPage(1);
        loadAll();
      }, children: "Filtrer" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-black text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Référence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Montant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-6 text-center text-sm", children: "Chargement…" }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-6 text-center text-sm", children: "Aucune transaction" }) }) : rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-black/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs", children: r.reference }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: r.user_email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 uppercase font-bold", children: r.plan }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-bold", children: fmt(Number(r.amount)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-pill", children: r.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: new Date(r.created_at).toLocaleString("fr-FR") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: ["succeeded", "paid"].includes(String(r.status)) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost text-xs", onClick: () => setRefundFor(r), children: "Rembourser" }) })
      ] }, r.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        total,
        " transaction(s)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost", disabled: page <= 1, onClick: () => setPage((p) => p - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Page ",
          page,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost", disabled: page >= totalPages, onClick: () => setPage((p) => p + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfirmDialog, { open: !!refundFor, title: "Rembourser la transaction", description: refundFor ? `${refundFor.reference} — ${fmt(Number(refundFor.amount))}` : "", confirmLabel: "Confirmer le remboursement", onClose: () => {
      setRefundFor(null);
      setRefundReason("");
    }, onConfirm: doRefund, disabled: refundReason.trim().length < 3, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-2 mt-2", children: "Motif (obligatoire)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "admin-input w-full", rows: 3, value: refundReason, onChange: (e) => setRefundReason(e.target.value), placeholder: "Raison du remboursement…" })
    ] })
  ] });
}
function KPI({
  label,
  value,
  sub,
  trend
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider opacity-70 font-bold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black mt-1", children: value }),
    trend !== void 0 && trend !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? "text-green-700" : "text-[color:var(--admin-accent)]"}`, children: [
      trend >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 12 }),
      trend > 0 ? "+" : "",
      trend,
      "% vs mois précédent"
    ] }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-1 opacity-70", children: sub })
  ] });
}
export {
  RevenuePage as component
};
