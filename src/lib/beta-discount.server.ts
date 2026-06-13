import type { StripeEnv } from "@/lib/stripe.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const BETA_LIFETIME_DISCOUNT_PERCENT = 50;

export function getBetaLifetimeCouponId(env: StripeEnv): string | null {
  const key =
    env === "sandbox" ? "STRIPE_BETA_50_COUPON_SANDBOX" : "STRIPE_BETA_50_COUPON_LIVE";
  const value = process.env[key]?.trim();
  return value || null;
}

export async function getBetaTesterCheckoutDiscount(userId: string): Promise<{
  percent: number;
  couponId: string | null;
} | null> {
  const { data, error } = await supabaseAdmin
    .from("beta_testers")
    .select("lifetime_discount_percent")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("beta_testers lookup error", error);
    return null;
  }
  if (!data) return null;

  const percent = Number(data.lifetime_discount_percent ?? BETA_LIFETIME_DISCOUNT_PERCENT);
  if (percent <= 0) return null;

  return { percent, couponId: null };
}

export async function resolveBetaStripeCoupon(
  userId: string,
  env: StripeEnv,
): Promise<string | null> {
  const benefit = await getBetaTesterCheckoutDiscount(userId);
  if (!benefit || benefit.percent <= 0) return null;
  return getBetaLifetimeCouponId(env);
}
