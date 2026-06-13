import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const BETA_MAX_SPOTS = 10;

export type BetaProgramStatus = {
  maxSpots: number;
  betaCount: number;
  waitlistCount: number;
  betaFull: boolean;
  spotsLeft: number;
};

type RpcStatus = {
  max_spots?: number;
  beta_count?: number;
  waitlist_count?: number;
  beta_full?: boolean;
  spots_left?: number;
};

type RpcRegisterResult = {
  ok?: boolean;
  error?: string;
  beta_full?: boolean;
  already_registered?: boolean;
  beta_count?: number;
  spots_left?: number;
};

function mapStatus(raw: RpcStatus): BetaProgramStatus {
  return {
    maxSpots: raw.max_spots ?? BETA_MAX_SPOTS,
    betaCount: raw.beta_count ?? 0,
    waitlistCount: raw.waitlist_count ?? 0,
    betaFull: raw.beta_full ?? false,
    spotsLeft: raw.spots_left ?? BETA_MAX_SPOTS,
  };
}

const betaRegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().email("Email invalide").max(255),
});

const waitlistSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  fullName: z.string().trim().max(120).optional(),
});

export const getBetaProgramStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.rpc("get_beta_program_status");
  if (error) {
    console.error("get_beta_program_status error", error);
    throw new Error("Impossible de charger le statut du programme bêta");
  }
  return mapStatus((data ?? {}) as RpcStatus);
});

export const registerBetaTester = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => betaRegisterSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: result, error } = await supabaseAdmin.rpc("register_beta_tester", {
      p_full_name: data.fullName,
      p_email: data.email,
    });
    if (error) {
      console.error("register_beta_tester error", error);
      throw new Error("Impossible de réserver ta place bêta pour le moment");
    }

    const payload = (result ?? {}) as RpcRegisterResult;
    if (payload.error === "invalid_input") {
      throw new Error("Nom ou email invalide");
    }
    if (payload.error === "beta_full" || payload.beta_full) {
      return { ok: false as const, betaFull: true };
    }
    if (!payload.ok) {
      throw new Error("Inscription bêta impossible pour le moment");
    }

    return {
      ok: true as const,
      alreadyRegistered: !!payload.already_registered,
      betaCount: payload.beta_count ?? 0,
      spotsLeft: payload.spots_left ?? 0,
      betaFull: (payload.beta_count ?? 0) >= BETA_MAX_SPOTS,
    };
  });

export const registerBetaWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => waitlistSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: result, error } = await supabaseAdmin.rpc("register_beta_waitlist", {
      p_email: data.email,
      p_full_name: data.fullName ?? null,
    });
    if (error) {
      console.error("register_beta_waitlist error", error);
      throw new Error("Impossible de t'inscrire à la liste d'attente pour le moment");
    }

    const payload = (result ?? {}) as RpcRegisterResult;
    if (payload.error === "invalid_input") {
      throw new Error("Email invalide");
    }
    if (!payload.ok) {
      throw new Error("Inscription à la liste d'attente impossible pour le moment");
    }

    return {
      ok: true as const,
      alreadyRegistered: !!payload.already_registered,
    };
  });
