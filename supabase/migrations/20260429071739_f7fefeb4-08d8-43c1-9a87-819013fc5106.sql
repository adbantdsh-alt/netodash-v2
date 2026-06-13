ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS delivery_fee_dakar numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_fee_regions numeric NOT NULL DEFAULT 0;

ALTER TABLE public.products
  ALTER COLUMN delivery_fee DROP NOT NULL,
  ALTER COLUMN delivery_fee SET DEFAULT 0;

ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS delivered_dakar integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivered_regions integer NOT NULL DEFAULT 0;