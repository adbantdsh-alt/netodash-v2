import { c as createSsrRpc } from "./createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
const listFiltersSchema = objectType({
  search: stringType().trim().max(200).optional(),
  plan: enumType(["free", "trial", "cod", "basic", "starter", "pro"]).optional(),
  status: enumType(["active", "suspended", "banned"]).optional(),
  country: stringType().max(64).optional(),
  dateFrom: stringType().optional(),
  dateTo: stringType().optional()
});
const listInput = listFiltersSchema.extend({
  page: numberType().int().min(1).max(1e4).default(1),
  pageSize: numberType().int().min(1).max(100).default(25)
}).default({
  page: 1,
  pageSize: 25
});
const adminListUsers = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => listInput.parse(input ?? {})).handler(createSsrRpc("4ddda3223cc7fd896cfccaf445235784da615ff755f00b83371db7eb7d5e3a21"));
const adminExportUsersCsv = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => listFiltersSchema.parse(input ?? {})).handler(createSsrRpc("14701e35b68d6a44ad016f2a4640a10589dab467db9b1e90768582cb43ac73f7"));
const adminGetUserProfile = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("d68579f18e40b2bd1279cef54685be15cad9e79a87ad9062cff99f3e71434007"));
const adminChangeUserPlan = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  plan: enumType(["free", "trial", "cod", "basic", "starter", "pro"]),
  reason: stringType().trim().max(500).optional()
}).parse(input)).handler(createSsrRpc("b8af022fd9f459dc75718c721480c729a67aff801c652116c5a587ceca388c54"));
const adminGrantFreeAccess = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  duration: numberType().int().min(1).max(3650),
  unit: enumType(["days", "months", "years"]),
  plan: enumType(["cod", "basic", "starter", "pro"])
}).parse(input)).handler(createSsrRpc("0f55f3c8f1dbecc00091f83c23fcd369f16b96e7ee62009841148b4a9c875d3a"));
const adminSuspendUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  reason: stringType().trim().min(3).max(500)
}).parse(input)).handler(createSsrRpc("f4507fc4122441b3575cf9b73e5fe53407792607753188d5d4e6289f3da8ab26"));
const adminUnsuspendUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0abe4e6b014453ad2f6ad3d271513a4cfd513e0bc51dfe6aa18f813dbcc2b474"));
const adminBanUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  reason: stringType().trim().min(3).max(500)
}).parse(input)).handler(createSsrRpc("5d723d5e58621c64ce574c1ffe373b6d2c7e384ac0076a218480b394e365fdd1"));
const adminDeleteUserData = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("cadd68642b9f8a66e68cdc51fc663cc4f87499ea261d5df5ea531a4c8141886f"));
const adminImpersonateUser = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("9ed8d2761b13b6db36828190617ee2af63d34ad3aa9ad5a1d21a49a50fb1712a"));
const stopImpersonation = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("e5f5ac0d97eb69dbe0375830d4ad2a7920ff5fdcc77d53cab8d10dcee047fb98"));
export {
  adminListUsers as a,
  adminExportUsersCsv as b,
  adminImpersonateUser as c,
  adminGrantFreeAccess as d,
  adminGetUserProfile as e,
  adminChangeUserPlan as f,
  adminSuspendUser as g,
  adminUnsuspendUser as h,
  adminBanUser as i,
  adminDeleteUserData as j,
  stopImpersonation as s
};
