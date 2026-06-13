import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";
import { REFERRAL_SOURCES } from "@/lib/countries";
import { ALL_COUNTRIES, searchCountries, findCountry } from "@/lib/countries-all";


const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional().default("login"),
  ref: z.string().trim().toLowerCase().max(60).optional(),
  email: z.string().trim().email().max(255).optional(),
  firstName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().max(100).optional(),
  beta: z.enum(["1"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Connexion — NETODASH" },
      { name: "description", content: "Connecte-toi à ton dashboard NETODASH." },
    ],
  }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(8, "8 caractères minimum").max(72),
});

function AuthPage() {
  const { mode, ref, email: emailParam, firstName: firstNameParam, lastName: lastNameParam, beta } =
    Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [selectedMode, setSelectedMode] = useState<"dropshipping" | "cod">("dropshipping");
  const [affiliateCode, setAffiliateCode] = useState(ref ?? "");
  const [affiliateInfo, setAffiliateInfo] = useState<{ valid: boolean; trial_days?: number; label?: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSentTo, setSignupSentTo] = useState<string | null>(null);

  // Pré-remplir l'indicatif quand pays change
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const c = findCountry(country);
    if (c && c.dial) setPhoneCode(c.dial);
  }, [country]);

  // Suggestions pays (autocomplete)
  const countrySuggestions =
    countryOpen && countryQuery.trim() ? searchCountries(countryQuery, 8) : [];

  useEffect(() => setIsSignup(mode === "signup"), [mode]);
  useEffect(() => {
    if (ref) setIsSignup(true);
  }, [ref]);
  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (firstNameParam) setFirstName(firstNameParam);
    if (lastNameParam) setLastName(lastNameParam);
    if (beta === "1" || emailParam) setIsSignup(true);
  }, [emailParam, firstNameParam, lastNameParam, beta]);
  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  // Validate affiliate code (debounced-ish via effect)
  useEffect(() => {
    const code = affiliateCode.trim().toLowerCase();
    if (!isSignup || !code) {
      setAffiliateInfo(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data, error } = await supabase.rpc("validate_affiliate_code", { _code: code });
      if (cancelled) return;
      const row = Array.isArray(data) ? data[0] : null;
      if (!error && row && row.valid) {
        setAffiliateInfo({ valid: true, trial_days: row.trial_days, label: row.label });
      } else {
        setAffiliateInfo({ valid: false });
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [affiliateCode, isSignup]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }
    if (isSignup) {
      if (password !== confirmPassword) {
        setErr("Les deux mots de passe ne correspondent pas.");
        return;
      }
      if (!firstName.trim()) {
        setErr("Le prénom est obligatoire.");
        return;
      }
      if (!lastName.trim()) {
        setErr("Le nom est obligatoire.");
        return;
      }
      if (!phone.trim()) {
        setErr("Le numéro de téléphone est obligatoire.");
        return;
      }
      if (!phoneCode.trim()) {
        setErr("L'indicatif téléphonique est obligatoire.");
        return;
      }
    }
    setBusy(true);
    try {
      if (isSignup) {
        const code = affiliateCode.trim().toLowerCase();
        const meta: Record<string, string> = {};
        if (code) meta.affiliate_code = code;
        if (firstName.trim()) meta.first_name = firstName.trim();
        if (lastName.trim()) meta.last_name = lastName.trim();
        if (country) meta.country = country;
        if (phoneCode.trim()) meta.phone_country_code = phoneCode.trim();
        if (phone.trim()) meta.phone = phone.trim();
        if (referralSource) meta.referral_source = referralSource;
        meta.selected_mode = selectedMode;
        meta.active_mode = selectedMode;
        if (firstName.trim() || lastName.trim()) {
          meta.display_name = `${firstName.trim()} ${lastName.trim()}`.trim();
        }
        if (beta === "1") meta.beta_tester = "1";
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: Object.keys(meta).length ? meta : undefined,
          },
        });
        if (error) throw error;
        // If email confirmation is required, no session is returned
        if (!data.session) {
          setSignupSentTo(parsed.data.email);
          toast.success(
            beta === "1"
              ? "Compte bêta créé. Vérifie ton email — Scale gratuit 6 mois + -50 % à vie."
              : "Compte créé. Vérifie ton email.",
          );
          return;
        }
        // Persist selected mode in profile (handle_new_user trigger n'a pas ces colonnes).
        if (data.user?.id) {
          await supabase
            .from("profiles")
            .update({
              selected_mode: selectedMode,
              active_mode: selectedMode,
            } as any)
            .eq("id", data.user.id);
        }
        toast.success(
          beta === "1"
            ? "Compte bêta créé — Scale gratuit 6 mois, puis -50 % à vie !"
            : affiliateInfo?.valid
              ? `Compte créé. Essai gratuit ${affiliateInfo.trial_days} jours !`
              : "Compte créé.",
        );
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Connecté.");
        navigate({ to: "/dashboard" });
      }
    } catch (e: any) {
      const msg = e?.message ?? "Erreur inconnue";
      setErr(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setErr("Entre ton email d'abord.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Email de réinitialisation envoyé.");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Retour
        </Link>
        <div className="mt-6 brutal-border p-6 sm:p-8 md:p-10">
          <div className="flex items-center mb-6">
            <Logo mode="cod" priority className="h-7 md:h-8 w-auto object-contain shrink-0" />
          </div>

          {signupSentTo ? (
            <div>
              <div className="text-xs uppercase tracking-widest text-accent font-bold mb-2">
                ✓ Compte créé
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tighter">
                VÉRIFIE TON EMAIL
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Un email de confirmation vient d'être envoyé à :
              </p>
              <div className="brutal-border-thin px-4 py-3 font-mono text-sm break-all mb-4 bg-muted">
                {signupSentTo}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Clique sur le lien dans l'email pour activer ton compte, puis reviens te connecter.
                Pense à vérifier tes <strong className="text-foreground">spams / promotions</strong>.
              </p>
              <button
                onClick={() => {
                  setSignupSentTo(null);
                  setIsSignup(false);
                  setPassword("");
                }}
                className="w-full brutal-border bg-foreground text-background px-4 py-3 font-black uppercase tracking-wider hover:bg-accent hover:border-accent"
              >
                Aller à la connexion
              </button>
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.resend({
                    type: "signup",
                    email: signupSentTo,
                    options: { emailRedirectTo: `${window.location.origin}/dashboard` },
                  });
                  if (error) toast.error(error.message);
                  else toast.success("Email renvoyé.");
                }}
                className="w-full mt-3 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground"
              >
                Renvoyer l'email
              </button>
            </div>
          ) : (
          <>
          {/* Onglets Connexion / Création */}
          <div role="tablist" aria-label="Mode d'authentification" className="grid grid-cols-2 brutal-border-thin mb-6">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              onClick={() => { setIsSignup(false); setErr(null); }}
              className={`px-3 py-3 text-xs uppercase tracking-widest font-black transition-colors ${
                !isSignup
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              onClick={() => { setIsSignup(true); setErr(null); }}
              className={`px-3 py-3 text-xs uppercase tracking-widest font-black border-l border-foreground transition-colors ${
                isSignup
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Créer un compte
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-1 tracking-tighter">
            {isSignup ? "CRÉER UN COMPTE" : "CONNEXION"}
          </h1>
          {isSignup && beta === "1" && (
            <div className="brutal-border-thin border-accent bg-accent/10 px-4 py-3 mb-4">
              <div className="text-xs uppercase tracking-widest font-black text-accent mb-1">
                Programme bêta-testeur
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                Inscription identique aux autres utilisateurs. Les bêta-testeurs bénéficient du plan{" "}
                <strong className="text-foreground">Scale</strong> gratuit pendant{" "}
                <strong className="text-foreground">6 mois</strong>, puis{" "}
                <strong className="text-foreground">-50 % à vie</strong> sur tous les plans (places
                limitées à 10).
              </p>
            </div>
          )}
          <p className="text-muted-foreground text-sm mb-8">
            {isSignup
              ? beta === "1"
                ? "Finalise ton inscription bêta en 30 secondes."
                : "Démarre en 30 secondes."
              : "Accède à ton dashboard."}
          </p>

          <form onSubmit={handleSubmit} method="post" action="/auth" className="space-y-5" autoComplete="on">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-background brutal-border-thin px-4 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                placeholder="toi@exemple.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest font-bold mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className="w-full bg-background brutal-border-thin px-4 py-3 pr-12 font-mono text-sm focus:border-accent outline-none focus:border-2"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Masquer" : "Voir"}
                </button>
              </div>
            </div>
            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-widest font-bold mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full bg-background brutal-border-thin px-4 py-3 pr-12 font-mono text-sm focus:border-accent outline-none focus:border-2"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? "Masquer" : "Voir"}
                  </button>
                </div>
                {confirmPassword && (
                  <div
                    className={`mt-2 text-xs font-bold ${
                      password === confirmPassword ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {password === confirmPassword
                      ? "✓ Les mots de passe correspondent"
                      : "✗ Les mots de passe ne correspondent pas"}
                  </div>
                )}
              </div>
            )}
            {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs uppercase tracking-widest font-bold mb-2">
                      Prénom *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      maxLength={60}
                      required
                      autoComplete="given-name"
                      className="w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                      placeholder="Aïssa"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs uppercase tracking-widest font-bold mb-2">
                      Nom *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      maxLength={60}
                      required
                      autoComplete="family-name"
                      className="w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                      placeholder="Diop"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="country" className="block text-xs uppercase tracking-widest font-bold mb-2">
                    Pays <span className="text-muted-foreground font-normal normal-case">(opt., tape pour rechercher)</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={countryQuery}
                    onChange={(e) => {
                      setCountryQuery(e.target.value);
                      setCountryOpen(true);
                      if (country) setCountry(""); // user changed -> clear selection until they pick
                    }}
                    onFocus={() => setCountryOpen(true)}
                    onBlur={() => setTimeout(() => setCountryOpen(false), 150)}
                    autoComplete="off"
                    className="w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                    placeholder="ex. France, Sénégal, Côte d'Ivoire…"
                  />
                  {country && countryQuery && (
                    <div className="mt-1 text-[10px] font-mono text-emerald-600">
                      ✓ {findCountry(country)?.flag} {findCountry(country)?.name}
                    </div>
                  )}
                  {countrySuggestions.length > 0 && (
                    <ul
                      role="listbox"
                      className="absolute z-20 left-0 right-0 mt-1 bg-background brutal-border-thin max-h-60 overflow-auto shadow-[4px_4px_0_0_var(--color-foreground)]"
                    >
                      {countrySuggestions.map((c) => (
                        <li key={c.code}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setCountry(c.code);
                              setCountryQuery(`${c.flag} ${c.name}`);
                              if (c.dial) setPhoneCode(c.dial);
                              setCountryOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 font-mono text-sm hover:bg-muted flex items-center justify-between gap-3"
                          >
                            <span>
                              <span className="mr-2">{c.flag}</span>
                              {c.name}
                            </span>
                            <span className="text-muted-foreground text-xs">{c.dial}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-1 text-[10px] font-mono text-muted-foreground">
                    Tape les premières lettres (ex. <em>fra</em> pour France).
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">
                    Téléphone <span className="text-accent font-normal normal-case">*</span>{" "}
                    <span className="text-muted-foreground font-normal normal-case">(utile pour WhatsApp)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      maxLength={5}
                      required
                      placeholder="+33"
                      aria-label="Indicatif"
                      className="w-20 bg-background brutal-border-thin px-2 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                      maxLength={20}
                      required
                      autoComplete="tel-national"
                      placeholder="6 12 34 56 78"
                      className="flex-1 bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                    />
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-muted-foreground">
                    L'indicatif se met à jour automatiquement quand tu choisis ton pays.
                  </div>
                </div>

                <div>
                  <label htmlFor="referral" className="block text-xs uppercase tracking-widest font-bold mb-2">
                    Comment nous as-tu connu ? <span className="text-muted-foreground font-normal normal-case">(opt.)</span>
                  </label>
                  <select
                    id="referral"
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
                  >
                    <option value="">— Sélectionner —</option>
                    {REFERRAL_SOURCES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">
                    Avec quel mode tu démarres ? *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMode("dropshipping")}
                      aria-pressed={selectedMode === "dropshipping"}
                      className={`brutal-border-thin px-3 py-3 text-left transition-colors ${
                        selectedMode === "dropshipping"
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-widest">Dropshipping</div>
                      <div className="text-[10px] font-mono mt-1 opacity-80">Shopify + Meta/TikTok</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMode("cod")}
                      aria-pressed={selectedMode === "cod"}
                      className={`brutal-border-thin px-3 py-3 text-left transition-colors ${
                        selectedMode === "cod"
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-widest">COD</div>
                      <div className="text-[10px] font-mono mt-1 opacity-80">Cash on Delivery · FCFA</div>
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-muted-foreground leading-snug">
                    Tu pourras changer de mode après. Sur le plan Basic ($5), un seul mode est actif à la fois.
                    Plans Pro/Premium : Drop + COD en parallèle.
                  </div>
                </div>
              </>
            )}
            {isSignup && (
              <div>
                <label htmlFor="affiliate" className="block text-xs uppercase tracking-widest font-bold mb-2">
                  Code parrainage <span className="text-muted-foreground font-normal normal-case">(optionnel)</span>
                </label>
                <input
                  id="affiliate"
                  name="affiliate"
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-background brutal-border-thin px-4 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2 lowercase"
                  placeholder="ntdsh-xxxx"
                />
                {affiliateCode && affiliateInfo?.valid && (
                  <div className="mt-2 text-xs font-bold text-emerald-600">
                    ✓ Code valide — Essai gratuit {affiliateInfo.trial_days} jours
                    {affiliateInfo.label ? ` (${affiliateInfo.label})` : ""}
                  </div>
                )}
                {affiliateCode && affiliateInfo && !affiliateInfo.valid && (
                  <div className="mt-2 text-xs font-bold text-amber-600">
                    Code inconnu — essai standard 3 jours appliqué
                  </div>
                )}
                {!affiliateCode && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Sans code : essai gratuit de 3 jours
                  </div>
                )}
              </div>
            )}
            {err && (
              <div className="brutal-border-thin border-accent text-accent px-3 py-2 text-sm font-bold">
                {err}
              </div>
            )}
            <button
              type="submit"
              disabled={!hydrated || busy}
              className="w-full brutal-border bg-foreground text-background px-4 py-4 font-black uppercase tracking-wider hover:bg-accent hover:border-accent disabled:opacity-50"
            >
              {!hydrated ? "CHARGEMENT…" : busy ? "…" : isSignup ? "CRÉER LE COMPTE" : "SE CONNECTER"}
            </button>
          </form>

          {!isSignup && (
            <div className="mt-6 text-xs uppercase tracking-widest">
              <button onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                Mot de passe oublié ?
              </button>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}
