-- Réduire l'essai gratuit de 7 jours à 3 jours
-- 1) Nouveau default sur la colonne
ALTER TABLE public.subscriptions
  ALTER COLUMN trial_ends_at SET DEFAULT (now() + interval '3 days');

-- 2) Mettre à jour la fonction handle_new_user pour utiliser 3 jours
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'trial', 'active', now() + interval '3 days')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;