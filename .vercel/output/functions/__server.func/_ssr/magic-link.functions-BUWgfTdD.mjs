import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction, a as auditMeta } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const MAGIC_LINK_TTL_SECONDS = 3600;
const adminGenerateForcedMagicLink_createServerFn_handler = createServerRpc({
  id: "eef86c4f2ddc35a9d2bb4f708f868330d028a731303bd32278233670be676b62",
  name: "adminGenerateForcedMagicLink",
  filename: "src/lib/admin/magic-link.functions.ts"
}, (opts) => adminGenerateForcedMagicLink.__executeServer(opts));
const adminGenerateForcedMagicLink = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  email: stringType().trim().email().max(255)
}).parse(input)).handler(adminGenerateForcedMagicLink_createServerFn_handler, async ({
  data,
  context
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  const {
    admin,
    adminId,
    adminEmail
  } = context;
  const email = data.email.trim().toLowerCase();
  const {
    data: prof,
    error: profErr
  } = await admin.from("profiles").select("id, email").ilike("email", email).maybeSingle();
  if (profErr) throw new Error(profErr.message);
  if (!prof) throw new Error(`Aucun utilisateur avec l'email ${email}`);
  const {
    data: au,
    error: auErr
  } = await supabaseAdmin.auth.admin.getUserById(prof.id);
  if (auErr) throw new Error(auErr.message);
  if (!au.user) throw new Error(`Compte auth introuvable pour ${email}`);
  const emailConfirmedAt = au.user.email_confirmed_at ?? null;
  const bannedUntil = au.user.banned_until ?? null;
  const updates = {};
  if (!emailConfirmedAt) updates.email_confirm = true;
  if (bannedUntil) updates.ban_duration = "none";
  if (Object.keys(updates).length > 0) {
    const {
      error: upErr
    } = await supabaseAdmin.auth.admin.updateUserById(prof.id, updates);
    if (upErr) throw new Error(upErr.message);
  }
  const siteUrl = (process.env.PUBLIC_SITE_URL ?? process.env.VITE_PUBLIC_SITE_URL ?? "https://app.netodash.com").replace(/\/$/, "");
  const {
    data: linkData,
    error: linkErr
  } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${siteUrl}/dashboard`
    }
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
    ...auditMeta(context),
    details: {
      expires_in_seconds: MAGIC_LINK_TTL_SECONDS,
      email_confirmed_now: !emailConfirmedAt,
      ban_lifted: !!bannedUntil
    }
  });
  return {
    link: actionLink,
    email,
    userId: prof.id,
    expiresInSeconds: MAGIC_LINK_TTL_SECONDS,
    emailConfirmedNow: !emailConfirmedAt,
    banLifted: !!bannedUntil
  };
});
export {
  adminGenerateForcedMagicLink_createServerFn_handler
};
