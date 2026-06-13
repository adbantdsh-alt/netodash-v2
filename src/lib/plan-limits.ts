import type { EffectivePlan } from "./use-subscription";
import type { BusinessMode } from "./use-active-mode";

/**
 * Grille v5 :
 *   - cod      = Plan COD $10 (COD uniquement, dashboard basique 7/30j)
 *   - basic    = Starter Drop $12 (3 prod. Drop + COD inclus)
 *   - starter  = Pro $29 (10 prod. Drop + COD + upsells/export/multi-zones)
 *   - pro      = Scale $79 (illimité Drop + Analytics Pro)
 *   - trial    = 14j accès complet
 *   - free     = post-essai sans abo
 */
export const DROPSHIP_PRODUCT_LIMITS: Record<EffectivePlan, number> = {
  free: 0,
  trial: 10,
  cod: 0,
  basic: 3,
  starter: 10,
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
  trial: 10,
  cod: -1,
  basic: 3,
  starter: 10,
  pro: -1,
};

export const HISTORY_DAYS_LIMITS: Record<EffectivePlan, number | null> = {
  free: 30,
  trial: null,
  cod: 30,
  basic: 60,
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

/** Capture mobile colorée : Pro et Scale (Drop). */
export function canUseMobileCapture(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Upsells : Pro / Scale / essai — Dropshipping uniquement. */
export function canUseUpsells(plan: EffectivePlan, mode: BusinessMode = "dropshipping"): boolean {
  if (mode === "cod") return false;
  return plan === "starter" || plan === "pro" || plan === "trial";
}

export function canUseWhatsAppSupport(plan: EffectivePlan): boolean {
  return plan === "starter" || plan === "pro";
}

/** Multi-zones COD : Pro / Scale / essai — pas en plan COD $10 seul. */
export function canUseMultiZonesCod(plan: EffectivePlan): boolean {
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Export CSV : Pro / Scale / essai — Dropshipping uniquement. */
export function canExportCsv(plan: EffectivePlan, mode: BusinessMode = "dropshipping"): boolean {
  if (mode === "cod") return false;
  return plan === "trial" || plan === "starter" || plan === "pro";
}

/** Analytics Pro : Scale + essai (Dropshipping uniquement côté UI). */
export function canUseAnalyticsPro(plan: EffectivePlan): boolean {
  return plan === "pro" || plan === "trial";
}

/** Decision Engine (Scale / Watch / Kill) : Scale + essai, Drop uniquement. */
export function canUseDecisionEngine(plan: EffectivePlan): boolean {
  return plan === "pro" || plan === "trial";
}
