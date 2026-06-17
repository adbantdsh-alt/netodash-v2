import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { l as loadPlanPricesUsd, c as computeMrrBreakdown, a as computeMrrAt, g as getMrrHistory12Months, P as PLAN_DISPLAY, b as mrrGrowthPct } from "./admin-metrics-CQ5RlFX5.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-CcppqNZQ.mjs";
const getAdminOverview_createServerFn_handler = createServerRpc({
  id: "633310c2c40dc57a0d4849ced63480c79b7913982ee1c41f737daebd617e6cb1",
  name: "getAdminOverview",
  filename: "src/lib/admin/overview.functions.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
const getAdminOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(getAdminOverview_createServerFn_handler, async ({
  context
}) => {
  const {
    admin
  } = context;
  const now = /* @__PURE__ */ new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endPrevMonth = new Date(startOfMonth.getTime() - 1);
  const prices = await loadPlanPricesUsd(admin);
  const {
    data: subs
  } = await admin.from("subscriptions").select("plan, status, current_period_end, trial_ends_at, created_at, updated_at, user_id, stripe_subscription_id");
  const subscriptions = subs ?? [];
  const {
    count: totalUsers
  } = await admin.from("profiles").select("id", {
    count: "exact",
    head: true
  });
  const breakdown = computeMrrBreakdown(subscriptions, prices, totalUsers ?? 0, now);
  const mrrPrevMonth = computeMrrAt(subscriptions, prices, endPrevMonth);
  const mrrGrowthPctValue = mrrGrowthPct(breakdown.mrr, mrrPrevMonth);
  const mrrSeries12mo = getMrrHistory12Months(subscriptions, prices, now);
  const mrrByPlanLabeled = Object.keys(PLAN_DISPLAY).map((plan) => ({
    plan,
    label: PLAN_DISPLAY[plan],
    priceUsd: prices[plan],
    mrr: breakdown.mrrByPlan[plan],
    count: breakdown.planCounts[plan] ?? 0
  }));
  const {
    data: recentPayments
  } = await admin.from("payments").select("id, amount, status, created_at, user_id").order("created_at", {
    ascending: false
  }).limit(10);
  const {
    data: recentSignups
  } = await admin.from("profiles").select("id, email, display_name, created_at").order("created_at", {
    ascending: false
  }).limit(10);
  const activity = [];
  const userIds = /* @__PURE__ */ new Set();
  (recentPayments ?? []).forEach((p) => userIds.add(p.user_id));
  const userMap = /* @__PURE__ */ new Map();
  if (userIds.size > 0) {
    const {
      data: u
    } = await admin.from("profiles").select("id, email").in("id", Array.from(userIds));
    for (const r of u ?? []) userMap.set(r.id, String(r.email));
  }
  for (const s of recentSignups ?? []) {
    activity.push({
      type: "signup",
      at: String(s.created_at),
      email: String(s.email ?? ""),
      detail: "Nouvelle inscription"
    });
  }
  for (const p of recentPayments ?? []) {
    activity.push({
      type: "payment",
      at: String(p.created_at),
      email: userMap.get(p.user_id) ?? "—",
      detail: `$${Number(p.amount ?? 0).toLocaleString("en-US")} · ${p.status}`
    });
  }
  activity.sort((a, b) => a.at < b.at ? 1 : -1);
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
    activity: activity.slice(0, 10)
  };
});
export {
  getAdminOverview_createServerFn_handler
};
