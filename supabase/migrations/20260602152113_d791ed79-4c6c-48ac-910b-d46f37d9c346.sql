-- 1. Ajouter le plan 'basic' au CHECK constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('trial', 'basic', 'starter', 'pro'));

-- 2. Colonnes profile : mode sélectionné à l'inscription + grandfathering dual-mode
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS selected_mode text
    CHECK (selected_mode IN ('dropshipping', 'cod')),
  ADD COLUMN IF NOT EXISTS legacy_dual_mode boolean NOT NULL DEFAULT false;

-- 3. Backfill : tous les comptes existants gardent l'accès dual-mode (Drop + COD)
UPDATE public.profiles
SET legacy_dual_mode = true
WHERE created_at < now();

-- 4. Mettre à jour get_user_plan pour reconnaître 'basic'
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
    WHEN s.plan = 'trial' AND s.trial_ends_at > now() THEN 'trial'
    ELSE 'free'
  END
  FROM public.subscriptions s
  WHERE s.user_id = _uid;
$function$;

-- 5. has_paid_access inclut 'basic'
CREATE OR REPLACE FUNCTION public.has_paid_access(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.get_user_plan(_uid) IN ('trial', 'basic', 'starter', 'pro');
$function$;

-- 6. has_history_limit : true pour 'free' ET 'basic' (30j seulement)
CREATE OR REPLACE FUNCTION public.has_history_limit(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.get_user_plan(_uid) IN ('free', 'basic');
$function$;

-- 7. Nouveau helper : accès dual-mode (Drop + COD en parallèle)
CREATE OR REPLACE FUNCTION public.has_dual_mode_access(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    public.get_user_plan(_uid) IN ('trial', 'starter', 'pro')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = _uid AND p.legacy_dual_mode = true
    );
$function$;