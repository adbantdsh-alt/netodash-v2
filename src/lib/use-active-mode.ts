import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  APP_CURRENCY,
  DEFAULT_DROPSHIPPING_CURRENCY,
  normalizeDropshippingCurrency,
  type DropshippingCurrency,
} from "@/lib/dropshipping-fx";

/**
 * Lignes de business du compte.
 *
 *  - `copyx`         → boutique CopyX : FCFA (XOF) uniquement, acomptes 10 %,
 *                      encaissements XaalipSay (5 % à l'encaissement).
 *  - `dropshipping`  → dropshipping international : devise au choix
 *                      (EUR / USD / GBP / XOF), devise pub possiblement distincte.
 *
 * Les deux lignes sont cloisonnées : produits, saisies et KPI sont filtrés par
 * `business_mode`, et aucune devise n'est mélangée entre elles.
 *
 * (La valeur héritée `cod` n'est plus proposée ; les comptes qui l'ont encore
 *  en base sont ramenés sur `copyx` à l'affichage.)
 */
export type BusinessMode = "copyx" | "dropshipping";

export type ActiveModeState = {
  mode: BusinessMode;
  /** Devise d'affichage de la ligne active. */
  currency: DropshippingCurrency;
  /** Devise de la ligne CopyX (toujours FCFA). */
  copyxCurrency: DropshippingCurrency;
  /** Devise choisie pour la ligne Dropshipping. */
  dropshippingCurrency: DropshippingCurrency;
  /** Taux saisi : 1 USD = N devises d'affichage (ligne Dropshipping). */
  dropshippingUsdRate: number | null;
  isLoading: boolean;
  setMode: (mode: BusinessMode, options?: { silent?: boolean }) => Promise<void>;
};

function readMode(value: unknown): BusinessMode {
  // Toute valeur inconnue (dont l'ancien `cod`) retombe sur la ligne CopyX.
  return String(value ?? "").toLowerCase() === "dropshipping" ? "dropshipping" : "copyx";
}

/**
 * Hook central : expose la ligne de business active et sa devise. Tout le code
 * de l'app passe par ce hook pour filtrer les données et afficher la bonne devise.
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
  const mode = readMode(profile?.active_mode);

  const copyxCurrency = APP_CURRENCY;
  const dropshippingCurrency = normalizeDropshippingCurrency(
    profile?.dropshipping_currency ?? profile?.currency,
    DEFAULT_DROPSHIPPING_CURRENCY,
  );
  const currency = mode === "dropshipping" ? dropshippingCurrency : copyxCurrency;

  const rawRate = Number(profile?.dropshipping_usd_fx);
  const dropshippingUsdRate =
    Number.isFinite(rawRate) && rawRate > 0 && rawRate < 5000 ? rawRate : null;

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
    onSuccess: (_next, _vars, _ctx) => {
      if (!user?.id) return;
      qc.invalidateQueries({ queryKey: ["profile", user.id] });
      // Les listes filtrées par `business_mode` doivent être rechargées.
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Échec du changement de ligne"),
  });

  const { mutateAsync } = mutation;

  const setMode = useCallback(
    async (next: BusinessMode, options?: { silent?: boolean }) => {
      if (next === mode) return;
      await mutateAsync(next);
      if (!options?.silent) {
        toast.success(
          next === "copyx"
            ? "Ligne CopyX activée (FCFA)"
            : `Ligne Dropshipping activée (${dropshippingCurrency})`,
        );
      }
    },
    [mode, mutateAsync, dropshippingCurrency],
  );

  return {
    mode,
    currency,
    copyxCurrency,
    dropshippingCurrency,
    dropshippingUsdRate,
    isLoading: profileQ.isLoading,
    setMode,
  };
}
