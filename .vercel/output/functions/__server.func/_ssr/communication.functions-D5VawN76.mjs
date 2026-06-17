import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType, b as booleanType } from "../_libs/zod.mjs";
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
const audienceEnum = enumType(["all", "free", "trial", "paying", "cod", "basic", "starter", "pro"]);
const severityEnum = enumType(["info", "success", "warning", "critical"]);
const listAnnouncements_createServerFn_handler = createServerRpc({
  id: "241d699abef9ad38693e90f4a23654bdaf183f9cd8b7e5fa7be64f7da48a364e",
  name: "listAnnouncements",
  filename: "src/lib/admin/communication.functions.ts"
}, (opts) => listAnnouncements.__executeServer(opts));
const listAnnouncements = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(listAnnouncements_createServerFn_handler, async ({
  context
}) => {
  const {
    admin
  } = context;
  const {
    data,
    error
  } = await admin.from("announcements").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const upsertAnnouncement_createServerFn_handler = createServerRpc({
  id: "126e9bbed1bebad7af673670f77f32a8c0e15f2e282a9e4f0aaf62ddaeea5b8f",
  name: "upsertAnnouncement",
  filename: "src/lib/admin/communication.functions.ts"
}, (opts) => upsertAnnouncement.__executeServer(opts));
const upsertAnnouncement = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid().optional(),
  title: stringType().min(2).max(200),
  body: stringType().min(2).max(2e3),
  severity: severityEnum.default("info"),
  audience: audienceEnum.default("all"),
  cta_label: stringType().max(80).nullable().optional(),
  cta_url: stringType().url().nullable().optional(),
  active: booleanType().default(true),
  starts_at: stringType(),
  ends_at: stringType().nullable().optional()
})).handler(upsertAnnouncement_createServerFn_handler, async ({
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
  const payload = {
    title: data.title,
    body: data.body,
    severity: data.severity,
    audience: data.audience,
    cta_label: data.cta_label ?? null,
    cta_url: data.cta_url ?? null,
    active: data.active,
    starts_at: data.starts_at,
    ends_at: data.ends_at ?? null,
    created_by: adminId
  };
  if (data.id) {
    const {
      error
    } = await admin.from("announcements").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "announcement.update",
      category: "communication",
      details: {
        id: data.id,
        title: data.title,
        audience: data.audience
      }
    });
    return {
      ok: true,
      id: data.id
    };
  } else {
    const {
      data: created,
      error
    } = await admin.from("announcements").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    const id = created.id;
    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "announcement.create",
      category: "communication",
      details: {
        id,
        title: data.title,
        audience: data.audience
      }
    });
    return {
      ok: true,
      id
    };
  }
});
const toggleAnnouncement_createServerFn_handler = createServerRpc({
  id: "56c20b1f8d8e8a1b6787e14f45a4136019550611eccc493f5e36acb06458df12",
  name: "toggleAnnouncement",
  filename: "src/lib/admin/communication.functions.ts"
}, (opts) => toggleAnnouncement.__executeServer(opts));
const toggleAnnouncement = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid(),
  active: booleanType()
})).handler(toggleAnnouncement_createServerFn_handler, async ({
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
    error
  } = await admin.from("announcements").update({
    active: data.active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: data.active ? "announcement.activate" : "announcement.deactivate",
    category: "communication",
    details: {
      id: data.id
    }
  });
  return {
    ok: true
  };
});
const deleteAnnouncement_createServerFn_handler = createServerRpc({
  id: "870742c0e557302ed8c92274157631a22b91007163bbbf87e41d1fdc08c7db25",
  name: "deleteAnnouncement",
  filename: "src/lib/admin/communication.functions.ts"
}, (opts) => deleteAnnouncement.__executeServer(opts));
const deleteAnnouncement = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(deleteAnnouncement_createServerFn_handler, async ({
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
    error
  } = await admin.from("announcements").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "announcement.delete",
    category: "communication",
    details: {
      id: data.id
    }
  });
  return {
    ok: true
  };
});
export {
  deleteAnnouncement_createServerFn_handler,
  listAnnouncements_createServerFn_handler,
  toggleAnnouncement_createServerFn_handler,
  upsertAnnouncement_createServerFn_handler
};
