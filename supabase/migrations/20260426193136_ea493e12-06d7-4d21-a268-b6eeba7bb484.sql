-- Add CPL target to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS target_cpl numeric NOT NULL DEFAULT 0;

-- Enrich creatives table (used as Campagnes in UI)
ALTER TABLE public.creatives ADD COLUMN IF NOT EXISTS budget_total numeric DEFAULT 0;
ALTER TABLE public.creatives ADD COLUMN IF NOT EXISTS objective text;