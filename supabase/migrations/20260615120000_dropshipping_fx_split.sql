-- Sépare le taux FX dropshipping (USD→EUR/GBP) du taux COD (USD→XOF).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dropshipping_usd_fx numeric;

COMMENT ON COLUMN public.profiles.dropshipping_usd_fx IS
  'Dropshipping : 1 USD = N unités de dropshipping_currency. NULL = taux par défaut.';

-- Reprendre les anciens taux FX plausibles (<50) erronément stockés dans usd_to_xof_rate.
UPDATE public.profiles
SET dropshipping_usd_fx = usd_to_xof_rate
WHERE dropshipping_usd_fx IS NULL
  AND usd_to_xof_rate IS NOT NULL
  AND usd_to_xof_rate > 0
  AND usd_to_xof_rate < 50;
