import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DkI0uzqn.mjs";
import { c as createStripeClient } from "./stripe.server-D419Yq3N.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/stripe.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
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
const BETA_LIFETIME_DISCOUNT_PERCENT = 50;
function getBetaLifetimeCouponId(env) {
  const key = env === "sandbox" ? "STRIPE_BETA_50_COUPON_SANDBOX" : "STRIPE_BETA_50_COUPON_LIVE";
  const value = process.env[key]?.trim();
  return value || null;
}
async function getBetaTesterCheckoutDiscount(userId) {
  const { data, error } = await supabaseAdmin.from("beta_testers").select("lifetime_discount_percent").eq("user_id", userId).maybeSingle();
  if (error) {
    console.error("beta_testers lookup error", error);
    return null;
  }
  if (!data) return null;
  const percent = Number(data.lifetime_discount_percent ?? BETA_LIFETIME_DISCOUNT_PERCENT);
  if (percent <= 0) return null;
  return { percent, couponId: null };
}
async function resolveBetaStripeCoupon(userId, env) {
  const benefit = await getBetaTesterCheckoutDiscount(userId);
  if (!benefit || benefit.percent <= 0) return null;
  return getBetaLifetimeCouponId(env);
}
const ALLOWED_RETURN_ORIGINS = /* @__PURE__ */ new Set(["https://netodash.com", "https://www.netodash.com", "https://netodash-v2.vercel.app", "https://netodash.lovable.app", "https://id-preview--c8da90f6-5654-47cb-a390-4f9faf5e58ee.lovable.app", "http://localhost:5173", "http://localhost:3000"]);
function assertSafeReturnUrl(input) {
  const u = new URL(input);
  const origin = `${u.protocol}//${u.host}`;
  if (!ALLOWED_RETURN_ORIGINS.has(origin)) {
    throw new Error("Disallowed returnUrl origin");
  }
  return input;
}
const Input = objectType({
  priceId: stringType().regex(/^[a-zA-Z0-9_-]+$/),
  returnUrl: stringType().url(),
  environment: enumType(["sandbox", "live"])
});
const createStripeCheckoutSession_createServerFn_handler = createServerRpc({
  id: "b87f3a8181bf6b66b6427b856356060877f64b22f9b6b9e29466a3456840001b",
  name: "createStripeCheckoutSession",
  filename: "src/lib/stripe.functions.ts"
}, (opts) => createStripeCheckoutSession.__executeServer(opts));
const createStripeCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => Input.parse(input)).handler(createStripeCheckoutSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  const userEmail = context.claims?.email;
  const stripe = createStripeClient(data.environment);
  const prices = await stripe.prices.list({
    lookup_keys: [data.priceId],
    limit: 1
  });
  if (!prices.data.length) throw new Error("Price not found");
  const stripePrice = prices.data[0];
  const isRecurring = stripePrice.type === "recurring";
  const betaCouponId = await resolveBetaStripeCoupon(userId, data.environment);
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price: stripePrice.id,
      quantity: 1
    }],
    mode: isRecurring ? "subscription" : "payment",
    ui_mode: "embedded_page",
    return_url: assertSafeReturnUrl(data.returnUrl),
    payment_method_types: ["card"],
    ...userEmail && {
      customer_email: userEmail
    },
    metadata: {
      userId,
      priceId: data.priceId
    },
    ...betaCouponId && {
      discounts: [{
        coupon: betaCouponId
      }]
    },
    ...isRecurring && {
      subscription_data: {
        metadata: {
          userId,
          priceId: data.priceId
        }
      }
    }
  });
  return session.client_secret;
});
export {
  createStripeCheckoutSession_createServerFn_handler
};
