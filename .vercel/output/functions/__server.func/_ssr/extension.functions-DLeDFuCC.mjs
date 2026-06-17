import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
function readSettings(raw) {
  const s = raw ?? {};
  return {
    cwsUrl: String(s["extension.cws_url"] ?? ""),
    cwsInstalls: Number(s["extension.cws_installs"] ?? 0) || 0,
    publishedVersion: String(s["extension.published_version"] ?? "—"),
    extensionId: String(s["extension.extension_id"] ?? "")
  };
}
const adminGetExtensionOverview_createServerFn_handler = createServerRpc({
  id: "add260f274306d96279d15f928ebd8e7779cad0a3856b22eda388edc5516e846",
  name: "adminGetExtensionOverview",
  filename: "src/lib/admin/extension.functions.ts"
}, (opts) => adminGetExtensionOverview.__executeServer(opts));
const adminGetExtensionOverview = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(adminGetExtensionOverview_createServerFn_handler, async ({
  context
}) => {
  ensureRole(context.adminRole, ["super_admin", "support", "finance"]);
  const {
    admin
  } = context;
  const {
    data,
    error
  } = await admin.rpc("get_extension_admin_stats");
  if (error) {
    const msg = error.message ?? "";
    if (/extension_events|get_extension_admin_stats|schema cache|PGRST205/i.test(msg)) {
      throw new Error("Tables extension absentes en base. Applique la migration 20260616120000_extension_analytics.sql puis recharge.");
    }
    throw new Error(msg);
  }
  const raw = data ?? {};
  const settings = readSettings(raw.settings);
  return {
    ...settings,
    trackedUsersTotal: Number(raw.tracked_users_total ?? 0),
    trackedUsers7d: Number(raw.tracked_users_7d ?? 0),
    trackedUsers30d: Number(raw.tracked_users_30d ?? 0),
    eventsTotal: Number(raw.events_total ?? 0),
    opensToday: Number(raw.opens_today ?? 0),
    opens7d: Number(raw.opens_7d ?? 0),
    captures7d: Number(raw.captures_7d ?? 0),
    ctaClicks7d: Number(raw.cta_clicks_7d ?? 0),
    recalc7d: Number(raw.recalc_7d ?? 0),
    siteSignupsExtension: Number(raw.site_signups_extension ?? 0),
    byVersion: (raw.by_version ?? []).map((v) => ({
      version: String(v.version),
      cnt: Number(v.cnt ?? 0)
    })),
    dailyOpens: (raw.daily_opens ?? []).map((d) => ({
      day: String(d.day),
      opens: Number(d.opens ?? 0)
    })),
    recentEvents: (raw.recent_events ?? []).map((e) => ({
      id: String(e.id),
      clientId: String(e.client_id),
      eventType: String(e.event_type),
      extensionVersion: e.extension_version ?? null,
      createdAt: String(e.created_at)
    }))
  };
});
const adminUpdateExtensionSettings_createServerFn_handler = createServerRpc({
  id: "b22b3936379403e45a8c2fa2ca9352b1e5a80669b17fca307e2c9632c0e8a400",
  name: "adminUpdateExtensionSettings",
  filename: "src/lib/admin/extension.functions.ts"
}, (opts) => adminUpdateExtensionSettings.__executeServer(opts));
const adminUpdateExtensionSettings = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  cwsInstalls: numberType().int().min(0).max(1e7).optional(),
  cwsUrl: stringType().url().max(500).optional(),
  publishedVersion: stringType().min(1).max(32).optional()
})).handler(adminUpdateExtensionSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  const {
    admin,
    adminId,
    adminEmail
  } = context;
  const rows = [];
  if (data.cwsInstalls !== void 0) {
    rows.push({
      key: "extension.cws_installs",
      value: String(data.cwsInstalls)
    });
  }
  if (data.cwsUrl !== void 0) {
    rows.push({
      key: "extension.cws_url",
      value: data.cwsUrl
    });
  }
  if (data.publishedVersion !== void 0) {
    rows.push({
      key: "extension.published_version",
      value: data.publishedVersion
    });
  }
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
    action: "extension.settings.update",
    category: "extension",
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
  adminGetExtensionOverview_createServerFn_handler,
  adminUpdateExtensionSettings_createServerFn_handler
};
