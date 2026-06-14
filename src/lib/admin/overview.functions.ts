import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "./admin-auth.middleware.server";
import {
  computeMrrBreakdown,
  getMrrHistory12Months,
  loadPlanPricesUsd,
  computeMrrAt,
  mrrGrowthPct,
  PLAN_DISPLAY,
  type PaidPlan,
} from "./admin-metrics";

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endPrevMonth = new Date(startOfMonth.getTime() - 1);

    const prices = await loadPlanPricesUsd(admin);

    const { data: subs } = await admin
      .from("subscriptions")
      .select(
        "plan, status, current_period_end, trial_ends_at, created_at, updated_at, user_id, stripe_subscription_id",
      );
    const subscriptions = subs ?? [];

    const { count: totalUsers } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true });

    const breakdown = computeMrrBreakdown(subscriptions, prices, totalUsers ?? 0, now);
    const mrrPrevMonth = computeMrrAt(subscriptions, prices, endPrevMonth);
    const mrrGrowthPctValue = mrrGrowthPct(breakdown.mrr, mrrPrevMonth);
    const mrrSeries12mo = getMrrHistory12Months(subscriptions, prices, now);

    const mrrByPlanLabeled = (Object.keys(PLAN_DISPLAY) as PaidPlan[]).map((plan) => ({
      plan,
      label: PLAN_DISPLAY[plan],
      priceUsd: prices[plan],
      mrr: breakdown.mrrByPlan[plan],
      count: breakdown.planCounts[plan] ?? 0,
    }));

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
        detail: `$${Number(p.amount ?? 0).toLocaleString("en-US")} · ${p.status}`,
      });
    }
    activity.sort((a, b) => (a.at < b.at ? 1 : -1));

    return {
      mrr: breakdown.mrr,
      arr: breakdown.mrr * 12,
      mrrPrevMonth,
      mrrGrowthPct: mrrGrowthPctValue,
      mrrByPlan: mrrByPlanLabeled,
      newSubsThisMonth: breakdown.newSubsThisMonth,
      churnedThisMonth: breakdown.churnedThisMonth,
      churnRatePct: breakdown.churnRatePct,
      ltvEstimated: breakdown.ltvEstimated,
      userCounts: breakdown.userCounts,
      planCounts: breakdown.planCounts,
      mrrSeries12mo,
      activity: activity.slice(0, 10),
    };
  });
