ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS onboarding_step integer NOT NULL DEFAULT 0;

-- Auto-mark existing users with at least one product as done
UPDATE public.profiles p
SET onboarding_status = 'done'
WHERE onboarding_status = 'pending'
  AND EXISTS (SELECT 1 FROM public.products pr WHERE pr.user_id = p.id);
