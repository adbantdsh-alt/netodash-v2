ALTER TABLE public.daily_entries
ADD COLUMN IF NOT EXISTS upsells jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.daily_entries.upsells IS
  'Liste des ventes upsell rattachées à cette saisie. Chaque item: { product_id: uuid, qty: number, unit_price: number, currency: text }. Plan Pro uniquement côté UI.';