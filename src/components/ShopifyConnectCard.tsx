import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import {
  disconnectShopify,
  getShopifyConnection,
  syncShopifyOrdersNow,
} from "@/lib/shopify.functions";

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Session expirée");
  return { Authorization: `Bearer ${session.access_token}` } as Record<string, string>;
}

export function ShopifyConnectCard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const getConn = useServerFn(getShopifyConnection);
  const syncNow = useServerFn(syncShopifyOrdersNow);
  const disconnect = useServerFn(disconnectShopify);
  const [shopInput, setShopInput] = useState("");

  const connQ = useQuery({
    queryKey: ["shopify-connection", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const headers = await authHeaders();
      return (await getConn({ headers })) as
        | null
        | {
            shop_domain: string;
            shop_name: string | null;
            currency: string | null;
            connected_at: string;
            last_sync_at: string | null;
            last_sync_status: string | null;
            last_sync_message: string | null;
          };
    },
  });

  const syncMut = useMutation({
    mutationFn: async () => {
      const headers = await authHeaders();
      return await syncNow({ data: { daysBack: 7 }, headers });
    },
    onSuccess: (res: any) => {
      toast.success(`Sync OK : ${res.ordersImported} commandes, ${res.productsMatched} produits`);
      qc.invalidateQueries({ queryKey: ["shopify-connection"] });
      qc.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (err: any) => toast.error(err?.message ?? "Sync échouée"),
  });

  const disconnectMut = useMutation({
    mutationFn: async () => {
      const headers = await authHeaders();
      return await disconnect({ headers });
    },
    onSuccess: () => {
      toast.success("Boutique déconnectée");
      qc.invalidateQueries({ queryKey: ["shopify-connection"] });
    },
  });

  function startInstall() {
    if (!user?.id) return;
    const cleaned = shopInput.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!cleaned) return toast.error("Entre ton domaine Shopify (ex: maboutique.myshopify.com)");
    const url = `/api/public/shopify/install?shop=${encodeURIComponent(cleaned)}&user_id=${encodeURIComponent(user.id)}`;
    window.location.href = url;
  }

  const conn = connQ.data;

  return (
    <div className="brutal-border p-5 bg-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            SHOPIFY
          </div>
          <h3 className="text-xl font-black tracking-tight mt-0.5">Synchro auto dropshipping</h3>
        </div>
        {conn && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 brutal-border-thin bg-green-500/10 text-green-700">
            Connecté
          </span>
        )}
      </div>

      {!conn && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connecte ta boutique pour importer auto chaque jour tes commandes, CA et devise dans les produits dropshipping.
          </p>
          <div className="flex gap-2">
            <input
              value={shopInput}
              onChange={(e) => setShopInput(e.target.value)}
              placeholder="maboutique.myshopify.com"
              className="flex-1 brutal-border-thin bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={startInstall}
              className="brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
            >
              Connecter
            </button>
          </div>
        </div>
      )}

      {conn && (
        <div className="space-y-3">
          <div className="text-sm">
            <div><span className="text-muted-foreground">Boutique :</span> <strong>{conn.shop_name ?? conn.shop_domain}</strong></div>
            <div><span className="text-muted-foreground">Devise détectée :</span> <strong>{conn.currency ?? "—"}</strong></div>
            <div>
              <span className="text-muted-foreground">Dernière sync :</span>{" "}
              <strong>{conn.last_sync_at ? new Date(conn.last_sync_at).toLocaleString("fr-FR") : "jamais"}</strong>
              {conn.last_sync_status === "error" && (
                <span className="ml-2 text-red-600 text-xs">{conn.last_sync_message}</span>
              )}
              {conn.last_sync_status === "ok" && conn.last_sync_message && (
                <span className="ml-2 text-xs text-muted-foreground">({conn.last_sync_message})</span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Astuce : pour qu'un produit soit matché auto, son nom dans NETODASH doit être identique au titre du produit dans Shopify.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => syncMut.mutate()}
              disabled={syncMut.isPending}
              className="brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent disabled:opacity-50"
            >
              {syncMut.isPending ? "Synchro…" : "Sync maintenant"}
            </button>
            <button
              onClick={() => {
                if (confirm("Déconnecter la boutique Shopify ?")) disconnectMut.mutate();
              }}
              disabled={disconnectMut.isPending}
              className="brutal-border-thin px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
            >
              Déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
