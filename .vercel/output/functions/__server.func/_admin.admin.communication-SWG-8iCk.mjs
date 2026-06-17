import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import { C as ConfirmDialog } from "./_ssr/ConfirmDialog-0O7-VzQ4.mjs";
import "./_libs/seroval.mjs";
import { Q as Plus, V as Megaphone, s as Pencil, q as Power, t as Trash2, I as Info, e as CircleCheck, T as TriangleAlert } from "./_libs/lucide-react.mjs";
import { o as objectType, b as booleanType, s as stringType, e as enumType } from "./_libs/zod.mjs";
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
const audienceEnum = enumType(["all", "free", "trial", "paying", "cod", "basic", "starter", "pro"]);
const severityEnum = enumType(["info", "success", "warning", "critical"]);
const listAnnouncements = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("241d699abef9ad38693e90f4a23654bdaf183f9cd8b7e5fa7be64f7da48a364e"));
const upsertAnnouncement = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid().optional(),
  title: stringType().min(2).max(200),
  body: stringType().min(2).max(2e3),
  severity: severityEnum.default("info"),
  audience: audienceEnum.default("all"),
  cta_label: stringType().max(80).nullable().optional(),
  cta_url: stringType().url().nullable().optional(),
  active: booleanType().default(true),
  starts_at: stringType(),
  ends_at: stringType().nullable().optional()
})).handler(createSsrRpc("126e9bbed1bebad7af673670f77f32a8c0e15f2e282a9e4f0aaf62ddaeea5b8f"));
const toggleAnnouncement = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid(),
  active: booleanType()
})).handler(createSsrRpc("56c20b1f8d8e8a1b6787e14f45a4136019550611eccc493f5e36acb06458df12"));
const deleteAnnouncement = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(createSsrRpc("870742c0e557302ed8c92274157631a22b91007163bbbf87e41d1fdc08c7db25"));
const SEVERITIES = [{
  v: "info",
  label: "Info",
  icon: Info
}, {
  v: "success",
  label: "Succès",
  icon: CircleCheck
}, {
  v: "warning",
  label: "Avertissement",
  icon: TriangleAlert
}, {
  v: "critical",
  label: "Critique",
  icon: TriangleAlert
}];
const AUDIENCES = [{
  v: "all",
  label: "Tous les utilisateurs"
}, {
  v: "free",
  label: "Plan Gratuit"
}, {
  v: "trial",
  label: "En essai"
}, {
  v: "paying",
  label: "Tous les payants"
}, {
  v: "cod",
  label: "Plan COD"
}, {
  v: "basic",
  label: "Plan Starter"
}, {
  v: "starter",
  label: "Plan Pro"
}, {
  v: "pro",
  label: "Plan Scale"
}];
const toLocalInput = (iso) => {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
function CommunicationPage() {
  const fetchAnnouncements = useServerFn(listAnnouncements);
  const saveAnnouncement = useServerFn(upsertAnnouncement);
  const setAnnouncementActive = useServerFn(toggleAnnouncement);
  const removeAnnouncement = useServerFn(deleteAnnouncement);
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setRows((await fetchAnnouncements()).rows);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const openCreate = () => setEditing({
    title: "",
    body: "",
    severity: "info",
    audience: "all",
    cta_label: "",
    cta_url: "",
    active: true,
    starts_at: (/* @__PURE__ */ new Date()).toISOString(),
    ends_at: null
  });
  const save = async () => {
    if (!editing) return;
    try {
      await saveAnnouncement({
        data: {
          id: editing.id,
          title: editing.title ?? "",
          body: editing.body ?? "",
          severity: editing.severity ?? "info",
          audience: editing.audience ?? "all",
          cta_label: editing.cta_label || null,
          cta_url: editing.cta_url || null,
          active: editing.active ?? true,
          starts_at: editing.starts_at ?? (/* @__PURE__ */ new Date()).toISOString(),
          ends_at: editing.ends_at || null
        }
      });
      setEditing(null);
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await removeAnnouncement({
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
  const doToggle = async (id, active) => {
    try {
      await setAnnouncementActive({
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Relation client" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1", children: "Communication" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "admin-btn", onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "inline mr-1" }),
        "Nouvelle annonce"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm opacity-70 mb-6 max-w-3xl", children: [
      "Diffuse des bandeaux ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "in-app" }),
      " à tes utilisateurs Netodash (maintenance, nouveauté, alerte facturation…). Pour de vraies campagnes email marketing (newsletter, promotions), un service dédié (Resend Broadcasts, Mailchimp…) est nécessaire — Lovable Emails est réservé aux messages transactionnels."
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-black text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Annonce" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Sévérité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Audience" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Période" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center", children: "Chargement…" }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "mx-auto mb-2 opacity-40" }),
        "Aucune annonce"
      ] }) }) : rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-black/10 align-top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: r.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-70 line-clamp-2 max-w-md", children: r.body })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-pill uppercase", children: r.severity }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: AUDIENCES.find((a) => a.v === r.audience)?.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-xs whitespace-nowrap", children: [
          new Date(r.starts_at).toLocaleDateString("fr-FR"),
          r.ends_at ? ` → ${new Date(r.ends_at).toLocaleDateString("fr-FR")}` : " → ∞"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `admin-pill ${r.active ? "bg-green-100 text-green-800" : "bg-black/10"}`, children: r.active ? "Actif" : "Inactif" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost", onClick: () => setEditing(r), title: "Modifier", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost", onClick: () => doToggle(r.id, r.active), title: r.active ? "Désactiver" : "Activer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost", onClick: () => setDeleteId(r.id), title: "Supprimer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] })
      ] }, r.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: !!editing, title: editing?.id ? "Modifier l'annonce" : "Nouvelle annonce", confirmLabel: "Enregistrer", onClose: () => setEditing(null), onConfirm: save, disabled: !editing?.title || !editing?.body, children: editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Titre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input w-full", value: editing.title ?? "", onChange: (e) => setEditing({
          ...editing,
          title: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "admin-input w-full", rows: 3, value: editing.body ?? "", onChange: (e) => setEditing({
          ...editing,
          body: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Sévérité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "admin-input w-full", value: editing.severity ?? "info", onChange: (e) => setEditing({
            ...editing,
            severity: e.target.value
          }), children: SEVERITIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.v, children: s.label }, s.v)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Audience" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "admin-input w-full", value: editing.audience ?? "all", onChange: (e) => setEditing({
            ...editing,
            audience: e.target.value
          }), children: AUDIENCES.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.v, children: a.label }, a.v)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "CTA (libellé)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input w-full", placeholder: "ex: En savoir plus", value: editing.cta_label ?? "", onChange: (e) => setEditing({
            ...editing,
            cta_label: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "CTA (URL)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input w-full", placeholder: "https://…", value: editing.cta_url ?? "", onChange: (e) => setEditing({
            ...editing,
            cta_url: e.target.value
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Début" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", className: "admin-input w-full", value: toLocalInput(editing.starts_at ?? (/* @__PURE__ */ new Date()).toISOString()), onChange: (e) => setEditing({
            ...editing,
            starts_at: new Date(e.target.value).toISOString()
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Fin (optionnel)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", className: "admin-input w-full", value: editing.ends_at ? toLocalInput(editing.ends_at) : "", onChange: (e) => setEditing({
            ...editing,
            ends_at: e.target.value ? new Date(e.target.value).toISOString() : null
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: editing.active ?? true, onChange: (e) => setEditing({
          ...editing,
          active: e.target.checked
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active immédiatement" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: !!deleteId, title: "Supprimer cette annonce ?", description: "Action irréversible.", confirmLabel: "Supprimer", destructive: true, onClose: () => setDeleteId(null), onConfirm: doDelete })
  ] });
}
export {
  CommunicationPage as component
};
