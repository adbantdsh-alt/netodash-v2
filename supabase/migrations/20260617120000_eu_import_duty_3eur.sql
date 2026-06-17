-- Droits de douane UE fixes (3 € / commande) — case cochée par défaut en saisie dropshipping.

ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS include_eu_import_duty boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.daily_entries.include_eu_import_duty IS
  'Si true, applique 3 € de droits de douane UE par commande reçue (réglementation juillet 2026).';

NOTIFY pgrst, 'reload schema';
