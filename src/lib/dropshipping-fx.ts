/**
 * Conversions monétaires strictement réservées au mode Dropshipping.
 * Devises autorisées : EUR, USD, GBP — jamais XOF / FCFA.
 */

export type DropshippingCurrency = "EUR" | "USD" | "GBP";

export const DROPSHIPPING_CURRENCIES: DropshippingCurrency[] = ["EUR", "USD", "GBP"];

/** 1 unité de devise → valeur en USD (taux indicatifs, overridables partiellement). */
export const DEFAULT_USD_PER_UNIT: Record<DropshippingCurrency, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
};

export function isDropshippingCurrency(value?: string | null): value is DropshippingCurrency {
  const cur = String(value ?? "").toUpperCase();
  return DROPSHIPPING_CURRENCIES.includes(cur as DropshippingCurrency);
}

export function normalizeDropshippingCurrency(
  currency?: string | null,
  fallback: DropshippingCurrency = "EUR",
): DropshippingCurrency {
  const cur = String(currency ?? fallback).toUpperCase();
  if (cur === "XOF") {
    // Fuite COD → on refuse XOF en dropshipping (montants FCFA interprétés à l'échelle EUR).
    return fallback;
  }
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
  const from = normalizeDropshippingCurrency(fromCurrency, opts?.displayCurrency ?? "EUR");
  const to = normalizeDropshippingCurrency(toCurrency, opts?.displayCurrency ?? "EUR");
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
    "EUR",
  );
  return {
    displayCurrency,
    usdToDisplayRate: readDropshippingUsdRate(profile),
  };
}
