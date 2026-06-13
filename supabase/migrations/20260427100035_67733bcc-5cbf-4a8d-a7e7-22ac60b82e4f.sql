-- Lock down SECURITY DEFINER helpers: only service_role (server) can execute.
REVOKE EXECUTE ON FUNCTION public.get_user_plan(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_paid_access(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_pro_access(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_user_plan(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.has_paid_access(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.has_pro_access(uuid) TO service_role;