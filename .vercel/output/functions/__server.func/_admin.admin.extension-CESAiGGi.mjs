import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import "./_libs/seroval.mjs";
import { P as Puzzle, R as RefreshCw, O as Save, z as ExternalLink } from "./_libs/lucide-react.mjs";
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
const adminGetExtensionOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("add260f274306d96279d15f928ebd8e7779cad0a3856b22eda388edc5516e846"));
const adminUpdateExtensionSettings = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  cwsInstalls: numberType().int().min(0).max(1e7).optional(),
  cwsUrl: stringType().url().max(500).optional(),
  publishedVersion: stringType().min(1).max(32).optional()
})).handler(createSsrRpc("b22b3936379403e45a8c2fa2ca9352b1e5a80669b17fca307e2c9632c0e8a400"));
const EVENT_LABELS = {
  open: "Ouverture popup",
  capture: "Capture PNG",
  cta_click: "Clic newsletter",
  recalc: "Recalcul manuel"
};
function AdminExtensionPage() {
  const fetchOverview = useServerFn(adminGetExtensionOverview);
  const saveSettings = useServerFn(adminUpdateExtensionSettings);
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [cwsInstalls, setCwsInstalls] = reactExports.useState("");
  const [publishedVersion, setPublishedVersion] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchOverview();
      setData(res);
      setCwsInstalls(String(res.cwsInstalls));
      setPublishedVersion(res.publishedVersion);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, [fetchOverview]);
  const fmtDate = (iso) => new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  });
  const shortId = (id) => id.length > 12 ? `${id.slice(0, 8)}…` : id;
  const saveMeta = async () => {
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await saveSettings({
        data: {
          cwsInstalls: Number(cwsInstalls) || 0,
          publishedVersion: publishedVersion.trim() || void 0
        }
      });
      setSaved(true);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };
  const maxDaily = Math.max(1, ...(data?.dailyOpens ?? []).map((d) => d.opens));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Chrome Web Store" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "admin-h1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Puzzle, { size: 28 }),
          " Extension Netodash"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 font-mono max-w-2xl", children: "ROAS Net & Profit Calculator · Manifest V3 · Les stats « utilisateurs actifs » proviennent du tracking intégré à l'extension (v1.5.2+). Les installations Chrome Web Store se mettent à jour manuellement depuis le dashboard Google." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "admin-btn-ghost inline-flex items-center gap-2", onClick: () => load(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
        " Actualiser"
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    saved && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-green-600", children: "Paramètres enregistrés." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Installations CWS", value: loading ? "…" : String(data?.cwsInstalls ?? 0), hint: "Saisie manuelle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Utilisateurs trackés (30j)", value: loading ? "…" : String(data?.trackedUsers30d ?? 0), hint: "IDs uniques extension" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Utilisateurs actifs (7j)", value: loading ? "…" : String(data?.trackedUsers7d ?? 0), hint: "Au moins 1 ouverture" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Ouvertures aujourd'hui", value: loading ? "…" : String(data?.opensToday ?? 0) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Total événements", value: loading ? "…" : String(data?.eventsTotal ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Ouvertures (7j)", value: loading ? "…" : String(data?.opens7d ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Captures PNG (7j)", value: loading ? "…" : String(data?.captures7d ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Clics CTA (7j)", value: loading ? "…" : String(data?.ctaClicks7d ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Inscriptions site", value: loading ? "…" : String(data?.siteSignupsExtension ?? 0), hint: "referral extension/chrome" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg mb-4", children: "Paramètres Chrome Web Store" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-widest font-bold block mb-1", children: "Installations (depuis le dashboard Google)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, className: "admin-input w-full", value: cwsInstalls, onChange: (e) => setCwsInstalls(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-widest font-bold block mb-1", children: "Version publiée" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input w-full", value: publishedVersion, onChange: (e) => setPublishedVersion(e.target.value), placeholder: "1.5.1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "admin-btn inline-flex items-center gap-2", disabled: saving, onClick: () => saveMeta(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
            " ",
            saving ? "Enregistrement…" : "Enregistrer"
          ] })
        ] }),
        data?.cwsUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: data.cwsUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 mt-4 text-xs font-bold uppercase tracking-wider hover:text-[color:var(--admin-accent)]", children: [
          "Voir sur Chrome Web Store ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 })
        ] }),
        data?.extensionId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-muted-foreground mt-2", children: [
          "ID : ",
          data.extensionId
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg mb-4", children: "Versions actives (30j)" }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Chargement…" }) : (data?.byVersion ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aucune donnée — déploie l'extension v1.5.2+ avec le tracking activé." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: data.byVersion.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between font-mono text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "v",
            v.version
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
            v.cnt,
            " év."
          ] })
        ] }, v.version)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg mb-4", children: "Ouvertures — 14 derniers jours" }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Chargement…" }) : (data?.dailyOpens ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Pas encore de données." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: data.dailyOpens.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 shrink-0", children: new Date(d.day).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-4 bg-black/5 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[color:var(--admin-accent)]", style: {
          width: `${Math.round(d.opens / maxDaily * 100)}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-right font-bold", children: d.opens })
      ] }, d.day)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card p-0 overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-black/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg", children: "Événements récents" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Événement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Client" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "p-6 text-center", children: "Chargement…" }) }) : (data?.recentEvents ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "p-6 text-center text-muted-foreground", children: "Aucun événement enregistré" }) }) : data.recentEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-xs whitespace-nowrap", children: fmtDate(e.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": "accent", children: EVENT_LABELS[e.eventType] ?? e.eventType }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs", children: e.extensionVersion ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs", title: e.clientId, children: shortId(e.clientId) })
        ] }, e.id)) })
      ] })
    ] })
  ] });
}
function Kpi({
  label,
  value,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black mt-2", children: value }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1", children: hint })
  ] });
}
export {
  AdminExtensionPage as component
};
