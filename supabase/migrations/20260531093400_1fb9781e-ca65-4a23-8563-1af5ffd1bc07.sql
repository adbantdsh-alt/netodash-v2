
-- Drop COD tables
DROP TABLE IF EXISTS public.entry_zone_deliveries CASCADE;
DROP TABLE IF EXISTS public.delivery_zones CASCADE;

-- daily_entries: drop COD columns, add include_shopify_fees
ALTER TABLE public.daily_entries
  DROP COLUMN IF EXISTS confirmed_orders,
  DROP COLUMN IF EXISTS delivered_orders,
  DROP COLUMN IF EXISTS cancelled_orders,
  DROP COLUMN IF EXISTS delivered_dakar,
  DROP COLUMN IF EXISTS delivered_regions,
  DROP COLUMN IF EXISTS actual_delivery_total,
  ADD COLUMN IF NOT EXISTS include_shopify_fees boolean NOT NULL DEFAULT false;

-- products: drop COD columns
ALTER TABLE public.products
  DROP COLUMN IF EXISTS product_type,
  DROP COLUMN IF EXISTS call_center_fee,
  DROP COLUMN IF EXISTS delivery_fee,
  DROP COLUMN IF EXISTS delivery_fee_dakar,
  DROP COLUMN IF EXISTS delivery_fee_regions,
  DROP COLUMN IF EXISTS wave_fee_pct,
  DROP COLUMN IF EXISTS hidden_fees,
  DROP COLUMN IF EXISTS transaction_fee_pct;
