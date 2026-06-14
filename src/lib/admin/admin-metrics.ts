import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PaidPlan = "cod" | "basic" | "starter" | "pro";

export const DEFAULT_PLAN_USD: Record<PaidPlan, number> = {
  cod: 10,
  basic: 12,
  starter: 29,
  pro: 79,
};

export const PLAN_DISPLAY: Record<PaidPlan, string> = {
  cod: "COD",
  basic: "Starter",
  starter: "Pro",
  pro: "Scale",
};

export type SubscriptionRow = {
  user_id?: string;
  plan?: string | null;
  status?: string | null;
  trial_ends_at?: string | null;
  stripe_subscription_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

const PAID_PLANS = new Set<string>(["cod", "basic", "starter", "pro"]);
const ACTIVE_STATUSES = new Set(["active", "incomplete"]);

export function isTrialActive(sub: SubscriptionRow, at: Date = new Date()): boolean {
  const plan = String(sub.plan ?? "free");
  if (plan !== "trial") return false;
  return Boolean(sub.trial_ends_at && new Date(sub.trial_ends_at) > at);
}

/** Plan effectif affiché (free / trial / cod / basic / starter / pro). */
export function effectivePlan(sub: SubscriptionRow | null | undefined, at: Date = new Date()): string {
  if (!sub) return "free";
  const plan = String(sub.plan ?? "free");
  if (plan === "trial") return isTrialActive(sub, at) ? "trial" : "free";
  if (PAID_PLANS.has(plan) && isActivePaidSubscription(sub, at)) return plan;
  return "free";
}

/** Abonnement payant actif pour le MRR (exclut trial, free, cancelled, accès offert). */
export function isActivePaidSubscription(sub: SubscriptionRow, at: Date = new Date()): boolean {
  const plan = String(sub.plan ?? "free");
  const status = String(sub.status ?? "").toLowerCase();
  if (plan === "trial" || plan === "free") return false;
  if (!PAID_PLANS.has(plan)) return false;
  if (status === "canceled" || status === "cancelled") return false;
  if (!ACTIVE_STATUSES.has(status)) return false;
  const trialEnd = sub.trial_ends_at ? new Date(sub.trial_ends_at) : null;
  if (trialEnd && trialEnd > at && !sub.stripe_subscription_id) return false;
  return true;
}

export function isActivePaidAt(sub: SubscriptionRow, at: Date): boolean {
  const created = sub.created_at ? new Date(sub.created_at) : null;
  if (created && created > at) return false;
  const status = String(sub.status ?? "").toLowerCase();
  const updated = sub.updated_at ? new Date(sub.updated_at) : null;
  if ((status === "canceled" || status === "cancelled") && updated && updated <= at) return false;
  return isActivePaidSubscription(sub, at);
}

export function mrrForPlan(plan: string, prices: Record<string, number>): number {
  return prices[plan] ?? 0;
}

export async function loadPlanPricesUsd(
  admin: SupabaseClient<Database>,
): Promise<Record<PaidPlan, number>> {
  const keys = [
    "pricing.cod_usd",
    "pricing.basic_usd",
    "pricing.starter_usd",
    "pricing.pro_usd",
  ];
  const { data } = await admin.from("app_settings").select("key, value").in("key", keys);
  const prices: Record<PaidPlan, number> = { ...DEFAULT_PLAN_USD };
  for (const row of data ?? []) {
    const key = String(row.key);
    const planKey = key.replace("pricing.", "").replace("_usd", "") as PaidPlan;
    if (planKey in prices) {
      const v = parseFloat(String(row.value ?? ""));
      if (!Number.isNaN(v) && v >= 0) prices[planKey] = v;
    }
  }
  return prices;
}

export type MrrBreakdown = {
  mrr: number;
  mrrByPlan: Record<PaidPlan, number>;
  planCounts: Record<string, number>;
  userCounts: { total: number; paying: number; trial: number; free: number };
  payingCount: number;
  newSubsThisMonth: number;
  churnedThisMonth: number;
  churnRatePct: number;
  ltvEstimated: number | null;
  avgMrrPerUser: number;
};

export function computeMrrBreakdown(
  subscriptions: SubscriptionRow[],
  prices: Record<string, number>,
  totalProfiles: number,
  now: Date = new Date(),
): MrrBreakdown {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const mrrByPlan: Record<PaidPlan, number> = { cod: 0, basic: 0, starter: 0, pro: 0 };
  const planCounts: Record<string, number> = {
    free: 0,
    trial: 0,
    cod: 0,
    basic: 0,
    starter: 0,
    pro: 0,
  };

  let payingCount = 0;
  let newSubsThisMonth = 0;
  let churnedThisMonth = 0;

  for (const sub of subscriptions) {
    const eff = effectivePlan(sub, now);
    planCounts[eff] = (planCounts[eff] ?? 0) + 1;

    const status = String(sub.status ?? "").toLowerCase();
    const updated = sub.updated_at ? new Date(sub.updated_at) : null;
    if ((status === "canceled" || status === "cancelled") && updated && updated >= startOfMonth) {
      churnedThisMonth += 1;
    }

    if (isActivePaidSubscription(sub, now)) {
      payingCount += 1;
      const plan = String(sub.plan) as PaidPlan;
      const amount = mrrForPlan(plan, prices);
      mrrByPlan[plan] += amount;
      const created = sub.created_at ? new Date(sub.created_at) : null;
      if (created && created >= startOfMonth) newSubsThisMonth += 1;
    }
  }

  const mrr = Object.values(mrrByPlan).reduce((a, b) => a + b, 0);
  const trialCount = planCounts.trial ?? 0;
  const freeCount = Math.max(0, totalProfiles - payingCount - trialCount);

  const churnRatePct =
    payingCount > 0 ? Math.round((churnedThisMonth / payingCount) * 1000) / 10 : 0;
  const avgMrrPerUser = payingCount > 0 ? mrr / payingCount : 0;
  const churnDecimal = churnRatePct / 100;
  const ltvEstimated =
    payingCount > 0 && churnDecimal > 0
      ? Math.round((avgMrrPerUser / churnDecimal) * 100) / 100
      : null;

  return {
    mrr,
    mrrByPlan,
    planCounts,
    userCounts: {
      total: totalProfiles,
      paying: payingCount,
      trial: trialCount,
      free: freeCount,
    },
    payingCount,
    newSubsThisMonth,
    churnedThisMonth,
    churnRatePct,
    ltvEstimated,
    avgMrrPerUser: Math.round(avgMrrPerUser * 100) / 100,
  };
}

export function computeMrrAt(
  subscriptions: SubscriptionRow[],
  prices: Record<string, number>,
  at: Date,
): number {
  let mrr = 0;
  for (const sub of subscriptions) {
    if (isActivePaidAt(sub, at)) {
      mrr += mrrForPlan(String(sub.plan), prices);
    }
  }
  return mrr;
}

export function getMrrHistory12Months(
  subscriptions: SubscriptionRow[],
  prices: Record<string, number>,
  now: Date = new Date(),
): { date: string; value: number }[] {
  const series: { date: string; value: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const label = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;
    series.push({ date: label, value: computeMrrAt(subscriptions, prices, monthEnd) });
  }
  return series;
}

export function mrrGrowthPct(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
