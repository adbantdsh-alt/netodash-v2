-- Bêta-testeurs : claim à l'inscription + 6 mois gratuits + colonnes admin

ALTER TABLE public.beta_testers
  ADD COLUMN IF NOT EXISTS free_until timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

CREATE OR REPLACE FUNCTION public.try_claim_beta_tester(
  p_user_id uuid,
  p_email text,
  p_full_name text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
  v_email text := lower(trim(p_email));
  v_name text := nullif(trim(p_full_name), '');
  v_free_until timestamptz := now() + interval '6 months';
BEGIN
  IF p_user_id IS NULL OR v_email = '' OR v_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'invalid_input');
  END IF;

  IF EXISTS (SELECT 1 FROM beta_testers WHERE user_id = p_user_id) THEN
    SELECT free_until INTO v_free_until FROM beta_testers WHERE user_id = p_user_id LIMIT 1;
    RETURN jsonb_build_object('claimed', true, 'already', true, 'free_until', v_free_until);
  END IF;

  IF EXISTS (SELECT 1 FROM beta_testers WHERE lower(email) = v_email) THEN
    UPDATE beta_testers
    SET
      user_id = p_user_id,
      full_name = COALESCE(v_name, full_name),
      free_until = COALESCE(free_until, v_free_until),
      status = 'active'
    WHERE lower(email) = v_email;
    SELECT free_until INTO v_free_until FROM beta_testers WHERE lower(email) = v_email LIMIT 1;
    RETURN jsonb_build_object('claimed', true, 'already', true, 'free_until', v_free_until);
  END IF;

  PERFORM pg_advisory_xact_lock(837291);

  SELECT count(*)::int INTO v_count FROM beta_testers;
  IF v_count >= 10 THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'beta_full');
  END IF;

  INSERT INTO beta_testers (email, full_name, user_id, free_until, status)
  VALUES (v_email, COALESCE(v_name, split_part(v_email, '@', 1)), p_user_id, v_free_until, 'active');

  RETURN jsonb_build_object('claimed', true, 'free_until', v_free_until);
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('claimed', true, 'already', true);
END;
$$;

REVOKE ALL ON FUNCTION public.try_claim_beta_tester(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.try_claim_beta_tester(uuid, text, text) TO service_role;

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
  v_display_name text;
  v_beta jsonb;
  v_beta_claimed boolean := false;
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
      v_trial_days := v_aff.trial_days;
      INSERT INTO public.affiliate_referrals (code_id, code, user_id, trial_days)
      VALUES (v_aff.id, v_aff.code, NEW.id, v_trial_days)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  IF COALESCE(v_meta->>'beta_tester', '') = '1' THEN
    v_beta := public.try_claim_beta_tester(NEW.id, NEW.email, v_display_name);
    v_beta_claimed := COALESCE((v_beta->>'claimed')::boolean, false);
    IF v_beta_claimed THEN
      v_trial_days := 180;
    END IF;
  END IF;

  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at, current_period_end)
  VALUES (
    NEW.id,
    'trial',
    'active',
    now() + (v_trial_days || ' days')::interval,
    CASE WHEN v_beta_claimed THEN now() + interval '6 months' ELSE NULL END
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Compteur bêta : uniquement les inscriptions finalisées (user_id renseigné)
CREATE OR REPLACE FUNCTION public.get_beta_program_status()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'max_spots', 10,
    'beta_count', (SELECT count(*)::int FROM beta_testers),
    'waitlist_count', (SELECT count(*)::int FROM beta_waitlist),
    'beta_full', (SELECT count(*) >= 10 FROM beta_testers),
    'spots_left', GREATEST(0, 10 - (SELECT count(*)::int FROM beta_testers))
  );
$$;

-- Admin : lecture des bêta-testeurs
CREATE POLICY "Admins can view beta testers"
ON public.beta_testers FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view beta waitlist"
ON public.beta_waitlist FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.beta_testers TO authenticated;
GRANT SELECT ON public.beta_waitlist TO authenticated;
