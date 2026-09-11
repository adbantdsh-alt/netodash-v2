import type { EffectivePlan } from "./use-subscription";
import type { BusinessMode } from "./use-active-mode";

/**
 * Grille actuelle :
 *   - trial    = essai gratuit 7 jours, accès complet mais 3 produits max
 *   - basic    = Basic $10/mois, produits illimités (sans Analytics Pro)
 *   - pro      = Pro $15/mois, produits illimités + Analytics Pro
 *   - free     = post-essai sans abonnement
 * Clés héritées (abonnés existants intouchés) : cod (ancien COD $10),
 * starter (ancien Pro $29).
 */
export const DROPSHIP_PRODUCT_LIMITS: Record<EffectivePlan, number> = {
  free: 0,
  trial: 3,
  cod: 0,
  basic: -1,
  starter: -1,
  pro: -1,
};

/** Produits COD : illimités dès le plan COD payant. */
export const COD_PRODUCT_LIMITS: Record<EffectivePlan, number> = {
  free: 1,
  trial: -1,
  cod: -1,
  basic: -1,
  starter: -1,
  pro: -1,
};

/** @deprecated Utiliser DROPSHIP_PRODUCT_LIMITS / COD_PRODUCT_LIMITS selon le mode. */
export const PRODUCT_LIMITS: Record<EffectivePlan, number> = {
  free: 1,
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

export function dropshipProductLimitFor(plan: EffectivePlan): number {
  return DROPSHIP_PRODUCT_LIMITS[plan] ?? 0;
}

export function codProductLimitFor(plan: EffectivePlan): number {
  return COD_PRODUCT_LIMITS[plan] ?? 0;
}

export function productLimitFor(plan: EffectivePlan, mode: BusinessMode = "dropshipping"): number {
  return mode === "cod" ? codProductLimitFor(plan) : dropshipProductLimitFor(plan);
}

export function historyDaysFor(plan: EffectivePlan): number | null {
  return HISTORY_DAYS_LIMITS[plan] ?? null;
}

export function canAddProduct(
  plan: EffectivePlan,
  currentCount: number,
  mode: BusinessMode,
): boolean {
  const limit = productLimitFor(plan, mode);
  if (limit === -1) return true;
  if (limit === 0) return false;
  return currentCount < limit;
}

export function productLimitLabel(plan: EffectivePlan, mode: BusinessMode): string {
  const limit = productLimitFor(plan, mode);
  if (limit === -1) return "illimité";
  if (limit === 0) return "0";
  return String(limit);
}

/** Accès au mode Dropshipping (plan COD seul = false). */
export function canAccessDropshipping(plan: EffectivePlan, legacyDualMode: boolean): boolean {
  if (plan === "cod") return false;
  return (
    plan === "trial" ||
    plan === "basic" ||
    plan === "starter" ||
    plan === "pro" ||
    legacyDualMode
  );
}

export function canAccessCod(plan: EffectivePlan): boolean {
  return plan !== "free";
}

/** Drop + COD en parallèle (Starter Drop et au-dessus, + legacy). */
export function canUseDualMode(plan: EffectivePlan, legacyDualMode: boolean): boolean {
  return canAccessDropshipping(plan, legacyDualMode);
}

/** Capture mobile colorée : tous les forfaits payants + essai. */
export function canUseMobileCapture(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "basic" || plan === "starter" || plan === "pro";
}

/** Upsells : inclus dans Basic et Pro (+ essai). */
export function canUseUpsells(plan: EffectivePlan, mode: BusinessMode = "dropshipping"): boolean {
  if (mode === "cod") return false;
  return plan === "basic" || plan === "starter" || plan === "pro" || plan === "trial";
}

export function canUseWhatsAppSupport(plan: EffectivePlan): boolean {
  return plan === "basic" || plan === "starter" || plan === "pro";
}

/** Multi-zones : inclus dès Basic (+ hérités + essai). */
export function canUseMultiZonesCod(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "basic" || plan === "starter" || plan === "pro";
}

/** Export CSV : inclus dès Basic (+ hérités + essai). */
export function canExportCsv(plan: EffectivePlan, mode: BusinessMode = "dropshipping"): boolean {
  if (mode === "cod") return false;
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
