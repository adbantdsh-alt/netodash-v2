import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Mapping interne ↔ label public (nouvelle grille Starter / Pro / Scale) :
 *   - trial    → "Essai gratuit" (14 jours, Pro débloqué)
 *   - basic    → "Starter" ($12/mois, 3 produits, 1 mode au choix, 60j d'historique)
 *   - starter  → "Pro"     ($29/mois, 10 produits, Drop+COD, upsells, multi-zones COD)
 *   - pro      → "Scale"   ($79/mois, illimité + Analytics Pro EXCLUSIF + WhatsApp prio)
 *   - free     → "Free" (post-essai sans abo, app utilisable très limitée)
 *
 * On conserve les identifiants internes `basic` / `starter` / `pro` pour ne pas
 * casser les abonnements Stripe et les colonnes DB existantes. Seuls les LABELS
 * publics et les FEATURES changent.
 */
export type RawPlan = "trial" | "basic" | "starter" | "pro";
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
  /** Toute formule payante OU essai (≠ free). */
  hasPaidAccess: boolean;
  /** Plan Scale ($79) — le plus haut, illimité + Analytics Pro + WhatsApp prio. */
  hasScaleAccess: boolean;
  /** Alias historique de hasScaleAccess. @deprecated utiliser hasScaleAccess. */
  hasPremiumAccess: boolean;
  /** Analytics Pro (waterfall, scoring, break-even, simulateur, insights) — Scale uniquement. */
  hasAnalyticsAccess: boolean;
  /** Plan Pro ($29) ou plus — débloque Drop+COD parallèle, upsells, multi-zones COD, capture. */
  hasProAccess: boolean;
  /** Plan Starter ($12) ou plus — accès payant minimum. */
  hasBasicAccess: boolean;
  /** Compatibilité — utilise une légère période de grâce, à supprimer à terme. */
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
    (row.plan === "basic" || row.plan === "starter" || row.plan === "pro") &&
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
  const isBasicOrBetter = plan !== "free";
  // Pendant l'essai, on débloque Analytics Pro pour qu'ils voient la valeur de Scale.
  const hasAnalytics = isScale || plan === "trial";

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
    hasBasicAccess: isBasicOrBetter,
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
  basic: "Starter",
  starter: "Pro",
  pro: "Scale",
  free: "Free",
};

export const PLAN_PRICES = {
  basic: { amount: 12, currency: "USD", display: "$12/mois" },
  starter: { amount: 29, currency: "USD", display: "$29/mois" },
  pro: { amount: 79, currency: "USD", display: "$79/mois" },
} as const;
