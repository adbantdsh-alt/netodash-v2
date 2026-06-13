import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";

const ALLOWED_RETURN_ORIGINS = new Set([
  "https://netodash.com",
  "https://www.netodash.com",
  "https://netodash.lovable.app",
  "https://id-preview--c8da90f6-5654-47cb-a390-4f9faf5e58ee.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
]);

function assertSafeReturnUrl(input: string): string {
  const u = new URL(input);
  const origin = `${u.protocol}//${u.host}`;
  if (!ALLOWED_RETURN_ORIGINS.has(origin)) {
    throw new Error("Disallowed returnUrl origin");
  }
  return input;
}

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

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: assertSafeReturnUrl(data.returnUrl),
      payment_method_types: ["card"],
      ...(userEmail && { customer_email: userEmail }),
      metadata: { userId, priceId: data.priceId },
      ...(isRecurring && {
        subscription_data: { metadata: { userId, priceId: data.priceId } },
      }),
    });

    return session.client_secret;
  });
