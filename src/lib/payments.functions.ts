import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  PLAN_PRICING,
  generateReference,
  unitechCreatePayment,
  type PlanKey,
  type UnitechMethod,
} from "./payments.server";

const CreateInput = z.object({
  plan: z.enum(["basic", "starter", "pro"]),
  method: z.enum(["wave", "orange_qr", "orange_maxit", "orange_om"]),
  customerNumber: z
    .string()
    .min(9)
    .max(15)
    .regex(/^[0-9]+$/)
    .optional(),
  // origin is accepted but strictly validated against the server allowlist below
  origin: z.string().url().optional(),
});

/** Allowlist of legitimate origins that may receive payment redirect callbacks. */
const ALLOWED_ORIGINS = new Set<string>([
  "https://netodash.com",
  "https://www.netodash.com",
  "https://netodash.lovable.app",
  "https://id-preview--c8da90f6-5654-47cb-a390-4f9faf5e58ee.lovable.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
]);

const DEFAULT_ORIGIN = "https://netodash.com";

function safeOrigin(input: string | undefined): string {
  if (!input) return DEFAULT_ORIGIN;
  try {
    const u = new URL(input);
    const normalized = `${u.protocol}//${u.host}`;
    return ALLOWED_ORIGINS.has(normalized) ? normalized : DEFAULT_ORIGIN;
  } catch {
    return DEFAULT_ORIGIN;
  }
}

export const createUnitechCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CreateInput.parse(input))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const plan = data.plan as PlanKey;
    const method = data.method as UnitechMethod;
    const pricing = PLAN_PRICING[plan];

    // Methods that require the customer's phone number.
    if ((method === "wave" || method === "orange_maxit" || method === "orange_om") && !data.customerNumber) {
      throw new Error("Numéro de téléphone requis pour cette méthode.");
    }

    // ── Idempotence : ne pas créer de nouvelle demande Unitech si l'utilisateur
    // a déjà un paiement "pending" récent (< 60 min) pour le même plan + méthode.
    // On retourne la même URL/QR pour qu'il termine sa paiement en cours.
    const SIXTY_MIN_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabaseAdmin
      .from("payments")
      .select("reference, raw_payload, created_at")
      .eq("user_id", userId)
      .eq("status", "pending")
      .eq("plan", plan)
      .eq("payment_method", method)
      .gte("created_at", SIXTY_MIN_AGO)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.reference) {
      const payload = (existing.raw_payload ?? {}) as Record<string, unknown>;
      const paymentUrl = (payload.payment_url as string | undefined) ?? null;
      const qrCode = (payload.qr_code as string | undefined) ?? null;
      // Si on a déjà une URL/QR Unitech valide, on la réutilise.
      if (paymentUrl || qrCode) {
        return { reference: existing.reference, paymentUrl, qrCode };
      }
    }

    const reference = generateReference();

    // Insert pending payment row first (admin client — RLS forbids user inserts).
    const { error: insertError } = await supabaseAdmin.from("payments").insert({
      user_id: userId,
      reference,
      amount: pricing.amountXof,
      currency: "XOF",
      plan,
      payment_method: method,
      status: "pending",
    });
    if (insertError) {
      console.error("payments insert failed", insertError);
      throw new Error("Impossible d'initialiser le paiement.");
    }

    const callbackBase = safeOrigin(data.origin);
    const result = await unitechCreatePayment({
      method,
      amount: pricing.amountXof,
      reference,
      description: `NETODASH ${pricing.label} (${plan})`,
      customerNumber: data.customerNumber,
      callbackSuccess: `${callbackBase}/plan?payment=success&ref=${reference}`,
      callbackCancel: `${callbackBase}/plan?payment=cancel&ref=${reference}`,
    });

    if (!result.success) {
      await supabaseAdmin
        .from("payments")
        .update({ status: "failed", raw_payload: { error: result.message } })
        .eq("reference", reference);
      throw new Error(result.message ?? "Échec de la création du paiement Unitech.");
    }

    // Stocker payment_url et qr_code dans raw_payload pour pouvoir les réutiliser
    // si l'utilisateur revient sans avoir terminé son paiement (idempotence).
    await supabaseAdmin
      .from("payments")
      .update({
        raw_payload: {
          payment_url: result.data?.payment_url ?? null,
          qr_code: result.data?.qr_code ?? null,
        },
      })
      .eq("reference", reference);

    return {
      reference,
      paymentUrl: result.data?.payment_url ?? null,
      qrCode: result.data?.qr_code ?? null,
    };
  });

const StatusInput = z.object({ reference: z.string().min(5).max(64) });

export const getPaymentStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => StatusInput.parse(input))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const { data: row, error } = await supabaseAdmin
      .from("payments")
      .select("status, plan, paid_at")
      .eq("reference", data.reference)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error("Erreur de lecture du paiement.");
    return row ?? { status: "unknown" };
  });
