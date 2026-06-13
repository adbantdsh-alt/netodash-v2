UPDATE public.subscriptions
SET plan='pro',
    status='active',
    current_period_end='2099-12-31 23:59:59+00',
    cancel_at_period_end=false,
    updated_at=now()
WHERE user_id='ad4a4e99-a9f8-4f48-9579-1493d988846d';