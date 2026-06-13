import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

/**
 * Permanently delete the authenticated user's account.
 * Verifies the user JWT, cleans all data, then removes the auth user.
 */
export const deleteAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!input || typeof input !== "object" || !("token" in input)) {
      throw new Error("Token requis.");
    }
    const token = (input as { token: unknown }).token;
    if (typeof token !== "string" || token.length < 10) {
      throw new Error("Token invalide.");
    }
    return { token };
  })
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;

    // Verify the JWT belongs to a real user
    const verifyClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: claimsData, error: claimsError } = await verifyClient.auth.getClaims(data.token);
    if (claimsError || !claimsData?.claims?.sub) {
      throw new Error("Authentification invalide.");
    }
    const userId = claimsData.claims.sub;

    // Defensive cleanup using admin (bypasses RLS) — safe because JWT was verified above.
    await supabaseAdmin.from("creative_performance").delete().eq("user_id", userId);
    await supabaseAdmin.from("creatives").delete().eq("user_id", userId);
    await supabaseAdmin.from("daily_entries").delete().eq("user_id", userId);
    await supabaseAdmin.from("products").delete().eq("user_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      throw new Error(`Échec suppression: ${error.message}`);
    }

    return { success: true };
  });
