import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { u as useAuth, e as Route$k } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useIsAdmin } from "./_ssr/use-is-admin--DQ0ykgS.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { e as formatNumber, f as formatCurrency } from "./_ssr/calc-DHAnOS6I.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireSupabaseAuth } from "./_ssr/auth-middleware-DkI0uzqn.mjs";
import { g as getCountry, a as getReferralLabel } from "./_ssr/countries-CQCxvze2.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./_ssr/dialog-DAFZrS93.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, D as Description, O as Overlay } from "./_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "./_libs/class-variance-authority.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/stripe.mjs";
import "./_libs/seroval.mjs";
import { R as RefreshCw, h as LayoutDashboard, U as Users, n as CreditCard, o as Ticket, l as Settings, f as Search, X, E as Ellipsis, p as Download, q as Power, r as Copy, s as Pencil, t as Trash2, u as ChevronRight, v as ChevronLeft } from "./_libs/lucide-react.mjs";
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
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
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
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "./_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => {
  if (!input || typeof input !== "object" || !("targetUserId" in input)) {
    throw new Error("targetUserId requis.");
  }
  const id = input.targetUserId;
  if (typeof id !== "string" || id.length < 10) {
    throw new Error("ID invalide.");
  }
  return {
    targetUserId: id
  };
}).handler(createSsrRpc("75454526e81445e210b3752ed6012b474b177f745b67b452ea06088e76834860"));
const getEngagementData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("bdf0979897a4a5e9e906809c655a7d3196ca4e631d68c60c78d0075e487e7707"));
const Sheet = Root;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
const PUBLIC_BASE_URL = "https://netodash.com";
function AdminPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const adminQ = useIsAdmin(user?.id);
  const {
    tab
  } = Route$k.useSearch();
  const [stats, setStats] = reactExports.useState(null);
  const [users, setUsers] = reactExports.useState([]);
  const [payments, setPayments] = reactExports.useState([]);
  const [codes, setCodes] = reactExports.useState([]);
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  const getEngagementDataFn = useServerFn(getEngagementData);
  reactExports.useEffect(() => {
    if (!adminQ.isLoading && adminQ.data === false) {
      navigate({
        to: "/dashboard"
      });
    }
  }, [adminQ.isLoading, adminQ.data, navigate]);
  reactExports.useEffect(() => {
    if (!adminQ.data) return;
    void loadAll();
  }, [adminQ.data, refreshKey]);
  async function loadAll() {
    try {
      setLoading(true);
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Session expirée");
      const [profilesRes, subsRes, paymentsRes, codesRes, refsRes, engagementRes] = await Promise.all([supabase.from("profiles").select("id, email, display_name, first_name, last_name, country, phone_country_code, phone, referral_source, selected_mode, active_mode, legacy_dual_mode, created_at"), supabase.from("subscriptions").select("*"), supabase.from("payments").select("*").order("created_at", {
        ascending: false
      }).limit(200), supabase.from("affiliate_codes").select("*").order("created_at", {
        ascending: false
      }), supabase.from("affiliate_referrals").select("code_id"), getEngagementDataFn({
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }).catch((e) => {
        console.error("engagement load failed", e);
        return {
          entries: []
        };
      })]);
      if (profilesRes.error) throw profilesRes.error;
      if (subsRes.error) throw subsRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      if (codesRes.error) throw codesRes.error;
      const profiles = profilesRes.data ?? [];
      const subs = subsRes.data ?? [];
      const pays = paymentsRes.data ?? [];
      const subByUser = new Map(subs.map((s) => [s.user_id, s]));
      const paidByUser = /* @__PURE__ */ new Map();
      for (const p of pays) {
        if (p.status === "paid") {
          paidByUser.set(p.user_id, (paidByUser.get(p.user_id) ?? 0) + Number(p.amount));
        }
      }
      const emailByUser = new Map(profiles.map((p) => [p.id, p.email]));
      const now = Date.now();
      const d30 = now - 30 * 864e5;
      const userRows = profiles.map((p) => {
        const s = subByUser.get(p.id);
        const plan = s?.plan ?? "free";
        const status = s?.status ?? "—";
        const trialEnds = s?.trial_ends_at ? new Date(s.trial_ends_at).getTime() : null;
        const periodEnd = s?.current_period_end ? new Date(s.current_period_end).getTime() : null;
        let effective = "free";
        if (plan === "pro" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now)) effective = "pro";
        else if (plan === "starter" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now)) effective = "starter";
        else if (plan === "cod" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now)) effective = "cod";
        else if (plan === "basic" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now)) effective = "basic";
        else if (plan === "trial" && trialEnds && trialEnds > now) effective = "trial";
        let trial_days_total = null;
        let trial_days_left = null;
        if (s?.trial_ends_at) {
          const created = new Date(s.created_at ?? p.created_at).getTime();
          trial_days_total = Math.max(1, Math.round((trialEnds - created) / 864e5));
          trial_days_left = Math.ceil((trialEnds - now) / 864e5);
        }
        return {
          id: p.id,
          email: p.email,
          display_name: p.display_name,
          first_name: p.first_name ?? null,
          last_name: p.last_name ?? null,
          country: p.country ?? null,
          phone_country_code: p.phone_country_code ?? null,
          phone: p.phone ?? null,
          referral_source: p.referral_source ?? null,
          selected_mode: p.selected_mode ?? null,
          active_mode: p.active_mode ?? null,
          legacy_dual_mode: Boolean(p.legacy_dual_mode),
          created_at: p.created_at,
          plan: effective,
          raw_plan: plan,
          status,
          trial_ends_at: s?.trial_ends_at ?? null,
          current_period_end: s?.current_period_end ?? null,
          trial_days_total,
          trial_days_left,
          total_paid: paidByUser.get(p.id) ?? 0
        };
      });
      const counts = {
        trial: 0,
        cod: 0,
        basic: 0,
        starter: 0,
        pro: 0,
        free: 0
      };
      for (const u of userRows) {
        if (u.plan === "trial") counts.trial++;
        else if (u.plan === "cod") counts.cod++;
        else if (u.plan === "basic") counts.basic++;
        else if (u.plan === "starter") counts.starter++;
        else if (u.plan === "pro") counts.pro++;
        else counts.free++;
      }
      const totalRevenue = pays.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
      const revenue30d = pays.filter((p) => p.status === "paid" && new Date(p.created_at).getTime() >= d30).reduce((s, p) => s + Number(p.amount), 0);
      const newUsers30d = profiles.filter((p) => new Date(p.created_at).getTime() >= d30).length;
      let mrr = 0;
      for (const s of subs) {
        if (!["active", "incomplete"].includes(s.status)) continue;
        const plan = s.plan;
        if (plan === "pro") mrr += 79;
        else if (plan === "starter") mrr += 29;
        else if (plan === "basic") mrr += 12;
        else if (plan === "cod") mrr += 10;
      }
      const signupsSeries = new Array(30).fill(0);
      const revenueSeries = new Array(30).fill(0);
      for (const p of profiles) {
        const t = new Date(p.created_at).getTime();
        const idx = 29 - Math.floor((now - t) / 864e5);
        if (idx >= 0 && idx < 30) signupsSeries[idx]++;
      }
      for (const p of pays) {
        if (p.status !== "paid") continue;
        const t = new Date(p.created_at).getTime();
        const idx = 29 - Math.floor((now - t) / 864e5);
        if (idx >= 0 && idx < 30) revenueSeries[idx] += Number(p.amount);
      }
      const refCounts = /* @__PURE__ */ new Map();
      for (const r of refsRes.data ?? []) {
        refCounts.set(r.code_id, (refCounts.get(r.code_id) ?? 0) + 1);
      }
      const codeRows = (codesRes.data ?? []).map((c) => ({
        ...c,
        signups_count: refCounts.get(c.id) ?? 0
      }));
      setStats({
        totalUsers: profiles.length,
        trialUsers: counts.trial,
        codUsers: counts.cod,
        basicUsers: counts.basic,
        starterUsers: counts.starter,
        proUsers: counts.pro,
        freeUsers: counts.free,
        newUsers30d,
        totalRevenue,
        revenue30d,
        paymentsCount: pays.length,
        mrr,
        signupsSeries,
        revenueSeries
      });
      setUsers(userRows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setPayments(pays.map((p) => ({
        ...p,
        email: emailByUser.get(p.user_id) ?? null
      })));
      setCodes(codeRows);
      setEntries(Array.isArray(engagementRes?.entries) ? engagementRes.entries : []);
    } catch (e) {
      toast.error(e.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }
  if (adminQ.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1600px] mx-auto px-6 py-12 text-xs uppercase tracking-widest text-muted-foreground", children: "Vérification accès…" });
  }
  if (!adminQ.data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1600px] mx-auto px-6 py-12 text-xs uppercase tracking-widest text-muted-foreground", children: "Accès refusé. Redirection…" });
  }
  const fmt = (v) => formatCurrency(v, "USD");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto pb-24 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 bg-background/95 backdrop-blur border-b-2 border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 md:px-6 py-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: "Admin · NETODASH" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg md:text-2xl font-black uppercase tracking-tight truncate", children: tabTitle(tab) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setRefreshKey((k) => k + 1), disabled: loading, className: "brutal-border-thin bg-card hover:bg-foreground hover:text-background px-3 py-2 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest disabled:opacity-50 shrink-0", title: "Rafraîchir", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Rafraîchir" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex px-4 md:px-6 gap-1 overflow-x-auto", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/netodsh", search: {
        tab: t.key
      }, className: `px-3 py-2 text-xs font-black uppercase tracking-widest border-b-2 inline-flex items-center gap-1.5 transition-colors ${tab === t.key ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-3.5 w-3.5" }),
        t.label
      ] }, t.key)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6", children: loading && !stats ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground py-8 text-center", children: "Chargement…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      tab === "overview" && stats && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { stats, fmt, users, entries }),
      tab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, { users, fmt, onRefresh: () => setRefreshKey((k) => k + 1) }),
      tab === "payments" && /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentsTab, { payments }),
      tab === "affiliates" && /* @__PURE__ */ jsxRuntimeExports.jsx(AffiliatesTab, { codes, userId: user?.id ?? null, onChanged: () => setRefreshKey((k) => k + 1) }),
      tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t-2 border-border", style: {
      paddingBottom: "env(safe-area-inset-bottom)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5", children: TABS.map((t) => {
      const active = tab === t.key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/netodsh", search: {
        tab: t.key
      }, className: `flex flex-col items-center justify-center gap-0.5 py-2 ${active ? "text-accent" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-bold", children: t.short })
      ] }, t.key);
    }) }) })
  ] });
}
const TABS = [{
  key: "overview",
  label: "Aperçu",
  short: "Aperçu",
  icon: LayoutDashboard
}, {
  key: "users",
  label: "Utilisateurs",
  short: "Users",
  icon: Users
}, {
  key: "payments",
  label: "Paiements",
  short: "Paie.",
  icon: CreditCard
}, {
  key: "affiliates",
  label: "Affiliation",
  short: "Affil.",
  icon: Ticket
}, {
  key: "settings",
  label: "Réglages",
  short: "Régl.",
  icon: Settings
}];
function tabTitle(t) {
  return TABS.find((x) => x.key === t)?.label ?? "Admin";
}
function OverviewTab({
  stats,
  fmt,
  users,
  entries
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Utilisateurs", value: formatNumber(stats.totalUsers) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Nouveaux 30j", value: formatNumber(stats.newUsers30d), sparkline: stats.signupsSeries }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "MRR estimé", value: fmt(stats.mrr), accent: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Revenu 30j", value: fmt(stats.revenue30d), sparkline: stats.revenueSeries }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Trial actifs", value: formatNumber(stats.trialUsers) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "COD ($10)", value: formatNumber(stats.codUsers) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Starter ($12)", value: formatNumber(stats.basicUsers) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pro ($29)", value: formatNumber(stats.starterUsers) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Scale ($79)", value: formatNumber(stats.proUsers), accent: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Free / expirés", value: formatNumber(stats.freeUsers) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Revenu total", value: fmt(stats.totalRevenue) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EngagementPanel, { users, entries }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DormantUsersPanel, { users, entries }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DemographicsPanel, { users })
  ] });
}
function EngagementPanel({
  users,
  entries
}) {
  const now = Date.now();
  const total = users.length || 1;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const day1 = now - 1 * 864e5;
  const day7 = now - 7 * 864e5;
  const day30 = now - 30 * 864e5;
  const activeIn = (since) => {
    const set = /* @__PURE__ */ new Set();
    for (const e of entries) {
      if (new Date(e.created_at).getTime() >= since) set.add(e.user_id);
    }
    return set;
  };
  const dau = activeIn(day1).size;
  const wau = activeIn(day7).size;
  const mau = activeIn(day30).size;
  const todayActive = entries.filter((e) => e.created_at.slice(0, 10) === today).reduce((s, e) => s.add(e.user_id), /* @__PURE__ */ new Set()).size;
  const eligibleForRetention = users.filter((u) => new Date(u.created_at).getTime() <= day7);
  const entriesByUser = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const arr = entriesByUser.get(e.user_id) ?? [];
    arr.push(new Date(e.created_at).getTime());
    entriesByUser.set(e.user_id, arr);
  }
  const retainedJ7 = eligibleForRetention.filter((u) => {
    const signupT = new Date(u.created_at).getTime();
    const userEntries = entriesByUser.get(u.id) ?? [];
    return userEntries.some((t) => t - signupT <= 7 * 864e5 && t >= signupT);
  }).length;
  const j7Pct = eligibleForRetention.length ? Math.round(retainedJ7 / eligibleForRetention.length * 100) : 0;
  const daysSeries = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 864e5).toISOString().slice(0, 10);
    const set = /* @__PURE__ */ new Set();
    for (const e of entries) {
      if (e.created_at.slice(0, 10) === d) set.add(e.user_id);
    }
    daysSeries.push(set.size);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: "Engagement" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: "Actifs aujourd'hui" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black tabular-nums mt-1", children: todayActive }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          "sur ",
          users.length,
          " inscrits (",
          Math.round(todayActive / total * 100),
          "%)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: "DAU / WAU / MAU" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black tabular-nums mt-1", children: [
          dau,
          " / ",
          wau,
          " / ",
          mau
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "distincts (1j / 7j / 30j)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: "Rétention J7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black tabular-nums mt-1", children: [
          j7Pct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          retainedJ7,
          " / ",
          eligibleForRetention.length,
          " inscrits 7j+"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: "Activité 14j" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { data: daysSeries, color: "hsl(var(--accent, 24 100% 50%))" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-1", children: [
          daysSeries.reduce((s, v) => s + v, 0),
          " sessions cumulées"
        ] })
      ] })
    ] })
  ] });
}
function DormantUsersPanel({
  users,
  entries
}) {
  const now = Date.now();
  const lastEntryByUser = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const t = new Date(e.created_at).getTime();
    const prev = lastEntryByUser.get(e.user_id) ?? 0;
    if (t > prev) lastEntryByUser.set(e.user_id, t);
  }
  const dormants = [];
  for (const u of users) {
    const last = lastEntryByUser.get(u.id) ?? null;
    const daysSinceSignup = Math.floor((now - new Date(u.created_at).getTime()) / 864e5);
    if (last === null) {
      if (daysSinceSignup >= 1) {
        dormants.push({
          u,
          lastActivity: null,
          daysSinceSignup,
          daysSinceActivity: null
        });
      }
    } else {
      const daysSinceActivity = Math.floor((now - last) / 864e5);
      if (daysSinceActivity >= 7) {
        dormants.push({
          u,
          lastActivity: last,
          daysSinceSignup,
          daysSinceActivity
        });
      }
    }
  }
  dormants.sort((a, b) => b.daysSinceSignup - a.daysSinceSignup);
  if (dormants.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: "Utilisateurs à relancer" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-xs text-muted-foreground italic", children: "Aucun utilisateur dormant 🎉" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold", children: [
        "À relancer · ",
        dormants.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Jamais utilisé ou inactif depuis 7 jours+" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border max-h-96 overflow-y-auto", children: [
      dormants.slice(0, 30).map((d) => {
        const country = d.u.country ? getCountry(d.u.country) : null;
        const fullPhone = d.u.phone && d.u.phone_country_code ? `${d.u.phone_country_code}${d.u.phone.replace(/\s+/g, "")}` : d.u.phone ? d.u.phone.replace(/\s+/g, "") : null;
        const cleanPhone = fullPhone ? fullPhone.replace(/[^\d]/g, "") : null;
        const waMsg = encodeURIComponent(`Salut ${d.u.first_name ?? ""}! C'est l'équipe NETODASH. On a remarqué que tu n'as pas encore utilisé ton tableau de bord. Besoin d'un coup de main pour démarrer ?`);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 flex items-center gap-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold truncate", children: [
              country?.flag ?? "🌐",
              " ",
              d.u.display_name || d.u.email || d.u.id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-[10px] truncate", children: [
              d.u.email,
              " · inscrit il y a ",
              d.daysSinceSignup,
              "j"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black tabular-nums", children: d.lastActivity === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Jamais" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              d.daysSinceActivity,
              "j"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground", children: d.lastActivity === null ? "utilisé" : "sans activité" })
          ] }),
          cleanPhone ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${cleanPhone}?text=${waMsg}`, target: "_blank", rel: "noopener noreferrer", className: "brutal-border-thin bg-[#25D366] text-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest shrink-0", title: "Relancer via WhatsApp", children: "WA" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground italic shrink-0", children: "pas de tél." })
        ] }, d.u.id);
      }),
      dormants.length > 30 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 text-[10px] text-muted-foreground italic", children: [
        "+",
        dormants.length - 30,
        " autres…"
      ] })
    ] })
  ] });
}
function KpiCard({
  label,
  value,
  accent,
  sparkline
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-3 md:p-4 ${accent ? "bg-foreground text-background" : "bg-card"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl md:text-2xl font-black mt-1 tabular-nums", children: value }),
    sparkline && sparkline.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { data: sparkline, color: accent ? "currentColor" : "hsl(var(--accent, 24 100% 50%))" })
  ] });
}
function Sparkline({
  data,
  color
}) {
  const max = Math.max(...data, 1);
  const w = 100;
  const h = 24;
  const step = w / Math.max(data.length - 1, 1);
  const points = data.map((v, i) => `${(i * step).toFixed(2)},${(h - v / max * h).toFixed(2)}`).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: `0 0 ${w} ${h}`, className: "w-full h-6 mt-2 opacity-80", preserveAspectRatio: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { fill: "none", stroke: color, strokeWidth: "1.5", points }) });
}
function DemographicsPanel({
  users
}) {
  if (users.length === 0) return null;
  const countryCounts = /* @__PURE__ */ new Map();
  let unknownCountry = 0;
  for (const u of users) {
    if (u.country) countryCounts.set(u.country, (countryCounts.get(u.country) ?? 0) + 1);
    else unknownCountry++;
  }
  const countryRanked = [...countryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const sourceCounts = /* @__PURE__ */ new Map();
  let unknownSource = 0;
  for (const u of users) {
    if (u.referral_source) sourceCounts.set(u.referral_source, (sourceCounts.get(u.referral_source) ?? 0) + 1);
    else unknownSource++;
  }
  const sourceRanked = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);
  const withPhone = users.filter((u) => u.phone).length;
  const phonePct = Math.round(withPhone / users.length * 100);
  const total = users.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: "Démographie" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DemoBlock, { title: "Top pays", items: countryRanked.map(([code, c]) => {
        const country = getCountry(code);
        return {
          label: `${country?.flag ?? "🌐"} ${country?.name ?? code}`,
          value: c
        };
      }), unknown: unknownCountry, total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DemoBlock, { title: "Sources d'acquisition", items: sourceRanked.map(([s, c]) => ({
        label: getReferralLabel(s),
        value: c
      })), unknown: unknownSource, total }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3", children: "Téléphone renseigné" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-black tabular-nums", children: [
          phonePct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
          withPhone,
          " / ",
          total,
          " utilisateurs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-2 bg-muted brutal-border-thin overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-accent", style: {
          width: `${phonePct}%`
        } }) })
      ] })
    ] })
  ] });
}
function DemoBlock({
  title,
  items,
  unknown,
  total
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground italic", children: "Aucune donnée" }),
      items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: it.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums font-bold ml-2", children: it.value })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-foreground", style: {
          width: `${it.value / max * 100}%`
        } }) })
      ] }, it.label)),
      unknown > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground italic pt-1 border-t border-border", children: [
        "Non renseigné : ",
        unknown,
        " / ",
        total
      ] })
    ] })
  ] });
}
const PAGE_SIZE = 25;
function UsersTab({
  users,
  fmt,
  onRefresh
}) {
  const [search, setSearch] = reactExports.useState("");
  const [planFilter, setPlanFilter] = reactExports.useState("all");
  const [countryFilter, setCountryFilter] = reactExports.useState("all");
  const [sortBy, setSortBy] = reactExports.useState("created");
  const [page, setPage] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(null);
  const countryOptions = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const u of users) if (u.country) set.add(u.country);
    return [...set].sort();
  }, [users]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = users.filter((u) => {
      if (planFilter === "paid" && u.total_paid <= 0) return false;
      else if (planFilter === "expiring" && (!u.trial_days_left || u.trial_days_left > 3 || u.trial_days_left < 0)) return false;
      else if (planFilter !== "all" && planFilter !== "paid" && planFilter !== "expiring" && u.plan !== planFilter) return false;
      if (countryFilter !== "all" && u.country !== countryFilter) return false;
      if (q) {
        const blob = `${u.email ?? ""} ${u.first_name ?? ""} ${u.last_name ?? ""} ${u.display_name ?? ""} ${u.phone ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    if (sortBy === "paid") list = [...list].sort((a, b) => b.total_paid - a.total_paid);
    else if (sortBy === "plan") {
      const order = {
        pro: 0,
        starter: 1,
        basic: 2,
        cod: 3,
        trial: 4,
        free: 5
      };
      list = [...list].sort((a, b) => (order[a.plan] ?? 9) - (order[b.plan] ?? 9));
    }
    return list;
  }, [users, search, planFilter, countryFilter, sortBy]);
  reactExports.useEffect(() => {
    setPage(0);
  }, [search, planFilter, countryFilter, sortBy]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Rechercher email, nom, téléphone…", className: "w-full brutal-border-thin bg-background pl-10 pr-9 py-2.5 text-sm outline-none" }),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSearch(""), className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: countryFilter, onChange: (e) => setCountryFilter(e.target.value), className: "brutal-border-thin bg-background px-3 py-2.5 text-sm outline-none sm:w-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous pays" }),
        countryOptions.map((c) => {
          const country = getCountry(c);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c, children: [
            country?.flag,
            " ",
            country?.name ?? c
          ] }, c);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "brutal-border-thin bg-background px-3 py-2.5 text-sm outline-none sm:w-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "created", children: "Tri : Inscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "Tri : Payé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "plan", children: "Tri : Plan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1", children: [{
      k: "all",
      l: `Tous (${users.length})`
    }, {
      k: "trial",
      l: `Trial`
    }, {
      k: "cod",
      l: "COD $10"
    }, {
      k: "basic",
      l: "Starter $12"
    }, {
      k: "starter",
      l: "Pro $29"
    }, {
      k: "pro",
      l: "Scale $79"
    }, {
      k: "free",
      l: "Free"
    }, {
      k: "paid",
      l: "💰 A payé"
    }, {
      k: "expiring",
      l: "⚠ Expire <3j"
    }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPlanFilter(f.k), className: `shrink-0 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest brutal-border-thin transition-colors ${planFilter === f.k ? "bg-foreground text-background border-foreground" : "bg-card hover:bg-muted"}`, children: f.l }, f.k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] uppercase tracking-widest text-muted-foreground", children: [
      filtered.length,
      " résultat",
      filtered.length > 1 ? "s" : "",
      " · Page ",
      page + 1,
      "/",
      totalPages
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-2", children: [
      pageItems.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserCard, { user: u, fmt, onOpen: () => setSelected(u) }, u.id)),
      pageItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Aucun utilisateur" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block brutal-border-thin overflow-x-auto bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Pays" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Tel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Inscrit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Essai" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Payé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        pageItems.map((u) => {
          const country = getCountry(u.country);
          const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40 cursor-pointer", onClick: () => setSelected(u), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs", children: u.email ?? "—" }),
              (fullName || u.display_name) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: fullName || u.display_name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan: u.plan }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs", children: country ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { title: country.name, children: [
              country.flag,
              " ",
              country.code
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-[11px]", children: u.phone ? `${u.phone_country_code ?? ""} ${u.phone}`.trim() : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs", children: u.referral_source ? getReferralLabel(u.referral_source) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs", children: new Date(u.created_at).toLocaleDateString("fr-FR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs", children: u.trial_days_total != null ? u.trial_days_left != null && u.trial_days_left > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: u.trial_days_left <= 3 ? "text-amber-600 font-bold" : "", children: [
              u.trial_days_left,
              "/",
              u.trial_days_total,
              "j"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-bold", children: "expiré" }) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums font-bold", children: fmt(u.total_paid) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4 text-muted-foreground inline" }) })
          ] }, u.id);
        }),
        pageItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "px-3 py-8 text-center text-muted-foreground text-sm", children: "Aucun utilisateur" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { page, totalPages, onPage: setPage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UserDrawer, { user: selected, onClose: () => setSelected(null), fmt, onDeleted: () => {
      setSelected(null);
      onRefresh();
    } })
  ] });
}
function UserCard({
  user,
  fmt,
  onOpen
}) {
  const initials = (user.email ?? "?").slice(0, 2).toUpperCase();
  const country = getCountry(user.country);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onOpen, className: "w-full brutal-border-thin bg-card p-3 text-left flex items-center gap-3 hover:bg-muted/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 brutal-border-thin bg-foreground text-background flex items-center justify-center font-black text-xs", children: initials }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs truncate flex-1", children: user.email ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan: user.plan })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5", children: [
        country && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          country.flag,
          " ",
          country.code
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(user.created_at).toLocaleDateString("fr-FR") }),
        user.total_paid > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-600", children: fmt(user.total_paid) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground shrink-0" })
  ] });
}
function PlanBadge({
  plan
}) {
  const styleMap = {
    pro: "bg-foreground text-background border-foreground",
    starter: "bg-accent text-background border-accent",
    basic: "bg-sky-100 text-sky-900 border-sky-300",
    cod: "bg-emerald-100 text-emerald-900 border-emerald-300",
    trial: "bg-amber-100 text-amber-900 border-amber-300",
    free: "bg-muted text-muted-foreground"
  };
  const labelMap = {
    pro: "Scale",
    starter: "Pro",
    basic: "Starter",
    cod: "COD",
    trial: "Trial",
    free: "Free"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest brutal-border-thin ${styleMap[plan] ?? "bg-muted"}`, children: labelMap[plan] ?? plan });
}
function UserDrawer({
  user,
  onClose,
  fmt,
  onDeleted
}) {
  const deleteUserFn = useServerFn(adminDeleteUser);
  const [confirming, setConfirming] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  if (!user) return null;
  const country = getCountry(user.country);
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  async function doDelete() {
    if (!user) return;
    setBusy(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée");
      await deleteUserFn({
        data: {
          targetUserId: user.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      toast.success("Utilisateur supprimé");
      onDeleted();
    } catch (e) {
      toast.error(e?.message ?? "Échec suppression");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: !!user, onOpenChange: (o) => !o && onClose(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-md overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "font-black uppercase tracking-tight break-all", children: user.email ?? "Utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: fullName || user.display_name || "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Plan effectif", value: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan: user.plan }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Plan brut (DB)", value: user.raw_plan }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Statut sub", value: user.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mode choisi au signup", value: user.selected_mode ? user.selected_mode.toUpperCase() : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mode actif", value: user.active_mode ? user.active_mode.toUpperCase() : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Dual mode (Drop+COD)", value: user.legacy_dual_mode ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-bold", children: "✓ Legacy (grandfathered)" }) : user.plan === "starter" || user.plan === "pro" || user.plan === "trial" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-bold", children: "✓ Inclus dans le plan" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Verrouillé (Basic / Free)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Pays", value: country ? `${country.flag} ${country.name}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Téléphone", value: user.phone ? `${user.phone_country_code ?? ""} ${user.phone}`.trim() : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Source", value: user.referral_source ? getReferralLabel(user.referral_source) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Inscrit le", value: new Date(user.created_at).toLocaleString("fr-FR") }),
        user.trial_days_total != null && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Essai", value: user.trial_days_left != null && user.trial_days_left > 0 ? `${user.trial_days_left} / ${user.trial_days_total}j restants` : "Expiré" }),
        user.current_period_end && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Période en cours jusqu'au", value: new Date(user.current_period_end).toLocaleDateString("fr-FR") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Total payé", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black tabular-nums", children: fmt(user.total_paid) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "ID", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] break-all", children: user.id }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setConfirming(true), className: "w-full inline-flex items-center justify-center gap-2 brutal-border bg-red-600 border-red-600 text-white px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
        " Supprimer définitivement"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: confirming, onOpenChange: setConfirming, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Supprimer ce compte ?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Toutes les données (",
          user.email ?? user.id,
          ") seront effacées : produits, saisies, paiements, abonnement. Action irréversible."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setConfirming(false), className: "brutal-border-thin px-4 py-2 text-xs font-black uppercase tracking-widest", children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: doDelete, disabled: busy, className: "brutal-border bg-red-600 border-red-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50", children: busy ? "Suppression…" : "Confirmer la suppression" })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: value })
  ] });
}
function PaymentsTab({
  payments
}) {
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [page, setPage] = reactExports.useState(0);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q) {
        const blob = `${p.email ?? ""} ${p.reference ?? ""} ${p.payment_method ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [payments, search, statusFilter]);
  reactExports.useEffect(() => setPage(0), [search, statusFilter]);
  const totalAmount = filtered.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  function exportCSV() {
    const header = ["date", "email", "plan", "method", "amount", "currency", "status", "reference"];
    const rows = filtered.map((p) => [new Date(p.created_at).toISOString(), p.email ?? "", p.plan, p.payment_method, p.amount, p.currency, p.status, p.reference]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv"
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `payments-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Email, référence, méthode…", className: "w-full brutal-border-thin bg-background pl-10 pr-3 py-2.5 text-sm outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "brutal-border-thin bg-background px-3 py-2.5 text-sm outline-none sm:w-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous statuts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "Payé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "En attente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Échoué" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: exportCSV, className: "brutal-border-thin bg-card hover:bg-foreground hover:text-background px-3 py-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
        " CSV"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        filtered.length,
        " paiement",
        filtered.length > 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-emerald-700 normal-case tracking-normal", children: [
        "Total payé filtré : ",
        formatCurrency(totalAmount, "USD")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-2", children: [
      pageItems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs truncate flex-1", children: p.email ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground uppercase tracking-widest", children: [
            p.plan,
            " · ",
            p.payment_method
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black tabular-nums text-sm", children: formatCurrency(Number(p.amount), p.currency) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 font-mono", children: new Date(p.created_at).toLocaleString("fr-FR") })
      ] }, p.id)),
      pageItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Aucun paiement" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block brutal-border-thin overflow-x-auto bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Méthode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest text-right", children: "Montant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-xs uppercase tracking-widest", children: "Référence" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        pageItems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs", children: new Date(p.created_at).toLocaleString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs", children: p.email ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 uppercase font-bold text-xs", children: p.plan }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs", children: p.payment_method }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums font-bold", children: formatCurrency(Number(p.amount), p.currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-[10px] text-muted-foreground truncate max-w-[160px]", children: p.reference })
        ] }, p.id)),
        pageItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-3 py-8 text-center text-muted-foreground", children: "Aucun paiement" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { page, totalPages, onPage: setPage })
  ] });
}
function StatusBadge({
  status
}) {
  const cls = status === "paid" ? "bg-emerald-600 text-white" : status === "pending" ? "bg-amber-500 text-black" : "bg-red-600 text-white";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${cls}`, children: status });
}
function AffiliatesTab({
  codes,
  userId,
  onChanged
}) {
  const [slug, setSlug] = reactExports.useState("");
  const [label, setLabel] = reactExports.useState("");
  const [trialDays, setTrialDays] = reactExports.useState(5);
  const [creating, setCreating] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(null);
  async function handleCreate(e) {
    e.preventDefault();
    if (!userId) return;
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!cleanSlug) return;
    const code = cleanSlug.startsWith("ntdsh-") ? cleanSlug : `ntdsh-${cleanSlug}`;
    setCreating(true);
    const {
      error
    } = await supabase.from("affiliate_codes").insert({
      code,
      label: label.trim() || null,
      trial_days: Math.max(1, Math.min(30, Number(trialDays) || 5)),
      created_by: userId,
      owner_user_id: userId
    });
    setCreating(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSlug("");
    setLabel("");
    setTrialDays(5);
    toast.success("Code créé");
    onChanged();
  }
  async function toggle(c) {
    const {
      error
    } = await supabase.from("affiliate_codes").update({
      active: !c.active
    }).eq("id", c.id);
    if (error) toast.error(error.message);
    else onChanged();
  }
  const sorted = reactExports.useMemo(() => [...codes].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return b.signups_count - a.signups_count;
  }), [codes]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border", children: "Nouveau code d'affiliation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "p-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_auto] gap-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Slug" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center brutal-border-thin bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-2 text-xs font-mono text-muted-foreground border-r border-border", children: "ntdsh-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: slug.replace(/^ntdsh-/, ""), onChange: (e) => setSlug(e.target.value.toLowerCase()), placeholder: "adbaecomx", className: "flex-1 bg-transparent px-2 py-2 font-mono text-sm outline-none min-w-0" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Libellé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: label, onChange: (e) => setLabel(e.target.value), placeholder: "Ex: Influenceur Dakar", className: "w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Essai (j)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 30, value: trialDays, onChange: (e) => setTrialDays(Number(e.target.value)), className: "w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none tabular-nums" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: creating || !slug.trim(), className: "brutal-border bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50", children: creating ? "…" : "Créer" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3", children: [
      sorted.map((c) => {
        const link = `${PUBLIC_BASE_URL}/affilie/${c.code}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-base font-black break-all", children: c.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: c.label ?? "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(c), className: `shrink-0 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest brutal-border-thin inline-flex items-center gap-1 ${c.active ? "bg-emerald-600 text-white border-emerald-600" : "bg-muted text-muted-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3 w-3" }),
              c.active ? "ON" : "OFF"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mt-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground font-bold", children: "Essai" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black tabular-nums", children: [
                c.trial_days,
                "j"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground font-bold", children: "Inscriptions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black tabular-nums", children: c.signups_count })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            navigator.clipboard?.writeText(link);
            toast.success("Lien copié");
          }, className: "mt-3 w-full inline-flex items-center justify-center gap-1.5 brutal-border-thin bg-muted/50 hover:bg-muted px-2 py-1.5 font-mono text-[10px] truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: link })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setEditing(c), className: "flex-1 brutal-border-thin bg-background hover:bg-foreground hover:text-background px-2 py-1.5 text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
              " Éditer"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setDeleting(c), className: "flex-1 brutal-border-thin bg-red-600 text-white border-red-600 hover:bg-red-700 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
              " Suppr"
            ] })
          ] })
        ] }, c.id);
      }),
      sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Aucun code créé" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditCodeDialog, { code: editing, onClose: () => setEditing(null), onSaved: onChanged }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteCodeDialog, { code: deleting, onClose: () => setDeleting(null), onDeleted: onChanged })
  ] });
}
function EditCodeDialog({
  code,
  onClose,
  onSaved
}) {
  const [slug, setSlug] = reactExports.useState("");
  const [label, setLabel] = reactExports.useState("");
  const [trialDays, setTrialDays] = reactExports.useState(5);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (code) {
      setSlug(code.code.replace(/^ntdsh-/, ""));
      setLabel(code.label ?? "");
      setTrialDays(code.trial_days);
    }
  }, [code]);
  async function save() {
    if (!code) return;
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!cleanSlug) {
      toast.error("Slug invalide");
      return;
    }
    setBusy(true);
    const newCode = cleanSlug.startsWith("ntdsh-") ? cleanSlug : `ntdsh-${cleanSlug}`;
    const {
      error
    } = await supabase.from("affiliate_codes").update({
      code: newCode,
      label: label.trim() || null,
      trial_days: Math.max(1, Math.min(30, Number(trialDays) || 5))
    }).eq("id", code.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Code mis à jour");
    onSaved();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!code, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Éditer le code" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Slug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center brutal-border-thin bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-2 text-xs font-mono text-muted-foreground border-r border-border", children: "ntdsh-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: slug.replace(/^ntdsh-/, ""), onChange: (e) => setSlug(e.target.value.toLowerCase()), className: "flex-1 bg-transparent px-2 py-2 font-mono text-sm outline-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Libellé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: label, onChange: (e) => setLabel(e.target.value), className: "w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Essai (jours)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 30, value: trialDays, onChange: (e) => setTrialDays(Number(e.target.value)), className: "w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none tabular-nums" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "brutal-border-thin px-4 py-2 text-xs font-black uppercase tracking-widest", children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: save, disabled: busy, className: "brutal-border bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50", children: busy ? "…" : "Enregistrer" })
    ] })
  ] }) });
}
function DeleteCodeDialog({
  code,
  onClose,
  onDeleted
}) {
  const [busy, setBusy] = reactExports.useState(false);
  if (!code) return null;
  async function doDelete() {
    if (!code) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("affiliate_codes").delete().eq("id", code.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Code supprimé");
    onDeleted();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!code, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Supprimer ce code ?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Le code ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold", children: code.code }),
        " ne sera plus utilisable. Les inscriptions déjà liées sont conservées."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "brutal-border-thin px-4 py-2 text-xs font-black uppercase tracking-widest", children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: doDelete, disabled: busy, className: "brutal-border bg-red-600 border-red-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50", children: busy ? "…" : "Supprimer" })
    ] })
  ] }) });
}
function SettingsTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SupportWhatsAppEditor, {}) });
}
function SupportWhatsAppEditor() {
  const [value, setValue] = reactExports.useState("");
  const [initial, setInitial] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data,
        error
      } = await supabase.from("app_settings").select("value").eq("key", "support_whatsapp").maybeSingle();
      if (error) toast.error(error.message);
      const v = data?.value ?? "";
      setValue(v);
      setInitial(v);
      setLoading(false);
    })();
  }, []);
  async function save() {
    setSaving(true);
    const {
      error
    } = await supabase.from("app_settings").upsert({
      key: "support_whatsapp",
      value: value.trim()
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Numéro enregistré");
      setInitial(value.trim());
    }
  }
  const dirty = value.trim() !== initial.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border", children: "Numéro WhatsApp Assistance" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1", children: "Numéro (format international, ex: +13474952236)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => setValue(e.target.value), placeholder: "+13474952236", disabled: loading, className: "w-full brutal-border-thin bg-background px-3 py-2 font-mono text-sm outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Laisser vide pour masquer le bouton flottant." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: save, disabled: !dirty || saving || loading, className: "brutal-border bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50", children: saving ? "…" : "Enregistrer" })
    ] })
  ] });
}
function Pagination({
  page,
  totalPages,
  onPage
}) {
  if (totalPages <= 1) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 pt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onPage(Math.max(0, page - 1)), disabled: page === 0, className: "brutal-border-thin bg-card px-3 py-1.5 disabled:opacity-40 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3 w-3" }),
      " Préc."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono tabular-nums", children: [
      page + 1,
      " / ",
      totalPages
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onPage(Math.min(totalPages - 1, page + 1)), disabled: page >= totalPages - 1, className: "brutal-border-thin bg-card px-3 py-1.5 disabled:opacity-40 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest", children: [
      "Suiv. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
    ] })
  ] });
}
function EmptyState({
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin bg-card p-8 text-center text-sm text-muted-foreground", children: text });
}
export {
  AdminPage as component
};
