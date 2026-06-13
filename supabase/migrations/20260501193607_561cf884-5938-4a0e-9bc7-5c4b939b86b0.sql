-- Affiliate codes table (admin-managed)
CREATE TABLE public.affiliate_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  label text,
  trial_days integer NOT NULL DEFAULT 5,
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_codes_code ON public.affiliate_codes(lower(code));

ALTER TABLE public.affiliate_codes ENABLE ROW LEVEL SECURITY;

-- Only admins manage codes
CREATE POLICY "Admins manage affiliate codes"
ON public.affiliate_codes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anyone authenticated can read active codes (for validation during signup, kept minimal)
CREATE POLICY "Anyone can view active codes for validation"
ON public.affiliate_codes
FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE TRIGGER touch_affiliate_codes_updated_at
BEFORE UPDATE ON public.affiliate_codes
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Referrals table: who used which code
CREATE TABLE public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES public.affiliate_codes(id) ON DELETE CASCADE,
  code text NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  trial_days integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_referrals_code_id ON public.affiliate_referrals(code_id);
CREATE INDEX idx_affiliate_referrals_user_id ON public.affiliate_referrals(user_id);

ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all referrals"
ON public.affiliate_referrals
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own referral"
ON public.affiliate_referrals
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Update handle_new_user to apply affiliate code trial_days
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_aff record;
  v_trial_days integer := 3;
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  v_code := lower(trim(COALESCE(NEW.raw_user_meta_data->>'affiliate_code', '')));

  IF v_code <> '' THEN
    SELECT * INTO v_aff FROM public.affiliate_codes
    WHERE lower(code) = v_code AND active = true
    LIMIT 1;

    IF FOUND THEN
      v_trial_days := v_aff.trial_days;
      INSERT INTO public.affiliate_referrals (code_id, code, user_id, trial_days)
      VALUES (v_aff.id, v_aff.code, NEW.id, v_trial_days)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'trial', 'active', now() + (v_trial_days || ' days')::interval)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Seed default code for the admin user (adbaecomx@gmail.com -> ntdsh-adbaecomx)
INSERT INTO public.affiliate_codes (code, owner_user_id, label, trial_days, created_by)
SELECT 'ntdsh-adbaecomx', u.id, 'Admin par défaut', 5, u.id
FROM auth.users u
WHERE u.email = 'adbaecomx@gmail.com'
ON CONFLICT (code) DO NOTHING;