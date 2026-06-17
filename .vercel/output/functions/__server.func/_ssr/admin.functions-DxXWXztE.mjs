import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DkI0uzqn.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
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
async function assertAdmin(callerId) {
  const {
    data: roleRow,
    error: roleErr
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", callerId).eq("role", "admin").maybeSingle();
  if (roleErr) throw new Error(roleErr.message);
  if (!roleRow) throw new Error("Accès refusé : admin requis.");
}
const adminDeleteUser_createServerFn_handler = createServerRpc({
  id: "75454526e81445e210b3752ed6012b474b177f745b67b452ea06088e76834860",
  name: "adminDeleteUser",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteUser.__executeServer(opts));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => {
  if (!input || typeof input !== "object" || !("targetUserId" in input)) {
    throw new Error("targetUserId requis.");
  }
  const id = input.targetUserId;
  if (typeof id !== "string" || id.length < 10) {
    throw new Error("ID invalide.");
  }
  return {
    targetUserId: id
  };
}).handler(adminDeleteUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const callerId = context.userId;
  await assertAdmin(callerId);
  if (data.targetUserId === callerId) {
    throw new Error("Tu ne peux pas te supprimer toi-même depuis l'admin.");
  }
  const uid = data.targetUserId;
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
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(uid);
  if (error) throw new Error(`Échec suppression auth: ${error.message}`);
  return {
    success: true
  };
});
const getEngagementData_createServerFn_handler = createServerRpc({
  id: "bdf0979897a4a5e9e906809c655a7d3196ca4e631d68c60c78d0075e487e7707",
  name: "getEngagementData",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getEngagementData.__executeServer(opts));
const getEngagementData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getEngagementData_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const since = new Date(Date.now() - 60 * 864e5).toISOString();
  const {
    data,
    error
  } = await supabaseAdmin.from("daily_entries").select("user_id, entry_date, created_at").gte("created_at", since);
  if (error) throw new Error(error.message);
  return {
    entries: (data ?? []).map((d) => ({
      user_id: d.user_id,
      entry_date: d.entry_date,
      created_at: d.created_at
    }))
  };
});
export {
  adminDeleteUser_createServerFn_handler,
  getEngagementData_createServerFn_handler
};
