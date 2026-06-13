import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BetaBenefits = {
  freeUntil: Date | null;
  lifetimeDiscountPercent: number;
  isBetaTester: boolean;
  isFreePeriodActive: boolean;
  freeDaysLeft: number | null;
};

export function useBetaBenefits(userId: string | undefined) {
  return useQuery({
    queryKey: ["beta-benefits", userId],
    enabled: !!userId,
    queryFn: async (): Promise<BetaBenefits | null> => {
      const { data, error } = await supabase
        .from("beta_testers")
        .select("free_until, lifetime_discount_percent, status")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const freeUntil = data.free_until ? new Date(data.free_until as string) : null;
      const now = Date.now();
      const isFreePeriodActive = !!freeUntil && freeUntil.getTime() > now;
      const freeDaysLeft = isFreePeriodActive
        ? Math.max(0, Math.ceil((freeUntil!.getTime() - now) / 86_400_000))
        : null;

      return {
        freeUntil,
        lifetimeDiscountPercent: Number(data.lifetime_discount_percent ?? 50),
        isBetaTester: (data.status as string) === "active",
        isFreePeriodActive,
        freeDaysLeft,
      };
    },
    staleTime: 60_000,
  });
}
