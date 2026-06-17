import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
const PRICES = {
  basic: 5e3,
  starter: 15e3,
  pro: 3e4
};
const getRevenueOverview_createServerFn_handler = createServerRpc({
  id: "d90db92a5b1aa8cd98e25fa11c454bd02c3a8d66e192de960901e0262fc6c9a4",
  name: "getRevenueOverview",
  filename: "src/lib/admin/revenue.functions.ts"
}, (opts) => getRevenueOverview.__executeServer(opts));
const getRevenueOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(getRevenueOverview_createServerFn_handler, async ({
  context
}) => {
  const {
    admin
  } = context;
  const now = /* @__PURE__ */ new Date();
  new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOf12mo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const {
    data: subs
  } = await admin.from("subscriptions").select("plan, status, trial_ends_at, user_id, created_at, updated_at");
  const subscriptions = subs ?? [];
  let mrr = 0;
  const planCounts = {
    basic: 0,
    starter: 0,
    pro: 0,
    trial: 0,
    free: 0
  };
  for (const s of subscriptions) {
    const plan = String(s.plan ?? "free");
    const status = String(s.status ?? "");
    if (["cod", "basic", "starter", "pro"].includes(plan) && ["active", "incomplete"].includes(status)) {
      planCounts[plan] += 1;
      mrr += PRICES[plan] ?? 0;
    } else if (plan === "trial" && s.trial_ends_at && new Date(s.trial_ends_at) > now) {
      planCounts.trial += 1;
    } else {
      planCounts.free += 1;
    }
  }
  const {
    data: pays
  } = await admin.from("payments").select("amount, status, created_at, user_id, plan").gte("created_at", startOf12mo.toISOString());
  const okPays = (pays ?? []).filter((p) => ["succeeded", "paid"].includes(String(p.status)));
  const monthly = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly[key] = {
      revenue: 0,
      count: 0
    };
  }
  for (const p of okPays) {
    const d = new Date(p.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in monthly) {
      monthly[key].revenue += Number(p.amount ?? 0);
      monthly[key].count += 1;
    }
  }
  const series = Object.entries(monthly).map(([month, v]) => ({
    month,
    ...v
  }));
  const revenueThisMonth = monthly[`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`]?.revenue ?? 0;
  const revenuePrevMonth = monthly[`${startOfPrevMonth.getFullYear()}-${String(startOfPrevMonth.getMonth() + 1).padStart(2, "0")}`]?.revenue ?? 0;
  const growth = revenuePrevMonth > 0 ? (revenueThisMonth - revenuePrevMonth) / revenuePrevMonth * 100 : 0;
  const totalsByUser = {};
  for (const p of okPays) {
    const uid = p.user_id;
    totalsByUser[uid] = (totalsByUser[uid] ?? 0) + Number(p.amount ?? 0);
  }
  const payingUsers = Object.keys(totalsByUser).length;
  const ltv = payingUsers > 0 ? Object.values(totalsByUser).reduce((a, b) => a + b, 0) / payingUsers : 0;
  return {
    mrr,
    arr: mrr * 12,
    revenueThisMonth,
    revenuePrevMonth,
    growth: Math.round(growth * 10) / 10,
    ltv: Math.round(ltv),
    payingUsers,
    planCounts,
    series
  };
});
const listTransactions_createServerFn_handler = createServerRpc({
  id: "22ba3b1f2142f2f422b91a2404e0e9ce1fb4724f79953143235aefbe10b56763",
  name: "listTransactions",
  filename: "src/lib/admin/revenue.functions.ts"
}, (opts) => listTransactions.__executeServer(opts));
const listTransactions = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).inputValidator(objectType({
  page: numberType().int().min(1).default(1),
  pageSize: numberType().int().min(5).max(100).default(25),
  status: stringType().optional(),
  search: stringType().optional()
})).handler(listTransactions_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin
  } = context;
  const from = (data.page - 1) * data.pageSize;
  const to = from + data.pageSize - 1;
  let q = admin.from("payments").select("id, reference, amount, currency, plan, status, payment_method, created_at, paid_at, user_id, external_transaction_id", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(from, to);
  if (data.status) q = q.eq("status", data.status);
  if (data.search) q = q.or(`reference.ilike.%${data.search}%,external_transaction_id.ilike.%${data.search}%`);
  const {
    data: rows,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id)));
  const userMap = /* @__PURE__ */ new Map();
  if (userIds.length > 0) {
    const {
      data: u
    } = await admin.from("profiles").select("id, email, display_name").in("id", userIds);
    for (const r of u ?? []) {
      userMap.set(r.id, {
        email: String(r.email ?? ""),
        display_name: r.display_name ?? null
      });
    }
  }
  return {
    rows: (rows ?? []).map((r) => ({
      ...r,
      user_email: userMap.get(r.user_id)?.email ?? "—",
      user_name: userMap.get(r.user_id)?.display_name ?? null
    })),
    total: count ?? 0,
    page: data.page,
    pageSize: data.pageSize
  };
});
const refundTransaction_createServerFn_handler = createServerRpc({
  id: "9a53482d4ce5091fa6af146347ac5479d651f769c91825765a09e8b9f9e4d222",
  name: "refundTransaction",
  filename: "src/lib/admin/revenue.functions.ts"
}, (opts) => refundTransaction.__executeServer(opts));
const refundTransaction = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  paymentId: stringType().uuid(),
  reason: stringType().min(3).max(500)
})).handler(refundTransaction_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin,
    adminId,
    adminEmail,
    adminRole
  } = context;
  ensureRole(adminRole, ["super_admin", "finance"]);
  const {
    data: pay,
    error
  } = await admin.from("payments").select("id, user_id, amount, status, reference").eq("id", data.paymentId).single();
  if (error || !pay) throw new Error("Paiement introuvable");
  const {
    error: upErr
  } = await admin.from("payments").update({
    status: "refunded",
    raw_payload: {
      refund_reason: data.reason,
      refunded_by: adminEmail,
      refunded_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  }).eq("id", data.paymentId);
  if (upErr) throw new Error(upErr.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "payment.refund",
    category: "finance",
    targetUserId: pay.user_id,
    details: {
      payment_id: pay.id,
      reference: pay.reference,
      amount: pay.amount,
      reason: data.reason
    }
  });
  return {
    ok: true
  };
});
export {
  getRevenueOverview_createServerFn_handler,
  listTransactions_createServerFn_handler,
  refundTransaction_createServerFn_handler
};
