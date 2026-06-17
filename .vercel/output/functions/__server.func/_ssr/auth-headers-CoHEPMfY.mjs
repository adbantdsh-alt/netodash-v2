import { s as supabase } from "./client-IbqXIlEo.mjs";
async function getSupabaseAuthHeaders() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Session expirée. Reconnecte-toi.");
  }
  return { Authorization: `Bearer ${token}` };
}
export {
  getSupabaseAuthHeaders as g
};
