ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS received_orders integer,
  ADD COLUMN IF NOT EXISTS confirmed_orders integer;