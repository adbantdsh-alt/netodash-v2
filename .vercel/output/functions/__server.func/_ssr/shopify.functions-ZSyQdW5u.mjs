import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DkI0uzqn.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import { r as runShopifySyncForUser, g as getShopInfo, f as fetchOrdersAggregated } from "./shopify-sync.server-B3mu1MxO.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
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
const getShopifyConnection_createServerFn_handler = createServerRpc({
  id: "cf38a71d99c4c81d8bccbb5e36770a8524be720eda805da1fbfe172b56c050d8",
  name: "getShopifyConnection",
  filename: "src/lib/shopify.functions.ts"
}, (opts) => getShopifyConnection.__executeServer(opts));
const getShopifyConnection = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getShopifyConnection_createServerFn_handler, async ({
  context
}) => {
  const userId = context.userId;
  const {
    data
  } = await supabaseAdmin.from("shopify_connections").select("shop_domain, shop_name, currency, connected_at, last_sync_at, last_sync_status, last_sync_message, active").eq("user_id", userId).maybeSingle();
  return data ?? null;
});
const disconnectShopify_createServerFn_handler = createServerRpc({
  id: "1cf56287c5cb0a52eba05bdb0e899290af3abaa3688e5d31a5d5d778c5c82b08",
  name: "disconnectShopify",
  filename: "src/lib/shopify.functions.ts"
}, (opts) => disconnectShopify.__executeServer(opts));
const disconnectShopify = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(disconnectShopify_createServerFn_handler, async ({
  context
}) => {
  const userId = context.userId;
  await supabaseAdmin.from("shopify_connections").delete().eq("user_id", userId);
  return {
    success: true
  };
});
const syncShopifyOrdersNow_createServerFn_handler = createServerRpc({
  id: "57f92a2f021219b5367eb28c59b73569a7bba6aec269df85b79908498e41fc80",
  name: "syncShopifyOrdersNow",
  filename: "src/lib/shopify.functions.ts"
}, (opts) => syncShopifyOrdersNow.__executeServer(opts));
const syncShopifyOrdersNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  daysBack: numberType().int().min(1).max(60).default(7)
}).parse(input ?? {})).handler(syncShopifyOrdersNow_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  return runShopifySyncForUser(userId, data.daysBack);
});
const previewShopifySync_createServerFn_handler = createServerRpc({
  id: "b135dd428bbc14378fde0a87a1822342f1c71cfe06cf72b2c439f8ff4ce649b8",
  name: "previewShopifySync",
  filename: "src/lib/shopify.functions.ts"
}, (opts) => previewShopifySync.__executeServer(opts));
const previewShopifySync = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  from: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: stringType().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(previewShopifySync_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  const {
    data: conn
  } = await supabaseAdmin.from("shopify_connections").select("shop_domain, access_token, currency, shop_name").eq("user_id", userId).eq("active", true).maybeSingle();
  if (!conn) throw new Error("Aucune boutique Shopify connectée.");
  let liveCurrency = conn.currency ?? null;
  let liveShopName = conn.shop_name ?? null;
  try {
    const info = await getShopInfo(conn.shop_domain, conn.access_token);
    liveCurrency = info.currency || liveCurrency;
    liveShopName = info.name || liveShopName;
    if (info.currency && info.currency !== conn.currency) {
      await supabaseAdmin.from("shopify_connections").update({
        currency: info.currency,
        shop_name: info.name ?? conn.shop_name
      }).eq("user_id", userId);
    }
  } catch {
  }
  const sinceISO = (/* @__PURE__ */ new Date(`${data.from}T00:00:00Z`)).toISOString();
  const {
    byDate,
    byProductDate
  } = await fetchOrdersAggregated(conn.shop_domain, conn.access_token, sinceISO);
  const inRange = (d) => d >= data.from && d <= data.to;
  const {
    data: userProducts
  } = await supabaseAdmin.from("products").select("id, name, currency").eq("user_id", userId);
  const productByNorm = {};
  for (const p of userProducts ?? []) {
    productByNorm[p.name.trim().toLowerCase()] = p;
  }
  const drafts = [];
  const allDates = /* @__PURE__ */ new Set();
  for (const [name, dateMap] of Object.entries(byProductDate)) {
    let orders = 0;
    let units = 0;
    let revenue = 0;
    let refundedOrders = 0;
    let refundedAmount = 0;
    const byDateDraft = {};
    for (const [d, agg] of Object.entries(dateMap)) {
      if (!inRange(d)) continue;
      orders += agg.orders;
      units += agg.units;
      revenue += agg.revenue;
      refundedOrders += agg.refundedOrders;
      refundedAmount += agg.refundedAmount;
      byDateDraft[d] = {
        orders: agg.orders,
        units: agg.units,
        revenue: Math.round(agg.revenue * 100) / 100,
        refundedOrders: agg.refundedOrders,
        refundedAmount: Math.round(agg.refundedAmount * 100) / 100
      };
      allDates.add(d);
    }
    if (orders === 0 && revenue === 0 && refundedOrders === 0 && refundedAmount === 0) continue;
    const match = productByNorm[name];
    drafts.push({
      shopifyTitle: name,
      matchedProductId: match?.id ?? null,
      matchedProductName: match?.name ?? null,
      orders,
      units,
      revenue: Math.round(revenue * 100) / 100,
      refundedOrders,
      refundedAmount: Math.round(refundedAmount * 100) / 100,
      byDate: byDateDraft
    });
  }
  let refundedOrdersTotal = 0;
  let cancelledOrders = 0;
  for (const [d, agg] of Object.entries(byDate)) {
    if (!inRange(d)) continue;
    refundedOrdersTotal += agg.refundedOrders;
    cancelledOrders += agg.cancelledOrders;
  }
  return {
    shopName: liveShopName ?? conn.shop_domain,
    shopDomain: conn.shop_domain,
    currency: liveCurrency ?? "USD",
    from: data.from,
    to: data.to,
    drafts: drafts.sort((a, b) => b.orders - a.orders),
    refundedOrders: refundedOrdersTotal,
    cancelledOrders,
    availableDates: Array.from(allDates).sort()
  };
});
export {
  disconnectShopify_createServerFn_handler,
  getShopifyConnection_createServerFn_handler,
  previewShopifySync_createServerFn_handler,
  syncShopifyOrdersNow_createServerFn_handler
};
