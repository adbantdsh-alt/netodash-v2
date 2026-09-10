-- =============================================================================
-- Correctif : limite de produits par plan — le plan COD était bloqué
-- =============================================================================
-- BUG CORRIGÉ
-- `enforce_product_limit()` (20260611074953) ne connaissait que les plans
-- Drop : son CASE n'avait aucune branche `cod`, donc tout abonné COD tombait
-- dans `ELSE 1`. Un client qui paie 10 $/mois pour un plan censé offrir des
-- produits COD **illimités** recevait une exception SQL en ajoutant son
-- 2ᵉ produit :
--
--   Limite de produits atteinte pour ton plan (1 / 1)
--
-- Le trigger contredisait à la fois l'interface (COD_PRODUCT_LIMITS.cod = -1)
-- et app_settings.plan_limits.cod_products = -1.
--
-- DEUXIÈME CORRECTIF
-- Le trigger comptait TOUS les produits de l'utilisateur, sans distinguer le
-- mode métier. Un utilisateur en mode Dropshipping avec 3 produits Drop ne
-- pouvait donc plus créer le moindre produit COD, alors que le plan COD est
-- indépendant. Le comptage est désormais restreint au même `business_mode`,
-- comme le fait déjà `productLimitFor(plan, mode)` côté interface.
--
-- SOURCE DE VÉRITÉ
-- Les valeurs ci-dessous reproduisent exactement `src/lib/plan-limits.ts` :
--   DROPSHIP_PRODUCT_LIMITS : free 0 | trial 10 | cod 0  | basic 3 | starter 10 | pro -1
--   COD_PRODUCT_LIMITS      : free 1 | trial -1 | cod -1 | basic -1| starter -1 | pro -1
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
      WHEN 'pro'     THEN -1   -- Scale
      WHEN 'starter' THEN 10   -- Pro public
      WHEN 'trial'   THEN 10   -- Essai
      WHEN 'basic'   THEN 3    -- Starter public
      ELSE 0                   -- free, et cod seul (pas d'accès Drop)
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
      'Limite de produits atteinte pour ton plan (% / %). Passe au plan supérieur pour en ajouter davantage.',
      v_count, v_limit
      USING ERRCODE = 'check_violation',
            HINT = 'plan_product_limit_reached';
  END IF;

  RETURN NEW;
END;
$$;

-- Le trigger lui-même est inchangé (BEFORE INSERT sur products) : on ne
-- remplace que la fonction, donc DROP/CREATE n'est pas nécessaire.
-- On le recrée tout de même de façon idempotente pour garantir l'état final.
DROP TRIGGER IF EXISTS trg_enforce_product_limit ON public.products;

CREATE TRIGGER trg_enforce_product_limit
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_product_limit();
