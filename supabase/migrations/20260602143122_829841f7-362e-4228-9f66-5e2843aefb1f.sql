
DROP POLICY IF EXISTS "Users can update own subscription cancel" ON public.subscriptions;

CREATE POLICY "Users can update own subscription cancel"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND plan = (SELECT plan FROM public.subscriptions WHERE user_id = auth.uid())
  AND status = (SELECT status FROM public.subscriptions WHERE user_id = auth.uid())
  AND trial_ends_at = (SELECT trial_ends_at FROM public.subscriptions WHERE user_id = auth.uid())
  AND current_period_end IS NOT DISTINCT FROM (SELECT current_period_end FROM public.subscriptions WHERE user_id = auth.uid())
  AND stripe_customer_id IS NOT DISTINCT FROM (SELECT stripe_customer_id FROM public.subscriptions WHERE user_id = auth.uid())
  AND stripe_subscription_id IS NOT DISTINCT FROM (SELECT stripe_subscription_id FROM public.subscriptions WHERE user_id = auth.uid())
);
