-- =============================================================================
-- Deux lignes de business : CopyX (FCFA) et Dropshipping (devises libres)
-- =============================================================================
-- AVANT : `business_mode` valait 'dropshipping' (ce qui était en fait la ligne
-- CopyX) ou 'cod' (ancienne ligne COD, retirée du produit).
-- APRÈS :
--   - 'copyx'        → boutique CopyX : XOF uniquement, acomptes 10 %,
--                      encaissements XaalipSay (5 %). Cloisonné et mono-devise.
--   - 'dropshipping' → dropshipping international : EUR / USD / GBP / XOF,
--                      devise pub potentiellement différente de la boutique.
--
-- Les données existantes (produits, saisies, mode du profil) basculent sur
-- 'copyx' : c'est bien leur nature. Aucune donnée n'est supprimée.
-- =============================================================================

-- 1. Lever les contraintes qui bloqueraient la nouvelle valeur 'copyx'
ALTER TABLE public.products      DROP CONSTRAINT IF EXISTS products_business_mode_check;
ALTER TABLE public.daily_entries DROP CONSTRAINT IF EXISTS daily_entries_business_mode_check;
ALTER TABLE public.profiles      DROP CONSTRAINT IF EXISTS profiles_active_mode_check;

-- Les contraintes de devise dépendaient des anciens libellés
ALTER TABLE public.products      DROP CONSTRAINT IF EXISTS products_currency_matches_business_mode;
ALTER TABLE public.daily_entries DROP CONSTRAINT IF EXISTS daily_entries_currency_matches_business_mode;

-- 2. Migration des données : l'existant (dropshipping d'hier / cod d'avant-hier)
--    devient la ligne CopyX
UPDATE public.products      SET business_mode = 'copyx' WHERE business_mode IN ('dropshipping', 'cod');
UPDATE public.daily_entries SET business_mode = 'copyx' WHERE business_mode IN ('dropshipping', 'cod');
UPDATE public.profiles      SET active_mode   = 'copyx' WHERE active_mode IS NULL OR active_mode IN ('dropshipping', 'cod');

-- Devise du profil : CopyX = XOF, la devise choisie côté dropshipping reste
-- stockée dans `dropshipping_currency` (EUR par défaut si absente/invalide).
UPDATE public.profiles
SET currency = 'XOF',
    cod_currency = 'XOF',
    dropshipping_currency = CASE
      WHEN upper(coalesce(dropshipping_currency, '')) IN ('EUR', 'USD', 'GBP', 'XOF')
        THEN upper(dropshipping_currency)
      ELSE 'EUR'
    END;

-- Les saisies CopyX sont en FCFA
UPDATE public.daily_entries SET ad_budget_currency = 'XOF'      WHERE business_mode = 'copyx' AND upper(coalesce(ad_budget_currency, '')) <> 'XOF';
UPDATE public.daily_entries SET total_revenue_currency = 'XOF'  WHERE business_mode = 'copyx' AND total_revenue_currency IS NOT NULL AND upper(total_revenue_currency) <> 'XOF';
UPDATE public.products      SET currency = 'XOF'                WHERE business_mode = 'copyx' AND upper(coalesce(currency, '')) <> 'XOF';

-- 3. Nouvelles contraintes
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_active_mode_check
    CHECK (active_mode IN ('copyx', 'dropshipping'));

ALTER TABLE public.products
  ADD CONSTRAINT products_business_mode_check
    CHECK (business_mode IN ('copyx', 'dropshipping'));

ALTER TABLE public.daily_entries
  ADD CONSTRAINT daily_entries_business_mode_check
    CHECK (business_mode IN ('copyx', 'dropshipping'));

-- CopyX : FCFA strict. Dropshipping : EUR / USD / GBP / XOF au choix.
ALTER TABLE public.products
  ADD CONSTRAINT products_currency_matches_business_mode
    CHECK (
      (business_mode = 'copyx'        AND upper(currency) = 'XOF')
      OR
      (business_mode = 'dropshipping' AND upper(currency) IN ('EUR', 'USD', 'GBP', 'XOF'))
    );

ALTER TABLE public.daily_entries
  ADD CONSTRAINT daily_entries_currency_matches_business_mode
    CHECK (
      (business_mode = 'copyx'
        AND (ad_budget_currency IS NULL OR upper(ad_budget_currency) = 'XOF')
        AND (total_revenue_currency IS NULL OR upper(total_revenue_currency) = 'XOF')
      )
      OR
      (business_mode = 'dropshipping'
        AND (ad_budget_currency IS NULL OR upper(ad_budget_currency) IN ('EUR', 'USD', 'GBP', 'XOF'))
        AND (total_revenue_currency IS NULL OR upper(total_revenue_currency) IN ('EUR', 'USD', 'GBP', 'XOF'))
      )
    );

-- Devise de la ligne Dropshipping : les 4 devises autorisées
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_dropshipping_currency_allowed;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_dropshipping_currency_allowed
    CHECK (dropshipping_currency IS NULL OR upper(dropshipping_currency) IN ('EUR', 'USD', 'GBP', 'XOF'));

-- 4. Nouveau défaut du profil : ligne CopyX
ALTER TABLE public.profiles ALTER COLUMN active_mode SET DEFAULT 'copyx';

-- 5. Limite de produits : les deux lignes suivent la même grille
--    (essai 3 produits · Basic et Pro illimités)
CREATE OR REPLACE FUNCTION public.enforce_product_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan  text;
  v_limit integer;
  v_count integer;
BEGIN
  v_plan := COALESCE(public.get_user_plan(NEW.user_id), 'free');

  v_limit := CASE v_plan
    WHEN 'trial'   THEN 3    -- essai gratuit 7 jours : 3 produits max
    WHEN 'basic'   THEN -1   -- Basic 10 $ : illimité
    WHEN 'starter' THEN -1   -- hérité
    WHEN 'pro'     THEN -1   -- Pro 15 $ : illimité
    ELSE 0                   -- free : pas de ligne active
  END;

  IF v_limit = -1 THEN RETURN NEW; END IF;

  SELECT count(*) INTO v_count
  FROM public.products
  WHERE user_id = NEW.user_id AND business_mode = NEW.business_mode;

  IF v_count >= v_limit THEN
    RAISE EXCEPTION
      'Limite de produits atteinte pour ton plan (% / %). Passe au forfait supérieur pour en ajouter davantage.',
      v_count, v_limit
      USING ERRCODE = 'check_violation', HINT = 'plan_product_limit_reached';
  END IF;

  RETURN NEW;
END;
$$;

-- 6. Contrôle final
SELECT business_mode, count(*) AS produits FROM public.products      GROUP BY 1 ORDER BY 1;
SELECT business_mode, count(*) AS saisies  FROM public.daily_entries GROUP BY 1 ORDER BY 1;
SELECT active_mode,  count(*) AS comptes   FROM public.profiles      GROUP BY 1 ORDER BY 1;
