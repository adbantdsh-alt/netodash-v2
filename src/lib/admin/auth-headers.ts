import { supabase } from "@/integrations/supabase/client";

export async function getSupabaseAuthHeaders(): Promise<{ Authorization: string }> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Session expirée. Reconnecte-toi.");
  }
  return { Authorization: `Bearer ${token}` };
}
