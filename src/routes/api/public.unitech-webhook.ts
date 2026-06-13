import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  unitechVerifyPayment,
  PLAN_PRICING,
  type PlanKey,
} from "@/lib/payments.server";

// Public webhook endpoint called by Unitech.
// Unitech doesn't sign webhooks, so we use a 2-layer defense:
//   1. The reference must exist in our `payments` table (we generate it
//      ourselves with crypto-random bytes; an attacker cannot guess it).
//   2. We re-verify the transaction via the Unitech API with our secret API
//      key before activating any subscription.
export const Route = createFileRoute("/api/public/unitech-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const reference: string | undefined = payload?.reference;
        const event: string | undefined = payload?.event;
        if (!reference) {
          return new Response("Missing reference", { status: 400 });
        }

        // 1. The reference must be one we created.
        const { data: paymentRow, error: fetchError } = await supabaseAdmin
          .from("payments")
          .select("id, user_id, plan, status, amount")
          .eq("reference", reference)
          .maybeSingle();

        if (fetchError || !paymentRow) {
          // Unknown reference → either spoofed or out of sync. ACK so Unitech
          // stops retrying, but do nothing.
          return new Response("Unknown reference", { status: 200 });
        }

        // Idempotency: if already completed, just ACK.
        if (paymentRow.status === "completed") {
          return new Response("Already processed", { status: 200 });
        }

        // 2. Re-verify with Unitech using our API key.
        const verification = await unitechVerifyPayment(reference);

        // Map event -> our status; verification is the source of truth.
        const isSuccess =
          event === "payment_success" &&
          verification.success &&
          (verification.status === "completed" || verification.status === "success");

        const isFailure =
          event === "payment_failed" ||
          event === "payment_expired" ||
          (verification.success && verification.status &&
            ["failed", "expired", "cancelled", "canceled"].includes(verification.status));

        if (isSuccess) {
          const plan = paymentRow.plan as PlanKey;
          const expected = PLAN_PRICING[plan]?.amountXof;
          if (expected && verification.amount && verification.amount < expected) {
            await supabaseAdmin
              .from("payments")
              .update({
                status: "failed",
                raw_payload: { error: "amount_mismatch", payload, verification: verification.raw },
              })
              .eq("id", paymentRow.id);
            return new Response("Amount mismatch", { status: 200 });
          }

          // Activate subscription: 30 days from now.
          const now = new Date();
          const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

          // Upsert subscription row (one per user).
          const { error: subError } = await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                user_id: paymentRow.user_id,
                plan,
                status: "active",
                trial_ends_at: now.toISOString(),
                current_period_end: periodEnd.toISOString(),
                cancel_at_period_end: false,
              },
              { onConflict: "user_id" },
            );

          if (subError) {
            console.error("subscription upsert failed", subError);
            return new Response("DB error", { status: 500 });
          }

          await supabaseAdmin
            .from("payments")
            .update({
              status: "completed",
              paid_at: now.toISOString(),
              external_transaction_id:
                payload?.transaction_id ?? payload?.external_id ?? null,
              raw_payload: { payload, verification: verification.raw },
            })
            .eq("id", paymentRow.id);

          return new Response("ok", { status: 200 });
        }

        if (isFailure) {
          await supabaseAdmin
            .from("payments")
            .update({
              status: "failed",
              raw_payload: { payload, verification: verification.raw },
            })
            .eq("id", paymentRow.id);
          return new Response("ok", { status: 200 });
        }

        // Unknown / pending event — ACK so Unitech doesn't retry forever.
        return new Response("ignored", { status: 200 });
      },
    },
  },
});
