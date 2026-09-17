/**
 * Conversions monétaires — deux lignes de business :
 *
 *  - ligne **CopyX** : devises forcées à XOF (FCFA), acomptes + XaalipSay ;
 *  - ligne **Dropshipping** : la devise de la boutique est choisie par le
 *    marchand (EUR / USD / GBP / XOF) et la devise du compte pub peut différer.
 *
 * Aucun mélange entre les deux lignes : la devise d'affichage vient toujours du
 * mode actif (voir `use-active-mode.ts`), et les montants d'une ligne ne sont
 * jamais additionnés à ceux de l'autre.
 */

export type DropshippingCurrency = "EUR" | "USD" | "GBP" | "XOF";

/** Devises proposées sur la ligne Dropshipping. */
export const DROPSHIPPING_CURRENCIES: DropshippingCurrency[] = ["EUR", "USD", "GBP", "XOF"];

/** Devise de la ligne CopyX (imposée). */
export const APP_CURRENCY: DropshippingCurrency = "XOF";

/** Devise par défaut d'une nouvelle boutique Dropshipping. */
export const DEFAULT_DROPSHIPPING_CURRENCY: DropshippingCurrency = "EUR";

/** 1 unité de devise → valeur en USD (taux indicatifs, overridables partiellement). */
export const DEFAULT_USD_PER_UNIT: Record<DropshippingCurrency, number> = {
  XOF: 1 / 600,
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
};

export function isDropshippingCurrency(value?: string | null): value is DropshippingCurrency {
  const cur = String(value ?? "").toUpperCase();
  return DROPSHIPPING_CURRENCIES.includes(cur as DropshippingCurrency);
}

/**
 * Normalise un code devise. Les devises supportées sont conservées telles
 * quelles (EUR / USD / GBP / XOF) ; une valeur vide ou inconnue retombe sur
 * `fallback` (EUR par défaut côté Dropshipping, XOF côté CopyX).
 */
export function normalizeDropshippingCurrency(
  currency?: string | null,
  fallback: DropshippingCurrency = DEFAULT_DROPSHIPPING_CURRENCY,
): DropshippingCurrency {
  const cur = String(currency ?? fallback).toUpperCase();
  return isDropshippingCurrency(cur) ? cur : fallback;
}

export type DropshippingFxOptions = {
  /** Taux personnalisé : 1 USD = N unités de la devise d'affichage (ex. 0.92 EUR). */
  usdToDisplayRate?: number | null;
  displayCurrency?: DropshippingCurrency;
};

function usdPerUnit(
  currency: DropshippingCurrency,
  opts?: DropshippingFxOptions,
): number {
  if (
    currency === opts?.displayCurrency &&
    opts?.usdToDisplayRate != null &&
    Number.isFinite(opts.usdToDisplayRate) &&
    opts.usdToDisplayRate > 0
  ) {
    // usdToDisplayRate : 1 USD = N unités de la devise d'affichage → 1 unité display = 1/N USD
    return 1 / opts.usdToDisplayRate;
  }
  return DEFAULT_USD_PER_UNIT[currency];
}

/** Convertit un montant entre devises dropshipping via pivot USD. */
export function convertDropshippingCurrency(
  value: number,
  fromCurrency?: string | null,
  toCurrency?: string | null,
  opts?: DropshippingFxOptions,
): number {
  const raw = Number(value) || 0;
  const fallback = opts?.displayCurrency ?? DEFAULT_DROPSHIPPING_CURRENCY;
  const from = normalizeDropshippingCurrency(fromCurrency, fallback);
  const to = normalizeDropshippingCurrency(toCurrency, fallback);
  if (from === to) return raw;

  const amountUsd = raw * usdPerUnit(from, opts);
  const targetUsdPerUnit = usdPerUnit(to, opts);
  return amountUsd / targetUsdPerUnit;
}

/** Lit le taux USD → devise d'affichage depuis le profil (champ dédié dropshipping). */
export function readDropshippingUsdRate(profile: {
  dropshipping_usd_fx?: number | null;
  usd_to_xof_rate?: number | null;
} | null | undefined): number | null {
  const dedicated = Number(profile?.dropshipping_usd_fx);
  if (Number.isFinite(dedicated) && dedicated > 0 && dedicated < 50) {
    return dedicated;
  }
  // Legacy : certains profils ont stocké un taux FX (<50) dans usd_to_xof_rate par erreur UI.
  const legacy = Number(profile?.usd_to_xof_rate);
  if (Number.isFinite(legacy) && legacy > 0 && legacy < 50) {
    return legacy;
  }
  return null;
}

export function dropshippingFxOptionsFromProfile(
  profile: {
    dropshipping_currency?: string | null;
    currency?: string | null;
    dropshipping_usd_fx?: number | null;
    usd_to_xof_rate?: number | null;
  } | null | undefined,
): DropshippingFxOptions {
  const displayCurrency = normalizeDropshippingCurrency(
    profile?.dropshipping_currency ?? profile?.currency,
    DEFAULT_DROPSHIPPING_CURRENCY,
  );
  return {
    displayCurrency,
    usdToDisplayRate: readDropshippingUsdRate(profile),
  };
}
