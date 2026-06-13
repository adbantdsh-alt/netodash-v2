// Server-only helpers for Unitech payment integration.
// Never import this file from client code.

const UNITECH_BASE_URL = "https://api.unitech.sn/api.php";

export type UnitechMethod = "wave" | "orange_qr" | "orange_maxit" | "orange_om";

export type PlanKey = "basic" | "starter" | "pro";

// Mapping interne → label public : basic→Basic, starter→Pro, pro→Premium.
// Tarif XOF basé sur ~600 XOF/USD (Sénégal).
export const PLAN_PRICING: Record<
  PlanKey,
  { amountXof: number; amountUsd: number; label: string }
> = {
  basic: { amountXof: 7200, amountUsd: 12, label: "Basic" },
  starter: { amountXof: 17400, amountUsd: 29, label: "Pro" },
  pro: { amountXof: 47400, amountUsd: 79, label: "Premium" },
};

function getApiKey(): string {
  const key = process.env.UNITECH_API_KEY;
  if (!key) throw new Error("UNITECH_API_KEY is not configured");
  return key;
}

type CreatePaymentInput = {
  method: UnitechMethod;
  amount: number;
  reference: string;
  description: string;
  customerNumber?: string;
  callbackSuccess: string;
  callbackCancel: string;
};

export async function unitechCreatePayment(input: CreatePaymentInput): Promise<{
  success: boolean;
  message?: string;
  data?: {
    payment_url?: string;
    qr_code?: string;
    reference?: string;
    transaction_id?: string;
  };
}> {
  const action =
    input.method === "wave"
      ? "create_wave_payment"
      : input.method === "orange_qr"
        ? "create_orange_qr"
        : input.method === "orange_maxit"
          ? "create_orange_maxit"
          : "create_orange_om";

  const body: Record<string, unknown> = {
    amount: input.amount,
    reference: input.reference,
    description: input.description,
    callback_success: input.callbackSuccess,
    callback_cancel: input.callbackCancel,
  };
  if (input.customerNumber) body.customer_number = input.customerNumber;

  const res = await fetch(`${UNITECH_BASE_URL}?action=${action}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: {
      payment_url?: string;
      qr_code?: string;
      reference?: string;
      transaction_id?: string;
    };
  };

  return {
    success: !!json.success,
    message: json.message,
    data: json.data,
  };
}

// Re-verify a transaction by reference. Used by the webhook to make sure the
// notification is genuine (Unitech does not sign webhooks).
export async function unitechVerifyPayment(reference: string): Promise<{
  success: boolean;
  status?: string;
  amount?: number;
  raw?: any;
}> {
  const res = await fetch(
    `${UNITECH_BASE_URL}?action=check_payment&reference=${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${getApiKey()}` },
    },
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    data?: { status?: string; amount?: number };
  };

  return {
    success: !!json.success,
    status: json.data?.status,
    amount: json.data?.amount,
    raw: json,
  };
}

export function generateReference(): string {
  // 32 hex chars — cryptographically random, used as the secret token
  // that proves the webhook is for a payment we actually created.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return (
    "ND-" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
