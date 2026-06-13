import type { EffectivePlan } from "./use-subscription";

/**
 * Limites par plan. -1 = illimité.
 * Mapping interne → label public (nouvelle grille) :
 *   - trial    = Essai gratuit 14j (Pro débloqué, 10 produits)
 *   - basic    = "Starter" public ($7, 3 produits, 1 mode)
 *   - starter  = "Pro"     public ($19, 10 produits, Drop+COD)
 *   - pro      = "Scale"   public ($39, illimité + Analytics Pro)
 *   - free     = post-essai sans abonnement
 */
export const PRODUCT_LIMITS: Record<EffectivePlan, number> = {
  free: 1,
  trial: 10,
  basic: 3,
  starter: 10,
  pro: -1,
};

/** Nombre de jours d'historique visibles. null = illimité. */
export const HISTORY_DAYS_LIMITS: Record<EffectivePlan, number | null> = {
  free: 30,
  trial: null,
  basic: 60,
  starter: null,
  pro: null,
};

export function productLimitFor(plan: EffectivePlan): number {
  return PRODUCT_LIMITS[plan] ?? 0;
}

export function historyDaysFor(plan: EffectivePlan): number | null {
  return HISTORY_DAYS_LIMITS[plan] ?? null;
}

export function canAddProduct(plan: EffectivePlan, currentCount: number): boolean {
  const limit = productLimitFor(plan);
  if (limit === -1) return true;
  return currentCount < limit;
}

export function productLimitLabel(plan: EffectivePlan): string {
  const limit = productLimitFor(plan);
  if (limit === -1) return "illimité";
  return String(limit);
}

/**
 * Peut utiliser Dropshipping + COD EN PARALLÈLE.
 * - Vrai pour trial / starter (Pro) / pro (Scale)
 * - Vrai aussi pour tout compte historique avec legacy_dual_mode=true
 *   (les utilisateurs créés avant l'introduction du plan Starter gardent leurs droits)
 */
export function canUseDualMode(plan: EffectivePlan, legacyDualMode: boolean): boolean {
  if (legacyDualMode) return true;
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Capture mobile colorée par mode : Pro ($19) et Scale ($39). */
export function canUseMobileCapture(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Upsells (ventes additionnelles) : indispo en trial / starter / free. */
export function canUseUpsells(plan: EffectivePlan): boolean {
  return plan === "starter" || plan === "pro" || plan === "trial";
}

/** Support WhatsApp : Pro ($19) et Scale ($39). */
export function canUseWhatsAppSupport(plan: EffectivePlan): boolean {
  return plan === "starter" || plan === "pro";
}

/** Multi-zones COD avec tarifs différenciés : Pro et Scale. Starter = 1 zone. */
export function canUseMultiZonesCod(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Export CSV de l'historique : Pro et Scale. */
export function canExportCsv(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Analytics Pro (waterfall, scoring, break-even, simulateur, insights auto) : Scale UNIQUEMENT. */
export function canUseAnalyticsPro(plan: EffectivePlan): boolean {
  return plan === "pro" || plan === "trial";
}
