CREATE TABLE public.roas_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  mode TEXT NOT NULL,
  currency TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roas_calculations TO authenticated;
GRANT ALL ON public.roas_calculations TO service_role;

ALTER TABLE public.roas_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roas calculations"
  ON public.roas_calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roas calculations"
  ON public.roas_calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roas calculations"
  ON public.roas_calculations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roas calculations"
  ON public.roas_calculations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX roas_calculations_user_created_idx
  ON public.roas_calculations (user_id, created_at DESC);

CREATE TRIGGER roas_calculations_touch_updated_at
  BEFORE UPDATE ON public.roas_calculations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();