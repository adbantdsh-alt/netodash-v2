import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DkI0uzqn.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import { c as createStripeClient } from "./stripe.server-D419Yq3N.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/stripe.mjs";
import { o as objectType, e as enumType } from "../_libs/zod.mjs";
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
import "events";
import "http";
import "https";
import "os";
const Input = objectType({
  action: enumType(["downgrade_to_pro", "downgrade_to_basic", "cancel_to_free"]),
  environment: enumType(["sandbox", "live"])
});
const DOWNGRADE_TARGET = {
  downgrade_to_pro: {
    lookupKey: "pro_monthly_v4",
    allowedFrom: ["pro"],
    // Scale → Pro uniquement
    metaPriceId: "pro_monthly_v4"
  },
  downgrade_to_basic: {
    lookupKey: "basic_monthly_v4",
    allowedFrom: ["pro", "starter"],
    // Scale ou Pro → Starter
    metaPriceId: "basic_monthly_v4"
  }
};
const changeSubscription_createServerFn_handler = createServerRpc({
  id: "56fe9073deac704664aa021f8e503cf985b8d95241d697a039bd60682ebbf2c4",
  name: "changeSubscription",
  filename: "src/lib/subscription-change.functions.ts"
}, (opts) => changeSubscription.__executeServer(opts));
const changeSubscription = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => Input.parse(input)).handler(changeSubscription_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  const {
    data: sub
  } = await supabaseAdmin.from("subscriptions").select("stripe_subscription_id, plan, status").eq("user_id", userId).maybeSingle();
  if (!sub?.stripe_subscription_id) {
    throw new Error("Aucun abonnement Stripe actif trouvé.");
  }
  const stripe = createStripeClient(data.environment);
  if (data.action === "cancel_to_free") {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true
    });
    await supabaseAdmin.from("subscriptions").update({
      cancel_at_period_end: true,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("user_id", userId);
    return {
      ok: true,
      action: "cancel_to_free"
    };
  }
  const target = DOWNGRADE_TARGET[data.action];
  if (!target.allowedFrom.includes(sub.plan)) {
    throw new Error("Ce changement n'est pas disponible depuis ton plan actuel.");
  }
  const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
  const item = stripeSub.items.data[0];
  if (!item) throw new Error("Abonnement Stripe sans item.");
  const prices = await stripe.prices.list({
    lookup_keys: [target.lookupKey],
    limit: 1
  });
  if (!prices.data.length) throw new Error("Prix cible introuvable.");
  const newPriceId = prices.data[0].id;
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    items: [{
      id: item.id,
      price: newPriceId
    }],
    proration_behavior: "create_prorations",
    metadata: {
      ...stripeSub.metadata ?? {},
      userId,
      priceId: target.metaPriceId
    }
  });
  return {
    ok: true,
    action: data.action
  };
});
export {
  changeSubscription_createServerFn_handler
};
