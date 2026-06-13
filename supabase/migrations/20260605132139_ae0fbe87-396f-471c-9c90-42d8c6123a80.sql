
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','success','warning','critical')),
  audience text NOT NULL DEFAULT 'all' CHECK (audience IN ('all','free','trial','paying','basic','starter','pro')),
  cta_label text,
  cta_url text,
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_active ON public.announcements(active, starts_at, ends_at);

GRANT SELECT ON public.announcements TO authenticated, anon;
GRANT ALL ON public.announcements TO service_role;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Lecture publique des annonces actives (filtrage par plan côté serverFn pour audience ciblée)
CREATE POLICY "Active announcements are readable"
  ON public.announcements FOR SELECT
  USING (active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

CREATE TRIGGER trg_announcements_updated
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
