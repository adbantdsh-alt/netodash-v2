
ALTER TABLE public.subscriptions
  ALTER COLUMN trial_ends_at SET DEFAULT (now() + '14 days'::interval);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_code text;
  v_aff record;
  v_trial_days integer := 14;
  v_meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.profiles (
    id, email, display_name,
    first_name, last_name, country, phone_country_code, phone, referral_source
  )
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NULLIF(v_meta->>'display_name',''), split_part(NEW.email, '@', 1)),
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
      v_trial_days := v_aff.trial_days;
      INSERT INTO public.affiliate_referrals (code_id, code, user_id, trial_days)
      VALUES (v_aff.id, v_aff.code, NEW.id, v_trial_days)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'trial', 'active', now() + (v_trial_days || ' days')::interval)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Geste commercial : on prolonge de 7 jours les essais en cours (sans réduire les essais affiliés plus longs)
UPDATE public.subscriptions
SET trial_ends_at = GREATEST(trial_ends_at, now() + interval '7 days'),
    updated_at = now()
WHERE plan = 'trial'
  AND status = 'active'
  AND trial_ends_at > now();
