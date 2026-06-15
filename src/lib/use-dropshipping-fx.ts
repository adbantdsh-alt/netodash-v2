import { useMemo } from "react";
import { dropshippingFxOptionsFromProfile, type DropshippingFxOptions } from "./dropshipping-fx";
import { useProfile } from "./queries";
import { useActiveMode } from "./use-active-mode";

/** FX dropshipping (EUR / USD / GBP) — séparé du taux COD XOF. */
export function useDropshippingFx(userId: string | undefined): {
  fx: DropshippingFxOptions;
  codUsdToXofRate: number;
} {
  const profileQ = useProfile(userId);
  const { currency } = useActiveMode();
  const fx = useMemo(
    () => ({
      ...dropshippingFxOptionsFromProfile(profileQ.data as never),
      displayCurrency: currency as DropshippingFxOptions["displayCurrency"],
    }),
    [profileQ.data, currency],
  );
  const codUsdToXofRate = Number(
    (profileQ.data as { usd_to_xof_rate?: number } | undefined)?.usd_to_xof_rate ?? 600,
  );
  return { fx, codUsdToXofRate };
}
