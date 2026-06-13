UPDATE public.profiles
SET
  dropshipping_currency = CASE
    WHEN upper(coalesce(dropshipping_currency, currency, 'EUR')) IN ('EUR', 'USD', 'GBP') THEN upper(coalesce(dropshipping_currency, currency, 'EUR'))
    ELSE 'EUR'
  END,
  currency = CASE
    WHEN upper(coalesce(dropshipping_currency, currency, 'EUR')) IN ('EUR', 'USD', 'GBP') THEN upper(coalesce(dropshipping_currency, currency, 'EUR'))
    ELSE 'EUR'
  END,
  cod_currency = 'XOF'
WHERE true;

UPDATE public.products
SET currency = 'EUR'
WHERE business_mode = 'dropshipping'
  AND upper(coalesce(currency, '')) NOT IN ('EUR', 'USD', 'GBP');

UPDATE public.products
SET currency = 'XOF'
WHERE business_mode = 'cod'
  AND upper(coalesce(currency, '')) <> 'XOF';

UPDATE public.daily_entries
SET ad_budget_currency = 'EUR'
WHERE business_mode = 'dropshipping'
  AND upper(coalesce(ad_budget_currency, '')) NOT IN ('EUR', 'USD', 'GBP');

UPDATE public.daily_entries
SET total_revenue_currency = 'EUR'
WHERE business_mode = 'dropshipping'
  AND total_revenue_currency IS NOT NULL
  AND upper(coalesce(total_revenue_currency, '')) NOT IN ('EUR', 'USD', 'GBP');

UPDATE public.daily_entries
SET total_revenue_currency = 'XOF'
WHERE business_mode = 'cod'
  AND total_revenue_currency IS DISTINCT FROM 'XOF';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_dropshipping_currency_allowed,
  DROP CONSTRAINT IF EXISTS profiles_cod_currency_locked;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_dropshipping_currency_allowed
    CHECK (dropshipping_currency IS NULL OR upper(dropshipping_currency) IN ('EUR', 'USD', 'GBP')),
  ADD CONSTRAINT profiles_cod_currency_locked
    CHECK (cod_currency IS NULL OR upper(cod_currency) = 'XOF');

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_currency_matches_business_mode;

ALTER TABLE public.products
  ADD CONSTRAINT products_currency_matches_business_mode
    CHECK (
      (business_mode = 'dropshipping' AND upper(currency) IN ('EUR', 'USD', 'GBP'))
      OR
      (business_mode = 'cod' AND upper(currency) = 'XOF')
    );

ALTER TABLE public.daily_entries
  DROP CONSTRAINT IF EXISTS daily_entries_currency_matches_business_mode;

ALTER TABLE public.daily_entries
  ADD CONSTRAINT daily_entries_currency_matches_business_mode
    CHECK (
      (business_mode = 'dropshipping'
        AND upper(ad_budget_currency) IN ('EUR', 'USD', 'GBP')
        AND (total_revenue_currency IS NULL OR upper(total_revenue_currency) IN ('EUR', 'USD', 'GBP'))
      )
      OR
      (business_mode = 'cod'
        AND (ad_budget_currency IS NULL OR upper(ad_budget_currency) IN ('XOF', 'EUR', 'USD', 'GBP'))
        AND (total_revenue_currency IS NULL OR upper(total_revenue_currency) = 'XOF')
      )
    );