-- Rôle admin (user_roles) pour les super-admins back-office
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN (lower('adbaxgoat@gmail.com'), lower('adbaecomx@gmail.com'))
ON CONFLICT (user_id, role) DO NOTHING;
