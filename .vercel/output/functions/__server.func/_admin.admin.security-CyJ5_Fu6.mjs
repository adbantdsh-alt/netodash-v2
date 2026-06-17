import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import { C as ConfirmDialog } from "./_ssr/ConfirmDialog-0O7-VzQ4.mjs";
import "./_libs/seroval.mjs";
import { f as Search, v as ChevronLeft, u as ChevronRight, H as UserPlus, t as Trash2 } from "./_libs/lucide-react.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "./_libs/zod.mjs";
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
const listAuditLogs = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).inputValidator(objectType({
  page: numberType().int().min(1).default(1),
  pageSize: numberType().int().min(10).max(200).default(50),
  category: stringType().optional(),
  adminEmail: stringType().optional(),
  search: stringType().optional()
})).handler(createSsrRpc("5122e628761802312fee88f5b907b0507003beefc4df541c53a3e489b6041b8d"));
const listAdminAccounts = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("544e151cb3fab442dbd99fc528f3d36651e48d422d09a0e4f6c56ce4a4ff5764"));
const inviteAdminAccount = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  email: stringType().email(),
  role: enumType(["super_admin", "support", "finance"]),
  display_name: stringType().max(120).optional()
})).handler(createSsrRpc("64f27f66b494470b025dec318a14e4997e76019d36b416167ef5403c2013fc60"));
const updateAdminAccount = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid(),
  role: enumType(["super_admin", "support", "finance"]).optional(),
  status: enumType(["active", "suspended", "revoked"]).optional()
})).handler(createSsrRpc("10bc6397c8e9c469c376a16606eb6efcc19c9b9c6deceaa8ade871fe9bde6a02"));
const removeAdminAccount = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(createSsrRpc("fe663f8e5f71a97724a1794b27b050b09491a2a3e361b92bf434007ffa8b09b7"));
function SecurityPage() {
  const fetchAuditLogs = useServerFn(listAuditLogs);
  const fetchAdminAccounts = useServerFn(listAdminAccounts);
  const inviteAccount = useServerFn(inviteAdminAccount);
  const updateAccount = useServerFn(updateAdminAccount);
  const removeAccount = useServerFn(removeAdminAccount);
  const [tab, setTab] = reactExports.useState("logs");
  const [logs, setLogs] = reactExports.useState(null);
  const [accounts, setAccounts] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(1);
  const [category, setCategory] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [showInvite, setShowInvite] = reactExports.useState(false);
  const [invite, setInvite] = reactExports.useState({
    email: "",
    role: "support"
  });
  const [removeId, setRemoveId] = reactExports.useState(null);
  const pageSize = 50;
  const loadLogs = async () => {
    setLoading(true);
    setErr(null);
    try {
      setLogs(await fetchAuditLogs({
        data: {
          page,
          pageSize,
          category: category || void 0,
          search: search || void 0
        }
      }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  const loadAccounts = async () => {
    setLoading(true);
    setErr(null);
    try {
      setAccounts(await fetchAdminAccounts());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (tab === "logs") loadLogs();
    else loadAccounts();
  }, [tab, page, category]);
  const doInvite = async () => {
    try {
      await inviteAccount({
        data: invite
      });
      setShowInvite(false);
      setInvite({
        email: "",
        role: "support"
      });
      loadAccounts();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const doChangeRole = async (id, role) => {
    try {
      await updateAccount({
        data: {
          id,
          role
        }
      });
      loadAccounts();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const doChangeStatus = async (id, status) => {
    try {
      await updateAccount({
        data: {
          id,
          status
        }
      });
      loadAccounts();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const doRemove = async () => {
    if (!removeId) return;
    try {
      await removeAccount({
        data: {
          id: removeId
        }
      });
      setRemoveId(null);
      loadAccounts();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };
  const totalPages = logs ? Math.max(1, Math.ceil(logs.total / pageSize)) : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Sécurité" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1 mb-6", children: "Sécurité & Audit" }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-6 border-b-2 border-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `px-4 py-2 font-bold uppercase text-sm ${tab === "logs" ? "bg-black text-white" : ""}`, onClick: () => {
        setTab("logs");
        setPage(1);
      }, children: "Journal d'audit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `px-4 py-2 font-bold uppercase text-sm ${tab === "accounts" ? "bg-black text-white" : ""}`, onClick: () => setTab("accounts"), children: "Comptes admin (RBAC)" })
    ] }),
    tab === "logs" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "admin-input pl-9 w-full", placeholder: "Action, email cible…", value: search, onChange: (e) => setSearch(e.target.value), onKeyDown: (e) => e.key === "Enter" && (setPage(1), loadLogs()) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "admin-input", value: category, onChange: (e) => {
          setPage(1);
          setCategory(e.target.value);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Toutes catégories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "general", children: "general" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "user", children: "user" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "finance", children: "finance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "affiliates", children: "affiliates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "security", children: "security" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "impersonation", children: "impersonation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "communication", children: "communication" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn", onClick: () => {
          setPage(1);
          loadLogs();
        }, children: "Filtrer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-black text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Catégorie" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Cible" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Détails" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center", children: "Chargement…" }) }) : (logs?.rows ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center", children: "Aucun log" }) }) : logs.rows.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-black/10 align-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs whitespace-nowrap", children: new Date(l.created_at).toLocaleString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: l.admin_email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs font-bold", children: l.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "admin-pill", children: l.category }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: l.target_email ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap font-mono opacity-70 max-w-xs", children: JSON.stringify(l.details, null, 0) }) })
        ] }, l.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          logs?.total ?? 0,
          " entrée(s)"
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
      ] })
    ] }),
    tab === "accounts" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "admin-btn", onClick: () => setShowInvite(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 16, className: "inline mr-1" }),
        "Inviter un admin"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-black text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Rôle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Statut" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Dernière connexion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Créé le" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center", children: "Chargement…" }) }) : (accounts?.rows ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-black/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold", children: a.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "admin-input", value: a.role, onChange: (e) => doChangeRole(a.id, e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "super_admin", children: "Super Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "support", children: "Support" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "finance", children: "Finance" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "admin-input", value: a.status, onChange: (e) => doChangeStatus(a.id, e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Actif" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suspended", children: "Suspendu" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "revoked", children: "Révoqué" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: a.last_login_at ? new Date(a.last_login_at).toLocaleString("fr-FR") : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: new Date(a.created_at).toLocaleDateString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "admin-btn-ghost", onClick: () => setRemoveId(a.id), title: "Retirer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) }) })
        ] }, a.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: showInvite, title: "Inviter un administrateur", description: "L'utilisateur doit déjà avoir un compte Netodash actif.", confirmLabel: "Ajouter", onClose: () => setShowInvite(false), onConfirm: doInvite, disabled: !invite.email.includes("@"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", className: "admin-input w-full", value: invite.email, onChange: (e) => setInvite({
          ...invite,
          email: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase font-bold mb-1", children: "Rôle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "admin-input w-full", value: invite.role, onChange: (e) => setInvite({
          ...invite,
          role: e.target.value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "support", children: "Support — lecture + impersonation + tickets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "finance", children: "Finance — revenus + remboursements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "super_admin", children: "Super Admin — tous les droits" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: !!removeId, title: "Retirer cet administrateur ?", description: "Le compte utilisateur Netodash sera conservé, mais perdra tout accès au panel admin.", confirmLabel: "Retirer", destructive: true, onClose: () => setRemoveId(null), onConfirm: doRemove })
  ] });
}
export {
  SecurityPage as component
};
