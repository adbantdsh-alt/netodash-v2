-- Active le claim bêta à l'inscription + rattrapage des comptes déjà créés.

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
    RETURN jsonb_build_object(
      'claimed', true,
      'already', true,
      'free_until', v_free_until,
      'lifetime_discount_percent', 50
    );
  END IF;

  IF EXISTS (SELECT 1 FROM beta_testers WHERE lower(email) = v_email) THEN
    UPDATE beta_testers
    SET
      user_id = p_user_id,
      full_name = COALESCE(v_name, full_name),
      free_until = COALESCE(free_until, v_free_until),
      lifetime_discount_percent = COALESCE(lifetime_discount_percent, 50),
      status = 'active'
    WHERE lower(email) = v_email;
    SELECT free_until INTO v_free_until FROM beta_testers WHERE lower(email) = v_email LIMIT 1;
    RETURN jsonb_build_object(
      'claimed', true,
      'already', true,
      'free_until', v_free_until,
      'lifetime_discount_percent', 50
    );
  END IF;

  PERFORM pg_advisory_xact_lock(837291);

  SELECT count(*)::int INTO v_count FROM beta_testers;
  IF v_count >= 10 THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'beta_full');
  END IF;

  INSERT INTO beta_testers (email, full_name, user_id, free_until, status, lifetime_discount_percent)
  VALUES (
    v_email,
    COALESCE(v_name, split_part(v_email, '@', 1)),
    p_user_id,
    v_free_until,
    'active',
    50
  );

  RETURN jsonb_build_object(
    'claimed', true,
    'free_until', v_free_until,
    'lifetime_discount_percent', 50
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('claimed', true, 'already', true, 'lifetime_discount_percent', 50);
END;
$$;

REVOKE ALL ON FUNCTION public.try_claim_beta_tester(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.try_claim_beta_tester(uuid, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.sync_beta_subscription(p_user_id uuid, p_free_until timestamptz)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL OR p_free_until IS NULL THEN
    RETURN;
  END IF;
  UPDATE public.subscriptions
  SET
    plan = 'pro',
    status = 'active',
    trial_ends_at = p_free_until,
    current_period_end = p_free_until,
    updated_at = now()
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at, current_period_end)
    VALUES (p_user_id, 'pro', 'active', p_free_until, p_free_until)
    ON CONFLICT (user_id) DO UPDATE SET
      plan = 'pro',
      status = 'active',
      trial_ends_at = EXCLUDED.trial_ends_at,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = now();
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_beta_subscription(uuid, timestamptz) TO service_role;

-- Appelable par l'utilisateur connecté si le trigger inscription a raté le claim.
CREATE OR REPLACE FUNCTION public.claim_my_beta_tester()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_name text;
  v_meta jsonb;
  v_beta jsonb;
  v_claimed boolean;
  v_free_until timestamptz;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  END IF;

  SELECT email, raw_user_meta_data INTO v_email, v_meta
  FROM auth.users
  WHERE id = v_uid;

  IF COALESCE(v_meta->>'beta_tester', '') <> '1' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_beta_signup');
  END IF;

  v_name := COALESCE(
    NULLIF(trim(COALESCE(v_meta->>'display_name', '')), ''),
    NULLIF(trim(concat_ws(' ', v_meta->>'first_name', v_meta->>'last_name')), ''),
    split_part(v_email, '@', 1)
  );

  v_beta := public.try_claim_beta_tester(v_uid, v_email, v_name);
  v_claimed := COALESCE((v_beta->>'claimed')::boolean, false);

  IF v_claimed THEN
    v_free_until := COALESCE(
      NULLIF(v_beta->>'free_until', '')::timestamptz,
      (SELECT free_until FROM beta_testers WHERE user_id = v_uid LIMIT 1),
      now() + interval '6 months'
    );
    PERFORM public.sync_beta_subscription(v_uid, v_free_until);
  END IF;

  RETURN jsonb_build_object('ok', true, 'claimed', v_claimed, 'beta', v_beta);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_my_beta_tester() TO authenticated;

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
      v_trial_days := v_aff.trial_days;
      INSERT INTO public.affiliate_referrals (code_id, code, user_id, trial_days)
      VALUES (v_aff.id, v_aff.code, NEW.id, v_trial_days)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  IF COALESCE(v_meta->>'beta_tester', '') = '1' THEN
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

-- Rattrapage : inscrits bêta sans ligne beta_testers (ex. Willow Gagnon, Max Kabore).
DO $$
DECLARE
  r record;
  v_beta jsonb;
  v_claimed boolean;
  v_free_until timestamptz;
  v_name text;
BEGIN
  FOR r IN
    SELECT
      u.id,
      u.email,
      u.raw_user_meta_data AS meta
    FROM auth.users u
    WHERE COALESCE(u.raw_user_meta_data->>'beta_tester', '') = '1'
      AND NOT EXISTS (
        SELECT 1 FROM public.beta_testers bt
        WHERE bt.user_id = u.id OR lower(bt.email) = lower(u.email)
      )
    ORDER BY u.created_at ASC
  LOOP
    v_name := COALESCE(
      NULLIF(trim(COALESCE(r.meta->>'display_name', '')), ''),
      NULLIF(trim(concat_ws(' ', r.meta->>'first_name', r.meta->>'last_name')), ''),
      split_part(r.email, '@', 1)
    );
    v_beta := public.try_claim_beta_tester(r.id, r.email, v_name);
    v_claimed := COALESCE((v_beta->>'claimed')::boolean, false);
    IF v_claimed THEN
      v_free_until := COALESCE(
        NULLIF(v_beta->>'free_until', '')::timestamptz,
        (SELECT free_until FROM beta_testers WHERE user_id = r.id LIMIT 1),
        now() + interval '6 months'
      );
      PERFORM public.sync_beta_subscription(r.id, v_free_until);
    END IF;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
