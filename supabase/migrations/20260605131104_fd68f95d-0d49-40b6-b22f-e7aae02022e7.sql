INSERT INTO admin.accounts (id, email, role, status, created_at)
SELECT u.id, u.email, 'super_admin', 'active', now()
FROM auth.users u
WHERE lower(u.email) = lower('adbaecomx@gmail.com')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', status = 'active';