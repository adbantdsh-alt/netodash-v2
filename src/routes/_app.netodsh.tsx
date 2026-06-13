import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { useIsAdmin } from "@/lib/use-is-admin";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, formatNumber } from "@/lib/calc";
import { adminDeleteUser, getEngagementData } from "@/lib/admin.functions";
import { getCountry, getReferralLabel } from "@/lib/countries";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Ticket,
  Settings as SettingsIcon,
  RefreshCw,
  Search,
  X,
  Copy,
  Pencil,
  Trash2,
  Power,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type TabKey = "overview" | "users" | "payments" | "affiliates" | "settings";

const VALID_TABS: TabKey[] = ["overview", "users", "payments", "affiliates", "settings"];

export const Route = createFileRoute("/_app/netodsh")({
  head: () => ({ meta: [{ title: "Admin — NETODASH" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    tab: (VALID_TABS.includes(s.tab as TabKey) ? (s.tab as TabKey) : "overview") as TabKey,
  }),
  component: AdminPage,
});

// ──────────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────────

type AdminStats = {
  totalUsers: number;
  trialUsers: number;
  codUsers: number;
  basicUsers: number;
  starterUsers: number; // affiché comme "Pro"
  proUsers: number;     // affiché comme "Scale"
  freeUsers: number;
  newUsers30d: number;
  totalRevenue: number;
  revenue30d: number;
  paymentsCount: number;
  mrr: number;
  signupsSeries: number[]; // 30 points
  revenueSeries: number[]; // 30 points
};

type UserRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  phone_country_code: string | null;
  phone: string | null;
  referral_source: string | null;
  selected_mode: string | null;
  legacy_dual_mode: boolean;
  active_mode: string | null;
  created_at: string;
  plan: string;
  raw_plan: string;
  status: string;
  trial_ends_at: string | null;
  current_period_end: string | null;
  trial_days_total: number | null;
  trial_days_left: number | null;
  total_paid: number;
};

type PaymentRow = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  plan: string;
  payment_method: string;
  status: string;
  reference: string;
  created_at: string;
  paid_at: string | null;
  email?: string | null;
};

type AffiliateCodeRow = {
  id: string;
  code: string;
  label: string | null;
  trial_days: number;
  active: boolean;
  owner_user_id: string | null;
  created_at: string;
  signups_count: number;
};

const PUBLIC_BASE_URL = "https://netodash.com";

// ──────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminQ = useIsAdmin(user?.id);
  const { tab } = Route.useSearch();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [codes, setCodes] = useState<AffiliateCodeRow[]>([]);
  const [entries, setEntries] = useState<{ user_id: string; entry_date: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const getEngagementDataFn = useServerFn(getEngagementData);

  useEffect(() => {
    if (!adminQ.isLoading && adminQ.data === false) {
      navigate({ to: "/dashboard" });
    }
  }, [adminQ.isLoading, adminQ.data, navigate]);

  useEffect(() => {
    if (!adminQ.data) return;
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminQ.data, refreshKey]);

  async function loadAll() {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Session expirée");

      const [profilesRes, subsRes, paymentsRes, codesRes, refsRes, engagementRes] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id, email, display_name, first_name, last_name, country, phone_country_code, phone, referral_source, selected_mode, active_mode, legacy_dual_mode, created_at",
          ),
        supabase.from("subscriptions").select("*"),
        supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("affiliate_codes").select("*").order("created_at", { ascending: false }),
        supabase.from("affiliate_referrals").select("code_id"),
        getEngagementDataFn({
          headers: { Authorization: `Bearer ${session.access_token}` },
        } as any).catch((e: unknown) => {
          console.error("engagement load failed", e);
          return { entries: [] as { user_id: string; entry_date: string; created_at: string }[] };
        }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (subsRes.error) throw subsRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      if (codesRes.error) throw codesRes.error;

      const profiles = profilesRes.data ?? [];
      const subs = subsRes.data ?? [];
      const pays = paymentsRes.data ?? [];

      const subByUser = new Map(subs.map((s: any) => [s.user_id, s]));
      const paidByUser = new Map<string, number>();
      for (const p of pays) {
        if (p.status === "paid") {
          paidByUser.set(p.user_id, (paidByUser.get(p.user_id) ?? 0) + Number(p.amount));
        }
      }
      const emailByUser = new Map(profiles.map((p: any) => [p.id, p.email]));

      const now = Date.now();
      const d30 = now - 30 * 86400000;

      const userRows: UserRow[] = profiles.map((p: any) => {
        const s = subByUser.get(p.id) as any;
        const plan = s?.plan ?? "free";
        const status = s?.status ?? "—";
        const trialEnds = s?.trial_ends_at ? new Date(s.trial_ends_at).getTime() : null;
        const periodEnd = s?.current_period_end ? new Date(s.current_period_end).getTime() : null;
        let effective = "free";
        if (plan === "pro" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now))
          effective = "pro";
        else if (plan === "starter" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now))
          effective = "starter";
        else if (plan === "cod" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now))
          effective = "cod";
        else if (plan === "basic" && ["active", "incomplete"].includes(status) && (!periodEnd || periodEnd > now))
          effective = "basic";
        else if (plan === "trial" && trialEnds && trialEnds > now) effective = "trial";

        let trial_days_total: number | null = null;
        let trial_days_left: number | null = null;
        if (s?.trial_ends_at) {
          const created = new Date(s.created_at ?? p.created_at).getTime();
          trial_days_total = Math.max(1, Math.round((trialEnds! - created) / 86_400_000));
          trial_days_left = Math.ceil((trialEnds! - now) / 86_400_000);
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
          total_paid: paidByUser.get(p.id) ?? 0,
        };
      });

      const counts = { trial: 0, cod: 0, basic: 0, starter: 0, pro: 0, free: 0 };
      for (const u of userRows) {
        if (u.plan === "trial") counts.trial++;
        else if (u.plan === "cod") counts.cod++;
        else if (u.plan === "basic") counts.basic++;
        else if (u.plan === "starter") counts.starter++;
        else if (u.plan === "pro") counts.pro++;
        else counts.free++;
      }

      const totalRevenue = pays
        .filter((p: any) => p.status === "paid")
        .reduce((s: number, p: any) => s + Number(p.amount), 0);
      const revenue30d = pays
        .filter((p: any) => p.status === "paid" && new Date(p.created_at).getTime() >= d30)
        .reduce((s: number, p: any) => s + Number(p.amount), 0);
      const newUsers30d = profiles.filter((p: any) => new Date(p.created_at).getTime() >= d30).length;

      // MRR estimé en USD : cod=$10, basic (Starter)=$12, starter (Pro)=$29, pro (Scale)=$79
      let mrr = 0;
      for (const s of subs) {
        if (!["active", "incomplete"].includes((s as any).status)) continue;
        const plan = (s as any).plan;
        if (plan === "pro") mrr += 79;
        else if (plan === "starter") mrr += 29;
        else if (plan === "basic") mrr += 12;
        else if (plan === "cod") mrr += 10;
      }

      // Build 30-day series
      const signupsSeries = new Array(30).fill(0);
      const revenueSeries = new Array(30).fill(0);
      for (const p of profiles) {
        const t = new Date(p.created_at).getTime();
        const idx = 29 - Math.floor((now - t) / 86_400_000);
        if (idx >= 0 && idx < 30) signupsSeries[idx]++;
      }
      for (const p of pays) {
        if (p.status !== "paid") continue;
        const t = new Date(p.created_at).getTime();
        const idx = 29 - Math.floor((now - t) / 86_400_000);
        if (idx >= 0 && idx < 30) revenueSeries[idx] += Number(p.amount);
      }

      // Affiliate codes with signup counts
      const refCounts = new Map<string, number>();
      for (const r of refsRes.data ?? []) {
        refCounts.set((r as any).code_id, (refCounts.get((r as any).code_id) ?? 0) + 1);
      }
      const codeRows: AffiliateCodeRow[] = (codesRes.data ?? []).map((c: any) => ({
        ...c,
        signups_count: refCounts.get(c.id) ?? 0,
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
        revenueSeries,
      });
      setUsers(
        userRows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      );
      setPayments(pays.map((p: any) => ({ ...p, email: emailByUser.get(p.user_id) ?? null })));
      setCodes(codeRows);
      setEntries(Array.isArray(engagementRes?.entries) ? engagementRes.entries : []);
    } catch (e: any) {
      toast.error(e.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  if (adminQ.isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12 text-xs uppercase tracking-widest text-muted-foreground">
        Vérification accès…
      </div>
    );
  }
  if (!adminQ.data) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12 text-xs uppercase tracking-widest text-muted-foreground">
        Accès refusé. Redirection…
      </div>
    );
  }

  const fmt = (v: number) => formatCurrency(v, "USD");

  return (
    <div className="max-w-[1600px] mx-auto pb-24 md:pb-6">
      {/* Header sticky */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b-2 border-border">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
              Admin · NETODASH
            </div>
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight truncate">
              {tabTitle(tab)}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="brutal-border-thin bg-card hover:bg-foreground hover:text-background px-3 py-2 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest disabled:opacity-50 shrink-0"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden md:flex px-4 md:px-6 gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link
              key={t.key}
              to="/netodsh"
              search={{ tab: t.key }}
              className={`px-3 py-2 text-xs font-black uppercase tracking-widest border-b-2 inline-flex items-center gap-1.5 transition-colors ${
                tab === t.key
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Body */}
      <main className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {loading && !stats ? (
          <div className="text-xs uppercase tracking-widest text-muted-foreground py-8 text-center">
            Chargement…
          </div>
        ) : (
          <>
            {tab === "overview" && stats && (
              <OverviewTab stats={stats} fmt={fmt} users={users} entries={entries} />
            )}
            {tab === "users" && (
              <UsersTab users={users} fmt={fmt} onRefresh={() => setRefreshKey((k) => k + 1)} />
            )}
            {tab === "payments" && <PaymentsTab payments={payments} />}
            {tab === "affiliates" && (
              <AffiliatesTab codes={codes} userId={user?.id ?? null} onChanged={() => setRefreshKey((k) => k + 1)} />
            )}
            {tab === "settings" && <SettingsTab />}
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t-2 border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Link
                key={t.key}
                to="/netodsh"
                search={{ tab: t.key }}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 ${
                  active ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <t.icon className="h-5 w-5" />
                <span className="text-[9px] uppercase tracking-wider font-bold">{t.short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

const TABS: { key: TabKey; label: string; short: string; icon: any }[] = [
  { key: "overview", label: "Aperçu", short: "Aperçu", icon: LayoutDashboard },
  { key: "users", label: "Utilisateurs", short: "Users", icon: Users },
  { key: "payments", label: "Paiements", short: "Paie.", icon: CreditCard },
  { key: "affiliates", label: "Affiliation", short: "Affil.", icon: Ticket },
  { key: "settings", label: "Réglages", short: "Régl.", icon: SettingsIcon },
];

function tabTitle(t: TabKey): string {
  return TABS.find((x) => x.key === t)?.label ?? "Admin";
}

// ──────────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ──────────────────────────────────────────────────────────────────

function OverviewTab({
  stats,
  fmt,
  users,
  entries,
}: {
  stats: AdminStats;
  fmt: (v: number) => string;
  users: UserRow[];
  entries: { user_id: string; entry_date: string; created_at: string }[];
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Utilisateurs" value={formatNumber(stats.totalUsers)} />
        <KpiCard
          label="Nouveaux 30j"
          value={formatNumber(stats.newUsers30d)}
          sparkline={stats.signupsSeries}
        />
        <KpiCard label="MRR estimé" value={fmt(stats.mrr)} accent />
        <KpiCard
          label="Revenu 30j"
          value={fmt(stats.revenue30d)}
          sparkline={stats.revenueSeries}
        />
        <KpiCard label="Trial actifs" value={formatNumber(stats.trialUsers)} />
        <KpiCard label="COD ($10)" value={formatNumber(stats.codUsers)} />
        <KpiCard label="Starter ($12)" value={formatNumber(stats.basicUsers)} />
        <KpiCard label="Pro ($29)" value={formatNumber(stats.starterUsers)} />
        <KpiCard label="Scale ($79)" value={formatNumber(stats.proUsers)} accent />
        <KpiCard label="Free / expirés" value={formatNumber(stats.freeUsers)} />
        <KpiCard label="Revenu total" value={fmt(stats.totalRevenue)} />
      </div>

      <EngagementPanel users={users} entries={entries} />
      <DormantUsersPanel users={users} entries={entries} />
      <DemographicsPanel users={users} />
    </div>
  );
}

function EngagementPanel({
  users,
  entries,
}: {
  users: UserRow[];
  entries: { user_id: string; entry_date: string; created_at: string }[];
}) {
  const now = Date.now();
  const total = users.length || 1;
  const today = new Date().toISOString().slice(0, 10);
  const day1 = now - 1 * 86400000;
  const day7 = now - 7 * 86400000;
  const day30 = now - 30 * 86400000;

  // DAU/WAU/MAU based on entry created_at (when user actually used the tool)
  const activeIn = (since: number) => {
    const set = new Set<string>();
    for (const e of entries) {
      if (new Date(e.created_at).getTime() >= since) set.add(e.user_id);
    }
    return set;
  };
  const dau = activeIn(day1).size;
  const wau = activeIn(day7).size;
  const mau = activeIn(day30).size;
  const todayActive = entries.filter((e) => e.created_at.slice(0, 10) === today)
    .reduce((s, e) => s.add(e.user_id), new Set<string>()).size;

  // J7 retention: % of users who signed up >= 7 days ago AND made at least one entry within 7 days of signup
  const eligibleForRetention = users.filter(
    (u) => new Date(u.created_at).getTime() <= day7,
  );
  const entriesByUser = new Map<string, number[]>();
  for (const e of entries) {
    const arr = entriesByUser.get(e.user_id) ?? [];
    arr.push(new Date(e.created_at).getTime());
    entriesByUser.set(e.user_id, arr);
  }
  const retainedJ7 = eligibleForRetention.filter((u) => {
    const signupT = new Date(u.created_at).getTime();
    const userEntries = entriesByUser.get(u.id) ?? [];
    return userEntries.some((t) => t - signupT <= 7 * 86400000 && t >= signupT);
  }).length;
  const j7Pct = eligibleForRetention.length
    ? Math.round((retainedJ7 / eligibleForRetention.length) * 100)
    : 0;

  // Sparkline 14 days: distinct active users per day
  const daysSeries: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
    const set = new Set<string>();
    for (const e of entries) {
      if (e.created_at.slice(0, 10) === d) set.add(e.user_id);
    }
    daysSeries.push(set.size);
  }

  return (
    <div className="brutal-border-thin bg-card">
      <div className="px-4 py-3 border-b border-border bg-muted">
        <div className="text-xs uppercase tracking-widest font-bold">Engagement</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Actifs aujourd'hui
          </div>
          <div className="text-2xl font-black tabular-nums mt-1">{todayActive}</div>
          <div className="text-[10px] text-muted-foreground">
            sur {users.length} inscrits ({Math.round((todayActive / total) * 100)}%)
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            DAU / WAU / MAU
          </div>
          <div className="text-2xl font-black tabular-nums mt-1">
            {dau} / {wau} / {mau}
          </div>
          <div className="text-[10px] text-muted-foreground">distincts (1j / 7j / 30j)</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Rétention J7
          </div>
          <div className="text-2xl font-black tabular-nums mt-1">{j7Pct}%</div>
          <div className="text-[10px] text-muted-foreground">
            {retainedJ7} / {eligibleForRetention.length} inscrits 7j+
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Activité 14j
          </div>
          <Sparkline data={daysSeries} color="hsl(var(--accent, 24 100% 50%))" />
          <div className="text-[10px] text-muted-foreground mt-1">
            {daysSeries.reduce((s, v) => s + v, 0)} sessions cumulées
          </div>
        </div>
      </div>
    </div>
  );
}

function DormantUsersPanel({
  users,
  entries,
}: {
  users: UserRow[];
  entries: { user_id: string; entry_date: string; created_at: string }[];
}) {
  const now = Date.now();
  const lastEntryByUser = new Map<string, number>();
  for (const e of entries) {
    const t = new Date(e.created_at).getTime();
    const prev = lastEntryByUser.get(e.user_id) ?? 0;
    if (t > prev) lastEntryByUser.set(e.user_id, t);
  }

  type Dormant = {
    u: UserRow;
    lastActivity: number | null;
    daysSinceSignup: number;
    daysSinceActivity: number | null;
  };
  const dormants: Dormant[] = [];
  for (const u of users) {
    const last = lastEntryByUser.get(u.id) ?? null;
    const daysSinceSignup = Math.floor((now - new Date(u.created_at).getTime()) / 86400000);
    if (last === null) {
      // never used
      if (daysSinceSignup >= 1) {
        dormants.push({ u, lastActivity: null, daysSinceSignup, daysSinceActivity: null });
      }
    } else {
      const daysSinceActivity = Math.floor((now - last) / 86400000);
      if (daysSinceActivity >= 7) {
        dormants.push({ u, lastActivity: last, daysSinceSignup, daysSinceActivity });
      }
    }
  }
  dormants.sort((a, b) => b.daysSinceSignup - a.daysSinceSignup);

  if (dormants.length === 0) {
    return (
      <div className="brutal-border-thin bg-card">
        <div className="px-4 py-3 border-b border-border bg-muted">
          <div className="text-xs uppercase tracking-widest font-bold">
            Utilisateurs à relancer
          </div>
        </div>
        <div className="p-4 text-xs text-muted-foreground italic">
          Aucun utilisateur dormant 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="brutal-border-thin bg-card">
      <div className="px-4 py-3 border-b border-border bg-muted flex items-center justify-between gap-2">
        <div className="text-xs uppercase tracking-widest font-bold">
          À relancer · {dormants.length}
        </div>
        <div className="text-[10px] text-muted-foreground">
          Jamais utilisé ou inactif depuis 7 jours+
        </div>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {dormants.slice(0, 30).map((d) => {
          const country = d.u.country ? getCountry(d.u.country) : null;
          const fullPhone =
            d.u.phone && d.u.phone_country_code
              ? `${d.u.phone_country_code}${d.u.phone.replace(/\s+/g, "")}`
              : d.u.phone
                ? d.u.phone.replace(/\s+/g, "")
                : null;
          const cleanPhone = fullPhone ? fullPhone.replace(/[^\d]/g, "") : null;
          const waMsg = encodeURIComponent(
            `Salut ${d.u.first_name ?? ""}! C'est l'équipe NETODASH. On a remarqué que tu n'as pas encore utilisé ton tableau de bord. Besoin d'un coup de main pour démarrer ?`,
          );
          return (
            <div key={d.u.id} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <div className="font-bold truncate">
                  {country?.flag ?? "🌐"} {d.u.display_name || d.u.email || d.u.id.slice(0, 8)}
                </div>
                <div className="text-muted-foreground text-[10px] truncate">
                  {d.u.email} · inscrit il y a {d.daysSinceSignup}j
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black tabular-nums">
                  {d.lastActivity === null ? (
                    <span className="text-destructive">Jamais</span>
                  ) : (
                    <span>{d.daysSinceActivity}j</span>
                  )}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  {d.lastActivity === null ? "utilisé" : "sans activité"}
                </div>
              </div>
              {cleanPhone ? (
                <a
                  href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-border-thin bg-[#25D366] text-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest shrink-0"
                  title="Relancer via WhatsApp"
                >
                  WA
                </a>
              ) : (
                <span className="text-[9px] text-muted-foreground italic shrink-0">
                  pas de tél.
                </span>
              )}
            </div>
          );
        })}
        {dormants.length > 30 && (
          <div className="px-4 py-2 text-[10px] text-muted-foreground italic">
            +{dormants.length - 30} autres…
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent,
  sparkline,
}: {
  label: string;
  value: string;
  accent?: boolean;
  sparkline?: number[];
}) {
  return (
    <div className={`brutal-border-thin p-3 md:p-4 ${accent ? "bg-foreground text-background" : "bg-card"}`}>
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-70">{label}</div>
      <div className="text-xl md:text-2xl font-black mt-1 tabular-nums">{value}</div>
      {sparkline && sparkline.length > 0 && (
        <Sparkline data={sparkline} color={accent ? "currentColor" : "hsl(var(--accent, 24 100% 50%))"} />
      )}
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 100;
  const h = 24;
  const step = w / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => `${(i * step).toFixed(2)},${(h - (v / max) * h).toFixed(2)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-6 mt-2 opacity-80" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

function DemographicsPanel({ users }: { users: UserRow[] }) {
  if (users.length === 0) return null;
  const countryCounts = new Map<string, number>();
  let unknownCountry = 0;
  for (const u of users) {
    if (u.country) countryCounts.set(u.country, (countryCounts.get(u.country) ?? 0) + 1);
    else unknownCountry++;
  }
  const countryRanked = [...countryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const sourceCounts = new Map<string, number>();
  let unknownSource = 0;
  for (const u of users) {
    if (u.referral_source) sourceCounts.set(u.referral_source, (sourceCounts.get(u.referral_source) ?? 0) + 1);
    else unknownSource++;
  }
  const sourceRanked = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);

  const withPhone = users.filter((u) => u.phone).length;
  const phonePct = Math.round((withPhone / users.length) * 100);
  const total = users.length;

  return (
    <div className="brutal-border-thin bg-card">
      <div className="px-4 py-3 border-b border-border bg-muted">
        <div className="text-xs uppercase tracking-widest font-bold">Démographie</div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 p-4">
        <DemoBlock title="Top pays" items={countryRanked.map(([code, c]) => {
          const country = getCountry(code);
          return { label: `${country?.flag ?? "🌐"} ${country?.name ?? code}`, value: c };
        })} unknown={unknownCountry} total={total} />
        <DemoBlock title="Sources d'acquisition" items={sourceRanked.map(([s, c]) => ({
          label: getReferralLabel(s),
          value: c,
        }))} unknown={unknownSource} total={total} />
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
            Téléphone renseigné
          </div>
          <div className="text-3xl font-black tabular-nums">{phonePct}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            {withPhone} / {total} utilisateurs
          </div>
          <div className="mt-3 h-2 bg-muted brutal-border-thin overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${phonePct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoBlock({
  title,
  items,
  unknown,
  total,
}: {
  title: string;
  items: { label: string; value: number }[];
  unknown: number;
  total: number;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
        {title}
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-xs text-muted-foreground italic">Aucune donnée</div>
        )}
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="truncate">{it.label}</span>
              <span className="tabular-nums font-bold ml-2">{it.value}</span>
            </div>
            <div className="h-1.5 bg-muted mt-1">
              <div className="h-full bg-foreground" style={{ width: `${(it.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
        {unknown > 0 && (
          <div className="text-[10px] text-muted-foreground italic pt-1 border-t border-border">
            Non renseigné : {unknown} / {total}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// USERS TAB
// ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

function UsersTab({
  users,
  fmt,
  onRefresh,
}: {
  users: UserRow[];
  fmt: (v: number) => string;
  onRefresh: () => void;
}) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created" | "paid" | "plan">("created");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<UserRow | null>(null);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const u of users) if (u.country) set.add(u.country);
    return [...set].sort();
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = users.filter((u) => {
      if (planFilter === "paid" && u.total_paid <= 0) return false;
      else if (planFilter === "expiring" && (!u.trial_days_left || u.trial_days_left > 3 || u.trial_days_left < 0)) return false;
      else if (planFilter !== "all" && planFilter !== "paid" && planFilter !== "expiring" && u.plan !== planFilter)
        return false;
      if (countryFilter !== "all" && u.country !== countryFilter) return false;
      if (q) {
        const blob = `${u.email ?? ""} ${u.first_name ?? ""} ${u.last_name ?? ""} ${u.display_name ?? ""} ${u.phone ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    if (sortBy === "paid") list = [...list].sort((a, b) => b.total_paid - a.total_paid);
    else if (sortBy === "plan") {
      const order: Record<string, number> = { pro: 0, starter: 1, basic: 2, cod: 3, trial: 4, free: 5 };
      list = [...list].sort((a, b) => (order[a.plan] ?? 9) - (order[b.plan] ?? 9));
    }
    return list;
  }, [users, search, planFilter, countryFilter, sortBy]);

  useEffect(() => {
    setPage(0);
  }, [search, planFilter, countryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher email, nom, téléphone…"
            className="w-full brutal-border-thin bg-background pl-10 pr-9 py-2.5 text-sm outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="brutal-border-thin bg-background px-3 py-2.5 text-sm outline-none sm:w-40"
        >
          <option value="all">Tous pays</option>
          {countryOptions.map((c) => {
            const country = getCountry(c);
            return (
              <option key={c} value={c}>
                {country?.flag} {country?.name ?? c}
              </option>
            );
          })}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="brutal-border-thin bg-background px-3 py-2.5 text-sm outline-none sm:w-40"
        >
          <option value="created">Tri : Inscription</option>
          <option value="paid">Tri : Payé</option>
          <option value="plan">Tri : Plan</option>
        </select>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { k: "all", l: `Tous (${users.length})` },
          { k: "trial", l: `Trial` },
          { k: "cod", l: "COD $10" },
          { k: "basic", l: "Starter $12" },
          { k: "starter", l: "Pro $29" },
          { k: "pro", l: "Scale $79" },
          { k: "free", l: "Free" },
          { k: "paid", l: "💰 A payé" },
          { k: "expiring", l: "⚠ Expire <3j" },
        ].map((f) => (
          <button
            key={f.k}
            type="button"
            onClick={() => setPlanFilter(f.k)}
            className={`shrink-0 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest brutal-border-thin transition-colors ${
              planFilter === f.k
                ? "bg-foreground text-background border-foreground"
                : "bg-card hover:bg-muted"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {filtered.length} résultat{filtered.length > 1 ? "s" : ""} · Page {page + 1}/{totalPages}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {pageItems.map((u) => (
          <UserCard key={u.id} user={u} fmt={fmt} onOpen={() => setSelected(u)} />
        ))}
        {pageItems.length === 0 && <EmptyState text="Aucun utilisateur" />}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block brutal-border-thin overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Utilisateur</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Plan</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Pays</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Tel</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Source</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Inscrit</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Essai</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Payé</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => {
              const country = getCountry(u.country);
              const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
              return (
                <tr
                  key={u.id}
                  className="border-t border-border hover:bg-muted/40 cursor-pointer"
                  onClick={() => setSelected(u)}
                >
                  <td className="px-3 py-2">
                    <div className="font-mono text-xs">{u.email ?? "—"}</div>
                    {(fullName || u.display_name) && (
                      <div className="text-[10px] text-muted-foreground">{fullName || u.display_name}</div>
                    )}
                  </td>
                  <td className="px-3 py-2"><PlanBadge plan={u.plan} /></td>
                  <td className="px-3 py-2 text-xs">
                    {country ? (
                      <span title={country.name}>{country.flag} {country.code}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px]">
                    {u.phone ? `${u.phone_country_code ?? ""} ${u.phone}`.trim() : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {u.referral_source ? getReferralLabel(u.referral_source) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {u.trial_days_total != null ? (
                      u.trial_days_left != null && u.trial_days_left > 0 ? (
                        <span className={u.trial_days_left <= 3 ? "text-amber-600 font-bold" : ""}>
                          {u.trial_days_left}/{u.trial_days_total}j
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold">expiré</span>
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold">{fmt(u.total_paid)}</td>
                  <td className="px-3 py-2 text-right">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground inline" />
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground text-sm">
                  Aucun utilisateur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />

      <UserDrawer
        user={selected}
        onClose={() => setSelected(null)}
        fmt={fmt}
        onDeleted={() => {
          setSelected(null);
          onRefresh();
        }}
      />
    </div>
  );
}

function UserCard({
  user,
  fmt,
  onOpen,
}: {
  user: UserRow;
  fmt: (v: number) => string;
  onOpen: () => void;
}) {
  const initials = (user.email ?? "?").slice(0, 2).toUpperCase();
  const country = getCountry(user.country);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full brutal-border-thin bg-card p-3 text-left flex items-center gap-3 hover:bg-muted/40"
    >
      <div className="h-10 w-10 shrink-0 brutal-border-thin bg-foreground text-background flex items-center justify-center font-black text-xs">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs truncate flex-1">{user.email ?? "—"}</div>
          <PlanBadge plan={user.plan} />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
          {country && <span>{country.flag} {country.code}</span>}
          <span>·</span>
          <span>{new Date(user.created_at).toLocaleDateString("fr-FR")}</span>
          {user.total_paid > 0 && (
            <>
              <span>·</span>
              <span className="font-bold text-emerald-600">{fmt(user.total_paid)}</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styleMap: Record<string, string> = {
    pro: "bg-foreground text-background border-foreground",
    starter: "bg-accent text-background border-accent",
    basic: "bg-sky-100 text-sky-900 border-sky-300",
    cod: "bg-emerald-100 text-emerald-900 border-emerald-300",
    trial: "bg-amber-100 text-amber-900 border-amber-300",
    free: "bg-muted text-muted-foreground",
  };
  // Mapping interne → label public affiché à l'admin
  const labelMap: Record<string, string> = {
    pro: "Scale",
    starter: "Pro",
    basic: "Starter",
    cod: "COD",
    trial: "Trial",
    free: "Free",
  };
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest brutal-border-thin ${styleMap[plan] ?? "bg-muted"}`}>
      {labelMap[plan] ?? plan}
    </span>
  );
}

function UserDrawer({
  user,
  onClose,
  fmt,
  onDeleted,
}: {
  user: UserRow | null;
  onClose: () => void;
  fmt: (v: number) => string;
  onDeleted: () => void;
}) {
  const deleteUserFn = useServerFn(adminDeleteUser);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) return null;
  const country = getCountry(user.country);
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  async function doDelete() {
    if (!user) return;
    setBusy(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée");
      await deleteUserFn({
        data: { targetUserId: user.id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      } as any);
      toast.success("Utilisateur supprimé");
      onDeleted();
    } catch (e: any) {
      toast.error(e?.message ?? "Échec suppression");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <Sheet open={!!user} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-black uppercase tracking-tight break-all">
            {user.email ?? "Utilisateur"}
          </SheetTitle>
          <SheetDescription>
            {fullName || user.display_name || "—"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          <Field label="Plan effectif" value={<PlanBadge plan={user.plan} />} />
          <Field label="Plan brut (DB)" value={user.raw_plan} />
          <Field label="Statut sub" value={user.status} />
          <Field
            label="Mode choisi au signup"
            value={user.selected_mode ? user.selected_mode.toUpperCase() : "—"}
          />
          <Field
            label="Mode actif"
            value={user.active_mode ? user.active_mode.toUpperCase() : "—"}
          />
          <Field
            label="Dual mode (Drop+COD)"
            value={
              user.legacy_dual_mode
                ? <span className="text-emerald-600 font-bold">✓ Legacy (grandfathered)</span>
                : (user.plan === "starter" || user.plan === "pro" || user.plan === "trial")
                  ? <span className="text-emerald-600 font-bold">✓ Inclus dans le plan</span>
                  : <span className="text-muted-foreground">Verrouillé (Basic / Free)</span>
            }
          />
          <Field
            label="Pays"
            value={country ? `${country.flag} ${country.name}` : "—"}
          />
          <Field
            label="Téléphone"
            value={user.phone ? `${user.phone_country_code ?? ""} ${user.phone}`.trim() : "—"}
          />
          <Field
            label="Source"
            value={user.referral_source ? getReferralLabel(user.referral_source) : "—"}
          />
          <Field
            label="Inscrit le"
            value={new Date(user.created_at).toLocaleString("fr-FR")}
          />
          {user.trial_days_total != null && (
            <Field
              label="Essai"
              value={
                user.trial_days_left != null && user.trial_days_left > 0
                  ? `${user.trial_days_left} / ${user.trial_days_total}j restants`
                  : "Expiré"
              }
            />
          )}
          {user.current_period_end && (
            <Field
              label="Période en cours jusqu'au"
              value={new Date(user.current_period_end).toLocaleDateString("fr-FR")}
            />
          )}
          <Field
            label="Total payé"
            value={<span className="font-black tabular-nums">{fmt(user.total_paid)}</span>}
          />
          <Field label="ID" value={<span className="font-mono text-[10px] break-all">{user.id}</span>} />
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full inline-flex items-center justify-center gap-2 brutal-border bg-red-600 border-red-600 text-white px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" /> Supprimer définitivement
          </button>
        </div>
      </SheetContent>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce compte ?</DialogTitle>
            <DialogDescription>
              Toutes les données ({user.email ?? user.id}) seront effacées : produits, saisies,
              paiements, abonnement. Action irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="brutal-border-thin px-4 py-2 text-xs font-black uppercase tracking-widest"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={doDelete}
              disabled={busy}
              className="brutal-border bg-red-600 border-red-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
            >
              {busy ? "Suppression…" : "Confirmer la suppression"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground shrink-0">
        {label}
      </div>
      <div className="text-right">{value}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// PAYMENTS TAB
// ──────────────────────────────────────────────────────────────────

function PaymentsTab({ payments }: { payments: PaymentRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
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

  useEffect(() => setPage(0), [search, statusFilter]);

  const totalAmount = filtered
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount), 0);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function exportCSV() {
    const header = ["date", "email", "plan", "method", "amount", "currency", "status", "reference"];
    const rows = filtered.map((p) => [
      new Date(p.created_at).toISOString(),
      p.email ?? "",
      p.plan,
      p.payment_method,
      p.amount,
      p.currency,
      p.status,
      p.reference,
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Email, référence, méthode…"
            className="w-full brutal-border-thin bg-background pl-10 pr-3 py-2.5 text-sm outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="brutal-border-thin bg-background px-3 py-2.5 text-sm outline-none sm:w-40"
        >
          <option value="all">Tous statuts</option>
          <option value="paid">Payé</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
        </select>
        <button
          type="button"
          onClick={exportCSV}
          className="brutal-border-thin bg-card hover:bg-foreground hover:text-background px-3 py-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-widest"
        >
          <Download className="h-3.5 w-3.5" /> CSV
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
        <span>{filtered.length} paiement{filtered.length > 1 ? "s" : ""}</span>
        <span className="font-black text-emerald-700 normal-case tracking-normal">
          Total payé filtré : {formatCurrency(totalAmount, "USD")}
        </span>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {pageItems.map((p) => (
          <div key={p.id} className="brutal-border-thin bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-xs truncate flex-1">{p.email ?? "—"}</div>
              <StatusBadge status={p.status} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {p.plan} · {p.payment_method}
              </div>
              <div className="font-black tabular-nums text-sm">
                {formatCurrency(Number(p.amount), p.currency)}
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 font-mono">
              {new Date(p.created_at).toLocaleString("fr-FR")}
            </div>
          </div>
        ))}
        {pageItems.length === 0 && <EmptyState text="Aucun paiement" />}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block brutal-border-thin overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Date</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Email</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Plan</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Méthode</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest text-right">Montant</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Statut</th>
              <th className="px-3 py-2 text-xs uppercase tracking-widest">Référence</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">{new Date(p.created_at).toLocaleString("fr-FR")}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.email ?? "—"}</td>
                <td className="px-3 py-2 uppercase font-bold text-xs">{p.plan}</td>
                <td className="px-3 py-2 text-xs">{p.payment_method}</td>
                <td className="px-3 py-2 text-right tabular-nums font-bold">
                  {formatCurrency(Number(p.amount), p.currency)}
                </td>
                <td className="px-3 py-2"><StatusBadge status={p.status} /></td>
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground truncate max-w-[160px]">{p.reference}</td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Aucun paiement</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"
      ? "bg-emerald-600 text-white"
      : status === "pending"
        ? "bg-amber-500 text-black"
        : "bg-red-600 text-white";
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${cls}`}>
      {status}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────
// AFFILIATES TAB
// ──────────────────────────────────────────────────────────────────

function AffiliatesTab({
  codes,
  userId,
  onChanged,
}: {
  codes: AffiliateCodeRow[];
  userId: string | null;
  onChanged: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [trialDays, setTrialDays] = useState(5);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AffiliateCodeRow | null>(null);
  const [deleting, setDeleting] = useState<AffiliateCodeRow | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!cleanSlug) return;
    const code = cleanSlug.startsWith("ntdsh-") ? cleanSlug : `ntdsh-${cleanSlug}`;
    setCreating(true);
    const { error } = await supabase.from("affiliate_codes").insert({
      code,
      label: label.trim() || null,
      trial_days: Math.max(1, Math.min(30, Number(trialDays) || 5)),
      created_by: userId,
      owner_user_id: userId,
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

  async function toggle(c: AffiliateCodeRow) {
    const { error } = await supabase
      .from("affiliate_codes")
      .update({ active: !c.active })
      .eq("id", c.id);
    if (error) toast.error(error.message);
    else onChanged();
  }

  const sorted = useMemo(
    () =>
      [...codes].sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return b.signups_count - a.signups_count;
      }),
    [codes],
  );

  return (
    <div className="space-y-4">
      {/* Create form */}
      <div className="brutal-border-thin bg-card">
        <div className="px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border">
          Nouveau code d'affiliation
        </div>
        <form onSubmit={handleCreate} className="p-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_auto] gap-3 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
              Slug
            </label>
            <div className="flex items-center brutal-border-thin bg-background">
              <span className="px-2 py-2 text-xs font-mono text-muted-foreground border-r border-border">
                ntdsh-
              </span>
              <input
                value={slug.replace(/^ntdsh-/, "")}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="adbaecomx"
                className="flex-1 bg-transparent px-2 py-2 font-mono text-sm outline-none min-w-0"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
              Libellé
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Influenceur Dakar"
              className="w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
              Essai (j)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
              className="w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none tabular-nums"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !slug.trim()}
            className="brutal-border bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50"
          >
            {creating ? "…" : "Créer"}
          </button>
        </form>
      </div>

      {/* Codes list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {sorted.map((c) => {
          const link = `${PUBLIC_BASE_URL}/affilie/${c.code}`;
          return (
            <div key={c.id} className="brutal-border-thin bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-base font-black break-all">{c.code}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.label ?? "—"}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(c)}
                  className={`shrink-0 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest brutal-border-thin inline-flex items-center gap-1 ${
                    c.active ? "bg-emerald-600 text-white border-emerald-600" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Power className="h-3 w-3" />
                  {c.active ? "ON" : "OFF"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Essai</div>
                  <div className="font-black tabular-nums">{c.trial_days}j</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Inscriptions</div>
                  <div className="font-black tabular-nums">{c.signups_count}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(link);
                  toast.success("Lien copié");
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 brutal-border-thin bg-muted/50 hover:bg-muted px-2 py-1.5 font-mono text-[10px] truncate"
              >
                <Copy className="h-3 w-3 shrink-0" />
                <span className="truncate">{link}</span>
              </button>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setEditing(c)}
                  className="flex-1 brutal-border-thin bg-background hover:bg-foreground hover:text-background px-2 py-1.5 text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-1"
                >
                  <Pencil className="h-3 w-3" /> Éditer
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(c)}
                  className="flex-1 brutal-border-thin bg-red-600 text-white border-red-600 hover:bg-red-700 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Suppr
                </button>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && <EmptyState text="Aucun code créé" />}
      </div>

      <EditCodeDialog code={editing} onClose={() => setEditing(null)} onSaved={onChanged} />
      <DeleteCodeDialog code={deleting} onClose={() => setDeleting(null)} onDeleted={onChanged} />
    </div>
  );
}

function EditCodeDialog({
  code,
  onClose,
  onSaved,
}: {
  code: AffiliateCodeRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [trialDays, setTrialDays] = useState(5);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
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
    const { error } = await supabase
      .from("affiliate_codes")
      .update({
        code: newCode,
        label: label.trim() || null,
        trial_days: Math.max(1, Math.min(30, Number(trialDays) || 5)),
      })
      .eq("id", code.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Code mis à jour");
    onSaved();
    onClose();
  }

  return (
    <Dialog open={!!code} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Éditer le code</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">Slug</label>
            <div className="flex items-center brutal-border-thin bg-background">
              <span className="px-2 py-2 text-xs font-mono text-muted-foreground border-r border-border">ntdsh-</span>
              <input
                value={slug.replace(/^ntdsh-/, "")}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                className="flex-1 bg-transparent px-2 py-2 font-mono text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">Libellé</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">Essai (jours)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
              className="w-full brutal-border-thin bg-background px-3 py-2 text-sm outline-none tabular-nums"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="brutal-border-thin px-4 py-2 text-xs font-black uppercase tracking-widest"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="brutal-border bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          >
            {busy ? "…" : "Enregistrer"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCodeDialog({
  code,
  onClose,
  onDeleted,
}: {
  code: AffiliateCodeRow | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState(false);
  if (!code) return null;

  async function doDelete() {
    if (!code) return;
    setBusy(true);
    const { error } = await supabase.from("affiliate_codes").delete().eq("id", code.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Code supprimé");
    onDeleted();
    onClose();
  }

  return (
    <Dialog open={!!code} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce code ?</DialogTitle>
          <DialogDescription>
            Le code <span className="font-mono font-bold">{code.code}</span> ne sera plus utilisable.
            Les inscriptions déjà liées sont conservées.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="brutal-border-thin px-4 py-2 text-xs font-black uppercase tracking-widest"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={doDelete}
            disabled={busy}
            className="brutal-border bg-red-600 border-red-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          >
            {busy ? "…" : "Supprimer"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ──────────────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <SupportWhatsAppEditor />
    </div>
  );
}

function SupportWhatsAppEditor() {
  const [value, setValue] = useState("");
  const [initial, setInitial] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "support_whatsapp")
        .maybeSingle();
      if (error) toast.error(error.message);
      const v = data?.value ?? "";
      setValue(v);
      setInitial(v);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "support_whatsapp", value: value.trim() });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Numéro enregistré");
      setInitial(value.trim());
    }
  }

  const dirty = value.trim() !== initial.trim();

  return (
    <div className="brutal-border-thin bg-card">
      <div className="px-4 py-3 text-xs uppercase tracking-widest font-bold border-b border-border">
        Numéro WhatsApp Assistance
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
            Numéro (format international, ex: +13474952236)
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="+13474952236"
            disabled={loading}
            className="w-full brutal-border-thin bg-background px-3 py-2 font-mono text-sm outline-none"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Laisser vide pour masquer le bouton flottant.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving || loading}
          className="brutal-border bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SHARED
// ──────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        type="button"
        onClick={() => onPage(Math.max(0, page - 1))}
        disabled={page === 0}
        className="brutal-border-thin bg-card px-3 py-1.5 disabled:opacity-40 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest"
      >
        <ChevronLeft className="h-3 w-3" /> Préc.
      </button>
      <span className="text-xs font-mono tabular-nums">
        {page + 1} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPage(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="brutal-border-thin bg-card px-3 py-1.5 disabled:opacity-40 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest"
      >
        Suiv. <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="brutal-border-thin bg-card p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
