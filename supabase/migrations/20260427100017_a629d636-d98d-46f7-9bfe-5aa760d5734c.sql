-- ============================================================
-- 1. SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE public.subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'active',
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_plan_check CHECK (plan IN ('trial', 'starter', 'pro')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete'))
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for client. Only service role (server) can write.

CREATE TRIGGER touch_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- 2. COACH_USAGE TABLE (rate limit log)
-- ============================================================
CREATE TABLE public.coach_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX coach_usage_user_recent_idx
  ON public.coach_usage (user_id, created_at DESC);

ALTER TABLE public.coach_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach usage"
  ON public.coach_usage FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for client. Only service role (server /api/coach) can write.

-- ============================================================
-- 3. HELPER FUNCTIONS (SECURITY DEFINER, no recursion)
-- ============================================================

-- Returns the EFFECTIVE plan: 'trial' | 'starter' | 'pro' | 'free'
-- 'free' = trial expired and no active paid subscription.
CREATE OR REPLACE FUNCTION public.get_user_plan(_uid uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN s.plan = 'pro' AND s.status IN ('active', 'incomplete') THEN 'pro'
    WHEN s.plan = 'starter' AND s.status IN ('active', 'incomplete') THEN 'starter'
    WHEN s.plan = 'trial' AND s.trial_ends_at > now() THEN 'trial'
    ELSE 'free'
  END
  FROM public.subscriptions s
  WHERE s.user_id = _uid;
$$;

CREATE OR REPLACE FUNCTION public.has_paid_access(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_plan(_uid) IN ('trial', 'starter', 'pro');
$$;

CREATE OR REPLACE FUNCTION public.has_pro_access(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_plan(_uid) IN ('trial', 'pro');
$$;

-- ============================================================
-- 4. AUTO-CREATE SUBSCRIPTION ON SIGNUP
-- ============================================================
-- Extend the existing handle_new_user trigger function so it also seeds
-- a subscriptions row with a 7-day trial.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'trial', 'active', now() + interval '7 days')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Make sure the trigger exists (recreate idempotently).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 5. BACKFILL EXISTING USERS (7-day catch-up trial)
-- ============================================================
INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
SELECT u.id, 'trial', 'active', now() + interval '7 days'
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.user_id IS NULL;