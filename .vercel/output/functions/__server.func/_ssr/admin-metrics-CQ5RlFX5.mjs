const DEFAULT_PLAN_USD = {
  cod: 10,
  basic: 12,
  starter: 29,
  pro: 79
};
const PLAN_DISPLAY = {
  cod: "COD",
  basic: "Starter",
  starter: "Pro",
  pro: "Scale"
};
const PAID_PLANS = /* @__PURE__ */ new Set(["cod", "basic", "starter", "pro"]);
const ACTIVE_STATUSES = /* @__PURE__ */ new Set(["active", "incomplete"]);
function isTrialActive(sub, at = /* @__PURE__ */ new Date()) {
  const plan = String(sub.plan ?? "free");
  if (plan !== "trial") return false;
  return Boolean(sub.trial_ends_at && new Date(sub.trial_ends_at) > at);
}
function effectivePlan(sub, at = /* @__PURE__ */ new Date()) {
  if (!sub) return "free";
  const plan = String(sub.plan ?? "free");
  if (plan === "trial") return isTrialActive(sub, at) ? "trial" : "free";
  if (PAID_PLANS.has(plan) && isActivePaidSubscription(sub, at)) return plan;
  return "free";
}
function isActivePaidSubscription(sub, at = /* @__PURE__ */ new Date()) {
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
function isActivePaidAt(sub, at) {
  const created = sub.created_at ? new Date(sub.created_at) : null;
  if (created && created > at) return false;
  const status = String(sub.status ?? "").toLowerCase();
  const updated = sub.updated_at ? new Date(sub.updated_at) : null;
  if ((status === "canceled" || status === "cancelled") && updated && updated <= at) return false;
  return isActivePaidSubscription(sub, at);
}
function mrrForPlan(plan, prices) {
  return prices[plan] ?? 0;
}
async function loadPlanPricesUsd(admin) {
  const keys = [
    "pricing.cod_usd",
    "pricing.basic_usd",
    "pricing.starter_usd",
    "pricing.pro_usd"
  ];
  const { data } = await admin.from("app_settings").select("key, value").in("key", keys);
  const prices = { ...DEFAULT_PLAN_USD };
  for (const row of data ?? []) {
    const key = String(row.key);
    const planKey = key.replace("pricing.", "").replace("_usd", "");
    if (planKey in prices) {
      const v = parseFloat(String(row.value ?? ""));
      if (!Number.isNaN(v) && v >= 0) prices[planKey] = v;
    }
  }
  return prices;
}
function computeMrrBreakdown(subscriptions, prices, totalProfiles, now = /* @__PURE__ */ new Date()) {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const mrrByPlan = { cod: 0, basic: 0, starter: 0, pro: 0 };
  const planCounts = {
    free: 0,
    trial: 0,
    cod: 0,
    basic: 0,
    starter: 0,
    pro: 0
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
      const plan = String(sub.plan);
      const amount = mrrForPlan(plan, prices);
      mrrByPlan[plan] += amount;
      const created = sub.created_at ? new Date(sub.created_at) : null;
      if (created && created >= startOfMonth) newSubsThisMonth += 1;
    }
  }
  const mrr = Object.values(mrrByPlan).reduce((a, b) => a + b, 0);
  const trialCount = planCounts.trial ?? 0;
  const freeCount = Math.max(0, totalProfiles - payingCount - trialCount);
  const churnRatePct = payingCount > 0 ? Math.round(churnedThisMonth / payingCount * 1e3) / 10 : 0;
  const avgMrrPerUser = payingCount > 0 ? mrr / payingCount : 0;
  const churnDecimal = churnRatePct / 100;
  const ltvEstimated = payingCount > 0 && churnDecimal > 0 ? Math.round(avgMrrPerUser / churnDecimal * 100) / 100 : null;
  return {
    mrr,
    mrrByPlan,
    planCounts,
    userCounts: {
      total: totalProfiles,
      paying: payingCount,
      trial: trialCount,
      free: freeCount
    },
    payingCount,
    newSubsThisMonth,
    churnedThisMonth,
    churnRatePct,
    ltvEstimated,
    avgMrrPerUser: Math.round(avgMrrPerUser * 100) / 100
  };
}
function computeMrrAt(subscriptions, prices, at) {
  let mrr = 0;
  for (const sub of subscriptions) {
    if (isActivePaidAt(sub, at)) {
      mrr += mrrForPlan(String(sub.plan), prices);
    }
  }
  return mrr;
}
function getMrrHistory12Months(subscriptions, prices, now = /* @__PURE__ */ new Date()) {
  const series = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const label = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;
    series.push({ date: label, value: computeMrrAt(subscriptions, prices, monthEnd) });
  }
  return series;
}
function mrrGrowthPct(current, previous) {
  if (previous <= 0) return current > 0 ? 100 : null;
  return Math.round((current - previous) / previous * 1e3) / 10;
}
export {
  PLAN_DISPLAY as P,
  computeMrrAt as a,
  mrrGrowthPct as b,
  computeMrrBreakdown as c,
  effectivePlan as e,
  getMrrHistory12Months as g,
  isActivePaidSubscription as i,
  loadPlanPricesUsd as l,
  mrrForPlan as m
};
