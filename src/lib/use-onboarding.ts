import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type OnboardingStatus = "pending" | "in_progress" | "skipped" | "done";

export const TOTAL_STEPS = 4;

export const STEP_ROUTES: Record<number, { path: string; label: string }> = {
  1: { path: "/products", label: "Créer un produit" },
  2: { path: "/entries", label: "Faire une saisie" },
  3: { path: "/dashboard", label: "Voir tes KPIs" },
  4: { path: "/dashboard", label: "Lire tes KPIs avancés" },
};

export function useOnboarding() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const queryKey = ["onboarding", user?.id];

  const profileQ = useQuery({
    queryKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_status, onboarding_step")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: { status?: OnboardingStatus; step?: number }) => {
      if (!user) return;
      const updates: { onboarding_status?: string; onboarding_step?: number } = {};
      if (patch.status !== undefined) updates.onboarding_status = patch.status;
      if (patch.step !== undefined) updates.onboarding_step = patch.step;
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      if (error) throw error;
    },
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<{ onboarding_status: string; onboarding_step: number } | null>(queryKey);
      qc.setQueryData(queryKey, {
        onboarding_status: patch.status ?? previous?.onboarding_status ?? "pending",
        onboarding_step: patch.step ?? previous?.onboarding_step ?? 0,
      });
      return { previous };
    },
    onError: (_error, _patch, context) => {
      qc.setQueryData(queryKey, context?.previous ?? null);
    },
    onSettled: () => qc.invalidateQueries({ queryKey }),
  });

  const status = (profileQ.data?.onboarding_status ?? "pending") as OnboardingStatus;
  const step = profileQ.data?.onboarding_step ?? 0;
  const isActive = status === "in_progress";
  const isPending = status === "pending";

  return {
    status,
    step,
    isActive,
    isPending,
    loading: profileQ.isLoading,
    start: () => update.mutate({ status: "in_progress", step: 1 }),
    later: () => update.mutate({ status: "skipped" }),
    skip: () => update.mutate({ status: "skipped" }),
    next: () => {
      const ns = Math.min(step + 1, TOTAL_STEPS);
      if (ns >= TOTAL_STEPS) update.mutate({ status: "done", step: TOTAL_STEPS });
      else update.mutate({ step: ns });
    },
    prev: () => update.mutate({ step: Math.max(1, step - 1) }),
    goTo: (n: number) => update.mutate({ status: "in_progress", step: n }),
    finish: () => update.mutate({ status: "done", step: TOTAL_STEPS }),
    restart: () => update.mutate({ status: "in_progress", step: 1 }),
  };
}
