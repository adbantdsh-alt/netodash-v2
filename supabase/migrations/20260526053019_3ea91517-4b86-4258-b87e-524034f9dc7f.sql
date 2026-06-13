ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS total_revenue numeric,
  ADD COLUMN IF NOT EXISTS visits integer;