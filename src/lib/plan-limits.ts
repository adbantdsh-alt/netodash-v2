import type { EffectivePlan } from "./use-subscription";
import type { BusinessMode } from "./use-active-mode";

/**
 * Limites par forfait — identiques sur les deux lignes de business
 * (CopyX et Dropshipping) :
 *
 *   - trial   = essai gratuit 7 jours, accès complet mais **3 produits max**
 *   - basic   = Basic 10 $/mois, produits illimités (sans Analytics Pro)
 *   - pro     = Pro 15 $/mois, produits illimités + Analytics Pro
 *   - free    = post-essai sans abonnement
 *   - cod / starter = clés héritées (anciens abonnés), droits conservés
 */
export const PRODUCT_LIMITS: Record<EffectivePlan, number> = {
  free: 0,
  trial: 3,
  cod: -1,
  basic: -1,
  starter: -1,
  pro: -1,
};

export const HISTORY_DAYS_LIMITS: Record<EffectivePlan, number | null> = {
  free: 30,
  trial: null,
  cod: 30,
  basic: null,
  starter: null,
  pro: null,
};

export function productLimitFor(plan: EffectivePlan, _mode: BusinessMode = "copyx"): number {
  return PRODUCT_LIMITS[plan] ?? 0;
}

export function historyDaysFor(plan: EffectivePlan): number | null {
  return HISTORY_DAYS_LIMITS[plan] ?? null;
}

export function canAddProduct(
  plan: EffectivePlan,
  currentCount: number,
  mode: BusinessMode = "copyx",
): boolean {
  const limit = productLimitFor(plan, mode);
  if (limit === -1) return true;
  if (limit === 0) return false;
  return currentCount < limit;
}

export function productLimitLabel(plan: EffectivePlan, mode: BusinessMode = "copyx"): string {
  const limit = productLimitFor(plan, mode);
  if (limit === -1) return "illimité";
  if (limit === 0) return "0";
  return String(limit);
}

/** Les deux lignes (CopyX et Dropshipping) sont ouvertes dès que l'accès est payant. */
export function canAccessDropshipping(plan: EffectivePlan, _legacyDualMode = false): boolean {
  return plan !== "free";
}

/** Capture mobile colorée : tous les forfaits payants + essai. */
export function canUseMobileCapture(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "basic" || plan === "starter" || plan === "pro";
}

/** Upsells : inclus dès Basic (+ hérités + essai). */
export function canUseUpsells(plan: EffectivePlan, _mode: BusinessMode = "copyx"): boolean {
  return plan === "basic" || plan === "starter" || plan === "pro" || plan === "trial";
}

export function canUseWhatsAppSupport(plan: EffectivePlan): boolean {
  return plan === "basic" || plan === "starter" || plan === "pro";
}

/** Multi-zones de livraison : inclus dès Basic (+ hérités + essai). */
export function canUseMultiZonesCod(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "basic" || plan === "starter" || plan === "pro";
}

/** Export CSV : inclus dès Basic (+ hérités + essai). */
export function canExportCsv(plan: EffectivePlan, _mode: BusinessMode = "copyx"): boolean {
  return plan === "trial" || plan === "basic" || plan === "starter" || plan === "pro";
}

/** Analytics Pro : forfait Pro (et essai) uniquement — PAS le forfait Basic. */
export function canUseAnalyticsPro(plan: EffectivePlan): boolean {
  return plan === "pro" || plan === "starter" || plan === "trial";
}

/** Decision Engine (Scale / Watch / Kill) : dans Analytics Pro. */
export function canUseDecisionEngine(plan: EffectivePlan): boolean {
  return plan === "pro" || plan === "starter" || plan === "trial";
}
