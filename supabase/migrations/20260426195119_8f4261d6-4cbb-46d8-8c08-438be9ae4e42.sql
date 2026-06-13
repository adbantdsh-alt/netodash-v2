-- Add testing window configuration to products
ALTER TABLE public.products
  ADD COLUMN testing_days integer NOT NULL DEFAULT 3,
  ADD COLUMN testing_started_at date;

ALTER TABLE public.products
  ADD CONSTRAINT products_testing_days_check CHECK (testing_days IN (3, 5));

-- Add optional CTR (%) on daily entries
ALTER TABLE public.daily_entries
  ADD COLUMN ctr numeric;

-- Helpful index for querying entries by product+date (used by series + testing logic)
CREATE INDEX IF NOT EXISTS daily_entries_product_date_idx
  ON public.daily_entries (product_id, entry_date);
