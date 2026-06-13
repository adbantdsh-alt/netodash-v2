ALTER TABLE public.daily_entries
  ADD COLUMN actual_delivery_total numeric NULL,
  ADD COLUMN ad_budget_currency text NOT NULL DEFAULT 'USD';

-- Saisies existantes : c'était saisi en CFA, on le marque comme tel pour ne pas fausser l'historique
UPDATE public.daily_entries SET ad_budget_currency = 'XOF' WHERE created_at < now();

ALTER TABLE public.daily_entries
  ADD CONSTRAINT daily_entries_currency_check CHECK (ad_budget_currency IN ('USD', 'XOF'));

ALTER TABLE public.profiles
  ADD COLUMN usd_to_xof_rate numeric NOT NULL DEFAULT 600;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_usd_rate_positive CHECK (usd_to_xof_rate > 0);