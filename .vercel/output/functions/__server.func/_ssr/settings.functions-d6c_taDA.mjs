import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, r as recordType, s as stringType } from "../_libs/zod.mjs";
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
const SETTING_KEYS = ["branding.app_name", "branding.support_email", "branding.tagline", "pricing.basic_xof", "pricing.starter_xof", "pricing.pro_xof", "pricing.cod_usd", "pricing.basic_usd", "pricing.starter_usd", "pricing.pro_usd", "plan_limits.cod_products", "plan_limits.basic_products", "plan_limits.starter_products", "plan_limits.pro_products", "beta.max_spots", "trial.default_days", "flags.signup_enabled", "flags.affiliate_enabled", "flags.maintenance_mode", "flags.maintenance_message"];
const DEFAULTS = {
  "branding.app_name": "Netodash",
  "branding.support_email": "support@netodash.com",
  "branding.tagline": "Pilote ton e-commerce sans te ruiner.",
  "pricing.basic_xof": "5000",
  "pricing.starter_xof": "15000",
  "pricing.pro_xof": "30000",
  "pricing.cod_usd": "10",
  "pricing.basic_usd": "12",
  "pricing.starter_usd": "29",
  "pricing.pro_usd": "79",
  "plan_limits.cod_products": "-1",
  "plan_limits.basic_products": "3",
  "plan_limits.starter_products": "10",
  "plan_limits.pro_products": "-1",
  "beta.max_spots": "10",
  "trial.default_days": "7",
  "flags.signup_enabled": "true",
  "flags.affiliate_enabled": "true",
  "flags.maintenance_mode": "false",
  "flags.maintenance_message": ""
};
const getAdminSettings_createServerFn_handler = createServerRpc({
  id: "4ca247a315bfa1cc7fff9b49390f9c259ed47c349a9ed55b55d33681e24d28d5",
  name: "getAdminSettings",
  filename: "src/lib/admin/settings.functions.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
const getAdminSettings = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(getAdminSettings_createServerFn_handler, async ({
  context
}) => {
  const {
    admin
  } = context;
  const {
    data,
    error
  } = await admin.from("app_settings").select("key, value, updated_at").in("key", SETTING_KEYS);
  if (error) throw new Error(error.message);
  const merged = {
    ...DEFAULTS
  };
  let latestUpdate = null;
  for (const row of data ?? []) {
    const key = String(row.key);
    if (key in merged) merged[key] = String(row.value ?? "");
    if (!latestUpdate || row.updated_at > latestUpdate) {
      latestUpdate = row.updated_at;
    }
  }
  return {
    settings: merged,
    latestUpdate
  };
});
const updateAdminSettings_createServerFn_handler = createServerRpc({
  id: "6461bc2b3c92ef580c50d1be6031f5356a9a871d9472ff5a15ce1cbd2a5aa58b",
  name: "updateAdminSettings",
  filename: "src/lib/admin/settings.functions.ts"
}, (opts) => updateAdminSettings.__executeServer(opts));
const updateAdminSettings = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  patch: recordType(stringType(), stringType())
})).handler(updateAdminSettings_createServerFn_handler, async ({
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
  const validKeys = new Set(SETTING_KEYS);
  const rows = Object.entries(data.patch).filter(([k]) => validKeys.has(k)).map(([key, value]) => ({
    key,
    value
  }));
  if (rows.length === 0) return {
    ok: true,
    updated: 0
  };
  const {
    error
  } = await admin.from("app_settings").upsert(rows, {
    onConflict: "key"
  });
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "settings.update",
    category: "settings",
    details: {
      keys: rows.map((r) => r.key)
    }
  });
  return {
    ok: true,
    updated: rows.length
  };
});
export {
  getAdminSettings_createServerFn_handler,
  updateAdminSettings_createServerFn_handler
};
