const DROPSHIP_PRODUCT_LIMITS = {
  free: 0,
  trial: 10,
  cod: 0,
  basic: 3,
  starter: 10,
  pro: -1
};
const COD_PRODUCT_LIMITS = {
  free: 1,
  trial: -1,
  cod: -1,
  basic: -1,
  starter: -1,
  pro: -1
};
const HISTORY_DAYS_LIMITS = {
  free: 30,
  trial: null,
  cod: 30,
  basic: 60,
  starter: null,
  pro: null
};
function dropshipProductLimitFor(plan) {
  return DROPSHIP_PRODUCT_LIMITS[plan] ?? 0;
}
function codProductLimitFor(plan) {
  return COD_PRODUCT_LIMITS[plan] ?? 0;
}
function productLimitFor(plan, mode = "dropshipping") {
  return mode === "cod" ? codProductLimitFor(plan) : dropshipProductLimitFor(plan);
}
function historyDaysFor(plan) {
  return HISTORY_DAYS_LIMITS[plan] ?? null;
}
function canAddProduct(plan, currentCount, mode) {
  const limit = productLimitFor(plan, mode);
  if (limit === -1) return true;
  if (limit === 0) return false;
  return currentCount < limit;
}
function productLimitLabel(plan, mode) {
  const limit = productLimitFor(plan, mode);
  if (limit === -1) return "illimité";
  if (limit === 0) return "0";
  return String(limit);
}
function canAccessDropshipping(plan, legacyDualMode) {
  if (plan === "cod") return false;
  return plan === "trial" || plan === "basic" || plan === "starter" || plan === "pro" || legacyDualMode;
}
function canUseDualMode(plan, legacyDualMode) {
  return canAccessDropshipping(plan, legacyDualMode);
}
function canUseUpsells(plan, mode = "dropshipping") {
  if (mode === "cod") return false;
  return plan === "starter" || plan === "pro" || plan === "trial";
}
function canUseMultiZonesCod(plan) {
  return plan === "trial" || plan === "starter" || plan === "pro";
}
function canExportCsv(plan, mode = "dropshipping") {
  if (mode === "cod") return false;
  return plan === "trial" || plan === "starter" || plan === "pro";
}
function canUseDecisionEngine(plan) {
  return plan === "pro" || plan === "trial";
}
export {
  canUseDualMode as a,
  canAddProduct as b,
  canAccessDropshipping as c,
  canUseMultiZonesCod as d,
  productLimitLabel as e,
  canUseUpsells as f,
  canUseDecisionEngine as g,
  historyDaysFor as h,
  canExportCsv as i,
  productLimitFor as p
};
