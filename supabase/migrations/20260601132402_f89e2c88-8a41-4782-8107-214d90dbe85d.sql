
-- Zones de livraison par produit COD (ex: Dakar 1500, Régions 2500)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS shipping_zones jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Répartition des livraisons par zone sur chaque saisie quotidienne COD
ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS delivered_by_zone jsonb NOT NULL DEFAULT '{}'::jsonb;
