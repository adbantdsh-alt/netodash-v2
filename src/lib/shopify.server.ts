// Server-only helpers for Shopify OAuth + API. Never import from client code.
import { createHmac, timingSafeEqual } from "crypto";

export const SHOPIFY_SCOPES = "read_orders,read_products";
export const SHOPIFY_API_VERSION = "2024-10";

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

/** Normalize a user-provided shop value to "xxx.myshopify.com" */
export function normalizeShopDomain(input: string): string | null {
  if (!input) return null;
  let s = input.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!s.endsWith(".myshopify.com")) {
    // accept bare handle
    if (/^[a-z0-9][a-z0-9-]*$/.test(s)) s = `${s}.myshopify.com`;
    else return null;
  }
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(s)) return null;
  return s;
}

export function signState(userId: string): string {
  const nonce = crypto.randomUUID();
  const payload = `${userId}.${nonce}.${Date.now()}`;
  const sig = createHmac("sha256", getStateSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyState(state: string): { userId: string } | null {
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
    // 1h max
    if (Date.now() - Number(ts) > 60 * 60 * 1000) return null;
    return { userId };
  } catch {
    return null;
  }
}

/** Verify Shopify OAuth callback HMAC. */
export function verifyShopifyHmac(query: URLSearchParams): boolean {
  const hmac = query.get("hmac");
  if (!hmac) return false;
  const params: string[] = [];
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

export function buildAuthorizeUrl(shop: string, state: string, redirectUri: string): string {
  const { clientId } = getClientCreds();
  const u = new URL(`https://${shop}/admin/oauth/authorize`);
  u.searchParams.set("client_id", clientId);
  u.searchParams.set("scope", SHOPIFY_SCOPES);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);
  return u.toString();
}

export async function exchangeCodeForToken(shop: string, code: string): Promise<{
  access_token: string;
  scope: string;
}> {
  const { clientId, clientSecret } = getClientCreds();
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}

async function shopifyFetch(shop: string, accessToken: string, path: string): Promise<any> {
  const res = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}${path}`, {
    headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Shopify API ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function getShopInfo(shop: string, accessToken: string) {
  const data = await shopifyFetch(shop, accessToken, "/shop.json");
  return data.shop as { name: string; currency: string; domain: string };
}

/** Fetch all products from Shopify (paginated). */
export async function fetchAllShopifyProducts(
  shop: string,
  accessToken: string,
): Promise<Array<{ id: number; title: string; image?: string; variants: Array<{ price: string }> }>> {
  const out: any[] = [];
  let pageInfo: string | null = null;
  for (let i = 0; i < 20; i++) {
    const qs = pageInfo
      ? `?limit=250&page_info=${encodeURIComponent(pageInfo)}`
      : `?limit=250`;
    const res = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products.json${qs}`, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });
    if (!res.ok) throw new Error(`Shopify products ${res.status} ${await res.text()}`);
    const data = await res.json();
    for (const p of data.products ?? []) {
      out.push({
        id: p.id,
        title: p.title,
        image: p.image?.src ?? p.images?.[0]?.src ?? undefined,
        variants: p.variants ?? [],
      });
    }
    const link: string | null = res.headers.get("link") ?? res.headers.get("Link");
    const m: RegExpMatchArray | null = link ? link.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/) : null;
    if (!m) break;
    pageInfo = m[1] as string;
  }
  return out;
}

type DateAgg = { orders: number; revenue: number; refundedOrders: number; refundedAmount: number; cancelledOrders: number };
type ProductDateAgg = { orders: number; units: number; revenue: number; refundedOrders: number; refundedAmount: number };

/**
 * Fetch orders since a date (paginated). Aggregates per day and per product.
 * IMPORTANT : `orders` compte des COMMANDES distinctes (1 commande = 1, peu
 * importe les quantités ou le nombre de lignes). `units` compte les unités.
 */
export async function fetchOrdersAggregated(
  shop: string,
  accessToken: string,
  sinceISO: string,
): Promise<{
  byDate: Record<string, DateAgg>;
  byProductDate: Record<string, Record<string, ProductDateAgg>>;
  totalOrders: number;
}> {
  const byDate: Record<string, DateAgg> = {};
  const byProductDate: Record<string, Record<string, ProductDateAgg>> = {};
  let totalOrders = 0;
  let pageInfo: string | null = null;
  for (let i = 0; i < 20; i++) {
    const qs: string = pageInfo
      ? `?limit=250&page_info=${encodeURIComponent(pageInfo)}&status=any`
      : `?limit=250&status=any&created_at_min=${encodeURIComponent(sinceISO)}`;
    const res: Response = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json${qs}`, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });
    if (!res.ok) throw new Error(`Shopify orders ${res.status} ${await res.text()}`);
    const data = await res.json();
    const orders: any[] = data.orders ?? [];
    for (const o of orders) {
      const d = (o.created_at as string).slice(0, 10);
      const isCancelled = !!o.cancelled_at || o.financial_status === "voided";
      const isFullyRefunded = o.financial_status === "refunded";

      const gross = Number(o.total_price ?? 0);
      const grossNet = Number(o.current_total_price ?? o.total_price ?? 0);
      const tax = Number(o.current_total_tax ?? o.total_tax ?? 0);
      const shipping = Number(
        o.total_shipping_price_set?.shop_money?.amount ??
          o.shipping_lines?.reduce?.((s: number, l: any) => s + Number(l.price ?? 0), 0) ??
          0,
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

      // Une commande peut contenir plusieurs lignes du même produit. On compte
      // la commande UNE seule fois par produit (Set), mais on cumule unités et CA.
      const seenForOrder = new Set<string>();
      for (const li of o.line_items ?? []) {
        const name = String(li.title ?? "").trim().toLowerCase();
        if (!name) continue;
        const origQty = Number(li.quantity ?? 0);
        const qty = Number(li.current_quantity ?? li.quantity ?? 0);
        const unitPrice = Number(li.price ?? 0);
        const discount = (li.discount_allocations ?? []).reduce(
          (s: number, da: any) => s + Number(da.amount ?? 0),
          0,
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
    const link: string | null = res.headers.get("link") ?? res.headers.get("Link");
    const m: RegExpMatchArray | null = link ? link.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/) : null;
    if (!m) break;
    pageInfo = m[1] as string;
  }
  return { byDate, byProductDate, totalOrders };
}

