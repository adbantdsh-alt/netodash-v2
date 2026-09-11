// Types de l'import de commandes.
//
// Recuperes de l'ancien composant de synchronisation Shopify, qui a ete
// supprime. Le panneau de brouillons de _app.entries.tsx les utilise encore,
// mais il ne peut plus etre alimente : plus rien ne remplit `shopifyPreview`.
// Conserves le temps de retirer cette machinerie residuelle.

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
