import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import { r as requireAdmin } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-CcppqNZQ.mjs";
const SUPER_ADMIN_EMAILS = new Set((process.env.SUPER_ADMIN_EMAILS ?? "adbaxgoat@gmail.com,adbaecomx@gmail.com").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
function createServiceClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
async function ensureBootstrapSuperAdmin(admin, userId) {
  const {
    data: authUser,
    error: userErr
  } = await admin.auth.admin.getUserById(userId);
  if (userErr || !authUser.user?.email) {
    return {
      isAdmin: false,
      role: null
    };
  }
  const email = authUser.user.email.trim().toLowerCase();
  if (!SUPER_ADMIN_EMAILS.has(email)) {
    return {
      isAdmin: false,
      role: null
    };
  }
  const {
    error: bootErr
  } = await admin.rpc("bootstrap_super_admin", {
    _uid: userId,
    _email: email
  });
  if (bootErr) {
    console.error("[checkIsAdminAccount] bootstrap_super_admin failed", bootErr);
    return {
      isAdmin: false,
      role: null
    };
  }
  return {
    isAdmin: true,
    role: "super_admin"
  };
}
const checkIsAdminAccount_createServerFn_handler = createServerRpc({
  id: "85fed52218865121fb40605209c6dc9fa50f137c271a9233672975bd60ccfd86",
  name: "checkIsAdminAccount",
  filename: "src/lib/admin/auth.functions.ts"
}, (opts) => checkIsAdminAccount.__executeServer(opts));
const checkIsAdminAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(checkIsAdminAccount_createServerFn_handler, async ({
  data
}) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Configuration serveur Supabase incomplète.");
  }
  const admin = createServiceClient();
  const [{
    data: isAdminData,
    error: isAdminErr
  }, {
    data: roleData,
    error: roleErr
  }] = await Promise.all([admin.rpc("is_admin", {
    _uid: data.userId
  }), admin.rpc("get_admin_role", {
    _uid: data.userId
  })]);
  if (isAdminErr || roleErr) {
    console.error("[checkIsAdminAccount] rpc error", {
      isAdminErr,
      roleErr
    });
    throw new Error("Impossible de vérifier le compte administrateur.");
  }
  if (isAdminData === true && roleData) {
    return {
      isAdmin: true,
      role: roleData
    };
  }
  return ensureBootstrapSuperAdmin(admin, data.userId);
});
const getCurrentAdmin_createServerFn_handler = createServerRpc({
  id: "08435824b548ef182c935cde55b21f5b42057ed9fde4c8ace2b3c821d92df234",
  name: "getCurrentAdmin",
  filename: "src/lib/admin/auth.functions.ts"
}, (opts) => getCurrentAdmin.__executeServer(opts));
const getCurrentAdmin = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(getCurrentAdmin_createServerFn_handler, async ({
  context
}) => {
  return {
    id: context.adminId,
    email: context.adminEmail,
    role: context.adminRole
  };
});
const touchAdminLogin_createServerFn_handler = createServerRpc({
  id: "0fc968d5a216172d7d018ef13a6c9f171bb5b723b4b74606a012f69550b774b1",
  name: "touchAdminLogin",
  filename: "src/lib/admin/auth.functions.ts"
}, (opts) => touchAdminLogin.__executeServer(opts));
const touchAdminLogin = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).handler(touchAdminLogin_createServerFn_handler, async () => {
  return {
    ok: true
  };
});
export {
  checkIsAdminAccount_createServerFn_handler,
  getCurrentAdmin_createServerFn_handler,
  touchAdminLogin_createServerFn_handler
};
