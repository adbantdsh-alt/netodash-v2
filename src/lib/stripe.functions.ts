import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import { resolveBetaStripeCoupon } from "@/lib/beta-discount.server";
import { assertAllowedOrigin } from "@/lib/site-url.server";

const Input = z.object({
  priceId: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  returnUrl: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

export const createStripeCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const userEmail = (context.claims as any)?.email as string | undefined;
    const stripe = createStripeClient(data.environment as StripeEnv);

    const prices = await stripe.prices.list({ lookup_keys: [data.priceId], limit: 1 });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];
    const isRecurring = stripePrice.type === "recurring";
    const betaCouponId = await resolveBetaStripeCoupon(userId, data.environment as StripeEnv);

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: assertAllowedOrigin(data.returnUrl),
      payment_method_types: ["card"],
      ...(userEmail && { customer_email: userEmail }),
      metadata: { userId, priceId: data.priceId },
      ...(betaCouponId && { discounts: [{ coupon: betaCouponId }] }),
      ...(isRecurring && {
        subscription_data: { metadata: { userId, priceId: data.priceId } },
      }),
    });

    return session.client_secret;
  });
