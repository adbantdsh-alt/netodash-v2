import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { useActiveMode } from "@/lib/use-active-mode";

/**
 * Aligne active_mode sur le plan (COD → mode cod), sans toast.
 * À appeler une seule fois dans le layout app (_app), pas dans l'admin.
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
    if (sub.plan !== "cod") return;
    if (mode === "cod") return;
    if (syncingRef.current) return;
    syncingRef.current = true;
    void setMode("cod", { silent: true }).finally(() => {
      syncingRef.current = false;
    });
  }, [isLoading, sub.loading, sub.plan, mode, setMode, user?.id]);
}
