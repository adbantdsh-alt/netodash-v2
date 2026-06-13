
-- 1) app_settings: restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can read settings" ON public.app_settings;
CREATE POLICY "Authenticated can read settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (true);

-- 2) subscriptions: restrict UPDATE to only the cancel_at_period_end column
REVOKE UPDATE ON public.subscriptions FROM authenticated;
GRANT UPDATE (cancel_at_period_end) ON public.subscriptions TO authenticated;

-- 3) Lock down SECURITY DEFINER functions that should not be RPC-callable
REVOKE EXECUTE ON FUNCTION public.get_user_plan(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
