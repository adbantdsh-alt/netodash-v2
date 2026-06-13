
-- Active mode on profile
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS active_mode text NOT NULL DEFAULT 'dropshipping'
    CHECK (active_mode IN ('cod', 'dropshipping')),
  ADD COLUMN IF NOT EXISTS cod_currency text NOT NULL DEFAULT 'XOF'
    CHECK (cod_currency IN ('XOF')),
  ADD COLUMN IF NOT EXISTS dropshipping_currency text NOT NULL DEFAULT 'EUR'
    CHECK (dropshipping_currency IN ('EUR', 'USD', 'GBP'));

-- Business mode tag on products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS business_mode text NOT NULL DEFAULT 'dropshipping'
    CHECK (business_mode IN ('cod', 'dropshipping'));

-- Business mode tag + COD-specific fields on daily_entries
ALTER TABLE public.daily_entries
  ADD COLUMN IF NOT EXISTS business_mode text NOT NULL DEFAULT 'dropshipping'
    CHECK (business_mode IN ('cod', 'dropshipping')),
  ADD COLUMN IF NOT EXISTS delivered_orders integer,
  ADD COLUMN IF NOT EXISTS refused_orders integer,
  ADD COLUMN IF NOT EXISTS cash_collected numeric;

-- Indexes for fast mode-filtered reads
CREATE INDEX IF NOT EXISTS idx_products_user_mode
  ON public.products (user_id, business_mode);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_mode
  ON public.daily_entries (user_id, business_mode);
