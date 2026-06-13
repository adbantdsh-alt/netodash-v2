-- Add product_type to distinguish COD (Africa) vs dropshipping
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'cod'
    CHECK (product_type IN ('cod', 'dropshipping')),
  ADD COLUMN IF NOT EXISTS shipping_cost numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS transaction_fee_pct numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hidden_fees numeric NOT NULL DEFAULT 0;

-- Existing products = COD (already the default)
UPDATE public.products SET product_type = 'cod' WHERE product_type IS NULL;