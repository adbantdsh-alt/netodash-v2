/**
 * Conversions monétaires de l'application. Devise unique : FCFA (XOF).
 *
 * Historique : ce module n'acceptait que EUR / USD / GBP pour isoler le
 * dropshipping du COD. Le COD a été retiré et l'app est mono-devise FCFA.
 *
 * IMPORTANT — les codes EUR / USD / GBP restent dans le type uniquement pour
 * relire d'anciennes lignes en base. Ils sont désormais *ramenés à XOF sans
 * conversion* : les montants saisis par les opérateurs ouest-africains étaient
 * des montants FCFA mal étiquetés après le changement de devise. Convertir avec
 * un taux (×655) ferait exploser tous les historiques ; on conserve donc la
 * valeur telle qu'elle a été saisie, seul le symbole change.
 */

export type DropshippingCurrency = "EUR" | "USD" | "GBP" | "XOF";

export const DROPSHIPPING_CURRENCIES: DropshippingCurrency[] = ["XOF"];

/** Devise unique de l'application (affichage + saisie + stockage). */
export const APP_CURRENCY: DropshippingCurrency = "XOF";

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
 * Normalise un code devise vers la devise unique FCFA.
 * Les codes hérités (EUR / USD / GBP) sont ramenés à XOF sans conversion, et une
 * valeur vide ou inconnue retombe aussi sur XOF.
 */
export function normalizeDropshippingCurrency(
  currency?: string | null,
  fallback: DropshippingCurrency = APP_CURRENCY,
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
  const from = normalizeDropshippingCurrency(fromCurrency, opts?.displayCurrency ?? APP_CURRENCY);
  const to = normalizeDropshippingCurrency(toCurrency, opts?.displayCurrency ?? APP_CURRENCY);
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
    APP_CURRENCY,
  );
  return {
    displayCurrency,
    usdToDisplayRate: readDropshippingUsdRate(profile),
  };
}
