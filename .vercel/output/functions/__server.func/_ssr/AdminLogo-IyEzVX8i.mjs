import { c as createSsrRpc } from "./createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireAdmin } from "./admin-auth.middleware.server-YY1OZxJW.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const checkIsAdminAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  userId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("85fed52218865121fb40605209c6dc9fa50f137c271a9233672975bd60ccfd86"));
const getCurrentAdmin = createServerFn({
  method: "GET"
}).middleware([requireAdmin]).handler(createSsrRpc("08435824b548ef182c935cde55b21f5b42057ed9fde4c8ace2b3c821d92df234"));
const touchAdminLogin = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).handler(createSsrRpc("0fc968d5a216172d7d018ef13a6c9f171bb5b723b4b74606a012f69550b774b1"));
function AdminLogo({ inverted = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-baseline gap-0.5 select-none",
      style: { fontWeight: 900, letterSpacing: "-0.04em", fontSize: "1.5rem" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: inverted ? "#fff" : "#000" }, children: "NETODASH" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#E05C1A" }, children: "." })
      ]
    }
  );
}
export {
  AdminLogo as A,
  checkIsAdminAccount as c,
  getCurrentAdmin as g,
  touchAdminLogin as t
};
