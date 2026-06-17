import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType, b as booleanType } from "../_libs/zod.mjs";
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
const getAffiliatesOverview_createServerFn_handler = createServerRpc({
  id: "84c2bc4171d1fa57bcb1647c93914165714018ec3c0f0accfa1a900dc7d46965",
  name: "getAffiliatesOverview",
  filename: "src/lib/admin/affiliates.functions.ts"
}, (opts) => getAffiliatesOverview.__executeServer(opts));
const getAffiliatesOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(getAffiliatesOverview_createServerFn_handler, async ({
  context
}) => {
  const {
    admin
  } = context;
  const {
    data: codes
  } = await admin.from("affiliate_codes").select("id, code, label, trial_days, active, owner_user_id, created_at").order("created_at", {
    ascending: false
  });
  const {
    data: refs
  } = await admin.from("affiliate_referrals").select("id, code_id, code, user_id, trial_days, created_at");
  const refsByCode = /* @__PURE__ */ new Map();
  for (const r of refs ?? []) {
    const k = r.code_id;
    refsByCode.set(k, (refsByCode.get(k) ?? 0) + 1);
  }
  const referredUserIds = (refs ?? []).map((r) => r.user_id);
  let conversionCount = 0;
  const conversionByCode = /* @__PURE__ */ new Map();
  if (referredUserIds.length > 0) {
    const {
      data: subs
    } = await admin.from("subscriptions").select("user_id, plan, status").in("user_id", referredUserIds);
    const paying = /* @__PURE__ */ new Set();
    for (const s of subs ?? []) {
      if (["cod", "basic", "starter", "pro"].includes(String(s.plan)) && ["active", "incomplete"].includes(String(s.status))) {
        paying.add(s.user_id);
      }
    }
    conversionCount = paying.size;
    for (const r of refs ?? []) {
      if (paying.has(r.user_id)) {
        const k = r.code_id;
        conversionByCode.set(k, (conversionByCode.get(k) ?? 0) + 1);
      }
    }
  }
  const rows = (codes ?? []).map((c) => {
    const usage = refsByCode.get(c.id) ?? 0;
    const conv = conversionByCode.get(c.id) ?? 0;
    return {
      ...c,
      usage,
      conversion: conv,
      conversion_rate: usage > 0 ? Math.round(conv / usage * 1e3) / 10 : 0
    };
  });
  return {
    totalCodes: rows.length,
    activeCodes: rows.filter((r) => r.active).length,
    totalReferrals: (refs ?? []).length,
    conversionCount,
    conversionRate: (refs ?? []).length > 0 ? Math.round(conversionCount / (refs ?? []).length * 1e3) / 10 : 0,
    codes: rows
  };
});
const createAffiliateCode_createServerFn_handler = createServerRpc({
  id: "ab5289154fc4378c2ba73d209b6ede80f3e700df5b27bb90f1ea99bd63945399",
  name: "createAffiliateCode",
  filename: "src/lib/admin/affiliates.functions.ts"
}, (opts) => createAffiliateCode.__executeServer(opts));
const createAffiliateCode = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  code: stringType().min(2).max(40).regex(/^[a-zA-Z0-9_-]+$/),
  label: stringType().max(120).optional().nullable(),
  trial_days: numberType().int().min(1).max(90).default(5)
})).handler(createAffiliateCode_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin,
    adminId,
    adminEmail,
    adminRole
  } = context;
  ensureRole(adminRole, ["super_admin", "support"]);
  const {
    data: created,
    error
  } = await admin.from("affiliate_codes").insert({
    code: data.code.toLowerCase(),
    label: data.label ?? null,
    trial_days: data.trial_days,
    active: true,
    created_by: adminId
  }).select("id, code").single();
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "affiliate.code.create",
    category: "affiliates",
    details: {
      code: created?.code,
      trial_days: data.trial_days,
      label: data.label ?? null
    }
  });
  return {
    ok: true,
    id: created?.id
  };
});
const toggleAffiliateCode_createServerFn_handler = createServerRpc({
  id: "2ea8b7687828bd595f3953a74cd2a21c28a4d7f5a772d8c2717b619863149366",
  name: "toggleAffiliateCode",
  filename: "src/lib/admin/affiliates.functions.ts"
}, (opts) => toggleAffiliateCode.__executeServer(opts));
const toggleAffiliateCode = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid(),
  active: booleanType()
})).handler(toggleAffiliateCode_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    admin,
    adminId,
    adminEmail,
    adminRole
  } = context;
  ensureRole(adminRole, ["super_admin", "support"]);
  const {
    data: row,
    error
  } = await admin.from("affiliate_codes").update({
    active: data.active
  }).eq("id", data.id).select("code").single();
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: data.active ? "affiliate.code.activate" : "affiliate.code.deactivate",
    category: "affiliates",
    details: {
      code: row?.code,
      id: data.id
    }
  });
  return {
    ok: true
  };
});
const deleteAffiliateCode_createServerFn_handler = createServerRpc({
  id: "9ac8a4a38987eb55f0fdd493340ef7cec75bebce8c9743c63c7653427f596d39",
  name: "deleteAffiliateCode",
  filename: "src/lib/admin/affiliates.functions.ts"
}, (opts) => deleteAffiliateCode.__executeServer(opts));
const deleteAffiliateCode = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(deleteAffiliateCode_createServerFn_handler, async ({
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
    data: row
  } = await admin.from("affiliate_codes").select("code").eq("id", data.id).single();
  const {
    error
  } = await admin.from("affiliate_codes").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "affiliate.code.delete",
    category: "affiliates",
    details: {
      code: row?.code,
      id: data.id
    }
  });
  return {
    ok: true
  };
});
export {
  createAffiliateCode_createServerFn_handler,
  deleteAffiliateCode_createServerFn_handler,
  getAffiliatesOverview_createServerFn_handler,
  toggleAffiliateCode_createServerFn_handler
};
