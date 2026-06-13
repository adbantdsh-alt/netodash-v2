-- Bootstrap super-admin + compte adbaxgoat@gmail.com

CREATE OR REPLACE FUNCTION public.bootstrap_super_admin(_uid uuid, _email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, admin
AS $$
BEGIN
  IF _uid IS NULL OR trim(coalesce(_email, '')) = '' THEN
    RETURN false;
  END IF;

  INSERT INTO admin.accounts (id, email, display_name, role, status)
  VALUES (_uid, lower(trim(_email)), 'Super Admin', 'super_admin', 'active')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = 'super_admin',
    status = 'active',
    display_name = COALESCE(admin.accounts.display_name, EXCLUDED.display_name);

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_super_admin(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_super_admin(uuid, text) TO service_role;

INSERT INTO admin.accounts (id, email, display_name, role, status)
SELECT u.id, u.email, 'Super Admin', 'super_admin', 'active'
FROM auth.users u
WHERE lower(u.email) IN (lower('adbaxgoat@gmail.com'), lower('adbaecomx@gmail.com'))
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  status = 'active',
  email = EXCLUDED.email;
