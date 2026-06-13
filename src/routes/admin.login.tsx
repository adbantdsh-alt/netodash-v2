import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdminAccount } from "@/lib/admin/auth.functions";
import { AdminLogo } from "@/components/admin/AdminLogo";
import "@/styles/admin.css";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin · Netodash" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const checkAdminAccount = useServerFn(checkIsAdminAccount);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInErr || !data.user) {
        throw new Error("Identifiants invalides.");
      }
      const check = await checkAdminAccount({ data: { userId: data.user.id } });
      if (!check.isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Ce compte n'est pas un compte administrateur.");
      }
      navigate({ to: "/admin" as never });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-admin-root
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#fafafa" }}
    >
      <form
        onSubmit={onSubmit}
        className="admin-card w-full max-w-md"
        style={{ background: "#fff", padding: "2.5rem" }}
      >
        <div className="mb-6">
          <AdminLogo />
          <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">
            Back-office
          </div>
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Connexion admin</h1>

        <label className="block text-xs font-bold uppercase tracking-wider mb-1">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          className="admin-input mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-xs font-bold uppercase tracking-wider mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          className="admin-input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div
            className="mb-4 p-3 text-sm"
            style={{
              background: "#fde0e0",
              color: "#b32d2c",
              border: "2px solid #b32d2c",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="admin-btn w-full justify-center"
          data-variant="accent"
          disabled={loading}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p
          className="text-[10px] uppercase tracking-widest mt-6 text-center"
          style={{ color: "#888" }}
        >
          Accès réservé · activités tracées
        </p>
      </form>
    </div>
  );
}

