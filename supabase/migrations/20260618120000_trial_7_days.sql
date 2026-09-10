-- =============================================================================
-- Essai gratuit : 14 jours -> 7 jours
-- =============================================================================
-- Nouvelle grille : 7 jours d'essai, puis 20 $/mois tout illimité.
--
-- Ce fichier ne change QUE la durée d'essai. Le passage à un plan unique à 20 $
-- est purement commercial (prix affiché + prix Stripe) : en base, le plan vendu
-- reste la clé `pro`, qui débloque déjà tout (produits illimités, Analytics Pro,
-- Decision Engine). Les abonnés `basic`/`starter` existants conservent leur plan
-- et leur tarif — rien n'est migré ni résilié.
-- =============================================================================

-- 1. Nouvelle valeur par défaut pour les futurs abonnements.
ALTER TABLE public.subscriptions
  ALTER COLUMN trial_ends_at SET DEFAULT (now() + interval '7 days');

-- 2. Le trigger d'inscription doit désormais semer 7 jours au lieu de 14.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_code text;
  v_aff record;
  v_trial_days integer := 7;   -- etait 14
  v_meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_display_name text;
  v_beta jsonb;
  v_beta_claimed boolean := false;
  v_free_until timestamptz;
BEGIN
  v_display_name := COALESCE(NULLIF(v_meta->>'display_name',''), split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (
    id, email, display_name,
    first_name, last_name, country, phone_country_code, phone, referral_source
  )
  VALUES (
    NEW.id, NEW.email,
    v_display_name,
    NULLIF(v_meta->>'first_name',''),
    NULLIF(v_meta->>'last_name',''),
    NULLIF(v_meta->>'country',''),
    NULLIF(v_meta->>'phone_country_code',''),
    NULLIF(v_meta->>'phone',''),
    NULLIF(v_meta->>'referral_source','')
  );

  v_code := lower(trim(COALESCE(v_meta->>'affiliate_code', '')));
  IF v_code <> '' THEN
    SELECT * INTO v_aff FROM public.affiliate_codes
    WHERE lower(code) = v_code AND active = true LIMIT 1;
    IF FOUND THEN
      -- Un code d'affiliation peut allonger l'essai : on garde ce comportement.
      v_trial_days := v_aff.trial_days;
      INSERT INTO public.affiliate_referrals (code_id, code, user_id, trial_days)
      VALUES (v_aff.id, v_aff.code, NEW.id, v_trial_days)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  -- Programme beta : une place preexistante est obligatoire (cf. migration
  -- 20260618100000). Le drapeau d'inscription ne suffit pas.
  IF COALESCE(v_meta->>'beta_tester', '') = '1'
     AND EXISTS (
       SELECT 1 FROM public.beta_testers WHERE lower(email) = lower(NEW.email)
     )
  THEN
    v_beta := public.try_claim_beta_tester(NEW.id, NEW.email, v_display_name);
    v_beta_claimed := COALESCE((v_beta->>'claimed')::boolean, false);
  END IF;

  IF v_beta_claimed THEN
    v_free_until := COALESCE(
      NULLIF(v_beta->>'free_until', '')::timestamptz,
      now() + interval '6 months'
    );
    PERFORM public.sync_beta_subscription(NEW.id, v_free_until);
  ELSE
    INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
    VALUES (NEW.id, 'trial', 'active', now() + (v_trial_days || ' days')::interval)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3. Les codes d'affiliation qui portaient 14 jours passent a 7.
--    (Ils peuvent toujours etre rallonges manuellement depuis l'admin.)
UPDATE public.affiliate_codes
SET trial_days = 7
WHERE trial_days = 14;
