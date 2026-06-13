import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(callerId: string) {
  const { data: roleRow, error: roleErr } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", callerId)
    .eq("role", "admin")
    .maybeSingle();
  if (roleErr) throw new Error(roleErr.message);
  if (!roleRow) throw new Error("Accès refusé : admin requis.");
}

/**
 * Permanently delete a user account (admin only).
 * Wipes all user-owned data, then removes the auth user.
 */
export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    if (!input || typeof input !== "object" || !("targetUserId" in input)) {
      throw new Error("targetUserId requis.");
    }
    const id = (input as { targetUserId: unknown }).targetUserId;
    if (typeof id !== "string" || id.length < 10) {
      throw new Error("ID invalide.");
    }
    return { targetUserId: id };
  })
  .handler(async ({ data, context }) => {
    const callerId = context.userId;
    await assertAdmin(callerId);

    if (data.targetUserId === callerId) {
      throw new Error("Tu ne peux pas te supprimer toi-même depuis l'admin.");
    }

    const uid = data.targetUserId;

    // Wipe all user-owned data
    await supabaseAdmin.from("creative_performance").delete().eq("user_id", uid);
    await supabaseAdmin.from("creatives").delete().eq("user_id", uid);
    await supabaseAdmin.from("daily_entries").delete().eq("user_id", uid);
    await supabaseAdmin.from("products").delete().eq("user_id", uid);
    await supabaseAdmin.from("coach_usage").delete().eq("user_id", uid);
    await supabaseAdmin.from("payments").delete().eq("user_id", uid);
    await supabaseAdmin.from("subscriptions").delete().eq("user_id", uid);
    await supabaseAdmin.from("affiliate_referrals").delete().eq("user_id", uid);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", uid);
    await supabaseAdmin.from("profiles").delete().eq("id", uid);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (error) throw new Error(`Échec suppression auth: ${error.message}`);

    return { success: true };
  });

/**
 * Returns daily_entries data for engagement metrics (admin only).
 * Bypasses RLS via service role.
 */
export const getEngagementData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const since = new Date(Date.now() - 60 * 86400000).toISOString();
    const { data, error } = await supabaseAdmin
      .from("daily_entries")
      .select("user_id, entry_date, created_at")
      .gte("created_at", since);
    if (error) throw new Error(error.message);
    return {
      entries: (data ?? []).map((d) => ({
        user_id: d.user_id as string,
        entry_date: d.entry_date as string,
        created_at: d.created_at as string,
      })),
    };
  });
