-- Table des connexions Shopify (1 par utilisateur en V1)
CREATE TABLE public.shopify_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  shop_domain text NOT NULL,
  access_token text NOT NULL,
  scopes text,
  currency text,
  shop_name text,
  connected_at timestamptz NOT NULL DEFAULT now(),
  last_sync_at timestamptz,
  last_sync_status text,
  last_sync_message text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shopify_connections TO authenticated;
GRANT ALL ON public.shopify_connections TO service_role;

ALTER TABLE public.shopify_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own shopify connection"
  ON public.shopify_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own shopify connection"
  ON public.shopify_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own shopify connection"
  ON public.shopify_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own shopify connection"
  ON public.shopify_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER touch_shopify_connections
  BEFORE UPDATE ON public.shopify_connections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Lier un produit dropshipping à un domaine Shopify
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS shopify_shop_domain text,
  ADD COLUMN IF NOT EXISTS shopify_product_match text;

CREATE INDEX IF NOT EXISTS idx_products_shopify_shop ON public.products(shopify_shop_domain);