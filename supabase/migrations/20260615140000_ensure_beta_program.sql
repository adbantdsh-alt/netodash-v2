-- Rattrapage prod : tables programme bêta si migrations 2026061412* non appliquées.

CREATE TABLE IF NOT EXISTS public.beta_testers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT beta_testers_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.beta_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT beta_waitlist_email_key UNIQUE (email)
);

ALTER TABLE public.beta_testers
  ADD COLUMN IF NOT EXISTS free_until timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS lifetime_discount_percent integer NOT NULL DEFAULT 50;

ALTER TABLE public.beta_testers
  DROP CONSTRAINT IF EXISTS beta_testers_lifetime_discount_percent_check;

ALTER TABLE public.beta_testers
  ADD CONSTRAINT beta_testers_lifetime_discount_percent_check
  CHECK (lifetime_discount_percent >= 0 AND lifetime_discount_percent <= 100);

CREATE INDEX IF NOT EXISTS idx_beta_testers_created_at ON public.beta_testers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beta_waitlist_created_at ON public.beta_waitlist(created_at DESC);

ALTER TABLE public.beta_testers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_waitlist ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.beta_testers TO service_role;
GRANT ALL ON public.beta_waitlist TO service_role;
GRANT SELECT ON public.beta_testers TO authenticated;
GRANT SELECT ON public.beta_waitlist TO authenticated;

CREATE OR REPLACE FUNCTION public.get_beta_program_status()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'max_spots', 10,
    'beta_count', (SELECT count(*)::int FROM beta_testers),
    'waitlist_count', (SELECT count(*)::int FROM beta_waitlist),
    'beta_full', (SELECT count(*) >= 10 FROM beta_testers),
    'spots_left', GREATEST(0, 10 - (SELECT count(*)::int FROM beta_testers))
  );
$$;

CREATE OR REPLACE FUNCTION public.register_beta_tester(p_full_name text, p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
  v_email text := lower(trim(p_email));
  v_name text := trim(p_full_name);
BEGIN
  IF length(v_name) < 2 OR v_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_input');
  END IF;

  IF EXISTS (SELECT 1 FROM beta_testers WHERE lower(email) = v_email) THEN
    RETURN jsonb_build_object(
      'ok', true,
      'already_registered', true,
      'beta_full', (SELECT count(*) >= 10 FROM beta_testers),
      'beta_count', (SELECT count(*)::int FROM beta_testers),
      'spots_left', GREATEST(0, 10 - (SELECT count(*)::int FROM beta_testers))
    );
  END IF;

  PERFORM pg_advisory_xact_lock(837291);

  SELECT count(*)::int INTO v_count FROM beta_testers;
  IF v_count >= 10 THEN
    RETURN jsonb_build_object('ok', false, 'beta_full', true, 'error', 'beta_full');
  END IF;

  INSERT INTO beta_testers (email, full_name) VALUES (v_email, v_name);

  RETURN jsonb_build_object(
    'ok', true,
    'beta_count', v_count + 1,
    'spots_left', GREATEST(0, 10 - v_count - 1),
    'beta_full', (v_count + 1 >= 10)
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('ok', true, 'already_registered', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.register_beta_waitlist(p_email text, p_full_name text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(p_email));
  v_name text := nullif(trim(coalesce(p_full_name, '')), '');
BEGIN
  IF v_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_input');
  END IF;

  IF EXISTS (SELECT 1 FROM beta_waitlist WHERE lower(email) = v_email) THEN
    RETURN jsonb_build_object('ok', true, 'already_registered', true);
  END IF;

  INSERT INTO beta_waitlist (email, full_name) VALUES (v_email, v_name);

  RETURN jsonb_build_object('ok', true);
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('ok', true, 'already_registered', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_beta_program_status() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.register_beta_tester(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.register_beta_waitlist(text, text) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Admins can view beta testers" ON public.beta_testers;
CREATE POLICY "Admins can view beta testers"
  ON public.beta_testers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view beta waitlist" ON public.beta_waitlist;
CREATE POLICY "Admins can view beta waitlist"
  ON public.beta_waitlist FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own beta tester row" ON public.beta_testers;
CREATE POLICY "Users can view own beta tester row"
  ON public.beta_testers FOR SELECT
  USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
