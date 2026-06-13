import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Réinitialiser le mot de passe — NETODASH" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function restoreRecoverySession() {
      setSessionError(null);
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
        const code = url.searchParams.get("code");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const recoveryType = hashParams.get("type") ?? url.searchParams.get("type");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          window.history.replaceState({}, document.title, "/reset-password");
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          window.history.replaceState({}, document.title, "/reset-password");
        } else {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            throw new Error(
              recoveryType === "recovery"
                ? "Session de récupération expirée. Redemande un lien de réinitialisation."
                : "Ouvre le lien reçu par email pour changer ton mot de passe.",
            );
          }
        }

        if (active) setReady(true);
      } catch (e: any) {
        if (active) {
          setReady(false);
          setSessionError(e?.message ?? "Lien de réinitialisation invalide ou expiré.");
        }
      }
    }

    restoreRecoverySession();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("8 caractères minimum");
      return;
    }
    setBusy(true);
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setBusy(false);
      const message = "Session expirée. Redemande un lien de réinitialisation.";
      setSessionError(message);
      toast.error(message);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Mot de passe mis à jour.");
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md brutal-border p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-black mb-1 tracking-tighter">NOUVEAU MOT DE PASSE</h1>
        <p className="text-muted-foreground text-sm mb-8">Choisis-en un solide.</p>
        {sessionError ? (
          <div className="space-y-5">
            <div className="brutal-border-thin border-accent text-accent px-3 py-2 text-sm font-bold">
              {sessionError}
            </div>
            <Link
              to="/auth"
              search={{ mode: "login" }}
              className="block w-full text-center brutal-border bg-foreground text-background px-4 py-4 font-black uppercase tracking-wider hover:bg-accent hover:border-accent"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : !ready ? (
          <div className="brutal-border-thin px-3 py-2 text-sm font-bold text-muted-foreground">
            Vérification du lien…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            <div className="relative">
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Nouveau mot de passe"
                className="w-full bg-background brutal-border-thin px-4 py-3 pr-20 font-mono text-sm focus:border-accent outline-none focus:border-2"
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
            <button
              type="submit"
              disabled={busy}
              className="w-full brutal-border bg-foreground text-background px-4 py-4 font-black uppercase tracking-wider hover:bg-accent hover:border-accent disabled:opacity-50"
            >
              {busy ? "…" : "METTRE À JOUR"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
