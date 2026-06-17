import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import "./_libs/seroval.mjs";
import { z as ExternalLink } from "./_libs/lucide-react.mjs";
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
const adminGetBetaProgram = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("80885401ec1500b51bd0c1e4a8ee09e0edcc0d7314b235192e5e1476eb349b95"));
function AdminBetaTestersPage() {
  const fetchBeta = useServerFn(adminGetBetaProgram);
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  reactExports.useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        setData(await fetchBeta());
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchBeta]);
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", {
    dateStyle: "medium"
  }) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Programme bêta" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1 mb-6", children: "Bêta-testeurs" }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Places utilisées", value: loading ? "…" : `${data?.betaCount ?? 0} / ${data?.maxSpots ?? 10}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Places restantes", value: loading ? "…" : `${data?.spotsLeft ?? 0}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Liste d'attente", value: loading ? "…" : `${data?.waitlistCount ?? 0}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Accès gratuit", value: "Scale · 6 mois" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Remise à vie", value: "-50 %" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card p-0 overflow-x-auto mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-black/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg", children: "Inscrits au programme bêta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono", children: "Plan Scale gratuit 6 mois · -50 % à vie sur tous les plans · max 10 places" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Inscription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Nom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Compte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Gratuit jusqu'au" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Remise à vie" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Statut" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "p-6 text-center", children: "Chargement…" }) }) : (data?.testers ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "p-6 text-center", children: "Aucun bêta-testeur pour le moment" }) }) : data.testers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtDate(t.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-bold", children: t.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs", children: t.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": t.hasAccount ? "success" : "neutral", children: t.hasAccount ? "Créé" : "En attente" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: t.plan ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtDate(t.freeUntil ?? t.trialEndsAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-bold", children: [
            "-",
            t.lifetimeDiscountPercent,
            " %"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": "accent", children: t.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: t.userId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/users/$id", params: {
            id: t.userId
          }, className: "inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:text-[color:var(--admin-accent)]", children: [
            "Voir ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 })
          ] }) })
        ] }, t.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card p-0 overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-black/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg", children: "Liste d'attente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono", children: "Emails collectés quand les 10 places sont complètes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Nom" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "p-6 text-center", children: "Chargement…" }) }) : (data?.waitlist ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "p-6 text-center", children: "Liste d'attente vide" }) }) : data.waitlist.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtDate(w.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs", children: w.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.fullName ?? "—" })
        ] }, w.id)) })
      ] })
    ] })
  ] });
}
function Kpi({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black mt-2", children: value })
  ] });
}
export {
  AdminBetaTestersPage as component
};
