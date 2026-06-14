-- Phase 0 admin pilotage : audience cod, settings USD/limites, audit service_role

ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_audience_check;
ALTER TABLE public.announcements ADD CONSTRAINT announcements_audience_check
  CHECK (audience IN ('all', 'free', 'trial', 'paying', 'cod', 'basic', 'starter', 'pro'));

INSERT INTO public.app_settings (key, value) VALUES
  ('pricing.cod_usd', '10'),
  ('pricing.basic_usd', '12'),
  ('pricing.starter_usd', '29'),
  ('pricing.pro_usd', '79'),
  ('plan_limits.cod_products', '-1'),
  ('plan_limits.basic_products', '3'),
  ('plan_limits.starter_products', '10'),
  ('plan_limits.pro_products', '-1'),
  ('beta.max_spots', '10')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.service_log_admin_action(
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
LANGUAGE plpgsql
SECURITY DEFINER
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
    _target_user_id, _target_email, COALESCE(_details, '{}'::jsonb), _ip, _user_agent
  )
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.service_log_admin_action(
  uuid, text, text, text, uuid, text, jsonb, text, text
) TO service_role;
