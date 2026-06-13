import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, ensureRole, logAdminAction } from "./admin-auth.middleware";

export const getAffiliatesOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;

    const { data: codes } = await admin
      .from("affiliate_codes")
      .select("id, code, label, trial_days, active, owner_user_id, created_at")
      .order("created_at", { ascending: false });

    const { data: refs } = await admin
      .from("affiliate_referrals")
      .select("id, code_id, code, user_id, trial_days, created_at");

    const refsByCode = new Map<string, number>();
    for (const r of refs ?? []) {
      const k = r.code_id as string;
      refsByCode.set(k, (refsByCode.get(k) ?? 0) + 1);
    }

    // Conversion : combien de referrals ont un abonnement payant
    const referredUserIds = (refs ?? []).map((r) => r.user_id as string);
    let conversionCount = 0;
    const conversionByCode = new Map<string, number>();
    if (referredUserIds.length > 0) {
      const { data: subs } = await admin
        .from("subscriptions")
        .select("user_id, plan, status")
        .in("user_id", referredUserIds);
      const paying = new Set<string>();
      for (const s of subs ?? []) {
        if (["basic", "starter", "pro"].includes(String(s.plan)) && ["active", "incomplete"].includes(String(s.status))) {
          paying.add(s.user_id as string);
        }
      }
      conversionCount = paying.size;
      for (const r of refs ?? []) {
        if (paying.has(r.user_id as string)) {
          const k = r.code_id as string;
          conversionByCode.set(k, (conversionByCode.get(k) ?? 0) + 1);
        }
      }
    }

    const rows = (codes ?? []).map((c) => {
      const usage = refsByCode.get(c.id as string) ?? 0;
      const conv = conversionByCode.get(c.id as string) ?? 0;
      return {
        ...c,
        usage,
        conversion: conv,
        conversion_rate: usage > 0 ? Math.round((conv / usage) * 1000) / 10 : 0,
      };
    });

    return {
      totalCodes: rows.length,
      activeCodes: rows.filter((r) => r.active).length,
      totalReferrals: (refs ?? []).length,
      conversionCount,
      conversionRate: (refs ?? []).length > 0
        ? Math.round((conversionCount / (refs ?? []).length) * 1000) / 10
        : 0,
      codes: rows,
    };
  });

export const createAffiliateCode = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      code: z.string().min(2).max(40).regex(/^[a-zA-Z0-9_-]+$/),
      label: z.string().max(120).optional().nullable(),
      trial_days: z.number().int().min(1).max(90).default(5),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin", "support"]);

    const { data: created, error } = await admin
      .from("affiliate_codes")
      .insert({
        code: data.code.toLowerCase(),
        label: data.label ?? null,
        trial_days: data.trial_days,
        active: true,
        created_by: adminId,
      })
      .select("id, code")
      .single();
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "affiliate.code.create",
      category: "affiliates",
      details: { code: created?.code, trial_days: data.trial_days, label: data.label ?? null },
    });

    return { ok: true, id: created?.id };
  });

export const toggleAffiliateCode = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid(), active: z.boolean() }))
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin", "support"]);

    const { data: row, error } = await admin
      .from("affiliate_codes")
      .update({ active: data.active })
      .eq("id", data.id)
      .select("code")
      .single();
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: data.active ? "affiliate.code.activate" : "affiliate.code.deactivate",
      category: "affiliates",
      details: { code: row?.code, id: data.id },
    });

    return { ok: true };
  });

export const deleteAffiliateCode = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin"]);

    const { data: row } = await admin
      .from("affiliate_codes")
      .select("code")
      .eq("id", data.id)
      .single();

    const { error } = await admin.from("affiliate_codes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "affiliate.code.delete",
      category: "affiliates",
      details: { code: row?.code, id: data.id },
    });

    return { ok: true };
  });
