-- Analytics extension Chrome Netodash

CREATE TABLE IF NOT EXISTS public.extension_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  event_type text NOT NULL,
  extension_version text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT extension_events_event_type_check
    CHECK (event_type IN ('open', 'capture', 'cta_click', 'recalc'))
);

CREATE INDEX IF NOT EXISTS idx_extension_events_client_id
  ON public.extension_events (client_id);

CREATE INDEX IF NOT EXISTS idx_extension_events_created_at
  ON public.extension_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_extension_events_type_created
  ON public.extension_events (event_type, created_at DESC);

ALTER TABLE public.extension_events ENABLE ROW LEVEL SECURITY;

INSERT INTO public.app_settings (key, value) VALUES
  ('extension.cws_url', 'https://chromewebstore.google.com/detail/netodash-roas-net-profit-calculator/bipggajcpfhhlfihblniiohkjmnglk'),
  ('extension.cws_installs', '0'),
  ('extension.published_version', '1.5.1'),
  ('extension.extension_id', 'bipggajcpfhhlfihblniiohkjmnglk')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.track_extension_event(
  p_client_id text,
  p_event_type text,
  p_extension_version text DEFAULT NULL,
  p_meta jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client text := lower(trim(COALESCE(p_client_id, '')));
  v_event text := lower(trim(COALESCE(p_event_type, '')));
BEGIN
  IF length(v_client) < 8 OR length(v_client) > 128 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_client_id');
  END IF;
  IF v_event NOT IN ('open', 'capture', 'cta_click', 'recalc') THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_event');
  END IF;

  INSERT INTO public.extension_events (client_id, event_type, extension_version, meta)
  VALUES (
    v_client,
    v_event,
    NULLIF(trim(COALESCE(p_extension_version, '')), ''),
    COALESCE(p_meta, '{}'::jsonb)
  );

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.track_extension_event(text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_extension_event(text, text, text, jsonb) TO service_role;

CREATE OR REPLACE FUNCTION public.get_extension_admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_settings jsonb;
BEGIN
  SELECT COALESCE(jsonb_object_agg(key, value), '{}'::jsonb)
  INTO v_settings
  FROM public.app_settings
  WHERE key LIKE 'extension.%';

  RETURN jsonb_build_object(
    'settings', v_settings,
    'tracked_users_total', (
      SELECT count(DISTINCT client_id)::int FROM public.extension_events
    ),
    'tracked_users_7d', (
      SELECT count(DISTINCT client_id)::int
      FROM public.extension_events
      WHERE created_at >= v_now - interval '7 days'
    ),
    'tracked_users_30d', (
      SELECT count(DISTINCT client_id)::int
      FROM public.extension_events
      WHERE created_at >= v_now - interval '30 days'
    ),
    'events_total', (SELECT count(*)::int FROM public.extension_events),
    'opens_today', (
      SELECT count(*)::int FROM public.extension_events
      WHERE event_type = 'open' AND created_at >= date_trunc('day', v_now)
    ),
    'opens_7d', (
      SELECT count(*)::int FROM public.extension_events
      WHERE event_type = 'open' AND created_at >= v_now - interval '7 days'
    ),
    'captures_7d', (
      SELECT count(*)::int FROM public.extension_events
      WHERE event_type = 'capture' AND created_at >= v_now - interval '7 days'
    ),
    'cta_clicks_7d', (
      SELECT count(*)::int FROM public.extension_events
      WHERE event_type = 'cta_click' AND created_at >= v_now - interval '7 days'
    ),
    'recalc_7d', (
      SELECT count(*)::int FROM public.extension_events
      WHERE event_type = 'recalc' AND created_at >= v_now - interval '7 days'
    ),
    'site_signups_extension', (
      SELECT count(*)::int FROM public.profiles
      WHERE referral_source ILIKE '%extension%'
         OR referral_source ILIKE '%chrome%'
    ),
    'by_version', COALESCE((
      SELECT jsonb_agg(row_to_json(v)::jsonb ORDER BY v.cnt DESC)
      FROM (
        SELECT COALESCE(extension_version, 'inconnue') AS version, count(*)::int AS cnt
        FROM public.extension_events
        WHERE created_at >= v_now - interval '30 days'
        GROUP BY 1
        ORDER BY cnt DESC
        LIMIT 10
      ) v
    ), '[]'::jsonb),
    'daily_opens', COALESCE((
      SELECT jsonb_agg(row_to_json(d)::jsonb ORDER BY d.day ASC)
      FROM (
        SELECT date_trunc('day', created_at)::date AS day, count(*)::int AS opens
        FROM public.extension_events
        WHERE event_type = 'open'
          AND created_at >= v_now - interval '14 days'
        GROUP BY 1
        ORDER BY 1
      ) d
    ), '[]'::jsonb),
    'recent_events', COALESCE((
      SELECT jsonb_agg(row_to_json(e)::jsonb ORDER BY e.created_at DESC)
      FROM (
        SELECT
          id,
          client_id,
          event_type,
          extension_version,
          created_at
        FROM public.extension_events
        ORDER BY created_at DESC
        LIMIT 40
      ) e
    ), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_extension_admin_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_extension_admin_stats() TO service_role;

NOTIFY pgrst, 'reload schema';
