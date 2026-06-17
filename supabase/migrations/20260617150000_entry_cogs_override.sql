-- COGs réels de l'agent : override optionnel des coûts produit/livraison par saisie.
-- Si renseignés, ils remplacent les coûts définis sur le produit UNIQUEMENT pour cette saisie.

ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS entry_cogs_per_unit    numeric,
  ADD COLUMN IF NOT EXISTS entry_shipping_per_unit numeric,
  ADD COLUMN IF NOT EXISTS entry_cogs_currency    text;

COMMENT ON COLUMN public.daily_entries.entry_cogs_per_unit IS
  'Coût produit réel / unité fourni par l''agent. Prioritaire sur products.cost_price si renseigné.';
COMMENT ON COLUMN public.daily_entries.entry_shipping_per_unit IS
  'Coût livraison réel / unité fourni par l''agent. Prioritaire sur products.shipping_cost si renseigné.';
COMMENT ON COLUMN public.daily_entries.entry_cogs_currency IS
  'Devise des COGs saisis (EUR/USD/GBP). Si NULL, utilise la devise du produit.';

NOTIFY pgrst, 'reload schema';
