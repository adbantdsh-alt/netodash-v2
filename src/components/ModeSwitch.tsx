import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useActiveMode, type BusinessMode } from "@/lib/use-active-mode";
import { PremiumModeSwitch } from "@/components/PremiumModeSwitch";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { canUseDualMode } from "@/lib/plan-limits";
import { toast } from "sonner";

/**
 * Switch de mode actif (Drop / COD).
 * - Plans Pro/Premium ou comptes "legacy_dual_mode" : switch libre.
 * - Plans Basic / Free : verrouillé sur le mode sélectionné au signup
 *   (`profiles.selected_mode`), avec un lien d'upgrade vers Pro.
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
  const dualAllowed = canUseDualMode(sub.plan, legacy);

  const handleChange = (m: BusinessMode) => {
    if (!dualAllowed && m !== mode) {
      toast.error("Mode verrouillé sur ton plan Basic. Passe au plan Pro pour activer Drop + COD en parallèle.");
      return;
    }
    void setMode(m);
  };

  if (variant === "mobile") {
    return (
      <div className="px-2 py-3 border-b border-foreground/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Mode actif
          </div>
          {!dualAllowed && (
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
          disabled={isLoading || !dualAllowed}
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
        disabled={isLoading || !dualAllowed}
        size="sm"
      />
      {!dualAllowed && (
        <Link
          to="/plan"
          title="Plan Basic verrouillé sur un seul mode. Passe au Pro pour activer Drop + COD."
          className="text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap"
        >
          🔒
        </Link>
      )}
    </div>
  );
}

/**
 * Switch utilisé sur la landing page : pas d'auth, juste un aperçu visuel.
 * Bascule l'accent global (orange COD / bleu Dropshipping) via [data-mode] sur <html>.
 * Contrôlé : passe `mode` + `onChange` depuis le parent pour synchroniser tout le copywriting.
 */
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
      // remet le défaut COD (orange) en quittant la landing
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

/** Bandeau discret affiché en haut du contenu de chaque page pour rappeler le mode. */
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
