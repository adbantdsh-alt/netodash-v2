import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin, l as logAdminAction } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { l as loadPlanPricesUsd, e as effectivePlan, i as isActivePaidSubscription, m as mrrForPlan } from "./admin-metrics-CQ5RlFX5.mjs";
import { e as ensureRole } from "./admin-auth.types-CV1Tr_fI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
function getStatusFromMeta(meta) {
  const s = meta?.admin_status;
  return typeof s === "string" ? s : "active";
}
const listFiltersSchema = objectType({
  search: stringType().trim().max(200).optional(),
  plan: enumType(["free", "trial", "cod", "basic", "starter", "pro"]).optional(),
  status: enumType(["active", "suspended", "banned"]).optional(),
  country: stringType().max(64).optional(),
  dateFrom: stringType().optional(),
  dateTo: stringType().optional()
});
const listInput = listFiltersSchema.extend({
  page: numberType().int().min(1).max(1e4).default(1),
  pageSize: numberType().int().min(1).max(100).default(25)
}).default({
  page: 1,
  pageSize: 25
});
async function fetchAllProfiles(admin, filters) {
  const pageSize = 1e3;
  const all = [];
  for (let page = 0; page < 20; page++) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    let q = admin.from("profiles").select("id, email, display_name, first_name, last_name, country, phone, phone_country_code, created_at").order("created_at", {
      ascending: false
    }).range(from, to);
    if (filters.search && filters.search.length > 0) {
      const s = filters.search.replace(/[%_]/g, "");
      q = q.or(`email.ilike.%${s}%,display_name.ilike.%${s}%,phone.ilike.%${s}%`);
    }
    if (filters.country) q = q.eq("country", filters.country);
    if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
    if (filters.dateTo) q = q.lte("created_at", filters.dateTo);
    const {
      data,
      error
    } = await q;
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    all.push(...rows);
    if (rows.length < pageSize) break;
  }
  return all;
}
async function buildUserRows(admin, profilesRows, filters) {
  const ids = profilesRows.map((r) => r.id);
  const prices = await loadPlanPricesUsd(admin);
  const now = /* @__PURE__ */ new Date();
  const plansMap = /* @__PURE__ */ new Map();
  if (ids.length > 0) {
    const {
      data: subs
    } = await admin.from("subscriptions").select("user_id, plan, status, trial_ends_at, stripe_subscription_id").in("user_id", ids);
    for (const s of subs ?? []) {
      plansMap.set(s.user_id, s);
    }
  }
  const statusMap = /* @__PURE__ */ new Map();
  const lastLoginMap = /* @__PURE__ */ new Map();
  if (ids.length > 0) {
    const results = await Promise.all(ids.map((id) => admin.auth.admin.getUserById(id)));
    results.forEach((res, i) => {
      statusMap.set(ids[i], getStatusFromMeta(res.data.user?.user_metadata));
      lastLoginMap.set(ids[i], res.data.user?.last_sign_in_at ?? null);
    });
  }
  let users = profilesRows.map((r) => {
    const sub = plansMap.get(r.id);
    const plan = effectivePlan(sub, now);
    const code = (r.phone_country_code ?? "").trim();
    const num = (r.phone ?? "").trim();
    const fullPhone = num ? `${code} ${num}`.trim() : "";
    const mrr = sub && isActivePaidSubscription(sub, now) ? mrrForPlan(String(sub.plan), prices) : 0;
    return {
      id: r.id,
      email: r.email ?? "",
      name: r.display_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "—",
      country: r.country || "—",
      phone: fullPhone,
      phoneDigits: (code + num).replace(/[^\d]/g, ""),
      createdAt: r.created_at,
      lastLoginAt: lastLoginMap.get(r.id) ?? null,
      status: statusMap.get(r.id) ?? "active",
      plan,
      subscriptionStatus: sub?.status ?? "—",
      mrr
    };
  });
  if (filters.plan) users = users.filter((u) => u.plan === filters.plan);
  if (filters.status) users = users.filter((u) => u.status === filters.status);
  return users;
}
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "4ddda3223cc7fd896cfccaf445235784da615ff755f00b83371db7eb7d5e3a21",
  name: "adminListUsers",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => listInput.parse(input ?? {})).handler(adminListUsers_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    admin
  } = context;
  const profilesRows = await fetchAllProfiles(admin, data);
  const filtered = await buildUserRows(admin, profilesRows, data);
  const total = filtered.length;
  const from = (data.page - 1) * data.pageSize;
  const users = filtered.slice(from, from + data.pageSize);
  return {
    users,
    total,
    page: data.page,
    pageSize: data.pageSize
  };
});
const adminExportUsersCsv_createServerFn_handler = createServerRpc({
  id: "14701e35b68d6a44ad016f2a4640a10589dab467db9b1e90768582cb43ac73f7",
  name: "adminExportUsersCsv",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminExportUsersCsv.__executeServer(opts));
const adminExportUsersCsv = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => listFiltersSchema.parse(input ?? {})).handler(adminExportUsersCsv_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin", "support", "finance"]);
  const {
    admin,
    adminId,
    adminEmail
  } = context;
  const profilesRows = await fetchAllProfiles(admin, data);
  const users = await buildUserRows(admin, profilesRows, data);
  const header = ["email", "plan", "statut", "date_inscription", "derniere_connexion", "pays", "mrr_usd", "nom"];
  const escape = (v) => `"${v.replace(/"/g, '""')}"`;
  const lines = [header.join(","), ...users.map((u) => [escape(u.email), escape(u.plan), escape(u.status), escape(new Date(u.createdAt).toISOString()), escape(u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : ""), escape(u.country), String(u.mrr), escape(u.name)].join(","))];
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "users.export_csv",
    category: "users",
    details: {
      count: users.length,
      filters: data
    }
  });
  return {
    csv: lines.join("\n"),
    count: users.length
  };
});
const adminGetUserProfile_createServerFn_handler = createServerRpc({
  id: "d68579f18e40b2bd1279cef54685be15cad9e79a87ad9062cff99f3e71434007",
  name: "adminGetUserProfile",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminGetUserProfile.__executeServer(opts));
const adminGetUserProfile = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(adminGetUserProfile_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    admin
  } = context;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{
    data: profile
  }, {
    data: sub
  }, {
    data: payments
  }, {
    data: au
  }, {
    data: lastEntry
  }, {
    count: entries30d
  }] = await Promise.all([admin.from("profiles").select("*").eq("id", data.userId).maybeSingle(), admin.from("subscriptions").select("*").eq("user_id", data.userId).maybeSingle(), admin.from("payments").select("id, amount, currency, status, payment_method, created_at").eq("user_id", data.userId).order("created_at", {
    ascending: false
  }).limit(50), admin.auth.admin.getUserById(data.userId), admin.from("daily_entries").select("created_at, entry_date").eq("user_id", data.userId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle(), admin.from("daily_entries").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", data.userId).gte("created_at", thirtyDaysAgo)]);
  if (!profile) throw new Error("Utilisateur introuvable");
  const status = getStatusFromMeta(au.user?.user_metadata);
  return {
    profile,
    subscription: sub,
    payments: payments ?? [],
    lastEntry,
    entries30d: entries30d ?? 0,
    status,
    lastLoginAt: au.user?.last_sign_in_at ?? null
  };
});
async function setAdminStatus(admin, userId, status) {
  const {
    data: u
  } = await admin.auth.admin.getUserById(userId);
  const existing = u.user?.user_metadata ?? {};
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...existing,
      admin_status: status
    }
  });
}
const adminChangeUserPlan_createServerFn_handler = createServerRpc({
  id: "b8af022fd9f459dc75718c721480c729a67aff801c652116c5a587ceca388c54",
  name: "adminChangeUserPlan",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminChangeUserPlan.__executeServer(opts));
const adminChangeUserPlan = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  plan: enumType(["free", "trial", "cod", "basic", "starter", "pro"]),
  reason: stringType().trim().max(500).optional()
}).parse(input)).handler(adminChangeUserPlan_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  const {
    admin
  } = context;
  const {
    data: prof
  } = await admin.from("profiles").select("email").eq("id", data.userId).maybeSingle();
  const {
    data: existing
  } = await admin.from("subscriptions").select("plan").eq("user_id", data.userId).maybeSingle();
  const upd = data.plan === "trial" ? {
    plan: "trial",
    status: "active",
    trial_ends_at: new Date(Date.now() + 7 * 864e5).toISOString()
  } : {
    plan: data.plan,
    status: data.plan === "free" ? "canceled" : "active"
  };
  if (existing) {
    await admin.from("subscriptions").update(upd).eq("user_id", data.userId);
  } else {
    await admin.from("subscriptions").insert({
      user_id: data.userId,
      ...upd
    });
  }
  await logAdminAction({
    admin,
    adminId: context.adminId,
    adminEmail: context.adminEmail,
    action: "plan_changed",
    category: "users",
    targetUserId: data.userId,
    targetEmail: prof?.email,
    details: {
      from: existing?.plan ?? null,
      to: data.plan,
      reason: data.reason ?? null
    }
  });
  return {
    ok: true
  };
});
const GRANT_PLAN_LABELS = {
  cod: "COD",
  basic: "Starter",
  starter: "Pro",
  pro: "Scale"
};
function addDuration(base, amount, unit) {
  const next = new Date(base);
  if (unit === "days") next.setDate(next.getDate() + amount);
  else if (unit === "months") next.setMonth(next.getMonth() + amount);
  else next.setFullYear(next.getFullYear() + amount);
  return next;
}
const adminGrantFreeAccess_createServerFn_handler = createServerRpc({
  id: "0f55f3c8f1dbecc00091f83c23fcd369f16b96e7ee62009841148b4a9c875d3a",
  name: "adminGrantFreeAccess",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminGrantFreeAccess.__executeServer(opts));
const adminGrantFreeAccess = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  duration: numberType().int().min(1).max(3650),
  unit: enumType(["days", "months", "years"]),
  plan: enumType(["cod", "basic", "starter", "pro"])
}).parse(input)).handler(adminGrantFreeAccess_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  const {
    admin,
    adminId,
    adminEmail
  } = context;
  const {
    data: prof
  } = await admin.from("profiles").select("email").eq("id", data.userId).maybeSingle();
  const {
    data: existing
  } = await admin.from("subscriptions").select("trial_ends_at, current_period_end").eq("user_id", data.userId).maybeSingle();
  const now = /* @__PURE__ */ new Date();
  let baseMs = now.getTime();
  if (existing?.trial_ends_at) {
    baseMs = Math.max(baseMs, new Date(existing.trial_ends_at).getTime());
  }
  if (existing?.current_period_end) {
    baseMs = Math.max(baseMs, new Date(existing.current_period_end).getTime());
  }
  const endsAt = addDuration(new Date(baseMs), data.duration, data.unit);
  const grantedAt = now.toISOString();
  const upd = {
    plan: data.plan,
    status: "active",
    trial_ends_at: endsAt.toISOString(),
    current_period_end: endsAt.toISOString(),
    cancel_at_period_end: false
  };
  if (existing) {
    const {
      error
    } = await admin.from("subscriptions").update(upd).eq("user_id", data.userId);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await admin.from("subscriptions").insert({
      user_id: data.userId,
      ...upd
    });
    if (error) throw new Error(error.message);
  }
  const planOffert = GRANT_PLAN_LABELS[data.plan];
  const duree = data.unit === "days" ? `${data.duration} jour${data.duration > 1 ? "s" : ""}` : data.unit === "months" ? `${data.duration} mois` : `${data.duration} an${data.duration > 1 ? "s" : ""}`;
  await logAdminAction({
    admin,
    adminId,
    adminEmail,
    action: "grant_free_access",
    category: "users",
    targetUserId: data.userId,
    targetEmail: prof?.email,
    details: {
      admin_email: adminEmail,
      user_email: prof?.email ?? null,
      plan_offert: planOffert,
      plan: data.plan,
      duree,
      duration: data.duration,
      unit: data.unit,
      date: grantedAt,
      ends_at: endsAt.toISOString()
    }
  });
  return {
    ok: true,
    endsAt: endsAt.toISOString(),
    planOffert,
    duree
  };
});
const adminSuspendUser_createServerFn_handler = createServerRpc({
  id: "f4507fc4122441b3575cf9b73e5fe53407792607753188d5d4e6289f3da8ab26",
  name: "adminSuspendUser",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminSuspendUser.__executeServer(opts));
const adminSuspendUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  reason: stringType().trim().min(3).max(500)
}).parse(input)).handler(adminSuspendUser_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  const {
    admin
  } = context;
  const {
    data: prof
  } = await admin.from("profiles").select("email").eq("id", data.userId).maybeSingle();
  await setAdminStatus(admin, data.userId, "suspended");
  await admin.auth.admin.signOut(data.userId);
  await logAdminAction({
    admin,
    adminId: context.adminId,
    adminEmail: context.adminEmail,
    action: "user_suspended",
    category: "users",
    targetUserId: data.userId,
    targetEmail: prof?.email,
    details: {
      reason: data.reason
    }
  });
  return {
    ok: true
  };
});
const adminUnsuspendUser_createServerFn_handler = createServerRpc({
  id: "0abe4e6b014453ad2f6ad3d271513a4cfd513e0bc51dfe6aa18f813dbcc2b474",
  name: "adminUnsuspendUser",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminUnsuspendUser.__executeServer(opts));
const adminUnsuspendUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(adminUnsuspendUser_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  await setAdminStatus(context.admin, data.userId, "active");
  await logAdminAction({
    admin: context.admin,
    adminId: context.adminId,
    adminEmail: context.adminEmail,
    action: "user_unsuspended",
    category: "users",
    targetUserId: data.userId
  });
  return {
    ok: true
  };
});
const adminBanUser_createServerFn_handler = createServerRpc({
  id: "5d723d5e58621c64ce574c1ffe373b6d2c7e384ac0076a218480b394e365fdd1",
  name: "adminBanUser",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminBanUser.__executeServer(opts));
const adminBanUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  reason: stringType().trim().min(3).max(500)
}).parse(input)).handler(adminBanUser_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin"]);
  const {
    admin
  } = context;
  const {
    data: prof
  } = await admin.from("profiles").select("email").eq("id", data.userId).maybeSingle();
  await setAdminStatus(admin, data.userId, "banned");
  await admin.auth.admin.signOut(data.userId);
  await logAdminAction({
    admin,
    adminId: context.adminId,
    adminEmail: context.adminEmail,
    action: "user_banned",
    category: "users",
    targetUserId: data.userId,
    targetEmail: prof?.email,
    details: {
      reason: data.reason
    }
  });
  return {
    ok: true
  };
});
const adminDeleteUserData_createServerFn_handler = createServerRpc({
  id: "cadd68642b9f8a66e68cdc51fc663cc4f87499ea261d5df5ea531a4c8141886f",
  name: "adminDeleteUserData",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminDeleteUserData.__executeServer(opts));
const adminDeleteUserData = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(adminDeleteUserData_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin"]);
  const {
    admin
  } = context;
  if (data.userId === context.adminId) {
    throw new Error("Tu ne peux pas te supprimer toi-même.");
  }
  const {
    data: prof
  } = await admin.from("profiles").select("email").eq("id", data.userId).maybeSingle();
  const tables = ["creative_performance", "creatives", "daily_entries", "products", "coach_usage", "payments", "subscriptions", "affiliate_referrals", "user_roles", "shopify_connections"];
  await Promise.all(tables.map((t) => admin.from(t).delete().eq("user_id", data.userId)));
  await admin.from("profiles").delete().eq("id", data.userId);
  await admin.auth.admin.deleteUser(data.userId);
  await logAdminAction({
    admin,
    adminId: context.adminId,
    adminEmail: context.adminEmail,
    action: "user_deleted_rgpd",
    category: "users",
    targetUserId: data.userId,
    targetEmail: prof?.email
  });
  return {
    ok: true
  };
});
const adminImpersonateUser_createServerFn_handler = createServerRpc({
  id: "9ed8d2761b13b6db36828190617ee2af63d34ad3aa9ad5a1d21a49a50fb1712a",
  name: "adminImpersonateUser",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => adminImpersonateUser.__executeServer(opts));
const adminImpersonateUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(adminImpersonateUser_createServerFn_handler, async ({
  context,
  data
}) => {
  ensureRole(context.adminRole, ["super_admin", "support"]);
  const {
    admin
  } = context;
  const {
    data: prof
  } = await admin.from("profiles").select("email").eq("id", data.userId).maybeSingle();
  if (!prof?.email) throw new Error("Utilisateur introuvable");
  const {
    data: u
  } = await admin.auth.admin.getUserById(data.userId);
  const existingMeta = u.user?.user_metadata ?? {};
  await admin.auth.admin.updateUserById(data.userId, {
    user_metadata: {
      ...existingMeta,
      impersonated_by: context.adminEmail,
      impersonated_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
  const {
    data: link,
    error
  } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: String(prof.email)
  });
  if (error) throw new Error(error.message);
  await logAdminAction({
    admin,
    adminId: context.adminId,
    adminEmail: context.adminEmail,
    action: "impersonation_started",
    category: "security",
    targetUserId: data.userId,
    targetEmail: String(prof.email)
  });
  return {
    link: link.properties?.action_link ?? null,
    userEmail: prof.email,
    adminEmail: context.adminEmail
  };
});
const stopImpersonation_createServerFn_handler = createServerRpc({
  id: "e5f5ac0d97eb69dbe0375830d4ad2a7920ff5fdcc77d53cab8d10dcee047fb98",
  name: "stopImpersonation",
  filename: "src/lib/admin/users.functions.ts"
}, (opts) => stopImpersonation.__executeServer(opts));
const stopImpersonation = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(stopImpersonation_createServerFn_handler, async ({
  data
}) => {
  const {
    createClient
  } = await import("../_libs/supabase__supabase-js.mjs");
  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const {
    data: u
  } = await admin.auth.admin.getUserById(data.userId);
  const meta = u.user?.user_metadata ?? {};
  delete meta.impersonated_by;
  delete meta.impersonated_at;
  await admin.auth.admin.updateUserById(data.userId, {
    user_metadata: meta
  });
  return {
    ok: true
  };
});
export {
  adminBanUser_createServerFn_handler,
  adminChangeUserPlan_createServerFn_handler,
  adminDeleteUserData_createServerFn_handler,
  adminExportUsersCsv_createServerFn_handler,
  adminGetUserProfile_createServerFn_handler,
  adminGrantFreeAccess_createServerFn_handler,
  adminImpersonateUser_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminSuspendUser_createServerFn_handler,
  adminUnsuspendUser_createServerFn_handler,
  stopImpersonation_createServerFn_handler
};
