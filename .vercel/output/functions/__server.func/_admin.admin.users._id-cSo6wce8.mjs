import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { e as adminGetUserProfile, f as adminChangeUserPlan, g as adminSuspendUser, h as adminUnsuspendUser, i as adminBanUser, j as adminDeleteUserData, c as adminImpersonateUser, d as adminGrantFreeAccess } from "./_ssr/users.functions-Bbf2rWkf.mjs";
import { S as StatusBadge } from "./_ssr/StatusBadge-BbX55_Y3.mjs";
import { C as ConfirmDialog } from "./_ssr/ConfirmDialog-0O7-VzQ4.mjs";
import { g as Route } from "./_ssr/router-CzeTO2qA.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import "./_libs/sonner.mjs";
import "./_libs/stripe.mjs";
import { W as ArrowLeft, z as ExternalLink, G as Gift } from "./_libs/lucide-react.mjs";
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
import "./_ssr/createSsrRpc-DbtoQF38.mjs";
import "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
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
import "./_libs/zod.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/client-IbqXIlEo.mjs";
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "events";
import "http";
import "https";
import "os";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
const GRANT_PLANS = [{
  id: "cod",
  label: "COD ($10)"
}, {
  id: "basic",
  label: "Starter ($12)"
}, {
  id: "starter",
  label: "Pro ($29)"
}, {
  id: "pro",
  label: "Scale ($79)"
}];
function AdminUserDetail() {
  const params = Route.useParams();
  const userId = params.id;
  const fetchUserProfile = useServerFn(adminGetUserProfile);
  const changeUserPlan = useServerFn(adminChangeUserPlan);
  const suspendUser = useServerFn(adminSuspendUser);
  const unsuspendUser = useServerFn(adminUnsuspendUser);
  const banUser = useServerFn(adminBanUser);
  const deleteUserData = useServerFn(adminDeleteUserData);
  const impersonateUser = useServerFn(adminImpersonateUser);
  const grantFreeAccess = useServerFn(adminGrantFreeAccess);
  const [data, setData] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [showGrant, setShowGrant] = reactExports.useState(false);
  const [grantDuration, setGrantDuration] = reactExports.useState(30);
  const [grantUnit, setGrantUnit] = reactExports.useState("days");
  const [grantPlan, setGrantPlan] = reactExports.useState("starter");
  const load = () => {
    setErr(null);
    fetchUserProfile({
      data: {
        userId
      }
    }).then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Erreur"));
  };
  reactExports.useEffect(load, [userId]);
  const wrap = async (fn) => {
    setBusy(true);
    try {
      await fn();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };
  if (err) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card text-destructive", children: err });
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest", children: "Chargement…" });
  const p = data.profile;
  const sub = data.subscription;
  const fullName = p.display_name || [p.first_name, p.last_name].filter(Boolean).join(" ") || "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/users", className: "inline-flex items-center gap-1 text-xs uppercase tracking-widest mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
      " Retour"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1", children: fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1", children: p.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: data.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": "neutral", children: sub?.plan ?? "free" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy, onClick: () => wrap(async () => {
        const r = await impersonateUser({
          data: {
            userId
          }
        });
        if (r.link) window.open(r.link, "_blank", "noopener,noreferrer");
      }), className: "admin-btn-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
        " Impersonner"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Activité 30 j", value: `${data.entries30d} saisies` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Dernière saisie", value: data.lastEntry ? new Date(data.lastEntry.created_at).toLocaleDateString("fr-FR") : "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pays", value: p.country || "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3", children: "Plan & abonnement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: ["free", "trial", "cod", "basic", "starter", "pro"].map((pl) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy, onClick: () => wrap(() => changeUserPlan({
        data: {
          userId,
          plan: pl
        }
      })), className: "admin-btn-ghost", children: [
        "Passer en ",
        pl
      ] }, pl)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy, onClick: () => setShowGrant(true), className: "admin-btn inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 14 }),
        " Offrir accès gratuit"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: showGrant, title: "Offrir accès gratuit", description: `Prolonger l'accès de ${p.email} · action tracée dans les audit logs.`, confirmLabel: "Confirmer", disabled: busy || grantDuration < 1, onCancel: () => setShowGrant(false), onConfirm: async () => {
      await wrap(async () => {
        const r = await grantFreeAccess({
          data: {
            userId,
            duration: grantDuration,
            unit: grantUnit,
            plan: grantPlan
          }
        });
        alert(`Accès offert · ${r.planOffert} · ${r.duree} · jusqu'au ${new Date(r.endsAt).toLocaleDateString("fr-FR")}`);
        setShowGrant(false);
      });
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Durée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 3650, value: grantDuration, onChange: (e) => setGrantDuration(Math.max(1, Number(e.target.value) || 1)), className: "admin-input w-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Unité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "admin-input w-full", value: grantUnit, onChange: (e) => setGrantUnit(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "days", children: "Jours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "months", children: "Mois" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "years", children: "Années" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Plan offert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "admin-input w-full", value: grantPlan, onChange: (e) => setGrantPlan(e.target.value), children: GRANT_PLANS.map((pl) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: pl.id, children: pl.label }, pl.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3", children: "Modération" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        data.status !== "suspended" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => {
          const reason = prompt("Raison de la suspension ?");
          if (reason && reason.length >= 3) wrap(() => suspendUser({
            data: {
              userId,
              reason
            }
          }));
        }, className: "admin-btn-ghost", children: "Suspendre" }),
        data.status === "suspended" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => wrap(() => unsuspendUser({
          data: {
            userId
          }
        })), className: "admin-btn-ghost", children: "Réactiver" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => {
          const reason = prompt("Raison du bannissement ?");
          if (reason && reason.length >= 3) wrap(() => banUser({
            data: {
              userId,
              reason
            }
          }));
        }, className: "admin-btn-ghost", style: {
          borderColor: "#b32d2c",
          color: "#b32d2c"
        }, children: "Bannir" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => {
          if (confirm("Suppression RGPD : toutes les données seront effacées. Action irréversible. Confirmer ?")) wrap(() => deleteUserData({
            data: {
              userId
            }
          }));
        }, className: "admin-btn-ghost", style: {
          borderColor: "#b32d2c",
          color: "#b32d2c"
        }, children: "Supprimer (RGPD)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3", children: [
        "Paiements (",
        data.payments.length,
        ")"
      ] }),
      data.payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Aucun paiement." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Montant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Méthode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Statut" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.payments.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(p2.created_at).toLocaleDateString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-bold", children: [
            Number(p2.amount).toLocaleString("fr-FR"),
            " ",
            p2.currency
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p2.payment_method }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-badge", "data-tone": p2.status === "succeeded" ? "success" : "warning", children: p2.status }) })
        ] }, p2.id)) })
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-kpi", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-kpi-label", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-kpi-value", children: value })
  ] });
}
export {
  AdminUserDetail as component
};
