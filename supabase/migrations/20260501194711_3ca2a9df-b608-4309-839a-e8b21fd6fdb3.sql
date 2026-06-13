-- =============================================================
-- 1) AFFILIATE CODES: stop exposing the table publicly
-- =============================================================

DROP POLICY IF EXISTS "Anyone can view active codes for validation" ON public.affiliate_codes;

-- Secure RPC: validate a code and return only the trial_days + label (no owner, no created_by, no id).
CREATE OR REPLACE FUNCTION public.validate_affiliate_code(_code text)
RETURNS TABLE (valid boolean, trial_days integer, label text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    true AS valid,
    c.trial_days,
    c.label
  FROM public.affiliate_codes c
  WHERE lower(c.code) = lower(trim(_code))
    AND c.active = true
  LIMIT 1;
$$;

-- Allow anon + authenticated to call only this validation RPC
REVOKE ALL ON FUNCTION public.validate_affiliate_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_affiliate_code(text) TO anon, authenticated;

-- =============================================================
-- 2) COACH_USAGE: add explicit INSERT policy (rest stays denied)
-- =============================================================

CREATE POLICY "Users can insert own coach usage"
ON public.coach_usage
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =============================================================
-- 3) AFFILIATE_REFERRALS: explicit deny for client writes
-- (only the SECURITY DEFINER trigger handle_new_user inserts)
-- =============================================================

CREATE POLICY "No client insert on referrals"
ON public.affiliate_referrals
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No client update on referrals"
ON public.affiliate_referrals
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No client delete on referrals"
ON public.affiliate_referrals
FOR DELETE
TO authenticated
USING (false);

-- =============================================================
-- 4) PAYMENTS: explicitly forbid client writes (server-only)
-- =============================================================

CREATE POLICY "No client insert on payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No client update on payments"
ON public.payments
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No client delete on payments"
ON public.payments
FOR DELETE
TO authenticated
USING (false);

-- =============================================================
-- 5) SUBSCRIPTIONS: forbid INSERT and DELETE from clients
-- (created by trigger; cancel handled via existing UPDATE policy)
-- =============================================================

CREATE POLICY "No client insert on subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No client delete on subscriptions"
ON public.subscriptions
FOR DELETE
TO authenticated
USING (false);

-- =============================================================
-- 6) PROFILES: forbid DELETE from clients
-- =============================================================

CREATE POLICY "No client delete on profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (false);

-- =============================================================
-- 7) USER_ROLES: forbid all client writes — admins only via SQL
-- =============================================================

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 8) Tighten EXECUTE on internal SECURITY DEFINER functions
-- These are used by RLS policies / triggers — clients should not call them directly.
-- =============================================================

REVOKE ALL ON FUNCTION public.get_user_plan(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_paid_access(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_pro_access(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role is used inside RLS policies; keep authenticated EXECUTE, drop anon
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;