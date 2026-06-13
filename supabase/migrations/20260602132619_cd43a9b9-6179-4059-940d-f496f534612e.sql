ALTER TABLE public.daily_entries DROP CONSTRAINT IF EXISTS daily_entries_total_revenue_currency_check;
ALTER TABLE public.daily_entries ADD CONSTRAINT daily_entries_total_revenue_currency_check CHECK (total_revenue_currency = ANY (ARRAY['EUR'::text, 'USD'::text, 'GBP'::text, 'XOF'::text]));
ALTER TABLE public.daily_entries DROP CONSTRAINT IF EXISTS daily_entries_currency_check;
ALTER TABLE public.daily_entries ADD CONSTRAINT daily_entries_currency_check CHECK (ad_budget_currency = ANY (ARRAY['EUR'::text, 'USD'::text, 'GBP'::text, 'XOF'::text]));