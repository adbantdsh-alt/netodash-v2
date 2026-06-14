import { createServerFn } from "@tanstack/react-start";
import { ensureRole, requireAdmin } from "./admin-auth.middleware.server";

export type AdminBetaTesterRow = {
  id: string;
  email: string;
  fullName: string;
  userId: string | null;
  status: string;
  freeUntil: string | null;
  lifetimeDiscountPercent: number;
  createdAt: string;
  hasAccount: boolean;
  plan: string | null;
  trialEndsAt: string | null;
};

export type AdminBetaWaitlistRow = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
};

export const adminGetBetaProgram = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    ensureRole(context.adminRole, ["super_admin", "support", "finance"]);
    const { admin } = context;

    const [{ data: testers, error: tErr }, { data: waitlist, error: wErr }, statusRes] =
      await Promise.all([
        admin
          .from("beta_testers")
          .select("id, email, full_name, user_id, status, free_until, lifetime_discount_percent, created_at")
          .order("created_at", { ascending: false }),
        admin
          .from("beta_waitlist")
          .select("id, email, full_name, created_at")
          .order("created_at", { ascending: false }),
        admin.rpc("get_beta_program_status"),
      ]);

    if (tErr) throw new Error(tErr.message);
    if (wErr) throw new Error(wErr.message);

    const userIds = (testers ?? [])
      .map((t) => t.user_id as string | null)
      .filter((id): id is string => !!id);

    let subsByUser = new Map<string, { plan: string; trial_ends_at: string | null }>();
    if (userIds.length > 0) {
      const { data: subs } = await admin
        .from("subscriptions")
        .select("user_id, plan, trial_ends_at")
        .in("user_id", userIds);
      for (const s of subs ?? []) {
        subsByUser.set(s.user_id as string, {
          plan: s.plan as string,
          trial_ends_at: s.trial_ends_at as string | null,
        });
      }
    }

    const statusRaw = (statusRes.data ?? {}) as Record<string, unknown>;

    return {
      maxSpots: Number(statusRaw.max_spots ?? 10),
      betaCount: Number(statusRaw.beta_count ?? 0),
      waitlistCount: Number(statusRaw.waitlist_count ?? 0),
      spotsLeft: Number(statusRaw.spots_left ?? 0),
      betaFull: !!statusRaw.beta_full,
      testers: (testers ?? []).map((t): AdminBetaTesterRow => {
        const uid = t.user_id as string | null;
        const sub = uid ? subsByUser.get(uid) : undefined;
        return {
          id: t.id as string,
          email: t.email as string,
          fullName: t.full_name as string,
          userId: uid,
          status: (t.status as string) ?? "active",
          freeUntil: (t.free_until as string | null) ?? null,
          lifetimeDiscountPercent: Number(t.lifetime_discount_percent ?? 50),
          createdAt: t.created_at as string,
          hasAccount: !!uid,
          plan: sub?.plan ?? null,
          trialEndsAt: sub?.trial_ends_at ?? null,
        };
      }),
      waitlist: (waitlist ?? []).map(
        (w): AdminBetaWaitlistRow => ({
          id: w.id as string,
          email: w.email as string,
          fullName: (w.full_name as string | null) ?? null,
          createdAt: w.created_at as string,
        }),
      ),
    };
  });
