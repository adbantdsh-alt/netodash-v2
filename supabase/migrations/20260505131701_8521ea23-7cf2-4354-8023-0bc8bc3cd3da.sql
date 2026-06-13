-- Ajout pays cibles sur produits + régions sélectionnées sur zones de livraison
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS countries text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.delivery_zones
  ADD COLUMN IF NOT EXISTS regions text[] NOT NULL DEFAULT '{}';