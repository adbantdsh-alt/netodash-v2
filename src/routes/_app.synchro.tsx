import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseAuthHeaders } from "@/lib/admin/auth-headers";
import {
  connectCopyx,
  disconnectCopyx,
  getCopyxConnection,
  syncCopyxNow,
  type CopyxConnection,
} from "@/lib/copyx.functions";

export const Route = createFileRoute("/_app/synchro")({
  component: SynchroPage,
});

function fmt(iso: string | null): string {
  if (!iso) return "jamais";
  try {
    return new Date(iso).toLocaleString("fr-FR");
  } catch {
    return iso;
  }
}

function SynchroPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const getConn = useServerFn(getCopyxConnection);
  const connect = useServerFn(connectCopyx);
  const disconnect = useServerFn(disconnectCopyx);
  const sync = useServerFn(syncCopyxNow);

  const [account, setAccount] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  const q = useQuery({
    queryKey: ["copyx-connection", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<CopyxConnection> => {
      const headers = await getSupabaseAuthHeaders();
      return (await getConn({ headers })) as CopyxConnection;
    },
  });

  const conn = q.data;

  const onConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const headers = await getSupabaseAuthHeaders();
      await connect({ data: { account: account.trim(), token: token.trim() }, headers });
      setToken("");
      toast.success("Compte CopyX connecté.");
      qc.invalidateQueries({ queryKey: ["copyx-connection"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    if (!confirm("Déconnecter le compte CopyX ? Le jeton stocké sera supprimé.")) return;
    const headers = await getSupabaseAuthHeaders();
    await disconnect({ headers });
    toast.success("Compte CopyX déconnecté.");
    qc.invalidateQueries({ queryKey: ["copyx-connection"] });
  };

  const onSync = async () => {
    setBusy(true);
    try {
      const headers = await getSupabaseAuthHeaders();
      const r = await sync({ headers });
      if (r.ok) toast.success("Synchronisation terminée.");
      else toast.error(r.message);
      qc.invalidateQueries({ queryKey: ["copyx-connection"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Synchronisation impossible.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">SYNCHRO</div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">COPYX</h1>
        <p className="font-mono text-sm text-muted-foreground max-w-2xl">
          Connecte ton compte CopyX pour importer tes commandes automatiquement, au lieu de les saisir à la main.
        </p>
      </header>

      {conn && !conn.configured && (
        <div className="brutal-border-thin border-accent bg-accent/5 p-4">
          <div className="font-black uppercase tracking-widest text-xs text-accent mb-1">Intégration à finaliser</div>
          <p className="font-mono text-xs text-muted-foreground">
            Les endpoints de l'API CopyX ne sont pas encore renseignés (src/lib/copyx.server.ts). La connexion et le
            stockage du jeton fonctionnent ; l'import des commandes reste à brancher.
          </p>
        </div>
      )}

      {conn?.status === "connected" ? (
        <div className="brutal-border p-7 max-w-2xl space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">COMPTE CONNECTÉ</div>
              <div className="text-2xl font-black tracking-tight mt-1">{conn.account ?? "—"}</div>
            </div>
            <span className="brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent text-accent-foreground border-accent">
              Actif
            </span>
          </div>

          <dl className="font-mono text-xs space-y-1.5 border-t border-foreground/20 pt-4">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Dernière synchronisation</dt>
              <dd className="font-bold">{fmt(conn.lastSyncAt)}</dd>
            </div>
            {conn.lastSyncMessage && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Détail</dt>
                <dd className="text-right">{conn.lastSyncMessage}</dd>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onSync}
              disabled={busy}
              className="brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {busy ? "Synchronisation…" : "Synchroniser maintenant"}
            </button>
            <button
              type="button"
              onClick={onDisconnect}
              className="brutal-border px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-foreground hover:text-background"
            >
              Déconnecter
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onConnect} className="brutal-border p-7 max-w-2xl space-y-5">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">CONNEXION</div>
            <div className="text-2xl font-black tracking-tight mt-1">Connecter CopyX</div>
          </div>

          <div>
            <label htmlFor="copyx-account" className="block text-xs uppercase tracking-widest font-bold mb-2">
              Identifiant du compte CopyX
            </label>
            <input
              id="copyx-account"
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="ton@email.com ou identifiant CopyX"
              required
              maxLength={120}
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
            />
          </div>

          <div>
            <label htmlFor="copyx-token" className="block text-xs uppercase tracking-widest font-bold mb-2">
              Clé API CopyX
            </label>
            <input
              id="copyx-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="colle ta clé API"
              required
              maxLength={500}
              autoComplete="off"
              className="w-full bg-background brutal-border-thin px-4 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2"
            />
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              Stockée côté serveur, jamais exposée au navigateur. Elle n'est lisible que par les fonctions serveur.
            </p>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {busy ? "Connexion…" : "Connecter CopyX"}
          </button>
        </form>
      )}
    </div>
  );
}
