ALTER TABLE public.daily_entries
ADD COLUMN IF NOT EXISTS include_meta_tax boolean NOT NULL DEFAULT true;