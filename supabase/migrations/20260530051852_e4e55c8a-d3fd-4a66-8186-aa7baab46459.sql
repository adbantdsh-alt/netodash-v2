ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.daily_entries ADD COLUMN IF NOT EXISTS refunded_orders integer NOT NULL DEFAULT 0;
ALTER TABLE public.daily_entries ADD COLUMN IF NOT EXISTS refunded_amount numeric NOT NULL DEFAULT 0;
ALTER TABLE public.daily_entries ADD COLUMN IF NOT EXISTS cancelled_orders integer NOT NULL DEFAULT 0;