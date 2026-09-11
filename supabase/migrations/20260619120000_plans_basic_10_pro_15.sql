-- =============================================================================
-- Nouvelle grille de forfaits : Basic 10 $ (illimité) / Pro 15 $ (+ Analytics)
-- =============================================================================
-- Ce qui change côté limites :
--   - Essai gratuit : 3 produits maximum (au lieu de 10).
--   - Basic ($10)   : produits illimités (au lieu de 3) — il perd uniquement
--                     l'accès Analytics, qui n'est pas une limite de produits.
--   - Pro ($15)     : produits illimités (clé DB `pro`).
--   - Clés héritées `starter` (ancien Pro $29) et `cod` : inchangées pour les
--     abonnés existants (starter = illimité, cod = produits Drop interdits).
--
-- SOURCE DE VÉRITÉ — reproduit `src/lib/plan-limits.ts` :
--   DROPSHIP_PRODUCT_LIMITS : free 0 | trial 3 | cod 0  | basic -1 | starter -1 | pro -1
--   COD_PRODUCT_LIMITS      : free 1 | trial -1 | cod -1 | basic -1 | starter -1 | pro -1
-- -1 = illimité.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.enforce_product_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan text;
  v_limit integer;
  v_count integer;
BEGIN
  -- 'free' par défaut : une ligne d'abonnement manquante ne doit pas ouvrir
  -- un accès illimité (get_user_plan renvoie NULL s'il n'y a aucune ligne).
  v_plan := COALESCE(public.get_user_plan(NEW.user_id), 'free');

  IF NEW.business_mode = 'cod' THEN
    -- COD_PRODUCT_LIMITS (src/lib/plan-limits.ts)
    v_limit := CASE v_plan
      WHEN 'free' THEN 1
      ELSE -1
    END;
  ELSE
    -- DROPSHIP_PRODUCT_LIMITS (src/lib/plan-limits.ts)
    v_limit := CASE v_plan
      WHEN 'trial'   THEN 3    -- Essai gratuit 7 jours : 3 produits max
      WHEN 'basic'   THEN -1   -- Basic 10 $ : produits illimités
      WHEN 'starter' THEN -1   -- hérité (ancien Pro 29 $)
      WHEN 'pro'     THEN -1   -- Pro 15 $ : Basic + Analytics
      ELSE 0                   -- free, et cod seul (pas d'accès boutique)
    END;
  END IF;

  IF v_limit = -1 THEN
    RETURN NEW;
  END IF;

  -- On ne compte que les produits du MÊME mode métier.
  SELECT count(*) INTO v_count
  FROM public.products
  WHERE user_id = NEW.user_id
    AND business_mode = NEW.business_mode;

  IF v_count >= v_limit THEN
    RAISE EXCEPTION
      'Limite de produits atteinte pour ton plan (% / %). Passe au forfait supérieur pour en ajouter davantage.',
      v_count, v_limit
      USING ERRCODE = 'check_violation',
            HINT = 'plan_product_limit_reached';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger inchangé (BEFORE INSERT sur products) : on le recrée de façon
-- idempotente pour garantir l'état final.
DROP TRIGGER IF EXISTS trg_enforce_product_limit ON public.products;

CREATE TRIGGER trg_enforce_product_limit
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_product_limit();

-- Limites affichées / pilotées dans l'admin (app_settings.plan_limits.*)
INSERT INTO public.app_settings (key, value) VALUES
  ('plan_limits.trial_products', '3'),
  ('plan_limits.basic_products', '-1'),
  ('plan_limits.starter_products', '-1'),
  ('plan_limits.pro_products', '-1')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
