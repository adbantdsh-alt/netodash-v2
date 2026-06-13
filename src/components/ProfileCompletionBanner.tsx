import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { toast } from "sonner";
import { X } from "lucide-react";

const DISMISS_KEY = "profile-completion-dismissed-at";
const DISMISS_DAYS = 3;

export function ProfileCompletionBanner() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<{
    country: string | null;
    phone: string | null;
    phone_country_code: string | null;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    supabase
      .from("profiles")
      .select("country, phone, phone_country_code")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted || !data) return;
        setProfile(data);
        setCountry(data.country ?? "");
        setPhoneCode(data.phone_country_code ?? "");
        setPhone(data.phone ?? "");
      });
    try {
      const v = localStorage.getItem(DISMISS_KEY);
      if (v) {
        const t = parseInt(v, 10);
        if (Date.now() - t < DISMISS_DAYS * 86400000) setDismissed(true);
      }
    } catch {
      /* ignore */
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!country) return;
    const c = getCountry(country);
    if (c?.dial && !phoneCode) setPhoneCode(c.dial);
  }, [country, phoneCode]);

  if (loading || !user || !profile) return null;
  const missingCountry = !profile.country;
  const missingPhone = !profile.phone;
  if (!missingCountry && !missingPhone) return null;
  if (dismissed && !open) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  async function save() {
    if (!user) return;
    if (!country.trim() && !phone.trim()) {
      toast.error("Renseigne au moins ton pays ou ton téléphone.");
      return;
    }
    setSaving(true);
    const updates: {
      country?: string;
      phone_country_code?: string;
      phone?: string;
    } = {};
    if (country.trim()) updates.country = country.trim();
    if (phoneCode.trim()) updates.phone_country_code = phoneCode.trim();
    if (phone.trim()) updates.phone = phone.trim().replace(/[^\d\s]/g, "");
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profil mis à jour 👌");
    setProfile({
      country: updates.country ?? profile?.country ?? null,
      phone: updates.phone ?? profile?.phone ?? null,
      phone_country_code: updates.phone_country_code ?? profile?.phone_country_code ?? null,
    });
    setOpen(false);
  }

  return (
    <>
      <div className="brutal-border-thin border-l-0 border-r-0 border-t-0 bg-accent/10 text-foreground">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 text-xs md:text-sm">
          <span className="font-bold uppercase tracking-widest text-accent text-[10px] md:text-xs shrink-0 hidden sm:inline">
            Profil
          </span>
          <span className="flex-1 min-w-0">
            {missingCountry && missingPhone
              ? "Ajoute ton pays et ton téléphone pour recevoir l'assistance WhatsApp."
              : missingCountry
                ? "Ajoute ton pays pour des conseils adaptés."
                : "Ajoute ton numéro WhatsApp pour recevoir l'assistance."}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent shrink-0"
          >
            Compléter
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fermer"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="brutal-border bg-background max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
              Profil
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mt-1">
              Complète ton profil
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Pour qu'on puisse t'aider plus vite et adapter les conseils à ton marché.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5">
                  Pays
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    const c = getCountry(e.target.value);
                    if (c?.dial) setPhoneCode(c.dial);
                  }}
                  className="w-full brutal-border-thin bg-background px-3 py-2 text-sm"
                >
                  <option value="">— Choisir —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-1.5">
                  Téléphone WhatsApp
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    placeholder="+221"
                    maxLength={5}
                    className="w-20 brutal-border-thin bg-background px-2 py-2 text-sm"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                    placeholder="77 123 45 67"
                    maxLength={20}
                    className="flex-1 brutal-border-thin bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 brutal-border bg-foreground text-background px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50"
              >
                {saving ? "Sauvegarde…" : "Enregistrer"}
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="brutal-border-thin px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-muted"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
