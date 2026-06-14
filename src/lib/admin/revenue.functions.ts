import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ensureRole, logAdminAction, requireAdmin } from "./admin-auth.middleware.server";

const PRICES: Record<string, number> = { basic: 5000, starter: 15000, pro: 30000 };

export const getRevenueOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOf12mo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const { data: subs } = await admin
      .from("subscriptions")
      .select("plan, status, trial_ends_at, user_id, created_at, updated_at");
    const subscriptions = subs ?? [];

    let mrr = 0;
    const planCounts: Record<string, number> = { basic: 0, starter: 0, pro: 0, trial: 0, free: 0 };
    for (const s of subscriptions) {
      const plan = String(s.plan ?? "free");
      const status = String(s.status ?? "");
      if (["cod", "basic", "starter", "pro"].includes(plan) && ["active", "incomplete"].includes(status)) {
        planCounts[plan] += 1;
        mrr += PRICES[plan] ?? 0;
      } else if (plan === "trial" && s.trial_ends_at && new Date(s.trial_ends_at as string) > now) {
        planCounts.trial += 1;
      } else {
        planCounts.free += 1;
      }
    }

    // Paiements 12 derniers mois
    const { data: pays } = await admin
      .from("payments")
      .select("amount, status, created_at, user_id, plan")
      .gte("created_at", startOf12mo.toISOString());
    const okPays = (pays ?? []).filter((p) =>
      ["succeeded", "paid"].includes(String(p.status)),
    );

    const monthly: Record<string, { revenue: number; count: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = { revenue: 0, count: 0 };
    }
    for (const p of okPays) {
      const d = new Date(p.created_at as string);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key in monthly) {
        monthly[key].revenue += Number(p.amount ?? 0);
        monthly[key].count += 1;
      }
    }
    const series = Object.entries(monthly).map(([month, v]) => ({ month, ...v }));

    const revenueThisMonth = monthly[
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    ]?.revenue ?? 0;
    const revenuePrevMonth = monthly[
      `${startOfPrevMonth.getFullYear()}-${String(startOfPrevMonth.getMonth() + 1).padStart(2, "0")}`
    ]?.revenue ?? 0;
    const growth =
      revenuePrevMonth > 0
        ? ((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100
        : 0;

    // LTV moyen = total payé par user / nb d'utilisateurs payants
    const totalsByUser: Record<string, number> = {};
    for (const p of okPays) {
      const uid = p.user_id as string;
      totalsByUser[uid] = (totalsByUser[uid] ?? 0) + Number(p.amount ?? 0);
    }
    const payingUsers = Object.keys(totalsByUser).length;
    const ltv = payingUsers > 0
      ? Object.values(totalsByUser).reduce((a, b) => a + b, 0) / payingUsers
      : 0;

    return {
      mrr,
      arr: mrr * 12,
      revenueThisMonth,
      revenuePrevMonth,
      growth: Math.round(growth * 10) / 10,
      ltv: Math.round(ltv),
      payingUsers,
      planCounts,
      series,
    };
  });

export const listTransactions = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(5).max(100).default(25),
      status: z.string().optional(),
      search: z.string().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin } = context;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let q = admin
      .from("payments")
      .select("id, reference, amount, currency, plan, status, payment_method, created_at, paid_at, user_id, external_transaction_id", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data.status) q = q.eq("status", data.status);
    if (data.search) q = q.or(`reference.ilike.%${data.search}%,external_transaction_id.ilike.%${data.search}%`);

    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);

    const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id as string)));
    const userMap = new Map<string, { email: string; display_name: string | null }>();
    if (userIds.length > 0) {
      const { data: u } = await admin
        .from("profiles")
        .select("id, email, display_name")
        .in("id", userIds);
      for (const r of u ?? []) {
        userMap.set(r.id as string, {
          email: String(r.email ?? ""),
          display_name: (r.display_name as string) ?? null,
        });
      }
    }

    return {
      rows: (rows ?? []).map((r) => ({
        ...r,
        user_email: userMap.get(r.user_id as string)?.email ?? "—",
        user_name: userMap.get(r.user_id as string)?.display_name ?? null,
      })),
      total: count ?? 0,
      page: data.page,
      pageSize: data.pageSize,
    };
  });

export const refundTransaction = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ paymentId: z.string().uuid(), reason: z.string().min(3).max(500) }))
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin", "finance"]);

    const { data: pay, error } = await admin
      .from("payments")
      .select("id, user_id, amount, status, reference")
      .eq("id", data.paymentId)
      .single();
    if (error || !pay) throw new Error("Paiement introuvable");

    // On marque comme refunded ; le remboursement effectif côté provider doit être déclenché manuellement
    const { error: upErr } = await admin
      .from("payments")
      .update({ status: "refunded", raw_payload: { refund_reason: data.reason, refunded_by: adminEmail, refunded_at: new Date().toISOString() } })
      .eq("id", data.paymentId);
    if (upErr) throw new Error(upErr.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "payment.refund",
      category: "finance",
      targetUserId: pay.user_id as string,
      details: { payment_id: pay.id, reference: pay.reference, amount: pay.amount, reason: data.reason },
    });

    return { ok: true };
  });
