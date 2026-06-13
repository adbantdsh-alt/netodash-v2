import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { runShopifySyncForUser } from "./shopify-sync.server";
import { fetchOrdersAggregated, getShopInfo } from "./shopify.server";

export const getShopifyConnection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId as string;
    const { data } = await supabaseAdmin
      .from("shopify_connections")
      .select("shop_domain, shop_name, currency, connected_at, last_sync_at, last_sync_status, last_sync_message, active")
      .eq("user_id", userId)
      .maybeSingle();
    return data ?? null;
  });

export const disconnectShopify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId as string;
    await supabaseAdmin.from("shopify_connections").delete().eq("user_id", userId);
    return { success: true };
  });

export const syncShopifyOrdersNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ daysBack: z.number().int().min(1).max(60).default(7) }).parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    return runShopifySyncForUser(userId, data.daysBack);
  });

/**
 * Lecture seule : agrège les commandes Shopify sur une plage de dates,
 * par produit, sans rien écrire en base. Sert à pré-remplir le formulaire
 * de saisie (l'utilisateur valide ensuite manuellement avec son budget pub).
 */
export const previewShopifySync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const { data: conn } = await supabaseAdmin
      .from("shopify_connections")
      .select("shop_domain, access_token, currency, shop_name")
      .eq("user_id", userId)
      .eq("active", true)
      .maybeSingle();
    if (!conn) throw new Error("Aucune boutique Shopify connectée.");

    let liveCurrency: string | null = conn.currency ?? null;
    let liveShopName: string | null = conn.shop_name ?? null;
    try {
      const info = await getShopInfo(conn.shop_domain, conn.access_token);
      liveCurrency = info.currency || liveCurrency;
      liveShopName = info.name || liveShopName;
      if (info.currency && info.currency !== conn.currency) {
        await (supabaseAdmin
          .from("shopify_connections")
          .update({ currency: info.currency, shop_name: info.name ?? conn.shop_name }) as any)
          .eq("user_id", userId);
      }
    } catch {
      // garde la devise stockée si /shop.json échoue
    }

    const sinceISO = new Date(`${data.from}T00:00:00Z`).toISOString();
    const { byDate, byProductDate } = await fetchOrdersAggregated(
      conn.shop_domain,
      conn.access_token,
      sinceISO,
    );

    const inRange = (d: string) => d >= data.from && d <= data.to;

    const { data: userProducts } = await supabaseAdmin
      .from("products")
      .select("id, name, currency")
      .eq("user_id", userId);
    const productByNorm: Record<
      string,
      { id: string; name: string; currency: string | null }
    > = {};
    for (const p of userProducts ?? []) {
      productByNorm[p.name.trim().toLowerCase()] = p as any;
    }

    type DayAgg = {
      orders: number;
      units: number;
      revenue: number;
      refundedOrders: number;
      refundedAmount: number;
    };
    const drafts: Array<{
      shopifyTitle: string;
      matchedProductId: string | null;
      matchedProductName: string | null;
      orders: number;
      units: number;
      revenue: number;
      refundedOrders: number;
      refundedAmount: number;
      byDate: Record<string, DayAgg>;
    }> = [];
    const allDates = new Set<string>();
    for (const [name, dateMap] of Object.entries(byProductDate)) {
      let orders = 0;
      let units = 0;
      let revenue = 0;
      let refundedOrders = 0;
      let refundedAmount = 0;
      const byDateDraft: Record<string, DayAgg> = {};
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
          refundedAmount: Math.round(agg.refundedAmount * 100) / 100,
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
        byDate: byDateDraft,
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
      availableDates: Array.from(allDates).sort(),
    };
  });
