
-- RPCs publiques pour gérer le schéma admin sans dépendre de l'exposition PostgREST

-- 1. Lister les audit logs
CREATE OR REPLACE FUNCTION public.admin_list_audit_logs(
  _page integer DEFAULT 1,
  _page_size integer DEFAULT 50,
  _category text DEFAULT NULL,
  _admin_email text DEFAULT NULL,
  _search text DEFAULT NULL
)
RETURNS TABLE (
  id bigint,
  admin_id uuid,
  admin_email text,
  action text,
  category text,
  target_user_id uuid,
  target_email text,
  details jsonb,
  created_at timestamptz,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
DECLARE
  v_offset integer := GREATEST(_page - 1, 0) * _page_size;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: not an admin';
  END IF;

  RETURN QUERY
  WITH filtered AS (
    SELECT l.*
    FROM admin.audit_logs l
    WHERE (_category IS NULL OR l.category = _category)
      AND (_admin_email IS NULL OR l.admin_email = _admin_email)
      AND (
        _search IS NULL
        OR l.action ILIKE '%' || _search || '%'
        OR COALESCE(l.target_email, '') ILIKE '%' || _search || '%'
      )
  ),
  counted AS (SELECT count(*) AS c FROM filtered)
  SELECT f.id, f.admin_id, f.admin_email, f.action, f.category,
         f.target_user_id, f.target_email, f.details, f.created_at,
         (SELECT c FROM counted) AS total_count
  FROM filtered f
  ORDER BY f.created_at DESC
  OFFSET v_offset
  LIMIT _page_size;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_audit_logs(integer, integer, text, text, text) TO authenticated, service_role;

-- 2. Lister les comptes admin
CREATE OR REPLACE FUNCTION public.admin_list_accounts()
RETURNS TABLE (
  id uuid,
  email text,
  display_name text,
  role text,
  status text,
  last_login_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: not an admin';
  END IF;

  RETURN QUERY
  SELECT a.id, a.email, a.display_name, a.role, a.status, a.last_login_at, a.created_at
  FROM admin.accounts a
  ORDER BY a.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_accounts() TO authenticated, service_role;

-- 3. Upsert d'un compte admin (invitation)
CREATE OR REPLACE FUNCTION public.admin_upsert_account(
  _id uuid,
  _email text,
  _display_name text,
  _role text,
  _invited_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
BEGIN
  IF public.get_admin_role(auth.uid()) <> 'super_admin' THEN
    RAISE EXCEPTION 'Forbidden: super_admin required';
  END IF;

  INSERT INTO admin.accounts (id, email, display_name, role, status, invited_by)
  VALUES (_id, _email, _display_name, _role, 'active', _invited_by)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    status = 'active';
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_upsert_account(uuid, text, text, text, uuid) TO authenticated, service_role;

-- 4. Mettre à jour role/status d'un compte admin
CREATE OR REPLACE FUNCTION public.admin_update_account(
  _id uuid,
  _role text,
  _status text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
DECLARE
  v_email text;
BEGIN
  IF public.get_admin_role(auth.uid()) <> 'super_admin' THEN
    RAISE EXCEPTION 'Forbidden: super_admin required';
  END IF;

  IF _id = auth.uid() AND _status IN ('revoked', 'suspended') THEN
    RAISE EXCEPTION 'Cannot suspend or revoke yourself';
  END IF;

  UPDATE admin.accounts
     SET role = COALESCE(_role, role),
         status = COALESCE(_status, status)
   WHERE id = _id
  RETURNING email INTO v_email;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_account(uuid, text, text) TO authenticated, service_role;

-- 5. Supprimer un compte admin
CREATE OR REPLACE FUNCTION public.admin_delete_account(_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
DECLARE
  v_email text;
BEGIN
  IF public.get_admin_role(auth.uid()) <> 'super_admin' THEN
    RAISE EXCEPTION 'Forbidden: super_admin required';
  END IF;

  IF _id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove yourself';
  END IF;

  DELETE FROM admin.accounts WHERE id = _id RETURNING email INTO v_email;
  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_account(uuid) TO authenticated, service_role;

-- 6. Wrapper public pour log_action (le client serveur appelle déjà admin.log_action via service_role,
--    mais on expose un wrapper public pour homogénéité)
CREATE OR REPLACE FUNCTION public.admin_log_action(
  _admin_id uuid,
  _admin_email text,
  _action text,
  _category text DEFAULT 'general',
  _target_user_id uuid DEFAULT NULL,
  _target_email text DEFAULT NULL,
  _details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: not an admin';
  END IF;

  INSERT INTO admin.audit_logs (admin_id, admin_email, action, category, target_user_id, target_email, details)
  VALUES (_admin_id, _admin_email, _action, _category, _target_user_id, _target_email, COALESCE(_details, '{}'::jsonb));
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_log_action(uuid, text, text, text, uuid, text, jsonb) TO authenticated, service_role;
