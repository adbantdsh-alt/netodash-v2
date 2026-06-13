import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, ensureRole, logAdminAction } from "./admin-auth.middleware";

// Le statut (active/suspended/banned) est stocké dans auth.users.user_metadata.admin_status
// pour éviter une nouvelle colonne sur profiles. "active" par défaut.
function getStatusFromMeta(meta: Record<string, unknown> | null | undefined): string {
  const s = meta?.admin_status;
  return typeof s === "string" ? s : "active";
}

const listInput = z
  .object({
    search: z.string().trim().max(200).optional(),
    plan: z.enum(["free", "trial", "basic", "starter", "pro"]).optional(),
    status: z.enum(["active", "suspended", "banned"]).optional(),
    country: z.string().max(64).optional(),
    page: z.number().int().min(1).max(10_000).default(1),
    pageSize: z.number().int().min(1).max(100).default(25),
  })
  .default({ page: 1, pageSize: 25 });

export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => listInput.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    const { admin } = context;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let q = admin
      .from("profiles")
      .select(
        "id, email, display_name, first_name, last_name, country, phone, phone_country_code, created_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data.search && data.search.length > 0) {
      const s = data.search.replace(/[%_]/g, "");
      q = q.or(`email.ilike.%${s}%,display_name.ilike.%${s}%,phone.ilike.%${s}%`);
    }
    if (data.country) q = q.eq("country", data.country);

    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    const profilesRows = (rows ?? []) as Array<{
      id: string;
      email: string | null;
      display_name: string | null;
      first_name: string | null;
      last_name: string | null;
      country: string | null;
      phone: string | null;
      phone_country_code: string | null;
      created_at: string;
    }>;

    const ids = profilesRows.map((r) => r.id);
    const plansMap = new Map<string, { plan: string; status: string }>();
    if (ids.length > 0) {
      const { data: subs } = await admin
        .from("subscriptions")
        .select("user_id, plan, status, trial_ends_at")
        .in("user_id", ids);
      for (const s of subs ?? []) {
        const trialActive = s.trial_ends_at && new Date(s.trial_ends_at as string) > new Date();
        let plan = String(s.plan);
        if (plan === "trial" && !trialActive) plan = "free";
        plansMap.set(s.user_id as string, { plan, status: String(s.status) });
      }
    }

    // Récup statut admin via auth metadata — parallélisé (1 round-trip groupé au lieu de N séquentiels)
    const statusMap = new Map<string, string>();
    if (ids.length > 0) {
      const results = await Promise.all(
        ids.map((id) => admin.auth.admin.getUserById(id)),
      );
      results.forEach((res, i) => {
        statusMap.set(ids[i], getStatusFromMeta(res.data.user?.user_metadata as never));
      });
    }

    let users = profilesRows.map((r) => {
      const p = plansMap.get(r.id);
      const code = (r.phone_country_code ?? "").trim();
      const num = (r.phone ?? "").trim();
      const fullPhone = num ? `${code} ${num}`.trim() : "";
      return {
        id: r.id,
        email: r.email ?? "",
        name:
          r.display_name ||
          [r.first_name, r.last_name].filter(Boolean).join(" ") ||
          "—",
        country: r.country || "—",
        phone: fullPhone,
        phoneDigits: (code + num).replace(/[^\d]/g, ""),
        createdAt: r.created_at,
        status: statusMap.get(r.id) ?? "active",
        plan: p?.plan ?? "free",
      };
    });

    if (data.plan) users = users.filter((u) => u.plan === data.plan);
    if (data.status) users = users.filter((u) => u.status === data.status);

    return { users, total: count ?? users.length, page: data.page, pageSize: data.pageSize };
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
        plan: z.enum(["free", "trial", "basic", "starter", "pro"]),
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
    // Suppressions parallèles : les tables sont indépendantes (10 round-trips → 1 vague parallèle).
    await Promise.all(
      tables.map((t) => admin.from(t).delete().eq("user_id", data.userId)),
    );
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
    // Marque l'utilisateur comme impersonné pour afficher la bannière dans l'app utilisateur.
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

/**
 * Génère un magic link de connexion pour un utilisateur (par email).
 * Lève automatiquement les blocages techniques (email non confirmé, ban) avant
 * de générer le lien. Utilisé pour débloquer en urgence un compte payant.
 */
export const adminGenerateMagicLink = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().trim().toLowerCase().email() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin } = context;

    // Retrouver l'utilisateur via profiles.email (1 requête) au lieu de scanner listUsers paginé.
    const { data: prof, error: profErr } = await admin
      .from("profiles")
      .select("id, email")
      .ilike("email", data.email)
      .maybeSingle();
    if (profErr) throw new Error(profErr.message);
    if (!prof) throw new Error(`Aucun utilisateur avec l'email ${data.email}`);

    const { data: au, error: auErr } = await admin.auth.admin.getUserById(prof.id);
    if (auErr) throw new Error(auErr.message);
    if (!au.user) throw new Error(`Aucun utilisateur avec l'email ${data.email}`);

    const targetUser = {
      id: prof.id,
      email_confirmed_at: (au.user.email_confirmed_at ?? null) as string | null,
      banned_until: ((au.user as unknown as { banned_until?: string | null }).banned_until ??
        null) as string | null,
    };

    // Lever les blocages techniques de connexion
    const updates: Record<string, unknown> = {};
    if (!targetUser.email_confirmed_at) updates.email_confirm = true;
    if (targetUser.banned_until) updates.ban_duration = "none";
    if (Object.keys(updates).length > 0) {
      const { error: upErr } = await admin.auth.admin.updateUserById(targetUser.id, updates);
      if (upErr) throw new Error(upErr.message);
    }

    // Générer le magic link
    const { data: link, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: data.email,
    });
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId: context.adminId,
      adminEmail: context.adminEmail,
      action: "magic_link_generated",
      category: "security",
      targetUserId: targetUser.id,
      targetEmail: data.email,
      details: {
        email_confirmed_now: !targetUser.email_confirmed_at,
        ban_lifted: !!targetUser.banned_until,
      },
    });

    return {
      link: link.properties?.action_link ?? null,
      email: data.email,
      userId: targetUser.id,
      emailConfirmedNow: !targetUser.email_confirmed_at,
      banLifted: !!targetUser.banned_until,
    };
  });
