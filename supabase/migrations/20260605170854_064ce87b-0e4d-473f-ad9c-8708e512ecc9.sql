-- Expose the "admin" schema to PostgREST so the Data API can query admin.audit_logs and admin.accounts
ALTER ROLE authenticator SET pgrst.db_schemas = 'public,admin';

GRANT USAGE ON SCHEMA admin TO service_role, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA admin TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA admin TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA admin TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA admin GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA admin GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA admin GRANT ALL ON FUNCTIONS TO service_role;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';