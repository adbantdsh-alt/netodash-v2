import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
function useIsAdmin(userId) {
  return useQuery({
    queryKey: ["is-admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (error) throw error;
      return !!data;
    }
  });
}
export {
  useIsAdmin as u
};
