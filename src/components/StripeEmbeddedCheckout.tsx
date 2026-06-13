import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createStripeCheckoutSession } from "@/lib/stripe.functions";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  priceId: string;
  returnUrl?: string;
}

export function StripeEmbeddedCheckoutForm({ priceId, returnUrl }: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Vous devez être connecté pour payer.");
    }
    const secret = await createStripeCheckoutSession({
      data: {
        priceId,
        returnUrl: returnUrl || `${window.location.origin}/plan?payment=success`,
        environment: getStripeEnvironment(),
      },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!secret) throw new Error("Stripe did not return a client secret");
    return secret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
