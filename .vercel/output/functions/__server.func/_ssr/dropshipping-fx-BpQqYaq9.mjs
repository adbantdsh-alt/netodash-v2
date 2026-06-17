const DROPSHIPPING_CURRENCIES = ["EUR", "USD", "GBP"];
const DEFAULT_USD_PER_UNIT = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27
};
function isDropshippingCurrency(value) {
  const cur = String(value ?? "").toUpperCase();
  return DROPSHIPPING_CURRENCIES.includes(cur);
}
function normalizeDropshippingCurrency(currency, fallback = "EUR") {
  const cur = String(currency ?? fallback).toUpperCase();
  if (cur === "XOF") {
    return fallback;
  }
  return isDropshippingCurrency(cur) ? cur : fallback;
}
function usdPerUnit(currency, opts) {
  if (currency === opts?.displayCurrency && opts?.usdToDisplayRate != null && Number.isFinite(opts.usdToDisplayRate) && opts.usdToDisplayRate > 0) {
    return 1 / opts.usdToDisplayRate;
  }
  return DEFAULT_USD_PER_UNIT[currency];
}
function convertDropshippingCurrency(value, fromCurrency, toCurrency, opts) {
  const raw = Number(value) || 0;
  const from = normalizeDropshippingCurrency(fromCurrency, opts?.displayCurrency ?? "EUR");
  const to = normalizeDropshippingCurrency(toCurrency, opts?.displayCurrency ?? "EUR");
  if (from === to) return raw;
  const amountUsd = raw * usdPerUnit(from, opts);
  const targetUsdPerUnit = usdPerUnit(to, opts);
  return amountUsd / targetUsdPerUnit;
}
function readDropshippingUsdRate(profile) {
  const dedicated = Number(profile?.dropshipping_usd_fx);
  if (Number.isFinite(dedicated) && dedicated > 0 && dedicated < 50) {
    return dedicated;
  }
  const legacy = Number(profile?.usd_to_xof_rate);
  if (Number.isFinite(legacy) && legacy > 0 && legacy < 50) {
    return legacy;
  }
  return null;
}
function dropshippingFxOptionsFromProfile(profile) {
  const displayCurrency = normalizeDropshippingCurrency(
    profile?.dropshipping_currency ?? profile?.currency,
    "EUR"
  );
  return {
    displayCurrency,
    usdToDisplayRate: readDropshippingUsdRate(profile)
  };
}
export {
  convertDropshippingCurrency as c,
  dropshippingFxOptionsFromProfile as d,
  normalizeDropshippingCurrency as n,
  readDropshippingUsdRate as r
};
