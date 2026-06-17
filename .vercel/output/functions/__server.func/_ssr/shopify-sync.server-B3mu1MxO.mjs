import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import { createHmac, timingSafeEqual } from "crypto";
const SHOPIFY_SCOPES = "read_orders,read_products";
const SHOPIFY_API_VERSION = "2024-10";
function getClientCreds() {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Shopify credentials missing");
  return { clientId, clientSecret };
}
function getStateSecret() {
  const s = process.env.SHOPIFY_OAUTH_STATE_SECRET;
  if (!s) throw new Error("SHOPIFY_OAUTH_STATE_SECRET missing");
  return s;
}
function normalizeShopDomain(input) {
  if (!input) return null;
  let s = input.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!s.endsWith(".myshopify.com")) {
    if (/^[a-z0-9][a-z0-9-]*$/.test(s)) s = `${s}.myshopify.com`;
    else return null;
  }
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(s)) return null;
  return s;
}
function signState(userId) {
  const nonce = crypto.randomUUID();
  const payload = `${userId}.${nonce}.${Date.now()}`;
  const sig = createHmac("sha256", getStateSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}
function verifyState(state) {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length !== 4) return null;
    const [userId, nonce, ts, sig] = parts;
    const payload = `${userId}.${nonce}.${ts}`;
    const expected = createHmac("sha256", getStateSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    if (Date.now() - Number(ts) > 60 * 60 * 1e3) return null;
    return { userId };
  } catch {
    return null;
  }
}
function verifyShopifyHmac(query) {
  const hmac = query.get("hmac");
  if (!hmac) return false;
  const params = [];
  query.forEach((value, key) => {
    if (key === "hmac" || key === "signature") return;
    params.push(`${key}=${value}`);
  });
  params.sort();
  const message = params.join("&");
  const { clientSecret } = getClientCreds();
  const computed = createHmac("sha256", clientSecret).update(message).digest("hex");
  try {
    const a = Buffer.from(hmac);
    const b = Buffer.from(computed);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
function buildAuthorizeUrl(shop, state, redirectUri) {
  const { clientId } = getClientCreds();
  const u = new URL(`https://${shop}/admin/oauth/authorize`);
  u.searchParams.set("client_id", clientId);
  u.searchParams.set("scope", SHOPIFY_SCOPES);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);
  return u.toString();
}
async function exchangeCodeForToken(shop, code) {
  const { clientId, clientSecret } = getClientCreds();
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}
async function shopifyFetch(shop, accessToken, path) {
  const res = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}${path}`, {
    headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Shopify API ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}
async function getShopInfo(shop, accessToken) {
  const data = await shopifyFetch(shop, accessToken, "/shop.json");
  return data.shop;
}
async function fetchAllShopifyProducts(shop, accessToken) {
  const out = [];
  let pageInfo = null;
  for (let i = 0; i < 20; i++) {
    const qs = pageInfo ? `?limit=250&page_info=${encodeURIComponent(pageInfo)}` : `?limit=250`;
    const res = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products.json${qs}`, {
      headers: { "X-Shopify-Access-Token": accessToken }
    });
    if (!res.ok) throw new Error(`Shopify products ${res.status} ${await res.text()}`);
    const data = await res.json();
    for (const p of data.products ?? []) {
      out.push({
        id: p.id,
        title: p.title,
        image: p.image?.src ?? p.images?.[0]?.src ?? void 0,
        variants: p.variants ?? []
      });
    }
    const link = res.headers.get("link") ?? res.headers.get("Link");
    const m = link ? link.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/) : null;
    if (!m) break;
    pageInfo = m[1];
  }
  return out;
}
async function fetchOrdersAggregated(shop, accessToken, sinceISO) {
  const byDate = {};
  const byProductDate = {};
  let totalOrders = 0;
  let pageInfo = null;
  for (let i = 0; i < 20; i++) {
    const qs = pageInfo ? `?limit=250&page_info=${encodeURIComponent(pageInfo)}&status=any` : `?limit=250&status=any&created_at_min=${encodeURIComponent(sinceISO)}`;
    const res = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json${qs}`, {
      headers: { "X-Shopify-Access-Token": accessToken }
    });
    if (!res.ok) throw new Error(`Shopify orders ${res.status} ${await res.text()}`);
    const data = await res.json();
    const orders = data.orders ?? [];
    for (const o of orders) {
      const d = o.created_at.slice(0, 10);
      const isCancelled = !!o.cancelled_at || o.financial_status === "voided";
      const isFullyRefunded = o.financial_status === "refunded";
      const gross = Number(o.total_price ?? 0);
      const grossNet = Number(o.current_total_price ?? o.total_price ?? 0);
      const tax = Number(o.current_total_tax ?? o.total_tax ?? 0);
      const shipping = Number(
        o.total_shipping_price_set?.shop_money?.amount ?? o.shipping_lines?.reduce?.((s, l) => s + Number(l.price ?? 0), 0) ?? 0
      );
      const orderNet = Math.max(0, grossNet - tax - shipping);
      const refundedAmountOrder = Math.max(0, gross - grossNet);
      byDate[d] ||= { orders: 0, revenue: 0, refundedOrders: 0, refundedAmount: 0, cancelledOrders: 0 };
      if (isCancelled) {
        byDate[d].cancelledOrders += 1;
        continue;
      }
      if (isFullyRefunded) {
        byDate[d].refundedOrders += 1;
        byDate[d].refundedAmount += gross;
      } else {
        byDate[d].orders += 1;
        byDate[d].revenue += orderNet;
        if (refundedAmountOrder > 0) byDate[d].refundedAmount += refundedAmountOrder;
        totalOrders += 1;
      }
      const seenForOrder = /* @__PURE__ */ new Set();
      for (const li of o.line_items ?? []) {
        const name = String(li.title ?? "").trim().toLowerCase();
        if (!name) continue;
        const origQty = Number(li.quantity ?? 0);
        const qty = Number(li.current_quantity ?? li.quantity ?? 0);
        const unitPrice = Number(li.price ?? 0);
        const discount = (li.discount_allocations ?? []).reduce(
          (s, da) => s + Number(da.amount ?? 0),
          0
        );
        byProductDate[name] ||= {};
        byProductDate[name][d] ||= { orders: 0, units: 0, revenue: 0, refundedOrders: 0, refundedAmount: 0 };
        const bucket = byProductDate[name][d];
        if (isFullyRefunded) {
          if (!seenForOrder.has(name)) {
            bucket.refundedOrders += 1;
            seenForOrder.add(name);
          }
          bucket.refundedAmount += unitPrice * origQty;
          continue;
        }
        if (qty > 0) {
          if (!seenForOrder.has(name)) {
            bucket.orders += 1;
            seenForOrder.add(name);
          }
          bucket.units += qty;
          bucket.revenue += Math.max(0, unitPrice * qty - discount);
        }
        const refundedQty = Math.max(0, origQty - qty);
        if (refundedQty > 0) {
          bucket.refundedAmount += unitPrice * refundedQty;
        }
      }
    }
    const link = res.headers.get("link") ?? res.headers.get("Link");
    const m = link ? link.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/) : null;
    if (!m) break;
    pageInfo = m[1];
  }
  return { byDate, byProductDate, totalOrders };
}
async function runShopifySyncForUser(userId, daysBack) {
  const { data: conn } = await supabaseAdmin.from("shopify_connections").select("shop_domain, access_token, currency").eq("user_id", userId).eq("active", true).maybeSingle();
  if (!conn) throw new Error("Aucune boutique Shopify connectée.");
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1e3).toISOString();
  try {
    const shopifyProducts = await fetchAllShopifyProducts(conn.shop_domain, conn.access_token);
    const currency = conn.currency || "USD";
    const { data: existingProducts } = await supabaseAdmin.from("products").select("id, name").eq("user_id", userId);
    const byNorm = {};
    for (const p of existingProducts ?? []) byNorm[p.name.trim().toLowerCase()] = p.id;
    let createdCount = 0;
    let imageUpdated = 0;
    for (const sp of shopifyProducts) {
      const name = String(sp.title ?? "").trim();
      if (!name) continue;
      const norm = name.toLowerCase();
      const image = sp.image ?? null;
      if (byNorm[norm]) {
        if (image) {
          const { data: existing } = await supabaseAdmin.from("products").select("image_url").eq("id", byNorm[norm]).maybeSingle();
          if (existing && !existing.image_url) {
            await supabaseAdmin.from("products").update({ image_url: image }).eq(
              "id",
              byNorm[norm]
            );
            imageUpdated += 1;
          }
        }
        continue;
      }
      const price = Number(sp.variants?.[0]?.price ?? 0);
      const { data: ins } = await supabaseAdmin.from("products").insert({
        user_id: userId,
        name,
        sale_price: price,
        cost_price: 0,
        shopify_shop_domain: conn.shop_domain,
        shopify_product_match: String(sp.id),
        image_url: image,
        currency
      }).select("id").single();
      if (ins) {
        byNorm[norm] = ins.id;
        createdCount += 1;
      }
    }
    const { byDate, byProductDate, totalOrders } = await fetchOrdersAggregated(
      conn.shop_domain,
      conn.access_token,
      since
    );
    const allDates = /* @__PURE__ */ new Set();
    for (const dateMap of Object.values(byProductDate)) {
      for (const d of Object.keys(dateMap)) allDates.add(d);
    }
    const dateList = Array.from(allDates);
    const existingEntries = dateList.length ? (await supabaseAdmin.from("daily_entries").select("id, product_id, entry_date, ad_budget_currency").eq("user_id", userId).in("entry_date", dateList)).data ?? [] : [];
    const entryKey = (productId, date) => `${productId}|${date}`;
    const existingMap = /* @__PURE__ */ new Map();
    for (const e of existingEntries) {
      existingMap.set(entryKey(e.product_id, e.entry_date), {
        id: e.id,
        ad_budget_currency: e.ad_budget_currency ?? null
      });
    }
    const rowsToUpsert = [];
    let matched = 0;
    for (const [name, dateMap] of Object.entries(byProductDate)) {
      let productId = byNorm[name];
      if (!productId) {
        const { data: ins } = await supabaseAdmin.from("products").insert({
          user_id: userId,
          name,
          sale_price: 0,
          cost_price: 0,
          shopify_shop_domain: conn.shop_domain,
          currency
        }).select("id").single();
        if (!ins) continue;
        productId = ins.id;
        byNorm[name] = productId;
        createdCount += 1;
      }
      matched += 1;
      for (const [date, agg] of Object.entries(dateMap)) {
        const dateAgg = byDate[date];
        const existing = existingMap.get(entryKey(productId, date));
        rowsToUpsert.push({
          user_id: userId,
          product_id: productId,
          entry_date: date,
          ad_budget_currency: existing?.ad_budget_currency ?? currency,
          shopify_orders: agg.orders,
          total_revenue: agg.revenue,
          total_revenue_currency: currency,
          refunded_amount: agg.refundedAmount ?? 0,
          refunded_orders: dateAgg?.refundedOrders ?? 0
        });
      }
    }
    if (rowsToUpsert.length > 0) {
      const { error: upsertErr } = await supabaseAdmin.from("daily_entries").upsert(rowsToUpsert, { onConflict: "user_id,product_id,entry_date" });
      if (upsertErr) throw new Error(upsertErr.message);
    }
    await supabaseAdmin.from("shopify_connections").update({
      last_sync_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_sync_status: "ok",
      last_sync_message: `${totalOrders} commandes / ${matched} produits matchés / ${createdCount} créés`
    }).eq("user_id", userId);
    return {
      success: true,
      ordersImported: totalOrders,
      productsMatched: matched,
      productsCreated: createdCount,
      currency,
      dates: Object.keys(byDate).length
    };
  } catch (err) {
    await supabaseAdmin.from("shopify_connections").update({
      last_sync_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_sync_status: "error",
      last_sync_message: String(err?.message ?? err).slice(0, 500)
    }).eq("user_id", userId);
    throw err;
  }
}
async function persistConnection(params) {
  let shopInfo = {};
  try {
    shopInfo = await getShopInfo(params.shop, params.accessToken);
  } catch {
  }
  const row = {
    user_id: params.userId,
    shop_domain: params.shop,
    access_token: params.accessToken,
    scopes: params.scope,
    shop_name: shopInfo?.name ?? null,
    currency: shopInfo?.currency ?? null,
    active: true,
    connected_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { data: existing } = await supabaseAdmin.from("shopify_connections").select("id").eq("user_id", params.userId).maybeSingle();
  if (existing) {
    await supabaseAdmin.from("shopify_connections").update(row).eq("id", existing.id);
  } else {
    await supabaseAdmin.from("shopify_connections").insert(row);
  }
}
export {
  verifyState as a,
  buildAuthorizeUrl as b,
  exchangeCodeForToken as e,
  fetchOrdersAggregated as f,
  getShopInfo as g,
  normalizeShopDomain as n,
  persistConnection as p,
  runShopifySyncForUser as r,
  signState as s,
  verifyShopifyHmac as v
};
