import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import "./_libs/seroval.mjs";
import { o as objectType, r as recordType, s as stringType } from "./_libs/zod.mjs";
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
const getAdminSettings = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("4ca247a315bfa1cc7fff9b49390f9c259ed47c349a9ed55b55d33681e24d28d5"));
const updateAdminSettings = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  patch: recordType(stringType(), stringType())
})).handler(createSsrRpc("6461bc2b3c92ef580c50d1be6031f5356a9a871d9472ff5a15ce1cbd2a5aa58b"));
const SECTIONS = [{
  title: "Branding",
  fields: [{
    key: "branding.app_name",
    label: "Nom de l'application",
    type: "text"
  }, {
    key: "branding.tagline",
    label: "Tagline",
    type: "text"
  }, {
    key: "branding.support_email",
    label: "Email support",
    type: "email",
    help: "Adresse affichée dans l'app pour le support utilisateurs."
  }]
}, {
  title: "Tarification (FCFA / mois)",
  fields: [{
    key: "pricing.basic_xof",
    label: "Plan Basic",
    type: "number"
  }, {
    key: "pricing.starter_xof",
    label: "Plan Starter",
    type: "number"
  }, {
    key: "pricing.pro_xof",
    label: "Plan Pro",
    type: "number"
  }, {
    key: "trial.default_days",
    label: "Durée d'essai par défaut (jours)",
    type: "number"
  }]
}, {
  title: "Feature flags",
  fields: [{
    key: "flags.signup_enabled",
    label: "Inscriptions ouvertes",
    type: "boolean",
    help: "Désactive pour bloquer les nouvelles inscriptions."
  }, {
    key: "flags.affiliate_enabled",
    label: "Codes d'affiliation actifs",
    type: "boolean"
  }, {
    key: "flags.maintenance_mode",
    label: "Mode maintenance",
    type: "boolean",
    help: "Affiche un écran de maintenance aux utilisateurs."
  }, {
    key: "flags.maintenance_message",
    label: "Message de maintenance",
    type: "textarea"
  }]
}];
function SettingsPage() {
  const fetchSettings = useServerFn(getAdminSettings);
  const saveSettings = useServerFn(updateAdminSettings);
  const [settings, setSettings] = reactExports.useState({});
  const [original, setOriginal] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const [ok, setOk] = reactExports.useState(false);
  const [latestUpdate, setLatestUpdate] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchSettings();
      setSettings(res.settings);
      setOriginal(res.settings);
      setLatestUpdate(res.latestUpdate);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const dirtyKeys = Object.keys(settings).filter((k) => settings[k] !== original[k]);
  const save = async () => {
    if (dirtyKeys.length === 0) return;
    setSaving(true);
    setErr(null);
    setOk(false);
    try {
      const patch = {};
      for (const k of dirtyKeys) patch[k] = settings[k];
      await saveSettings({
        data: {
          patch
        }
      });
      setOk(true);
      setTimeout(() => setOk(false), 2500);
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card", children: "Chargement…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Configuration" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1", children: "Paramètres" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        latestUpdate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs opacity-70", children: [
          "Dernière maj : ",
          new Date(latestUpdate).toLocaleString("fr-FR")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn", onClick: save, disabled: dirtyKeys.length === 0 || saving, children: saving ? "Enregistrement…" : dirtyKeys.length === 0 ? "Tout est à jour" : `Enregistrer (${dirtyKeys.length})` })
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    ok && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-green-600", children: "Paramètres enregistrés." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: SECTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black uppercase tracking-tight mb-4", children: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: s.fields.map((f) => {
        const val = settings[f.key] ?? "";
        const dirty = settings[f.key] !== original[f.key];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: f.type === "textarea" ? "md:col-span-2" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase font-bold mb-1", children: [
            f.label,
            dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[color:var(--admin-accent)]", children: "•modifié" })
          ] }),
          f.type === "boolean" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: val === "true", onChange: (e) => setSettings({
              ...settings,
              [f.key]: e.target.checked ? "true" : "false"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: val === "true" ? "Activé" : "Désactivé" })
          ] }) : f.type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "admin-input w-full", rows: 3, value: val, onChange: (e) => setSettings({
            ...settings,
            [f.key]: e.target.value
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: f.type, className: "admin-input w-full", value: val, onChange: (e) => setSettings({
            ...settings,
            [f.key]: e.target.value
          }) }),
          f.help && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-60 mt-1", children: f.help })
        ] }, f.key);
      }) })
    ] }, s.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mt-6 border-l-4 border-l-[color:var(--admin-accent)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black uppercase mb-1", children: "Zone sensible" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-80", children: "Les changements de tarification s'appliquent immédiatement aux nouvelles souscriptions, mais ne modifient pas rétroactivement les abonnements en cours. Le mode maintenance affichera un écran bloquant à tous les utilisateurs non-admin." })
    ] })
  ] });
}
export {
  SettingsPage as component
};
