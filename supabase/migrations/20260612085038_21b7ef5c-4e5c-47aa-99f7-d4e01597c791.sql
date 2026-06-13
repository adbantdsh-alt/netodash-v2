-- Recherche admin : ILIKE sur email / phone (profiles)
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles (country) WHERE country IS NOT NULL;

-- Webhook Shopify sync : profils opt-in
CREATE INDEX IF NOT EXISTS idx_profiles_auto_sync ON public.profiles (id) WHERE auto_sync_enabled = true;

-- Webhook Shopify sync : connexions actives
CREATE INDEX IF NOT EXISTS idx_shopify_connections_active ON public.shopify_connections (user_id) WHERE active = true;

-- Paiements : historique par user trié par date + listings admin globaux
CREATE INDEX IF NOT EXISTS idx_payments_user_created ON public.payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments (created_at DESC);

-- Messages contact : tri par statut/date côté admin
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON public.contact_messages (status, created_at DESC);

-- Daily entries : tri "derniers ajouts" par user
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_created ON public.daily_entries (user_id, created_at DESC);