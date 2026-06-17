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
const adminGetBetaProgram_createServerFn_handler = createServerRpc({
  id: "80885401ec1500b51bd0c1e4a8ee09e0edcc0d7314b235192e5e1476eb349b95",
  name: "adminGetBetaProgram",
  filename: "src/lib/admin/beta.functions.ts"
}, (opts) => adminGetBetaProgram.__executeServer(opts));
const adminGetBetaProgram = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(adminGetBetaProgram_createServerFn_handler, async ({
  context
}) => {
  ensureRole(context.adminRole, ["super_admin", "support", "finance"]);
  const {
    admin
  } = context;
  const [{
    data: testers,
    error: tErr
  }, {
    data: waitlist,
    error: wErr
  }, statusRes] = await Promise.all([admin.from("beta_testers").select("id, email, full_name, user_id, status, free_until, lifetime_discount_percent, created_at").order("created_at", {
    ascending: false
  }), admin.from("beta_waitlist").select("id, email, full_name, created_at").order("created_at", {
    ascending: false
  }), admin.rpc("get_beta_program_status")]);
  if (tErr) {
    const msg = tErr.message ?? "";
    if (/beta_testers|schema cache|PGRST205/i.test(msg)) {
      throw new Error("La table beta_testers est absente en base. Applique les migrations Supabase (supabase db push) puis recharge la page.");
    }
    throw new Error(msg);
  }
  if (wErr) {
    const msg = wErr.message ?? "";
    if (/beta_waitlist|schema cache|PGRST205/i.test(msg)) {
      throw new Error("La table beta_waitlist est absente en base. Applique les migrations Supabase (supabase db push) puis recharge la page.");
    }
    throw new Error(msg);
  }
  const userIds = (testers ?? []).map((t) => t.user_id).filter((id) => !!id);
  let subsByUser = /* @__PURE__ */ new Map();
  if (userIds.length > 0) {
    const {
      data: subs
    } = await admin.from("subscriptions").select("user_id, plan, trial_ends_at").in("user_id", userIds);
    for (const s of subs ?? []) {
      subsByUser.set(s.user_id, {
        plan: s.plan,
        trial_ends_at: s.trial_ends_at
      });
    }
  }
  const statusRaw = statusRes.data ?? {};
  return {
    maxSpots: Number(statusRaw.max_spots ?? 10),
    betaCount: Number(statusRaw.beta_count ?? 0),
    waitlistCount: Number(statusRaw.waitlist_count ?? 0),
    spotsLeft: Number(statusRaw.spots_left ?? 0),
    betaFull: !!statusRaw.beta_full,
    testers: (testers ?? []).map((t) => {
      const uid = t.user_id;
      const sub = uid ? subsByUser.get(uid) : void 0;
      return {
        id: t.id,
        email: t.email,
        fullName: t.full_name,
        userId: uid,
        status: t.status ?? "active",
        freeUntil: t.free_until ?? null,
        lifetimeDiscountPercent: Number(t.lifetime_discount_percent ?? 50),
        createdAt: t.created_at,
        hasAccount: !!uid,
        plan: sub?.plan ?? null,
        trialEndsAt: sub?.trial_ends_at ?? null
      };
    }),
    waitlist: (waitlist ?? []).map((w) => ({
      id: w.id,
      email: w.email,
      fullName: w.full_name ?? null,
      createdAt: w.created_at
    }))
  };
});
export {
  adminGetBetaProgram_createServerFn_handler
};
