import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ensureRole, logAdminAction, requireAdmin } from "./admin-auth.middleware.server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  effectivePlan,
  isActivePaidSubscription,
  loadPlanPricesUsd,
  mrrForPlan,
} from "./admin-metrics";

type AdminClient = SupabaseClient<Database>;

function getStatusFromMeta(meta: Record<string, unknown> | null | undefined): string {
  const s = meta?.admin_status;
  return typeof s === "string" ? s : "active";
}

const listFiltersSchema = z.object({
  search: z.string().trim().max(200).optional(),
  plan: z.enum(["free", "trial", "cod", "basic", "starter", "pro"]).optional(),
  status: z.enum(["active", "suspended", "banned"]).optional(),
  country: z.string().max(64).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

const listInput = listFiltersSchema
  .extend({
    page: z.number().int().min(1).max(10_000).default(1),
    pageSize: z.number().int().min(1).max(100).default(25),
  })
  .default({ page: 1, pageSize: 25 });

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  phone: string | null;
  phone_country_code: string | null;
  created_at: string;
};

type SubRow = {
  user_id: string;
  plan: string | null;
  status: string | null;
  trial_ends_at: string | null;
  stripe_subscription_id: string | null;
};

async function fetchAllProfiles(
  admin: AdminClient,
  filters: z.infer<typeof listFiltersSchema>,
): Promise<ProfileRow[]> {
  const pageSize = 1000;
  const all: ProfileRow[] = [];
  for (let page = 0; page < 20; page++) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    let q = admin
      .from("profiles")
      .select(
        "id, email, display_name, first_name, last_name, country, phone, phone_country_code, created_at",
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters.search && filters.search.length > 0) {
      const s = filters.search.replace(/[%_]/g, "");
      q = q.or(`email.ilike.%${s}%,display_name.ilike.%${s}%,phone.ilike.%${s}%`);
    }
    if (filters.country) q = q.eq("country", filters.country);
    if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
    if (filters.dateTo) q = q.lte("created_at", filters.dateTo);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as ProfileRow[];
    all.push(...rows);
    if (rows.length < pageSize) break;
  }
  return all;
}

async function buildUserRows(
  admin: AdminClient,
  profilesRows: ProfileRow[],
  filters: z.infer<typeof listFiltersSchema>,
) {
  const ids = profilesRows.map((r) => r.id);
  const prices = await loadPlanPricesUsd(admin);
  const now = new Date();

  const plansMap = new Map<string, SubRow>();
  if (ids.length > 0) {
    const { data: subs } = await admin
      .from("subscriptions")
      .select("user_id, plan, status, trial_ends_at, stripe_subscription_id")
      .in("user_id", ids);
    for (const s of subs ?? []) {
      plansMap.set(s.user_id as string, s as SubRow);
    }
  }

  const statusMap = new Map<string, string>();
  const lastLoginMap = new Map<string, string | null>();
  if (ids.length > 0) {
    const results = await Promise.all(ids.map((id) => admin.auth.admin.getUserById(id)));
    results.forEach((res, i) => {
      statusMap.set(ids[i], getStatusFromMeta(res.data.user?.user_metadata as never));
      lastLoginMap.set(ids[i], res.data.user?.last_sign_in_at ?? null);
    });
  }

  let users = profilesRows.map((r) => {
    const sub = plansMap.get(r.id);
    const plan = effectivePlan(sub, now);
    const code = (r.phone_country_code ?? "").trim();
    const num = (r.phone ?? "").trim();
    const fullPhone = num ? `${code} ${num}`.trim() : "";
    const mrr = sub && isActivePaidSubscription(sub, now) ? mrrForPlan(String(sub.plan), prices) : 0;
    return {
      id: r.id,
      email: r.email ?? "",
      name:
        r.display_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "—",
      country: r.country || "—",
      phone: fullPhone,
      phoneDigits: (code + num).replace(/[^\d]/g, ""),
      createdAt: r.created_at,
      lastLoginAt: lastLoginMap.get(r.id) ?? null,
      status: statusMap.get(r.id) ?? "active",
      plan,
      subscriptionStatus: sub?.status ?? "—",
      mrr,
    };
  });

  if (filters.plan) users = users.filter((u) => u.plan === filters.plan);
  if (filters.status) users = users.filter((u) => u.status === filters.status);

  return users;
}

export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => listInput.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    const { admin } = context;
    const profilesRows = await fetchAllProfiles(admin, data);
    const filtered = await buildUserRows(admin, profilesRows, data);
    const total = filtered.length;
    const from = (data.page - 1) * data.pageSize;
    const users = filtered.slice(from, from + data.pageSize);

    return { users, total, page: data.page, pageSize: data.pageSize };
  });

export const adminExportUsersCsv = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => listFiltersSchema.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support", "finance"]);
    const { admin, adminId, adminEmail } = context;
    const profilesRows = await fetchAllProfiles(admin, data);
    const users = await buildUserRows(admin, profilesRows, data);

    const header = [
      "email",
      "plan",
      "statut",
      "date_inscription",
      "derniere_connexion",
      "pays",
      "mrr_usd",
      "nom",
    ];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      header.join(","),
      ...users.map((u) =>
        [
          escape(u.email),
          escape(u.plan),
          escape(u.status),
          escape(new Date(u.createdAt).toISOString()),
          escape(u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : ""),
          escape(u.country),
          String(u.mrr),
          escape(u.name),
        ].join(","),
      ),
    ];

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "users.export_csv",
      category: "users",
      details: { count: users.length, filters: data },
    });

    return { csv: lines.join("\n"), count: users.length };
  });

export const adminGetUserProfile = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { admin } = context;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const [
      { data: profile },
      { data: sub },
      { data: payments },
      { data: au },
      { data: lastEntry },
      { count: entries30d },
    ] = await Promise.all([
      admin.from("profiles").select("*").eq("id", data.userId).maybeSingle(),
      admin.from("subscriptions").select("*").eq("user_id", data.userId).maybeSingle(),
      admin
        .from("payments")
        .select("id, amount, currency, status, payment_method, created_at")
        .eq("user_id", data.userId)
        .order("created_at", { ascending: false })
        .limit(50),
      admin.auth.admin.getUserById(data.userId),
      admin
        .from("daily_entries")
        .select("created_at, entry_date")
        .eq("user_id", data.userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("daily_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", data.userId)
        .gte("created_at", thirtyDaysAgo),
    ]);
    if (!profile) throw new Error("Utilisateur introuvable");

    const status = getStatusFromMeta(au.user?.user_metadata as never);

    return {
      profile,
      subscription: sub,
      payments: payments ?? [],
      lastEntry,
      entries30d: entries30d ?? 0,
      status,
      lastLoginAt: au.user?.last_sign_in_at ?? null,
    };
  });

async function setAdminStatus(
  admin: Parameters<typeof logAdminAction>[0]["admin"],
  userId: string,
  status: "active" | "suspended" | "banned",
) {
  const { data: u } = await admin.auth.admin.getUserById(userId);
  const existing = (u.user?.user_metadata ?? {}) as Record<string, unknown>;
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { ...existing, admin_status: status },
  });
}

export const adminChangeUserPlan = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        plan: z.enum(["free", "trial", "cod", "basic", "starter", "pro"]),
        reason: z.string().trim().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin } = context;
    const { data: prof } = await admin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();
    const { data: existing } = await admin
      .from("subscriptions")
      .select("plan")
      .eq("user_id", data.userId)
      .maybeSingle();

    const upd =
      data.plan === "trial"
        ? {
            plan: "trial",
            status: "active",
            trial_ends_at: new Date(Date.now() + 7 * 86400000).toISOString(),
          }
        : { plan: data.plan, status: data.plan === "free" ? "canceled" : "active" };

    if (existing) {
      await admin.from("subscriptions").update(upd).eq("user_id", data.userId);
    } else {
      await admin.from("subscriptions").insert({ user_id: data.userId, ...upd });
    }

    await logAdminAction({
      admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "plan_changed",
      category: "users",
      targetUserId: data.userId,
      targetEmail: prof?.email as string | undefined,
      details: { from: existing?.plan ?? null, to: data.plan, reason: data.reason ?? null },
    });
    return { ok: true };
  });

const GRANT_PLAN_LABELS: Record<"cod" | "basic" | "starter" | "pro", string> = {
  cod: "COD",
  basic: "Starter",
  starter: "Pro",
  pro: "Scale",
};

function addDuration(base: Date, amount: number, unit: "days" | "months" | "years"): Date {
  const next = new Date(base);
  if (unit === "days") next.setDate(next.getDate() + amount);
  else if (unit === "months") next.setMonth(next.getMonth() + amount);
  else next.setFullYear(next.getFullYear() + amount);
  return next;
}

export const adminGrantFreeAccess = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        duration: z.number().int().min(1).max(3650),
        unit: z.enum(["days", "months", "years"]),
        plan: z.enum(["cod", "basic", "starter", "pro"]),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin, adminId, adminEmail } = context;

    const { data: prof } = await admin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();
    const { data: existing } = await admin
      .from("subscriptions")
      .select("trial_ends_at, current_period_end")
      .eq("user_id", data.userId)
      .maybeSingle();

    const now = new Date();
    let baseMs = now.getTime();
    if (existing?.trial_ends_at) {
      baseMs = Math.max(baseMs, new Date(existing.trial_ends_at).getTime());
    }
    if (existing?.current_period_end) {
      baseMs = Math.max(baseMs, new Date(existing.current_period_end).getTime());
    }
    const endsAt = addDuration(new Date(baseMs), data.duration, data.unit);
    const grantedAt = now.toISOString();

    const upd = {
      plan: data.plan,
      status: "active" as const,
      trial_ends_at: endsAt.toISOString(),
      current_period_end: endsAt.toISOString(),
      cancel_at_period_end: false,
    };

    if (existing) {
      const { error } = await admin.from("subscriptions").update(upd).eq("user_id", data.userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await admin.from("subscriptions").insert({ user_id: data.userId, ...upd });
      if (error) throw new Error(error.message);
    }

    const planOffert = GRANT_PLAN_LABELS[data.plan];
    const duree =
      data.unit === "days"
        ? `${data.duration} jour${data.duration > 1 ? "s" : ""}`
        : data.unit === "months"
          ? `${data.duration} mois`
          : `${data.duration} an${data.duration > 1 ? "s" : ""}`;

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "grant_free_access",
      category: "users",
      targetUserId: data.userId,
      targetEmail: prof?.email as string | undefined,
      details: {
        admin_email: adminEmail,
        user_email: prof?.email ?? null,
        plan_offert: planOffert,
        plan: data.plan,
        duree,
        duration: data.duration,
        unit: data.unit,
        date: grantedAt,
        ends_at: endsAt.toISOString(),
      },
    });

    return { ok: true, endsAt: endsAt.toISOString(), planOffert, duree };
  });

export const adminSuspendUser = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        reason: z.string().trim().min(3).max(500),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin } = context;
    const { data: prof } = await admin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();
    await setAdminStatus(admin, data.userId, "suspended");
    await admin.auth.admin.signOut(data.userId);
    await logAdminAction({
      admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "user_suspended",
      category: "users",
      targetUserId: data.userId,
      targetEmail: prof?.email as string | undefined,
      details: { reason: data.reason },
    });
    return { ok: true };
  });

export const adminUnsuspendUser = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    await setAdminStatus(context.admin, data.userId, "active");
    await logAdminAction({
      admin: context.admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "user_unsuspended",
      category: "users",
      targetUserId: data.userId,
    });
    return { ok: true };
  });

export const adminBanUser = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        reason: z.string().trim().min(3).max(500),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin"]);
    const { admin } = context;
    const { data: prof } = await admin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();
    await setAdminStatus(admin, data.userId, "banned");
    await admin.auth.admin.signOut(data.userId);
    await logAdminAction({
      admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "user_banned",
      category: "users",
      targetUserId: data.userId,
      targetEmail: prof?.email as string | undefined,
      details: { reason: data.reason },
    });
    return { ok: true };
  });

export const adminDeleteUserData = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin"]);
    const { admin } = context;
    if (data.userId === context.adminId) {
      throw new Error("Tu ne peux pas te supprimer toi-même.");
    }
    const { data: prof } = await admin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();

    const tables = [
      "creative_performance",
      "creatives",
      "daily_entries",
      "products",
      "coach_usage",
      "payments",
      "subscriptions",
      "affiliate_referrals",
      "user_roles",
      "shopify_connections",
    ] as const;
    await Promise.all(tables.map((t) => admin.from(t).delete().eq("user_id", data.userId)));
    await admin.from("profiles").delete().eq("id", data.userId);
    await admin.auth.admin.deleteUser(data.userId);

    await logAdminAction({
      admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "user_deleted_rgpd",
      category: "users",
      targetUserId: data.userId,
      targetEmail: prof?.email as string | undefined,
    });
    return { ok: true };
  });

export const adminImpersonateUser = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin } = context;
    const { data: prof } = await admin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();
    if (!prof?.email) throw new Error("Utilisateur introuvable");
    const { data: u } = await admin.auth.admin.getUserById(data.userId);
    const existingMeta = (u.user?.user_metadata ?? {}) as Record<string, unknown>;
    await admin.auth.admin.updateUserById(data.userId, {
      user_metadata: {
        ...existingMeta,
        impersonated_by: context.adminEmail,
        impersonated_at: new Date().toISOString(),
      },
    });
    const { data: link, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: String(prof.email),
    });
    if (error) throw new Error(error.message);
    await logAdminAction({
      admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "impersonation_started",
      category: "security",
      targetUserId: data.userId,
      targetEmail: String(prof.email),
    });
    return {
      link: link.properties?.action_link ?? null,
      userEmail: prof.email,
      adminEmail: context.adminEmail,
    };
  });

export const stopImpersonation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: u } = await admin.auth.admin.getUserById(data.userId);
    const meta = (u.user?.user_metadata ?? {}) as Record<string, unknown>;
    delete meta.impersonated_by;
    delete meta.impersonated_at;
    await admin.auth.admin.updateUserById(data.userId, { user_metadata: meta });
    return { ok: true };
  });
