import { r as reactExports } from "../_libs/react.mjs";
import { d as dropshippingFxOptionsFromProfile } from "./dropshipping-fx-BpQqYaq9.mjs";
import { c as useProfile, u as useActiveMode } from "./queries-BVXaOG3h.mjs";
function useDropshippingFx(userId) {
  const profileQ = useProfile(userId);
  const { currency } = useActiveMode();
  const fx = reactExports.useMemo(
    () => ({
      ...dropshippingFxOptionsFromProfile(profileQ.data),
      displayCurrency: currency
    }),
    [profileQ.data, currency]
  );
  const codUsdToXofRate = Number(
    profileQ.data?.usd_to_xof_rate ?? 600
  );
  return { fx, codUsdToXofRate };
}
export {
  useDropshippingFx as u
};
