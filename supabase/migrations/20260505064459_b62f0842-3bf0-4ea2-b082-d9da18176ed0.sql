UPDATE public.subscriptions
SET plan='starter', status='active',
    current_period_end = now() + interval '30 days',
    updated_at = now()
WHERE user_id='cdbf9f68-1f9b-4c4d-a985-9e1a72208465';