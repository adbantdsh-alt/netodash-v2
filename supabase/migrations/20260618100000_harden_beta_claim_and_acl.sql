-- =============================================================================
-- Durcissement : octroi du programme bêta + cohérence des ACL
-- =============================================================================
-- Contexte : `try_claim_beta_tester()` INSÈRE une nouvelle place dans
-- `beta_testers` si l'e-mail n'y figure pas encore. Or les deux appelants
-- (`handle_new_user` au signup et `claim_my_beta_tester()` côté utilisateur
-- connecté) se contentaient du drapeau `raw_user_meta_data.beta_tester = '1'`
-- — une valeur entièrement contrôlée par l'inscrivant (`/auth?beta=1`).
--
-- Chaîne d'exploitation : un compte neuf met le drapeau → le trigger appelle
-- `try_claim_beta_tester` → celui-ci crée la place → `sync_beta_subscription`
-- pose `plan = 'pro'` (Scale, 79 $/mois) pour 6 mois, sans invitation ni
-- validation. Plafonné à 10 places, mais un attaquant pouvait aussi saturer
-- ces 10 places et priver les vrais bêta-testeurs.
--
-- Correctif : le drapeau ne sert plus qu'à RATTACHER un compte à une place
-- existante. Seule une place déjà présente dans `beta_testers` (créée par le
-- formulaire public plafonné, ou par un admin) autorise l'octroi du plan.
-- Le parcours produit « je m'inscris au programme puis je crée mon compte »
-- reste donc strictement identique.
-- =============================================================================

-- 1. handle_new_user : la place doit préexister ---------------------------------
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

  -- SECURITY: `beta_tester` vient du client, il ne peut donc pas AUTORISER
  -- l'octroi. On exige une place préexistante pour cet e-mail.
  IF COALESCE(v_meta->>'beta_tester', '') = '1'
     AND EXISTS (
       SELECT 1 FROM public.beta_testers
       WHERE lower(email) = lower(NEW.email)
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

-- 2. claim_my_beta_tester : idem, plus de création de place ---------------------
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

  -- SECURITY: sans place préexistante pour cet e-mail, on ne crée rien.
  IF NOT EXISTS (
    SELECT 1 FROM public.beta_testers WHERE lower(email) = lower(v_email)
  ) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_invited');
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

-- 3. ACL : le client ne doit plus appeler ces RPC directement -------------------
-- L'application les appelle déjà via `supabaseAdmin` (service_role) dans
-- src/lib/beta.functions.ts : révoquer anon/authenticated ne casse rien et
-- ferme l'accès PostgREST direct.
REVOKE ALL ON FUNCTION public.register_beta_tester(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.register_beta_waitlist(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_beta_program_status() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_beta_tester(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.register_beta_waitlist(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_beta_program_status() TO service_role;

-- Incohérence relevée : `has_dual_mode_access` était exécutable par anon et
-- authenticated alors que ses 5 fonctions sœurs sont révoquées depuis
-- 20260602142900 (fuite d'un bit de plan pour n'importe quel uuid).
REVOKE ALL ON FUNCTION public.has_dual_mode_access(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_dual_mode_access(uuid) TO service_role;

-- 4. profiles.legacy_dual_mode : ne doit pas être modifiable par l'utilisateur --
-- La policy UPDATE de `profiles` n'a ni WITH CHECK ni restriction de colonne :
-- un abonné au plan COD seul pouvait poser `legacy_dual_mode = true` sur sa
-- propre ligne et débloquer gratuitement le mode Dropshipping
-- (`has_dual_mode_access` lit ce drapeau).
CREATE OR REPLACE FUNCTION public.protect_legacy_dual_mode()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service_role (nos server functions admin) peut tout écrire.
  -- Les autres rôles ne peuvent pas faire varier ce drapeau.
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role'
     AND NEW.legacy_dual_mode IS DISTINCT FROM OLD.legacy_dual_mode THEN
    NEW.legacy_dual_mode := OLD.legacy_dual_mode;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_legacy_dual_mode() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_legacy_dual_mode ON public.profiles;
CREATE TRIGGER trg_protect_legacy_dual_mode
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_legacy_dual_mode();
