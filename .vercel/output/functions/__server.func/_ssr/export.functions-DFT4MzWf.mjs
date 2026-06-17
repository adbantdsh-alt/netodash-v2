import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
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
import "./client.server-CcppqNZQ.mjs";
const adminExportAuthUsers_createServerFn_handler = createServerRpc({
  id: "e7f97f85f8e2b146e4d4e1e2ae6662a99dcd68ebbd87f14f65de9717e12c7064",
  name: "adminExportAuthUsers",
  filename: "src/lib/admin/export.functions.ts"
}, (opts) => adminExportAuthUsers.__executeServer(opts));
const adminExportAuthUsers = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).handler(adminExportAuthUsers_createServerFn_handler, async ({
  context
}) => {
  ensureRole(context.adminRole, ["super_admin"]);
  const {
    admin
  } = context;
  const allUsers = [];
  let page = 1;
  const perPage = 1e3;
  for (let i = 0; i < 50; i++) {
    const {
      data,
      error
    } = await admin.auth.admin.listUsers({
      page,
      perPage
    });
    if (error) throw new Error(error.message);
    const users = data?.users ?? [];
    for (const u of users) {
      allUsers.push({
        id: u.id,
        email: u.email ?? null,
        phone: u.phone ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        phone_confirmed_at: u.phone_confirmed_at ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        user_metadata: u.user_metadata ?? {},
        app_metadata: u.app_metadata ?? {},
        providers: (u.identities ?? []).map((it) => ({
          provider: it.provider,
          provider_id: it.provider_id ?? null,
          identity_data: it.identity_data ?? {}
        }))
      });
    }
    if (users.length < perPage) break;
    page++;
  }
  const payload = JSON.stringify({
    exported_at: (/* @__PURE__ */ new Date()).toISOString(),
    count: allUsers.length,
    users: allUsers
  });
  return {
    json: payload,
    count: allUsers.length
  };
});
export {
  adminExportAuthUsers_createServerFn_handler
};
