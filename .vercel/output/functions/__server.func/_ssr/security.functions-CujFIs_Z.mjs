import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "../_libs/zod.mjs";
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
const listAuditLogs_createServerFn_handler = createServerRpc({
  id: "5122e628761802312fee88f5b907b0507003beefc4df541c53a3e489b6041b8d",
  name: "listAuditLogs",
  filename: "src/lib/admin/security.functions.ts"
}, (opts) => listAuditLogs.__executeServer(opts));
const listAuditLogs = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).inputValidator(objectType({
  page: numberType().int().min(1).default(1),
  pageSize: numberType().int().min(10).max(200).default(50),
  category: stringType().optional(),
  adminEmail: stringType().optional(),
  search: stringType().optional()
})).handler(listAuditLogs_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin
  } = context;
  const {
    data: rows,
    error
  } = await admin.rpc("admin_list_audit_logs", {
    _page: data.page,
    _page_size: data.pageSize,
    _category: data.category ?? null,
    _admin_email: data.adminEmail ?? null,
    _search: data.search ?? null
  });
  if (error) throw new Error(error.message);
  const list = rows ?? [];
  const total = list.length > 0 ? Number(list[0].total_count) : 0;
  return {
    rows: list.map(({
      total_count: _t,
      ...r
    }) => r),
    total,
    page: data.page,
    pageSize: data.pageSize
  };
});
const listAdminAccounts_createServerFn_handler = createServerRpc({
  id: "544e151cb3fab442dbd99fc528f3d36651e48d422d09a0e4f6c56ce4a4ff5764",
  name: "listAdminAccounts",
  filename: "src/lib/admin/security.functions.ts"
}, (opts) => listAdminAccounts.__executeServer(opts));
const listAdminAccounts = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(listAdminAccounts_createServerFn_handler, async ({
  context
}) => {
  const {
    admin
  } = context;
  const {
    data,
    error
  } = await admin.rpc("admin_list_accounts");
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const inviteAdminAccount_createServerFn_handler = createServerRpc({
  id: "64f27f66b494470b025dec318a14e4997e76019d36b416167ef5403c2013fc60",
  name: "inviteAdminAccount",
  filename: "src/lib/admin/security.functions.ts"
}, (opts) => inviteAdminAccount.__executeServer(opts));
const inviteAdminAccount = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  email: stringType().email(),
  role: enumType(["super_admin", "support", "finance"]),
  display_name: stringType().max(120).optional()
})).handler(inviteAdminAccount_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin,
    adminId,
    adminEmail,
    adminRole
  } = context;
  ensureRole(adminRole, ["super_admin"]);
  const {
    data: list,
    error: listErr
  } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });
  if (listErr) throw new Error(listErr.message);
  const target = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase());
  if (!target) {
    throw new Error("Cet email n'a pas de compte Netodash. L'utilisateur doit d'abord s'inscrire.");
  }
  const {
    error
  } = await admin.rpc("admin_upsert_account", {
    _id: target.id,
    _email: target.email,
    _display_name: data.display_name ?? null,
    _role: data.role,
    _invited_by: adminId
  });
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "admin.account.invite",
    category: "security",
    targetUserId: target.id,
    targetEmail: target.email,
    details: {
      role: data.role
    }
  });
  return {
    ok: true
  };
});
const updateAdminAccount_createServerFn_handler = createServerRpc({
  id: "10bc6397c8e9c469c376a16606eb6efcc19c9b9c6deceaa8ade871fe9bde6a02",
  name: "updateAdminAccount",
  filename: "src/lib/admin/security.functions.ts"
}, (opts) => updateAdminAccount.__executeServer(opts));
const updateAdminAccount = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid(),
  role: enumType(["super_admin", "support", "finance"]).optional(),
  status: enumType(["active", "suspended", "revoked"]).optional()
})).handler(updateAdminAccount_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin,
    adminId,
    adminEmail,
    adminRole
  } = context;
  ensureRole(adminRole, ["super_admin"]);
  if (data.id === adminId && (data.status === "revoked" || data.status === "suspended")) {
    throw new Error("Vous ne pouvez pas vous suspendre ou révoquer vous-même.");
  }
  const {
    data: email,
    error
  } = await admin.rpc("admin_update_account", {
    _id: data.id,
    _role: data.role ?? null,
    _status: data.status ?? null
  });
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "admin.account.update",
    category: "security",
    targetUserId: data.id,
    targetEmail: email ?? null,
    details: {
      role: data.role,
      status: data.status
    }
  });
  return {
    ok: true
  };
});
const removeAdminAccount_createServerFn_handler = createServerRpc({
  id: "fe663f8e5f71a97724a1794b27b050b09491a2a3e361b92bf434007ffa8b09b7",
  name: "removeAdminAccount",
  filename: "src/lib/admin/security.functions.ts"
}, (opts) => removeAdminAccount.__executeServer(opts));
const removeAdminAccount = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(removeAdminAccount_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin,
    adminId,
    adminEmail,
    adminRole
  } = context;
  ensureRole(adminRole, ["super_admin"]);
  if (data.id === adminId) throw new Error("Vous ne pouvez pas vous retirer vous-même.");
  const {
    data: email,
    error
  } = await admin.rpc("admin_delete_account", {
    _id: data.id
  });
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "admin.account.remove",
    category: "security",
    targetUserId: data.id,
    targetEmail: email ?? null
  });
  return {
    ok: true
  };
});
export {
  inviteAdminAccount_createServerFn_handler,
  listAdminAccounts_createServerFn_handler,
  listAuditLogs_createServerFn_handler,
  removeAdminAccount_createServerFn_handler,
  updateAdminAccount_createServerFn_handler
};
