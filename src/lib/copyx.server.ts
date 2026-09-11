// Client serveur pour l'API CopyX. Ne jamais importer depuis le client.
//
// ⚠️ INTÉGRATION À FINALISER
// Les 3 constantes ci-dessous doivent être remplacées par les vraies valeurs
// de l'API CopyX (base URL, chemins, format d'authentification). Tant qu'elles
// ne le sont pas, \`syncCopyxForUser\` lève une erreur explicite au lieu de
// faire semblant de fonctionner.

/** Base de l'API CopyX. À remplacer. */
const COPYX_BASE_URL = process.env.COPYX_API_URL ?? "";
/** Chemin qui renvoie les commandes/commandes sur une période. À remplacer. */
const COPYX_ORDERS_PATH = "/orders";
/** En-tête d'authentification. À adapter (Authorization: Bearer, X-Api-Key...). */
function authHeaders(token: string): Record<string, string> {
  return { Authorization: "Bearer " + token, "Content-Type": "application/json" };
}

export type CopyxOrder = {
  externalId: string;
  createdAt: string;
  status: string;
  amount: number;
  currency: string;
  productName?: string | null;
};

export function isCopyxConfigured(): boolean {
  return COPYX_BASE_URL.trim().length > 0;
}

/** Vérifie qu'un jeton CopyX est valide et renvoie le libellé du compte. */
export async function copyxCheckAccount(token: string): Promise<{ ok: boolean; label?: string; message?: string }> {
  if (!isCopyxConfigured()) {
    return { ok: false, message: "Intégration CopyX non configurée (COPYX_API_URL manquante)." };
  }
  try {
    const res = await fetch(COPYX_BASE_URL.replace(/\/+$/, "") + "/me", { headers: authHeaders(token) });
    if (!res.ok) return { ok: false, message: "Jeton refusé par CopyX (" + res.status + ")." };
    const j = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const label = String(j.name ?? j.email ?? j.account ?? "").trim();
    return { ok: true, label: label || undefined };
  } catch (e) {
    return { ok: false, message: "CopyX injoignable : " + (e instanceof Error ? e.message : String(e)) };
  }
}

/** Récupère les commandes CopyX sur une période. */
export async function copyxFetechOrders(token: string, fromISO: string, toISO: string): Promise<CopyxOrder[]> {
  if (!isCopyxConfigured()) {
    throw new Error(
      "Intégration CopyX non configurée. Renseigne COPYX_API_URL, COPYX_ORDERS_PATH et authHeaders() dans src/lib/copyx.server.ts.",
    );
  }
  const url =
    COPYX_BASE_URL.replace(/\/+$/, "") +
    COPYX_ORDERS_PATH +
    "?from=" + encodeURIComponent(fromISO) + "&to=" + encodeURIComponent(toISO);
  const res = await fetch(url, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("CopyX " + res.status + " : " + (await res.text().catch(() => "")));
  const j = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const rows = (Array.isArray(j) ? j : (j.data as unknown[])) ?? [];
  return (rows as Record<string, unknown>[]).map((r) => ({
    externalId: String(r.id ?? r.external_id ?? ""),
    createdAt: String(r.created_at ?? r.date ?? ""),
    status: String(r.status ?? ""),
    amount: Number(r.amount ?? r.total ?? 0),
    currency: String(r.currency ?? "XOF"),
    productName: (r.product_name as string | undefined) ?? null,
  }));
}
