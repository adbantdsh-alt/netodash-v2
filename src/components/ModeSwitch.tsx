import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useActiveMode, type BusinessMode } from "@/lib/use-active-mode";
import { PremiumModeSwitch } from "@/components/PremiumModeSwitch";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { canAccessDropshipping, canUseDualMode } from "@/lib/plan-limits";
import { toast } from "sonner";

/**
 * Switch Drop / COD.
 * - Plan COD $10 : verrouillé en COD
 * - Plans Drop (Starter+) : dual mode (COD inclus)
 * - legacy_dual_mode : grandfathering comptes basic existants
 */
export function ModeSwitch({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { mode, setMode, isLoading } = useActiveMode();
  const { user } = useAuth();
  const sub = useSubscription(user?.id);

  const legacyQ = useQuery({
    queryKey: ["profile-legacy-dual", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("legacy_dual_mode")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return Boolean((data as any)?.legacy_dual_mode);
    },
  });

  const legacy = legacyQ.data ?? false;
  const dropAllowed = canAccessDropshipping(sub.plan, legacy);
  const dualAllowed = canUseDualMode(sub.plan, legacy);
  const lockedToCod = sub.plan === "cod";

  const handleChange = (m: BusinessMode) => {
    if (m === "dropshipping" && !dropAllowed) {
      toast.error(
        "Ton plan COD n'inclut pas le Dropshipping. Passe à Starter ($12) ou plus.",
      );
      return;
    }
    if (!dualAllowed && m !== mode) {
      toast.error("Mode verrouillé sur ton plan actuel.");
      return;
    }
    void setMode(m);
  };

  const switchDisabled = isLoading || lockedToCod || !dualAllowed;

  if (variant === "mobile") {
    return (
      <div className="px-2 py-3 border-b border-foreground/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Mode actif
          </div>
          {!dropAllowed && (
            <Link
              to="/plan"
              className="text-[10px] font-mono font-bold uppercase tracking-widest underline"
            >
              🔒 Upgrade
            </Link>
          )}
        </div>
        <PremiumModeSwitch
          mode={mode}
          onChange={handleChange}
          disabled={switchDisabled}
          size="md"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <PremiumModeSwitch
        mode={mode}
        onChange={handleChange}
        disabled={switchDisabled}
        size="sm"
      />
      {lockedToCod && (
        <Link
          to="/plan"
          title="Plan COD — Dropshipping via Starter ($12)+"
          className="text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap"
        >
          🔒 COD
        </Link>
      )}
      {!lockedToCod && !dualAllowed && (
        <Link
          to="/plan"
          title="Passe à un plan Drop pour activer les deux modes"
          className="text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap"
        >
          🔒
        </Link>
      )}
    </div>
  );
}

export function LandingModeSwitch({
  mode,
  onChange,
}: {
  mode: BusinessMode;
  onChange: (m: BusinessMode) => void;
}) {
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    return () => {
      document.documentElement.setAttribute("data-mode", "cod");
    };
  }, [mode]);

  return (
    <PremiumModeSwitch
      mode={mode}
      onChange={onChange}
      size="lg"
      className="mx-auto"
    />
  );
}

export function ModeIndicator() {
  const { mode } = useActiveMode();
  const isCod = mode === "cod";
  return (
    <div
      key={mode}
      className="mode-fade w-full px-4 md:px-6 py-1.5 border-b border-foreground/20 font-mono text-[10px] uppercase tracking-[0.25em] flex items-center justify-between bg-accent text-accent-foreground"
    >
      <span>
        <span className="opacity-70">Mode :</span>{" "}
        <span className="font-black">
          {isCod ? "COD · CASH ON DELIVERY · AFRIQUE (FCFA)" : "DROPSHIPPING · INTERNATIONAL"}
        </span>
      </span>
      <Link to="/settings" className="opacity-70 hover:opacity-100 hidden md:inline">
        Paramètres →
      </Link>
    </div>
  );
}
