import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "./admin-auth.middleware";

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

    // Subscriptions par plan
    const { data: subs } = await admin
      .from("subscriptions")
      .select("plan, status, current_period_end, trial_ends_at, created_at, user_id");
    const subscriptions = subs ?? [];

    const PRICES: Record<string, number> = {
      cod: 10000,
      basic: 12000,
      starter: 29000,
      pro: 79000,
    };
    let mrr = 0;
    const planCounts: Record<string, number> = {
      free: 0,
      trial: 0,
      cod: 0,
      basic: 0,
      starter: 0,
      pro: 0,
    };
    for (const s of subscriptions) {
      const plan = String(s.plan ?? "free");
      const status = String(s.status ?? "");
      const trialActive = s.trial_ends_at && new Date(s.trial_ends_at as string) > now;
      if (plan === "trial" && trialActive) planCounts.trial += 1;
      else if (["cod", "basic", "starter", "pro"].includes(plan) && ["active", "incomplete"].includes(status)) {
        planCounts[plan] += 1;
        mrr += PRICES[plan] ?? 0;
      } else {
        planCounts.free += 1;
      }
    }

    // Users
    const { count: totalUsers } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true });

    const { count: newThisWeek } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", oneWeekAgo);

    // Churn = cancellations ce mois / abonnés payants début de mois
    const { count: cancellations } = await admin
      .from("subscriptions")
      .select("user_id", { count: "exact", head: true })
      .eq("status", "canceled")
      .gte("updated_at", startOfMonth);

    const payingNow = planCounts.cod + planCounts.basic + planCounts.starter + planCounts.pro;
    const churn = payingNow > 0 ? ((cancellations ?? 0) / Math.max(payingNow, 1)) * 100 : 0;

    // Paiements des 30 derniers jours pour le graphique MRR
    const { data: pays } = await admin
      .from("payments")
      .select("amount, status, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      days[key] = 0;
    }
    for (const p of pays ?? []) {
      if (String(p.status) !== "succeeded" && String(p.status) !== "paid") continue;
      const key = String(p.created_at).slice(0, 10);
      if (key in days) days[key] += Number(p.amount ?? 0);
    }
    const mrrSeries = Object.entries(days).map(([date, value]) => ({ date, value }));

    // Activité récente : derniers paiements + dernières inscriptions
    const { data: recentPayments } = await admin
      .from("payments")
      .select("id, amount, status, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: recentSignups } = await admin
      .from("profiles")
      .select("id, email, display_name, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    type ActivityItem = {
      type: "signup" | "payment";
      at: string;
      email: string;
      detail: string;
    };
    const activity: ActivityItem[] = [];
    const userIds = new Set<string>();
    (recentPayments ?? []).forEach((p) => userIds.add(p.user_id as string));
    const userMap = new Map<string, string>();
    if (userIds.size > 0) {
      const { data: u } = await admin
        .from("profiles")
        .select("id, email")
        .in("id", Array.from(userIds));
      for (const r of u ?? []) userMap.set(r.id as string, String(r.email));
    }
    for (const s of recentSignups ?? []) {
      activity.push({
        type: "signup",
        at: String(s.created_at),
        email: String(s.email ?? ""),
        detail: "Nouvelle inscription",
      });
    }
    for (const p of recentPayments ?? []) {
      activity.push({
        type: "payment",
        at: String(p.created_at),
        email: userMap.get(p.user_id as string) ?? "—",
        detail: `${(p.amount as number).toLocaleString("fr-FR")} FCFA · ${p.status}`,
      });
    }
    activity.sort((a, b) => (a.at < b.at ? 1 : -1));

    return {
      mrr,
      arr: mrr * 12,
      totalUsers: totalUsers ?? 0,
      newThisWeek: newThisWeek ?? 0,
      churn: Math.round(churn * 10) / 10,
      planCounts,
      mrrSeries,
      activity: activity.slice(0, 10),
    };
  });
