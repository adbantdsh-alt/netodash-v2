// Server-only sync + persist helpers. Never import from client code.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { fetchAllShopifyProducts, fetchOrdersAggregated, getShopInfo } from "./shopify.server";

export async function runShopifySyncForUser(userId: string, daysBack: number) {
  const { data: conn } = await supabaseAdmin
    .from("shopify_connections")
    .select("shop_domain, access_token, currency")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();
  if (!conn) throw new Error("Aucune boutique Shopify connectée.");

  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
  try {
    const shopifyProducts = await fetchAllShopifyProducts(conn.shop_domain, conn.access_token);
    const currency = conn.currency || "USD";

    const { data: existingProducts } = await supabaseAdmin
      .from("products")
      .select("id, name")
      .eq("user_id", userId);
    const byNorm: Record<string, string> = {};
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
          const { data: existing } = await supabaseAdmin
            .from("products")
            .select("image_url")
            .eq("id", byNorm[norm])
            .maybeSingle();
          if (existing && !existing.image_url) {
            await (supabaseAdmin.from("products").update({ image_url: image }) as any).eq(
              "id",
              byNorm[norm],
            );
            imageUpdated += 1;
          }
        }
        continue;
      }
      const price = Number(sp.variants?.[0]?.price ?? 0);
      const { data: ins } = await (supabaseAdmin
        .from("products")
        .insert({
          user_id: userId,
          name,
          sale_price: price,
          cost_price: 0,
          shopify_shop_domain: conn.shop_domain,
          shopify_product_match: String(sp.id),
          image_url: image,
          currency,
        } as any)
        .select("id")
        .single() as any);
      if (ins) {
        byNorm[norm] = ins.id;
        createdCount += 1;
      }
    }

    const { byDate, byProductDate, totalOrders } = await fetchOrdersAggregated(
      conn.shop_domain,
      conn.access_token,
      since,
    );

    // Pré-charger les daily_entries existantes en une seule requête (au lieu d'un SELECT par date)
    const allDates = new Set<string>();
    for (const dateMap of Object.values(byProductDate)) {
      for (const d of Object.keys(dateMap)) allDates.add(d);
    }
    const dateList = Array.from(allDates);
    const existingEntries = dateList.length
      ? (
          await supabaseAdmin
            .from("daily_entries")
            .select("id, product_id, entry_date, ad_budget_currency")
            .eq("user_id", userId)
            .in("entry_date", dateList)
        ).data ?? []
      : [];
    const entryKey = (productId: string, date: string) => `${productId}|${date}`;
    const existingMap = new Map<
      string,
      { id: string; ad_budget_currency: string | null }
    >();
    for (const e of existingEntries) {
      existingMap.set(entryKey(e.product_id as string, e.entry_date as string), {
        id: e.id as string,
        ad_budget_currency: (e.ad_budget_currency ?? null) as string | null,
      });
    }

    // Préparer un upsert batché sur la contrainte unique (user_id, product_id, entry_date)
    const rowsToUpsert: Array<Record<string, unknown>> = [];
    let matched = 0;
    for (const [name, dateMap] of Object.entries(byProductDate)) {
      let productId = byNorm[name];
      if (!productId) {
        const { data: ins } = await (supabaseAdmin
          .from("products")
          .insert({
            user_id: userId,
            name,
            sale_price: 0,
            cost_price: 0,
            shopify_shop_domain: conn.shop_domain,
            currency,
          } as any)
          .select("id")
          .single() as any);
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
          refunded_orders: dateAgg?.refundedOrders ?? 0,
        });
      }
    }

    if (rowsToUpsert.length > 0) {
      const { error: upsertErr } = await (supabaseAdmin
        .from("daily_entries") as any)
        .upsert(rowsToUpsert, { onConflict: "user_id,product_id,entry_date" });
      if (upsertErr) throw new Error(upsertErr.message);
    }

    await (supabaseAdmin
      .from("shopify_connections")
      .update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: "ok",
        last_sync_message: `${totalOrders} commandes / ${matched} produits matchés / ${createdCount} créés`,
      }) as any)
      .eq("user_id", userId);

    return {
      success: true,
      ordersImported: totalOrders,
      productsMatched: matched,
      productsCreated: createdCount,
      currency,
      dates: Object.keys(byDate).length,
    };
  } catch (err: any) {
    await (supabaseAdmin
      .from("shopify_connections")
      .update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: "error",
        last_sync_message: String(err?.message ?? err).slice(0, 500),
      }) as any)
      .eq("user_id", userId);
    throw err;
  }
}


export async function persistConnection(params: {
  userId: string;
  shop: string;
  accessToken: string;
  scope: string;
}) {
  let shopInfo: { name?: string; currency?: string } = {};
  try {
    shopInfo = await getShopInfo(params.shop, params.accessToken);
  } catch {
    // non-fatal
  }
  const row = {
    user_id: params.userId,
    shop_domain: params.shop,
    access_token: params.accessToken,
    scopes: params.scope,
    shop_name: shopInfo?.name ?? null,
    currency: shopInfo?.currency ?? null,
    active: true,
    connected_at: new Date().toISOString(),
  };
  const { data: existing } = await supabaseAdmin
    .from("shopify_connections")
    .select("id")
    .eq("user_id", params.userId)
    .maybeSingle();
  if (existing) {
    await (supabaseAdmin.from("shopify_connections").update(row) as any).eq("id", existing.id);
  } else {
    await (supabaseAdmin.from("shopify_connections") as any).insert(row);
  }
}
