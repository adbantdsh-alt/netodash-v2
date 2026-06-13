
-- delivery_zones: zones libres définies par produit
CREATE TABLE public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  fee numeric NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, name)
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own zones" ON public.delivery_zones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own zones" ON public.delivery_zones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own zones" ON public.delivery_zones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own zones" ON public.delivery_zones FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_delivery_zones_product ON public.delivery_zones(product_id);

-- entry_zone_deliveries: répartition par zone pour chaque saisie quotidienne
CREATE TABLE public.entry_zone_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL REFERENCES public.daily_entries(id) ON DELETE CASCADE,
  zone_id uuid NOT NULL REFERENCES public.delivery_zones(id) ON DELETE CASCADE,
  delivered_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entry_id, zone_id)
);

ALTER TABLE public.entry_zone_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own zone deliveries" ON public.entry_zone_deliveries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own zone deliveries" ON public.entry_zone_deliveries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own zone deliveries" ON public.entry_zone_deliveries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own zone deliveries" ON public.entry_zone_deliveries FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_ezd_entry ON public.entry_zone_deliveries(entry_id);
CREATE INDEX idx_ezd_zone ON public.entry_zone_deliveries(zone_id);

-- Backfill: migration des produits existants Dakar/Régions vers zones
INSERT INTO public.delivery_zones (user_id, product_id, name, fee, position)
SELECT user_id, id, 'Dakar', delivery_fee_dakar, 0
FROM public.products
WHERE COALESCE(delivery_fee_dakar, 0) > 0
ON CONFLICT (product_id, name) DO NOTHING;

INSERT INTO public.delivery_zones (user_id, product_id, name, fee, position)
SELECT user_id, id, 'Régions', delivery_fee_regions, 1
FROM public.products
WHERE COALESCE(delivery_fee_regions, 0) > 0
ON CONFLICT (product_id, name) DO NOTHING;

-- Backfill des saisies existantes
INSERT INTO public.entry_zone_deliveries (user_id, entry_id, zone_id, delivered_count)
SELECT e.user_id, e.id, z.id, e.delivered_dakar
FROM public.daily_entries e
JOIN public.delivery_zones z ON z.product_id = e.product_id AND z.name = 'Dakar'
WHERE COALESCE(e.delivered_dakar, 0) > 0
ON CONFLICT (entry_id, zone_id) DO NOTHING;

INSERT INTO public.entry_zone_deliveries (user_id, entry_id, zone_id, delivered_count)
SELECT e.user_id, e.id, z.id, e.delivered_regions
FROM public.daily_entries e
JOIN public.delivery_zones z ON z.product_id = e.product_id AND z.name = 'Régions'
WHERE COALESCE(e.delivered_regions, 0) > 0
ON CONFLICT (entry_id, zone_id) DO NOTHING;
