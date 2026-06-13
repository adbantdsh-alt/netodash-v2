import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { normalizeDropshippingCurrency } from "@/lib/calc";

export type BusinessMode = "cod" | "dropshipping";

export type ActiveModeState = {
  mode: BusinessMode;
  /** Devise affichée dans toute l'app pour le mode actif. */
  currency: string;
  /** Devise spécifique au mode dropshipping (config). */
  dropshippingCurrency: string;
  /** Devise COD (figée à XOF pour le MVP Sénégal). */
  codCurrency: string;
  isLoading: boolean;
  setMode: (mode: BusinessMode) => Promise<void>;
};

/**
 * Hook central qui expose le mode business actif (COD ou Dropshipping)
 * et la devise associée. Tout le code de l'app doit passer par ce hook
 * pour filtrer les données et afficher la bonne devise.
 */
export function useActiveMode(): ActiveModeState {
  const { user } = useAuth();
  const qc = useQueryClient();

  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const profile = profileQ.data as any;
  const mode: BusinessMode = (profile?.active_mode ?? "dropshipping") as BusinessMode;
  const codCurrency = "XOF";
  const dropshippingCurrency = normalizeDropshippingCurrency(
    profile?.dropshipping_currency ?? profile?.currency,
  );
  const currency = mode === "cod" ? codCurrency : dropshippingCurrency;

  const mutation = useMutation({
    mutationFn: async (next: BusinessMode) => {
      if (!user?.id) throw new Error("Non authentifié");
      const { error } = await supabase
        .from("profiles")
        .update({ active_mode: next } as any)
        .eq("id", user.id);
      if (error) throw error;
      return next;
    },
    onSuccess: () => {
      // Invalider tout — chaque écran rechargera ses données filtrées par mode.
      qc.invalidateQueries();
    },
    onError: (e: any) => toast.error(e?.message ?? "Échec du changement de mode"),
  });

  return {
    mode,
    currency,
    codCurrency,
    dropshippingCurrency,
    isLoading: profileQ.isLoading,
    setMode: async (next) => {
      if (next === mode) return;
      await mutation.mutateAsync(next);
      toast.success(next === "cod" ? "Mode COD activé" : "Mode Dropshipping activé");
    },
  };
}
