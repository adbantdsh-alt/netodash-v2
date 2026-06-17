import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { a as adminListUsers, b as adminExportUsersCsv, c as adminImpersonateUser, d as adminGrantFreeAccess } from "./_ssr/users.functions-Bbf2rWkf.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import { S as StatusBadge } from "./_ssr/StatusBadge-BbX55_Y3.mjs";
import { C as ConfirmDialog } from "./_ssr/ConfirmDialog-0O7-VzQ4.mjs";
import "./_libs/seroval.mjs";
import { p as Download, f as Search, a as MessageCircle, y as Phone, G as Gift, K as KeyRound, z as ExternalLink, v as ChevronLeft, u as ChevronRight, A as Check, r as Copy } from "./_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "./_libs/zod.mjs";
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
const adminGenerateForcedMagicLink = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  email: stringType().trim().email().max(255)
}).parse(input)).handler(createSsrRpc("eef86c4f2ddc35a9d2bb4f708f868330d028a731303bd32278233670be676b62"));
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
function AdminUsersPage() {
  const listUsers = useServerFn(adminListUsers);
  const impersonateUser = useServerFn(adminImpersonateUser);
  const generateForcedMagicLink = useServerFn(adminGenerateForcedMagicLink);
  const grantFreeAccess = useServerFn(adminGrantFreeAccess);
  const exportUsersCsv = useServerFn(adminExportUsersCsv);
  const [rows, setRows] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const [plan, setPlan] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [exportBusy, setExportBusy] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [forcedLoginUser, setForcedLoginUser] = reactExports.useState(null);
  const [forcedLink, setForcedLink] = reactExports.useState(null);
  const [forcedMeta, setForcedMeta] = reactExports.useState(null);
  const [forcedBusy, setForcedBusy] = reactExports.useState(false);
  const [forcedErr, setForcedErr] = reactExports.useState(null);
  const [forcedCopied, setForcedCopied] = reactExports.useState(false);
  const [grantUser, setGrantUser] = reactExports.useState(null);
  const [grantDuration, setGrantDuration] = reactExports.useState(30);
  const [grantUnit, setGrantUnit] = reactExports.useState("days");
  const [grantPlan, setGrantPlan] = reactExports.useState("starter");
  const [grantBusy, setGrantBusy] = reactExports.useState(false);
  const pageSize = 25;
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listUsers({
        data: {
          page,
          pageSize,
          search: search || void 0,
          plan: plan || void 0,
          status: status || void 0,
          country: country || void 0,
          dateFrom: dateFrom ? new Date(dateFrom).toISOString() : void 0,
          dateTo: dateTo ? (/* @__PURE__ */ new Date(dateTo + "T23:59:59")).toISOString() : void 0
        }
      });
      setRows(res.users);
      setTotal(res.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, [page, plan, status, country, dateFrom, dateTo]);
  const onExportCsv = async () => {
    setExportBusy(true);
    try {
      const res = await exportUsersCsv({
        data: {
          search: search || void 0,
          plan: plan || void 0,
          status: status || void 0,
          country: country || void 0,
          dateFrom: dateFrom ? new Date(dateFrom).toISOString() : void 0,
          dateTo: dateTo ? (/* @__PURE__ */ new Date(dateTo + "T23:59:59")).toISOString() : void 0
        }
      });
      const blob = new Blob([res.csv], {
        type: "text/csv;charset=utf-8"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netodash-users-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur export");
    } finally {
      setExportBusy(false);
    }
  };
  const onImpersonate = async (id, email) => {
    if (!confirm(`Impersonner ${email} ? Cette action est tracée.`)) return;
    try {
      const r = await impersonateUser({
        data: {
          userId: id
        }
      });
      if (r.link) {
        window.open(r.link, "_blank", "noopener,noreferrer");
      } else {
        alert("Lien d'impersonation indisponible");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    }
  };
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const openGrant = (u) => {
    setGrantUser(u);
    setGrantDuration(30);
    setGrantUnit("days");
    setGrantPlan("starter");
  };
  const openForcedLogin = (u) => {
    setForcedLoginUser(u);
    setForcedLink(null);
    setForcedMeta(null);
    setForcedErr(null);
    setForcedCopied(false);
  };
  const generateForcedLink = async () => {
    if (!forcedLoginUser) return;
    setForcedBusy(true);
    setForcedErr(null);
    try {
      const r = await generateForcedMagicLink({
        data: {
          email: forcedLoginUser.email
        }
      });
      setForcedLink(r.link);
      setForcedMeta({
        emailConfirmedNow: r.emailConfirmedNow,
        banLifted: r.banLifted
      });
    } catch (e) {
      setForcedErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setForcedBusy(false);
    }
  };
  const confirmGrant = async () => {
    if (!grantUser) return;
    setGrantBusy(true);
    try {
      const r = await grantFreeAccess({
        data: {
          userId: grantUser.id,
          duration: grantDuration,
          unit: grantUnit,
          plan: grantPlan
        }
      });
      alert(`Accès offert à ${grantUser.email} · ${r.planOffert} · ${r.duree} · jusqu'au ${new Date(r.endsAt).toLocaleDateString("fr-FR")}`);
      setGrantUser(null);
      void load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setGrantBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-eyebrow", children: "Back-office" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "admin-h1", children: "Utilisateurs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm mt-1 text-muted-foreground", children: [
          total,
          " compte",
          total > 1 ? "s" : "",
          " au total"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => void onExportCsv(), disabled: exportBusy, className: "admin-btn-ghost inline-flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
        exportBusy ? "Export…" : "Export CSV"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        setPage(1);
        void load();
      }, className: "flex items-center gap-2 w-full md:flex-1 md:min-w-[260px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Email, nom ou téléphone…", className: "flex-1 bg-transparent outline-none text-sm py-2 min-w-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "admin-btn-primary shrink-0", children: "OK" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: plan, onChange: (e) => {
          setPlan(e.target.value);
          setPage(1);
        }, className: "admin-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Tous plans" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "free", children: "Free" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "trial", children: "Trial" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cod", children: "COD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "basic", children: "Starter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "starter", children: "Pro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pro", children: "Scale" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => {
          setStatus(e.target.value);
          setPage(1);
        }, className: "admin-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Tous statuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Actif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suspended", children: "Suspendu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "banned", children: "Banni" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: country, onChange: (e) => {
          setCountry(e.target.value);
          setPage(1);
        }, placeholder: "Pays", className: "admin-select min-w-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dateFrom, onChange: (e) => {
          setDateFrom(e.target.value);
          setPage(1);
        }, className: "admin-select min-w-0", title: "Inscription depuis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dateTo, onChange: (e) => {
          setDateTo(e.target.value);
          setPage(1);
        }, className: "admin-select min-w-0", title: "Inscription jusqu'à" })
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card text-destructive mb-4", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden space-y-3", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card text-center text-xs uppercase tracking-widest", children: "Chargement…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card text-center text-muted-foreground", children: "Aucun utilisateur." }) : rows.map((u) => {
      const waLink = u.phoneDigits ? `https://wa.me/${u.phoneDigits}` : null;
      const telLink = u.phoneDigits ? `tel:+${u.phoneDigits}` : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm break-all", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate mt-0.5", children: u.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: u.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: "Plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold uppercase", children: u.plan })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: "Pays" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: u.country })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: "Téléphone" }),
            u.phone ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm break-all", children: u.phone }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs", children: "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: "MRR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: u.mrr > 0 ? `$${u.mrr}` : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: "Dernière connexion" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("fr-FR") : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60", children: "Créé le" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: new Date(u.createdAt).toLocaleDateString("fr-FR") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [
          waLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waLink, target: "_blank", rel: "noopener noreferrer", className: "admin-btn-ghost inline-flex items-center justify-center gap-1", style: {
            color: "#1f8a4c",
            borderColor: "#1f8a4c"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 14 }),
            " WhatsApp"
          ] }),
          telLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: telLink, className: "admin-btn-ghost inline-flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
            " Appeler"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/admin/users/${u.id}`, className: "admin-btn-ghost inline-flex items-center justify-center", children: "Détails" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openGrant(u), className: "admin-btn-ghost inline-flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 12 }),
            " Offrir accès"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openForcedLogin(u), className: "admin-btn-ghost inline-flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 12 }),
            " Connexion forcée"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onImpersonate(u.id, u.email), className: "admin-btn-ghost inline-flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }),
            " Impersonner"
          ] })
        ] })
      ] }, u.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-card p-0 overflow-x-auto hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Nom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "WhatsApp / Tél" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Pays" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "MRR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Inscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th", children: "Dernière connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "admin-th text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "p-6 text-center text-xs uppercase tracking-widest", children: "Chargement…" }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "p-6 text-center text-muted-foreground", children: "Aucun utilisateur." }) }) : rows.map((u) => {
        const waLink = u.phoneDigits ? `https://wa.me/${u.phoneDigits}` : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-foreground/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td font-bold", children: u.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td", children: u.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td font-mono text-xs whitespace-nowrap", children: u.phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: u.phone }),
            waLink && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: waLink, target: "_blank", rel: "noopener noreferrer", title: "WhatsApp", style: {
              color: "#1f8a4c"
            }, className: "inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 14 }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td", children: u.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td uppercase text-xs font-bold", children: u.plan }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td text-xs font-mono", children: u.mrr > 0 ? `$${u.mrr}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: u.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td text-xs", children: new Date(u.createdAt).toLocaleDateString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "admin-td text-xs", children: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("fr-FR") : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "admin-td text-right whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/admin/users/${u.id}`, className: "admin-btn-ghost mr-2", children: "Détails" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openGrant(u), className: "admin-btn-ghost inline-flex items-center gap-1 mr-2", title: "Offrir accès gratuit", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 12 }),
              " Offrir"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openForcedLogin(u), className: "admin-btn-ghost inline-flex items-center gap-1 mr-2", title: "Connexion forcée par magic link", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 12 }),
              " Connexion forcée"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onImpersonate(u.id, u.email), className: "admin-btn-ghost inline-flex items-center gap-1", title: "Impersonner (ouvre une session)", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }),
              " Impersonner"
            ] })
          ] })
        ] }, u.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-xs uppercase tracking-widest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "Page ",
        page,
        " / ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)), className: "admin-btn-ghost disabled:opacity-30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 }),
          " Préc."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: page >= totalPages, onClick: () => setPage((p) => Math.min(totalPages, p + 1)), className: "admin-btn-ghost disabled:opacity-30", children: [
          "Suiv. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: !!grantUser, title: "Offrir accès gratuit", description: grantUser ? `Prolonger l'accès de ${grantUser.email} avec le plan choisi. L'action est tracée dans les audit logs.` : void 0, confirmLabel: "Confirmer", disabled: grantBusy || grantDuration < 1, onCancel: () => setGrantUser(null), onConfirm: confirmGrant, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 mb-2", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "admin-input w-full", value: grantPlan, onChange: (e) => setGrantPlan(e.target.value), children: GRANT_PLANS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.label }, p.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { open: !!forcedLoginUser, title: "Connexion forcée", description: forcedLoginUser ? "Génère un magic link de connexion directe (expire après 1 heure). Envoie-le par WhatsApp ou autre canal." : void 0, confirmLabel: forcedLink ? "Fermer" : forcedBusy ? "Génération…" : "Générer le magic link", disabled: forcedBusy, onCancel: () => setForcedLoginUser(null), onConfirm: async () => {
      if (forcedLink) {
        setForcedLoginUser(null);
        return;
      }
      await generateForcedLink();
    }, children: forcedLoginUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { readOnly: true, value: forcedLoginUser.email, className: "admin-input w-full bg-muted" })
      ] }),
      forcedErr && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive", children: forcedErr }),
      forcedLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Lien généré — expire dans 1 heure",
          forcedMeta?.emailConfirmedNow && " · email confirmé",
          forcedMeta?.banLifted && " · ban levé"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { readOnly: true, value: forcedLink, onFocus: (e) => e.currentTarget.select(), className: "flex-1 bg-muted text-xs font-mono py-2 px-3 brutal-border-thin overflow-hidden text-ellipsis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
            try {
              await navigator.clipboard.writeText(forcedLink);
              setForcedCopied(true);
              setTimeout(() => setForcedCopied(false), 2e3);
            } catch {
            }
          }, className: "admin-btn-ghost inline-flex items-center gap-1 shrink-0", children: [
            forcedCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }),
            forcedCopied ? "Copié" : "Copier"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: forcedLink, target: "_blank", rel: "noopener noreferrer", className: "admin-btn-ghost inline-flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
            " Ouvrir"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdminUsersPage as component
};
