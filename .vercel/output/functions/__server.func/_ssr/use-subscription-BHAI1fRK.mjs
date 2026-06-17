import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
function computeEffective(row) {
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
      isFree: true
    };
  }
  const trialEndsAt = new Date(row.trial_ends_at);
  const periodEnd = row.current_period_end ? new Date(row.current_period_end) : null;
  const now = /* @__PURE__ */ new Date();
  const trialActive = row.plan === "trial" && trialEndsAt.getTime() > now.getTime();
  const periodActive = !periodEnd || periodEnd.getTime() > now.getTime();
  const paidActive = (row.plan === "cod" || row.plan === "basic" || row.plan === "starter" || row.plan === "pro") && (row.status === "active" || row.status === "incomplete") && periodActive;
  let plan;
  if (paidActive) plan = row.plan;
  else if (trialActive) plan = "trial";
  else plan = "free";
  const trialDaysLeft = trialActive ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / 864e5)) : null;
  const isScale = plan === "pro";
  const isProOrBetter = plan === "pro" || plan === "starter" || plan === "trial";
  const isDropPaid = plan === "basic" || plan === "starter" || plan === "pro";
  const isBasicOrBetter = plan !== "free";
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
    hasBasicAccess: isDropPaid || plan === "cod" || plan === "trial",
    hasCodPlanAccess: plan === "cod",
    needsPayment: false,
    isFree: plan === "free"
  };
}
const EMPTY_LOADING = {
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
  isFree: false
};
function useSubscription(userId) {
  const q = useQuery({
    queryKey: ["subscription", userId],
    enabled: !!userId,
    refetchInterval: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
      if (error) throw error;
      return data ?? null;
    }
  });
  if (!userId || q.isLoading) return EMPTY_LOADING;
  return computeEffective(q.data ?? null);
}
const PLAN_LABELS = {
  trial: "Essai gratuit",
  cod: "COD",
  basic: "Starter",
  starter: "Pro",
  pro: "Scale",
  free: "Free"
};
export {
  PLAN_LABELS as P,
  useSubscription as u
};
