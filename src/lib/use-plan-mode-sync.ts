import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { useActiveMode } from "@/lib/use-active-mode";

/**
 * Vérifie que la ligne de business stockée est bien une ligne valide.
 *
 * Historique : ce hook forçait le mode `cod` pour les abonnés au plan COD.
 * Cette ligne n'existe plus (l'app a deux lignes : CopyX et Dropshipping), donc
 * le hook se contente désormais de laisser le marchand sur sa ligne — il ne
 * change plus rien tout seul. Il est conservé pour ne pas casser l'appel du
 * layout `_app`.
 */
export function usePlanCodModeSync() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const { mode, setMode, isLoading } = useActiveMode();
  const syncingRef = useRef(false);

  useEffect(() => {
    syncingRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    if (isLoading || sub.loading || !user?.id) return;
    // Aucune bascule automatique : les deux lignes sont ouvertes à tous les
    // forfaits payants (et à l'essai), et le choix du marchand est respecté.
    if (mode !== "copyx" && mode !== "dropshipping") {
      if (syncingRef.current) return;
      syncingRef.current = true;
      void setMode("copyx", { silent: true }).finally(() => {
        syncingRef.current = false;
      });
    }
  }, [isLoading, sub.loading, mode, setMode, user?.id]);
}
