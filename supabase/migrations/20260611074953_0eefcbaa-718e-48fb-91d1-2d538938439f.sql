-- Garde-fou serveur : limite de produits par plan.
-- IMPORTANT : doit rester aligné avec src/lib/plan-limits.ts (PRODUCT_LIMITS).
-- Si tu changes une limite ici, change-la aussi dans plan-limits.ts (et inversement).

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
  -- Plan effectif de l'utilisateur (free / trial / basic / starter / pro)
  v_plan := public.get_user_plan(NEW.user_id);

  -- Mapping plan -> limite (-1 = illimité). Doit rester en phase avec plan-limits.ts.
  v_limit := CASE v_plan
    WHEN 'pro'     THEN -1   -- Scale
    WHEN 'starter' THEN 10   -- Pro public
    WHEN 'trial'   THEN 10   -- Essai 14j
    WHEN 'basic'   THEN 3    -- Starter public
    WHEN 'free'    THEN 1
    ELSE 1
  END;

  IF v_limit = -1 THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO v_count
  FROM public.products
  WHERE user_id = NEW.user_id;

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

DROP TRIGGER IF EXISTS trg_enforce_product_limit ON public.products;

CREATE TRIGGER trg_enforce_product_limit
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.enforce_product_limit();