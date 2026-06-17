import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
import { r as reactExports } from "../_libs/react.mjs";
import { u as useAuth } from "./router-CzeTO2qA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as normalizeDropshippingCurrency } from "./dropshipping-fx-BpQqYaq9.mjs";
function useActiveMode() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const profile = profileQ.data;
  const mode = profile?.active_mode ?? "dropshipping";
  const codCurrency = "XOF";
  const dropshippingCurrency = normalizeDropshippingCurrency(
    profile?.dropshipping_currency ?? profile?.currency
  );
  const currency = mode === "cod" ? codCurrency : dropshippingCurrency;
  const mutation = useMutation({
    mutationFn: async (next) => {
      if (!user?.id) throw new Error("Non authentifié");
      const { error } = await supabase.from("profiles").update({ active_mode: next }).eq("id", user.id);
      if (error) throw error;
      return next;
    },
    onSuccess: (_next, _vars, _ctx) => {
      if (!user?.id) return;
      qc.invalidateQueries({ queryKey: ["profile", user.id] });
    },
    onError: (e) => toast.error(e?.message ?? "Échec du changement de mode")
  });
  const { mutateAsync } = mutation;
  const setMode = reactExports.useCallback(
    async (next, options) => {
      if (next === mode) return;
      await mutateAsync(next);
      if (!options?.silent) {
        toast.success(next === "cod" ? "Mode COD activé" : "Mode Dropshipping activé");
      }
    },
    [mode, mutateAsync]
  );
  return {
    mode,
    currency,
    codCurrency,
    dropshippingCurrency,
    isLoading: profileQ.isLoading,
    setMode
  };
}
function useProfile(userId) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
}
function useProducts(userId, modeOverride) {
  const { mode: activeMode } = useActiveMode();
  const mode = activeMode;
  return useQuery({
    queryKey: ["products", userId, mode],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("business_mode", mode).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useEntries(userId, range, productId, modeOverride) {
  const { mode: activeMode } = useActiveMode();
  const mode = activeMode;
  return useQuery({
    queryKey: ["entries", userId, range.from, range.to, productId ?? "all", mode],
    enabled: !!userId,
    queryFn: async () => {
      let q = supabase.from("daily_entries").select("*").eq("business_mode", mode).gte("entry_date", range.from).lte("entry_date", range.to).order("entry_date", { ascending: false });
      if (productId) q = q.eq("product_id", productId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    }
  });
}
export {
  useProducts as a,
  useEntries as b,
  useProfile as c,
  useActiveMode as u
};
