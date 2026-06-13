import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";

/**
 * Actions disponibles sur un abonnement :
 *  - downgrade_to_pro : Premium ($27) → Pro ($17), pro-rata Stripe
 *  - downgrade_to_basic : Premium ou Pro → Basic ($5), pro-rata Stripe
 *  - cancel_to_free : annulation programmée en fin de période payée
 */
export type ChangeSubscriptionAction =
  | "downgrade_to_pro"
  | "downgrade_to_basic"
  | "cancel_to_free";

const Input = z.object({
  action: z.enum(["downgrade_to_pro", "downgrade_to_basic", "cancel_to_free"]),
  environment: z.enum(["sandbox", "live"]),
});

// Mapping action → (lookup_key cible Stripe, plans DB autorisés en source)
const DOWNGRADE_TARGET: Record<
  "downgrade_to_pro" | "downgrade_to_basic",
  { lookupKey: string; allowedFrom: string[]; metaPriceId: string }
> = {
  downgrade_to_pro: {
    lookupKey: "pro_monthly_v4",
    allowedFrom: ["pro"], // Scale → Pro uniquement
    metaPriceId: "pro_monthly_v4",
  },
  downgrade_to_basic: {
    lookupKey: "basic_monthly_v4",
    allowedFrom: ["pro", "starter"], // Scale ou Pro → Starter
    metaPriceId: "basic_monthly_v4",
  },
};

export const changeSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_subscription_id, plan, status")
      .eq("user_id", userId)
      .maybeSingle();

    if (!sub?.stripe_subscription_id) {
      throw new Error("Aucun abonnement Stripe actif trouvé.");
    }

    const stripe = createStripeClient(data.environment as StripeEnv);

    if (data.action === "cancel_to_free") {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
      await (supabaseAdmin.from("subscriptions") as any)
        .update({ cancel_at_period_end: true, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      return { ok: true, action: "cancel_to_free" as const };
    }

    const target = DOWNGRADE_TARGET[data.action];
    if (!target.allowedFrom.includes(sub.plan as string)) {
      throw new Error("Ce changement n'est pas disponible depuis ton plan actuel.");
    }

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    const item = stripeSub.items.data[0];
    if (!item) throw new Error("Abonnement Stripe sans item.");

    const prices = await stripe.prices.list({ lookup_keys: [target.lookupKey], limit: 1 });
    if (!prices.data.length) throw new Error("Prix cible introuvable.");
    const newPriceId = prices.data[0].id;

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: item.id, price: newPriceId }],
      proration_behavior: "create_prorations",
      metadata: { ...(stripeSub.metadata ?? {}), userId, priceId: target.metaPriceId },
    });

    return { ok: true, action: data.action };
  });
