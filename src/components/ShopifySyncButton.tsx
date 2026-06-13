import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getShopifyConnection, previewShopifySync } from "@/lib/shopify.functions";

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Session expirée");
  return { Authorization: `Bearer ${session.access_token}` } as Record<string, string>;
}

function timeAgo(iso: string | null | undefined) {
  if (!iso) return "jamais";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

export type ShopifyDayAgg = {
  orders: number;
  units: number;
  revenue: number;
  refundedOrders: number;
  refundedAmount: number;
};

export type ShopifyDraft = {
  shopifyTitle: string;
  matchedProductId: string | null;
  matchedProductName: string | null;
  productType: string | null;
  orders: number;
  units: number;
  revenue: number;
  refundedOrders: number;
  refundedAmount: number;
  byDate: Record<string, ShopifyDayAgg>;
};

export type ShopifyPreview = {
  shopName: string;
  shopDomain: string;
  currency: string;
  from: string;
  to: string;
  drafts: ShopifyDraft[];
  refundedOrders: number;
  cancelledOrders: number;
  availableDates: string[];
};


/**
 * Bouton qui prévisualise (lecture seule) les commandes Shopify pour la
 * période choisie et passe le résultat au parent pour pré-remplir le form.
 */
export function ShopifySyncButton({
  from,
  to,
  onPreview,
}: {
  from: string;
  to: string;
  onPreview: (preview: ShopifyPreview) => void;
}) {
  const { user } = useAuth();
  const getConn = useServerFn(getShopifyConnection);
  const preview = useServerFn(previewShopifySync);
  const [open, setOpen] = useState(false);

  const connQ = useQuery({
    queryKey: ["shopify-connection", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const headers = await authHeaders();
      return (await getConn({ headers })) as
        | null
        | { shop_domain: string; shop_name?: string | null; currency?: string | null; last_sync_at: string | null };
    },
  });

  const previewMut = useMutation({
    mutationFn: async () => {
      const headers = await authHeaders();
      return (await preview({ data: { from, to }, headers })) as ShopifyPreview;
    },
    onSuccess: (res) => {
      if (res.drafts.length === 0) {
        toast.info("Aucune commande Shopify trouvée sur cette période.");
        return;
      }
      onPreview(res);
      toast.success(
        `${res.drafts.length} produit(s) Shopify détecté(s) · ${res.drafts.reduce((s, d) => s + d.orders, 0)} cmd`,
      );
    },
    onError: (err: any) => toast.error(err?.message ?? "Lecture Shopify échouée"),
  });

  if (!connQ.data) return null;

  return (
    <button
      type="button"
      onClick={() => previewMut.mutate()}
      disabled={previewMut.isPending}
      title={`Boutique : ${connQ.data.shop_name || connQ.data.shop_domain} · Dernière sync : ${timeAgo(connQ.data.last_sync_at)}`}
      className="brutal-border-thin bg-background hover:bg-foreground hover:text-background px-3 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest disabled:opacity-50 inline-flex items-center gap-1.5"
    >
      <span className={previewMut.isPending ? "inline-block animate-spin" : "inline-block"}>⟳</span>
      <span>{previewMut.isPending ? "Lecture…" : "Synchroniser depuis Shopify"}</span>
    </button>
  );
}
