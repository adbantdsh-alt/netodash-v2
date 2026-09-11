import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Grille actuelle (2 forfaits) :
 *   - trial    → Essai gratuit 7 jours, accès complet mais 3 produits max
 *   - basic    → Basic $10/mois : produits illimités, sans Analytics Pro
 *   - pro      → Pro $15/mois : Basic + Analytics Pro (+ Decision Engine)
 *   - free     → post-essai sans abonnement
 *
 * Clés héritées conservées pour les abonnés existants (aucun changement de
 * prix ni de droits pour eux) :
 *   - cod      → ancien plan COD $10
 *   - starter  → ancien plan Pro $29
 */
export type RawPlan = "trial" | "cod" | "basic" | "starter" | "pro";
export type EffectivePlan = RawPlan | "free";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "incomplete";

export type SubscriptionRow = {
  user_id: string;
  plan: RawPlan;
  status: SubscriptionStatus;
  trial_ends_at: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionState = {
  loading: boolean;
  raw: SubscriptionRow | null;
  plan: EffectivePlan;
  status: SubscriptionStatus | null;
  trialEndsAt: Date | null;
  trialDaysLeft: number | null;
  isTrialing: boolean;
  hasPaidAccess: boolean;
  hasScaleAccess: boolean;
  hasPremiumAccess: boolean;
  hasAnalyticsAccess: boolean;
  hasProAccess: boolean;
  hasBasicAccess: boolean;
  /** Plan COD $10 actif. */
  hasCodPlanAccess: boolean;
  needsPayment: boolean;
  isFree: boolean;
};

function computeEffective(row: SubscriptionRow | null): SubscriptionState {
  if (!row) {
    return {
      loading: false,
      raw: null,
      plan: "free",
      status: null,
      trialEndsAt: null,
      trialDaysLeft: null,
      isTrialing: false,
      hasPaidAccess: false,
      hasScaleAccess: false,
      hasPremiumAccess: false,
      hasAnalyticsAccess: false,
      hasProAccess: false,
      hasBasicAccess: false,
      hasCodPlanAccess: false,
      needsPayment: false,
      isFree: true,
    };
  }
  const trialEndsAt = new Date(row.trial_ends_at);
  const periodEnd = row.current_period_end ? new Date(row.current_period_end) : null;
  const now = new Date();
  const trialActive = row.plan === "trial" && trialEndsAt.getTime() > now.getTime();
  const periodActive = !periodEnd || periodEnd.getTime() > now.getTime();
  const paidActive =
    (row.plan === "cod" ||
      row.plan === "basic" ||
      row.plan === "starter" ||
      row.plan === "pro") &&
    (row.status === "active" || row.status === "incomplete") &&
    periodActive;

  let plan: EffectivePlan;
  if (paidActive) plan = row.plan;
  else if (trialActive) plan = "trial";
  else plan = "free";

  const trialDaysLeft = trialActive
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / 86_400_000))
    : null;

  const isScale = plan === "pro";
  const isProOrBetter = plan === "pro" || plan === "starter" || plan === "trial";
  const isDropPaid = plan === "basic" || plan === "starter" || plan === "pro";
  const isBasicOrBetter = plan !== "free";
  // Analytics Pro : forfait Pro (et essai). Le forfait Basic ne l'inclut pas.
  const hasAnalytics = plan === "pro" || plan === "starter" || plan === "trial";

  return {
    loading: false,
    raw: row,
    plan,
    status: row.status,
    trialEndsAt,
    trialDaysLeft,
    isTrialing: trialActive,
    hasPaidAccess: isBasicOrBetter,
    hasScaleAccess: isScale,
    hasPremiumAccess: isScale,
    hasAnalyticsAccess: hasAnalytics,
    hasProAccess: isProOrBetter,
    hasBasicAccess: isDropPaid || plan === "cod" || plan === "trial",
    hasCodPlanAccess: plan === "cod",
    needsPayment: false,
    isFree: plan === "free",
  };
}

const EMPTY_LOADING: SubscriptionState = {
  loading: true,
  raw: null,
  plan: "free",
  status: null,
  trialEndsAt: null,
  trialDaysLeft: null,
  isTrialing: false,
  hasPaidAccess: false,
  hasScaleAccess: false,
  hasPremiumAccess: false,
  hasAnalyticsAccess: false,
  hasProAccess: false,
  hasBasicAccess: false,
  hasCodPlanAccess: false,
  needsPayment: false,
  isFree: false,
};

export function useSubscription(userId: string | undefined): SubscriptionState {
  const q = useQuery({
    queryKey: ["subscription", userId],
    enabled: !!userId,
    refetchInterval: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return (data as SubscriptionRow | null) ?? null;
    },
  });

  if (!userId || q.isLoading) return EMPTY_LOADING;
  return computeEffective(q.data ?? null);
}

export const PLAN_LABELS: Record<EffectivePlan, string> = {
  trial: "Essai gratuit",
  cod: "COD (hérité)",
  basic: "Basic",
  starter: "Pro (hérité)",
  pro: "Pro",
  free: "Free",
};

export const PLAN_PRICES = {
  cod: { amount: 10, currency: "USD", display: "$10/mois" },
  basic: { amount: 10, currency: "USD", display: "$10/mois" },
  starter: { amount: 29, currency: "USD", display: "$29/mois" },
  pro: { amount: 15, currency: "USD", display: "$15/mois" },
} as const;
