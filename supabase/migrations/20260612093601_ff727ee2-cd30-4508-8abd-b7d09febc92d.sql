INSERT INTO admin.accounts (id, email, display_name, role, status)
SELECT u.id, u.email, 'Super Admin', 'super_admin', 'active'
FROM auth.users u
WHERE u.email = 'adbaecomx@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', status = 'active', email = EXCLUDED.email;