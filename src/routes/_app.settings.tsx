import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/queries";
import { normalizeDropshippingCurrency } from "@/lib/calc";
import { readDropshippingUsdRate } from "@/lib/dropshipping-fx";
import { deleteAccount } from "@/lib/account.functions";
import { useOnboarding } from "@/lib/use-onboarding";
import { useNavigate as useNav } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Compte — NETODASH" }] }),
  component: SettingsPage,
});

const CURRENCIES = [
  { code: "EUR", label: "EUR — Euro (€)" },
  { code: "USD", label: "USD — Dollar ($)" },
  { code: "GBP", label: "GBP — Livre sterling (£)" },
];

function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const profileQ = useProfile(user?.id);
  const deleteAccountFn = useServerFn(deleteAccount);

  // Profil
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [usdRate, setUsdRate] = useState("1");
  const [metaTax, setMetaTax] = useState("18");
  const [autoSync, setAutoSync] = useState(false);
  const [busyProfile, setBusyProfile] = useState(false);

  // Email
  const [newEmail, setNewEmail] = useState("");
  const [busyEmail, setBusyEmail] = useState(false);

  // Mot de passe
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busyPassword, setBusyPassword] = useState(false);

  // Suppression compte
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [busyDelete, setBusyDelete] = useState(false);

  useEffect(() => {
    if (profileQ.data) {
      setDisplayName(profileQ.data.display_name ?? "");
      setCurrency(normalizeDropshippingCurrency((profileQ.data as any).dropshipping_currency ?? profileQ.data.currency));
      const fxRate = readDropshippingUsdRate(profileQ.data as any);
      setUsdRate(String(fxRate ?? (normalizeDropshippingCurrency((profileQ.data as any).dropshipping_currency ?? profileQ.data.currency) === "USD" ? 1 : 0.92)));
      setMetaTax(String((profileQ.data as any).meta_tax_pct ?? 18));
      setAutoSync(!!(profileQ.data as any).auto_sync_enabled);
    }
  }, [profileQ.data]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const rate = Number(usdRate);
    if (!Number.isFinite(rate) || rate <= 0) {
      return toast.error("Taux USD invalide.");
    }
    const tax = Number(metaTax);
    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      return toast.error("Taxe Meta : entre 0 et 100 %.");
    }
    setBusyProfile(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user!.id,
          email: user!.email,
          display_name: displayName,
          currency,
          dropshipping_currency: currency,
          cod_currency: "XOF",
          dropshipping_usd_fx: rate,
          meta_tax_pct: tax,
          auto_sync_enabled: autoSync,
        } as any,
        { onConflict: "id" },
      );
    setBusyProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profil enregistré.");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      return toast.error("Email invalide.");
    }
    setBusyEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setBusyEmail(false);
    if (error) return toast.error(error.message);
    toast.success(
      "Email de confirmation envoyé à la nouvelle adresse. Clique sur le lien pour valider.",
    );
    setNewEmail("");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Mot de passe : 8 caractères minimum.");
    if (newPassword !== confirmPassword) return toast.error("Les mots de passe ne correspondent pas.");
    setBusyPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusyPassword(false);
    if (error) return toast.error(error.message);
    toast.success("Mot de passe modifié.");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function exportAll() {
    const [{ data: products }, { data: entries }, { data: creatives }, { data: perf }] =
      await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("daily_entries").select("*"),
        supabase.from("creatives").select("*"),
        supabase.from("creative_performance").select("*"),
      ]);
    const blob = new Blob(
      [
        JSON.stringify(
          { exported_at: new Date().toISOString(), products, entries, creatives, perf },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profitcod_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export téléchargé.");
  }

  async function handleDelete() {
    if (deleteConfirm !== "SUPPRIMER") {
      return toast.error('Tape exactement "SUPPRIMER" pour confirmer.');
    }
    setBusyDelete(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Session expirée. Reconnecte-toi.");
      await deleteAccountFn({ data: { token } });
      toast.success("Compte supprimé.");
      await signOut();
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la suppression.");
    } finally {
      setBusyDelete(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          MON COMPTE
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">COMPTE</h1>
      </div>

      {/* PROFIL */}
      <section className="brutal-border p-5 md:p-8 mb-6">
        <h2 className="text-2xl font-black mb-5">PROFIL</h2>
        <form onSubmit={saveProfile} className="grid gap-5">
          <label className="block">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">Nom affiché</div>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            />
          </label>
          <label className="block scroll-mt-24" id="currency">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">Devise dropshipping</div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              S'applique uniquement au dropshipping. Le COD reste verrouillé en FCFA (XOF).
            </p>
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">
              Taux de change USD → {currency}
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={usdRate}
              onChange={(e) => setUsdRate(e.target.value)}
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Utilisé pour convertir le budget pub saisi en USD vers ta devise. Mets <code>1</code> si tu opères en USD.
            </p>
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">
              Taxe Meta Ads (%) — appliquée sur le budget pub
            </div>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={metaTax}
              onChange={(e) => setMetaTax(e.target.value)}
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Charge fantôme automatiquement déduite de ta marge nette dans tous les
              calculs (TVA Sénégal = 18 % par défaut).
            </p>
          </label>
          <label className="block brutal-border-thin p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold">
                  Synchronisation automatique Shopify
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono max-w-md">
                  Désactivée par défaut. Quand activée, NetoDash écrit automatiquement les commandes Shopify dans tes saisies toutes les heures (sans ton budget pub). Recommandé : laisser OFF et utiliser le bouton "Synchroniser" sur la page Saisies pour valider chaque entrée à la main.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-5 h-5 accent-foreground"
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={busyProfile}
            className="brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent w-fit disabled:opacity-50"
          >
            {busyProfile ? "…" : "ENREGISTRER"}
          </button>
        </form>
      </section>

      {/* EMAIL */}
      <section className="brutal-border p-8 mb-6">
        <h2 className="text-2xl font-black mb-2">EMAIL</h2>
        <div className="text-xs uppercase tracking-widest font-bold mb-1 text-muted-foreground">
          Email actuel
        </div>
        <div className="font-mono text-sm mb-5">{user?.email}</div>
        <form onSubmit={changeEmail} className="grid gap-4">
          <label className="block">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">
              Nouvel email
            </div>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nouveau@email.com"
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busyEmail || !newEmail}
            className="brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent w-fit disabled:opacity-50"
          >
            {busyEmail ? "…" : "MODIFIER L'EMAIL"}
          </button>
          <p className="text-xs text-muted-foreground">
            Un lien de confirmation sera envoyé à la nouvelle adresse.
          </p>
        </form>
      </section>

      {/* MOT DE PASSE */}
      <section className="brutal-border p-8 mb-6">
        <h2 className="text-2xl font-black mb-5">MOT DE PASSE</h2>
        <form onSubmit={changePassword} className="grid gap-4">
          <label className="block">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">
              Nouveau mot de passe
            </div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              placeholder="8 caractères minimum"
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            />
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-widest font-bold mb-2">Confirmer</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busyPassword || !newPassword}
            className="brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent w-fit disabled:opacity-50"
          >
            {busyPassword ? "…" : "CHANGER LE MOT DE PASSE"}
          </button>
        </form>
      </section>

      {/* DONNÉES */}
      <section className="brutal-border p-8 mb-6">
        <h2 className="text-2xl font-black mb-2">EXPORTER MES DONNÉES</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Télécharge un fichier JSON contenant tous tes produits, saisies, campagnes et performances.
        </p>
        <button
          onClick={exportAll}
          className="brutal-border-thin px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
        >
          Télécharger l'export
        </button>
      </section>

      <OnboardingSection />

      {/* LÉGAL */}
      <section className="brutal-border p-5 md:p-8 mb-6">
        <h2 className="text-2xl font-black mb-5">LÉGAL</h2>
        <ul className="grid gap-3 font-mono text-sm">
          <li>
            <Link to="/legal/mentions" className="flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors">
              <span>Mentions légales</span>
              <span>→</span>
            </Link>
          </li>
          <li>
            <Link to="/legal/cgu" className="flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors">
              <span>Conditions d'utilisation (CGU)</span>
              <span>→</span>
            </Link>
          </li>
          <li>
            <Link to="/legal/cgv" className="flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors">
              <span>Conditions de vente (CGV)</span>
              <span>→</span>
            </Link>
          </li>
          <li>
            <Link to="/legal/privacy" className="flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors">
              <span>Politique de confidentialité</span>
              <span>→</span>
            </Link>
          </li>
          <li>
            <Link to="/legal/cookies" className="flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors">
              <span>Politique des cookies</span>
              <span>→</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* ZONE DANGER */}
      <section className="brutal-border border-accent p-8">
        <h2 className="text-2xl font-black mb-2 text-accent">ZONE DANGER</h2>
        <p className="text-muted-foreground text-sm mb-5">
          La suppression est <strong>définitive</strong> : produits, saisies, campagnes,
          performances et compte sont effacés. Pas de retour possible.
        </p>

        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="brutal-border border-accent text-accent px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:text-accent-foreground"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="grid gap-4">
            <label className="block">
              <div className="text-xs uppercase tracking-widest font-bold mb-2 text-accent">
                Pour confirmer, tape exactement : SUPPRIMER
              </div>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full bg-background brutal-border-thin border-accent px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={busyDelete || deleteConfirm !== "SUPPRIMER"}
                className="brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {busyDelete ? "Suppression…" : "Confirmer la suppression"}
              </button>
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteConfirm("");
                }}
                className="brutal-border-thin px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function OnboardingSection() {
  const ob = useOnboarding();
  const nav = useNav();
  return (
    <section className="brutal-border p-8 mb-6">
      <h2 className="text-2xl font-black mb-2">GUIDE DE DÉMARRAGE</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Statut actuel : <strong className="text-foreground">{ob.status}</strong>
        {ob.isActive ? ` (étape ${ob.step}/4)` : ""}
      </p>
      <button
        onClick={() => {
          ob.restart();
          nav({ to: "/products" });
        }}
        className="brutal-border-thin px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
      >
        Relancer le guide d'introduction
      </button>
    </section>
  );
}
