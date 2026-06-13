ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS total_revenue_currency text NOT NULL DEFAULT 'EUR';

UPDATE public.daily_entries
SET ad_budget_currency = 'EUR'
WHERE ad_budget_currency IS NULL OR ad_budget_currency NOT IN ('EUR', 'USD', 'GBP');

UPDATE public.daily_entries
SET total_revenue_currency = CASE
  WHEN total_revenue_currency IN ('EUR', 'USD', 'GBP') THEN total_revenue_currency
  WHEN ad_budget_currency IN ('EUR', 'USD', 'GBP') THEN ad_budget_currency
  ELSE 'EUR'
END;

UPDATE public.products
SET currency = 'EUR'
WHERE currency IS NULL OR currency NOT IN ('EUR', 'USD', 'GBP');

UPDATE public.profiles
SET currency = 'EUR'
WHERE currency IS NULL OR currency NOT IN ('EUR', 'USD', 'GBP');

ALTER TABLE public.daily_entries
  DROP CONSTRAINT IF EXISTS daily_entries_currency_check;

ALTER TABLE public.daily_entries
  ADD CONSTRAINT daily_entries_currency_check
  CHECK (ad_budget_currency IN ('EUR', 'USD', 'GBP'));

ALTER TABLE public.daily_entries
  DROP CONSTRAINT IF EXISTS daily_entries_total_revenue_currency_check;

ALTER TABLE public.daily_entries
  ADD CONSTRAINT daily_entries_total_revenue_currency_check
  CHECK (total_revenue_currency IN ('EUR', 'USD', 'GBP'));