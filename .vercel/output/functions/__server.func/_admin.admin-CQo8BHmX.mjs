import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { d as useLocation, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import { g as getSupabaseAuthHeaders } from "./_ssr/auth-headers-CoHEPMfY.mjs";
import "./_libs/seroval.mjs";
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
import "./_ssr/client-IbqXIlEo.mjs";
const getAdminOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("633310c2c40dc57a0d4849ced63480c79b7913982ee1c41f737daebd617e6cb1"));
function AdminRouteContent() {
  const location = useLocation();
  if (location.pathname !== "/admin") return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminOverview, {});
}
function AdminOverview() {
  const fetchOverview = useServerFn(getAdminOverview);
  const [data, setData] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const headers = await getSupabaseAuthHeaders();
        const data2 = await fetchOverview({
          headers
        });
        setData(data2);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Erreur");
      }
    })();
  }, [fetchOverview]);
  if (err) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
    "Erreur : ",
    err
  ] });
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest", children: "Chargement…" });
  const fmtUsd = (n) => n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
  const mrrSeries = data.mrrSeries12mo ?? [];
  const activity = data.activity ?? [];
  const max = Math.max(1, ...mrrSeries.map((d) => d.value));
  const growth = data.mrrGrowthPct;
  const growthLabel = growth === null ? "—" : growth >= 0 ? `+${growth}%` : `${growth}%`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-6", children: "Vue d'ensemble" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "MRR réel", value: fmtUsd(data.mrr), hint: "Abonnements actifs payants" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "MRR mois précédent", value: fmtUsd(data.mrrPrevMonth), hint: `Variation ${growthLabel}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Croissance MRR", value: growthLabel, hint: "vs fin du mois précédent", tone: growth !== null && growth >= 0 ? "success" : growth !== null ? "warning" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "ARR", value: fmtUsd(data.arr), hint: "MRR × 12" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Utilisateurs inscrits", value: String(data.userCounts.total) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Utilisateurs payants", value: String(data.userCounts.paying) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "En trial", value: String(data.userCounts.trial) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Free", value: String(data.userCounts.free) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Nouveaux abonnés (mois)", value: String(data.newSubsThisMonth) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Churned (mois)", value: String(data.churnedThisMonth) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Churn rate", value: `${data.churnRatePct}%` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "LTV estimée", value: data.ltvEstimated != null ? fmtUsd(data.ltvEstimated) : "—", hint: "MRR moyen / churn rate" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3", children: "MRR par plan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Prix" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Abonnés" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "MRR" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (data.mrrByPlan ?? []).map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-bold", children: row.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
            "$",
            row.priceUsd,
            "/mois"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: row.count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtUsd(row.mrr) })
        ] }, row.plan)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3", children: "MRR · 12 mois glissants" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1 h-40", children: mrrSeries.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: `${d.date} · ${fmtUsd(d.value)}`, style: {
          width: "100%",
          height: `${d.value / max * 100}%`,
          background: d.value > 0 ? "#E05C1A" : "#eee",
          minHeight: 2
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] opacity-50 truncate w-full text-center", children: d.date.slice(5) })
      ] }, d.date)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3", children: "Activité récente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Détail" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: activity.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(a.at).toLocaleString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": a.type === "signup" ? "accent" : "success", children: a.type === "signup" ? "Inscription" : "Paiement" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.detail })
        ] }, i)) })
      ] })
    ] })
  ] });
}
function Kpi({
  label,
  value,
  hint,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black mt-2", style: tone === "success" ? {
      color: "#1f8a4c"
    } : tone === "warning" ? {
      color: "#c0392b"
    } : void 0, children: value }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-50 mt-1", children: hint })
  ] });
}
export {
  AdminRouteContent as component
};
