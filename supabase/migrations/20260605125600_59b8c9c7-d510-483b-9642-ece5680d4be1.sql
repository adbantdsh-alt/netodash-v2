
-- 1. Schéma admin isolé
CREATE SCHEMA IF NOT EXISTS admin;

-- Révoquer tous les droits par défaut sur le schéma admin
REVOKE ALL ON SCHEMA admin FROM PUBLIC;
REVOKE ALL ON SCHEMA admin FROM anon, authenticated;
GRANT USAGE ON SCHEMA admin TO service_role;

-- 2. Table admin.accounts
CREATE TABLE admin.accounts (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  display_name text,
  role text NOT NULL CHECK (role IN ('super_admin', 'support', 'finance')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  invited_by uuid REFERENCES admin.accounts(id) ON DELETE SET NULL,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_accounts_status ON admin.accounts(status);
CREATE INDEX idx_admin_accounts_role ON admin.accounts(role);

GRANT ALL ON admin.accounts TO service_role;
ALTER TABLE admin.accounts ENABLE ROW LEVEL SECURITY;
-- Pas de policy pour anon/authenticated : seul service_role peut accéder.

-- 3. Table admin.audit_logs
CREATE TABLE admin.audit_logs (
  id bigserial PRIMARY KEY,
  admin_id uuid REFERENCES admin.accounts(id) ON DELETE SET NULL,
  admin_email text NOT NULL,
  action text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  target_user_id uuid,
  target_email text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  impersonation_session_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_created_at ON admin.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_admin_id ON admin.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_target_user_id ON admin.audit_logs(target_user_id);
CREATE INDEX idx_audit_logs_action ON admin.audit_logs(action);
CREATE INDEX idx_audit_logs_category ON admin.audit_logs(category);

GRANT ALL ON admin.audit_logs TO service_role;
GRANT USAGE, SELECT ON SEQUENCE admin.audit_logs_id_seq TO service_role;
ALTER TABLE admin.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Helpers publics (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, admin
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin.accounts
    WHERE id = _uid AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(_uid uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, admin
AS $$
  SELECT role FROM admin.accounts
  WHERE id = _uid AND status = 'active'
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_role(uuid) TO authenticated, service_role;

-- 5. Helper pour logger une action admin (appelé depuis les server functions)
CREATE OR REPLACE FUNCTION admin.log_action(
  _admin_id uuid,
  _admin_email text,
  _action text,
  _category text DEFAULT 'general',
  _target_user_id uuid DEFAULT NULL,
  _target_email text DEFAULT NULL,
  _details jsonb DEFAULT '{}'::jsonb,
  _ip text DEFAULT NULL,
  _user_agent text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = admin, public
AS $$
DECLARE
  _id bigint;
BEGIN
  INSERT INTO admin.audit_logs (
    admin_id, admin_email, action, category,
    target_user_id, target_email, details, ip_address, user_agent
  )
  VALUES (
    _admin_id, _admin_email, _action, _category,
    _target_user_id, _target_email, _details, _ip, _user_agent
  )
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

GRANT EXECUTE ON FUNCTION admin.log_action(uuid, text, text, text, uuid, text, jsonb, text, text) TO service_role;

-- 6. Trigger updated_at sur admin.accounts
CREATE TRIGGER trg_admin_accounts_updated
  BEFORE UPDATE ON admin.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- 7. Marquer dans auth.users.raw_app_meta_data qu'un compte est admin-only
-- (sera utilisé côté login user pour rejeter les comptes admin)
-- Pas de migration de données, c'est le code applicatif qui gérera ça lors de la création.
