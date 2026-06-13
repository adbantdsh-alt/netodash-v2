-- Plan COD $10 (cod_monthly_v1) — Dropshipping Starter/Pro/Scale inchangés en DB.

ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('trial', 'cod', 'basic', 'starter', 'pro'));

CREATE OR REPLACE FUNCTION public.get_user_plan(_uid uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT CASE
    WHEN s.plan = 'pro' AND s.status IN ('active', 'incomplete') THEN 'pro'
    WHEN s.plan = 'starter' AND s.status IN ('active', 'incomplete') THEN 'starter'
    WHEN s.plan = 'basic' AND s.status IN ('active', 'incomplete') THEN 'basic'
    WHEN s.plan = 'cod' AND s.status IN ('active', 'incomplete') THEN 'cod'
    WHEN s.plan = 'trial' AND s.trial_ends_at > now() THEN 'trial'
    ELSE 'free'
  END
  FROM public.subscriptions s
  WHERE s.user_id = _uid;
$function$;

CREATE OR REPLACE FUNCTION public.has_paid_access(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.get_user_plan(_uid) IN ('trial', 'cod', 'basic', 'starter', 'pro');
$function$;

CREATE OR REPLACE FUNCTION public.has_history_limit(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.get_user_plan(_uid) IN ('free', 'basic', 'cod');
$function$;

-- Drop + COD en parallèle : plans Drop (basic+) + trial + legacy. Jamais le plan COD seul.
CREATE OR REPLACE FUNCTION public.has_dual_mode_access(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    public.get_user_plan(_uid) IN ('trial', 'basic', 'starter', 'pro')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = _uid AND p.legacy_dual_mode = true
    );
$function$;

-- Grandfathering : comptes basic existants gardent Drop + COD explicitement.
UPDATE public.profiles p
SET legacy_dual_mode = true
FROM public.subscriptions s
WHERE s.user_id = p.id
  AND s.plan = 'basic'
  AND s.status IN ('active', 'incomplete');
