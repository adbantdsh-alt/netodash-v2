
-- Diagnostic + reset pour designvip18@gmail.com
-- 1) S'assurer que l'email est confirmé (si une migration a pu interférer)
-- 2) Lever tout ban éventuel
-- 3) Retourner le statut pour vérification

DO $$
DECLARE
  v_user_id uuid;
  v_email_confirmed timestamptz;
  v_banned_until timestamptz;
  v_deleted_at timestamptz;
BEGIN
  SELECT id, email_confirmed_at, banned_until, deleted_at
    INTO v_user_id, v_email_confirmed, v_banned_until, v_deleted_at
  FROM auth.users
  WHERE email = 'designvip18@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Utilisateur introuvable dans auth.users';
    RETURN;
  END IF;

  RAISE NOTICE 'User % | email_confirmed=% | banned_until=% | deleted_at=%',
    v_user_id, v_email_confirmed, v_banned_until, v_deleted_at;

  -- Confirmer l'email s'il ne l'est pas
  IF v_email_confirmed IS NULL THEN
    UPDATE auth.users
       SET email_confirmed_at = now(),
           confirmed_at = COALESCE(confirmed_at, now())
     WHERE id = v_user_id;
    RAISE NOTICE 'Email confirmé manuellement';
  END IF;

  -- Lever tout ban
  IF v_banned_until IS NOT NULL AND v_banned_until > now() THEN
    UPDATE auth.users SET banned_until = NULL WHERE id = v_user_id;
    RAISE NOTICE 'Ban levé';
  END IF;

  -- Restaurer si soft-deleted
  IF v_deleted_at IS NOT NULL THEN
    UPDATE auth.users SET deleted_at = NULL WHERE id = v_user_id;
    RAISE NOTICE 'Compte restauré (deleted_at supprimé)';
  END IF;
END $$;

-- 4) Prolonger l'abonnement starter expiré (current_period_end < now)
UPDATE public.subscriptions
   SET current_period_end = GREATEST(current_period_end, now() + interval '7 days'),
       status = 'active'
 WHERE user_id = 'cdbf9f68-1f9b-4c4d-a985-9e1a72208465'
   AND current_period_end < now();
