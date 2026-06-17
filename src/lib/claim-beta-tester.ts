import { supabase } from "@/integrations/supabase/client";

/** Réclame la place bêta si l'inscription a été faite avec ?beta=1 (idempotent). */
export async function claimBetaTesterIfEligible(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
} | null | undefined): Promise<void> {
  if (!user?.id) return;
  const flag = user.user_metadata?.beta_tester;
  if (flag !== "1" && flag !== 1 && flag !== true) return;
  try {
    await supabase.rpc("claim_my_beta_tester");
  } catch {
    // Silencieux : le trigger SQL ou un retry ultérieur peut suffire.
  }
}
