import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { ensureRole, logAdminAction, requireAdmin } from "@/lib/admin/admin-auth.middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MAGIC_LINK_TTL_SECONDS = 3600;

function getRequestIp(): string | null {
  const request = getRequest();
  const forwarded = request?.headers?.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request?.headers?.get("x-real-ip") ?? null;
}

export const adminGenerateForcedMagicLink = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin, adminId, adminEmail } = context;

    const email = data.email.trim().toLowerCase();

    const { data: prof, error: profErr } = await admin
      .from("profiles")
      .select("id, email")
      .ilike("email", email)
      .maybeSingle();
    if (profErr) throw new Error(profErr.message);
    if (!prof) throw new Error(`Aucun utilisateur avec l'email ${email}`);

    const { data: au, error: auErr } = await supabaseAdmin.auth.admin.getUserById(prof.id);
    if (auErr) throw new Error(auErr.message);
    if (!au.user) throw new Error(`Compte auth introuvable pour ${email}`);

    const emailConfirmedAt = au.user.email_confirmed_at ?? null;
    const bannedUntil = (au.user as { banned_until?: string | null }).banned_until ?? null;

    const updates: Record<string, unknown> = {};
    if (!emailConfirmedAt) updates.email_confirm = true;
    if (bannedUntil) updates.ban_duration = "none";
    if (Object.keys(updates).length > 0) {
      const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(prof.id, updates);
      if (upErr) throw new Error(upErr.message);
    }

    const siteUrl = (
      process.env.PUBLIC_SITE_URL ??
      process.env.VITE_PUBLIC_SITE_URL ??
      "https://app.netodash.com"
    ).replace(/\/$/, "");

    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/dashboard` },
    });
    if (linkErr) throw new Error(linkErr.message);

    const actionLink = linkData.properties?.action_link ?? null;
    if (!actionLink) throw new Error("Lien magic link indisponible.");

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "forced_magic_link_generated",
      category: "security",
      targetUserId: prof.id,
      targetEmail: email,
      details: {
        expires_in_seconds: MAGIC_LINK_TTL_SECONDS,
        email_confirmed_now: !emailConfirmedAt,
        ban_lifted: !!bannedUntil,
        ip: getRequestIp(),
        user_agent: getRequest()?.headers?.get("user-agent") ?? null,
      },
    });

    return {
      link: actionLink,
      email,
      userId: prof.id,
      expiresInSeconds: MAGIC_LINK_TTL_SECONDS,
      emailConfirmedNow: !emailConfirmedAt,
      banLifted: !!bannedUntil,
    };
  });
