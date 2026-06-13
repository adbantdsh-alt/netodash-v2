import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

function planFromPriceId(priceId: string | undefined | null): "basic" | "starter" | "pro" | null {
  if (!priceId) return null;
  // v4 = grille tarifaire actuelle (Starter $7 / Pro $19 / Scale $39)
  // Labels publics → IDs internes : Starter=basic, Pro=starter, Scale=pro
  // Mensuel
  if (priceId === "scale_monthly_v4") return "pro";
  if (priceId === "pro_monthly_v4") return "starter";
  if (priceId === "basic_monthly_v4") return "basic";
  // Annuel (-20%)
  if (priceId === "scale_yearly_v4") return "pro";
  if (priceId === "pro_yearly_v4") return "starter";
  if (priceId === "basic_yearly_v4") return "basic";
  // Grandfathering v3 (Basic $5 / Pro $17 / Premium $27) — abos existants conservés à vie
  if (priceId === "premium_monthly_v3") return "pro";
  if (priceId === "pro_monthly_v3") return "starter";
  if (priceId === "basic_monthly_v3") return "basic";
  // Legacy v1/v2
  if (priceId === "pro_monthly" || priceId === "pro_monthly_v2") return "pro";
  if (priceId === "starter_monthly" || priceId === "starter_monthly_v2") return "starter";
  return null;
}

async function upsertSubscriptionFromStripe(subscription: any) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const lovablePriceId =
    item?.price?.metadata?.lovable_external_id || subscription.metadata?.priceId || null;
  const plan = planFromPriceId(lovablePriceId);
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  const update: Record<string, any> = {
    status: subscription.status,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    cancel_at_period_end: subscription.cancel_at_period_end || false,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  if (plan) update.plan = plan;

  await (getSupabase().from("subscriptions") as any).update(update).eq("user_id", userId);
}

async function handleSubscriptionDeleted(subscription: any) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;
  await (getSupabase().from("subscriptions") as any)
    .update({
      status: "canceled",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

async function handleCheckoutCompleted(session: any) {
  // Subscriptions are handled by customer.subscription.* events.
  // For one-time payments we could extend logic here later.
  if (session.mode !== "subscription") return;
}

async function handleWebhook(req: Request, env: "sandbox" | "live") {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscriptionFromStripe(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
