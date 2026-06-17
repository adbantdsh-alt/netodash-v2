import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const BETA_MAX_SPOTS = 10;
function mapStatus(raw) {
  return {
    maxSpots: raw.max_spots ?? BETA_MAX_SPOTS,
    betaCount: raw.beta_count ?? 0,
    waitlistCount: raw.waitlist_count ?? 0,
    betaFull: raw.beta_full ?? false,
    spotsLeft: raw.spots_left ?? BETA_MAX_SPOTS
  };
}
const betaRegisterSchema = objectType({
  fullName: stringType().trim().min(2, "Nom trop court").max(120),
  email: stringType().trim().email("Email invalide").max(255)
});
const waitlistSchema = objectType({
  email: stringType().trim().email("Email invalide").max(255),
  fullName: stringType().trim().max(120).optional()
});
const getBetaProgramStatus_createServerFn_handler = createServerRpc({
  id: "0662bc786edd452e77a9ae99b4bac6c0e4878ab982faa194738bf6d09ab4ce4d",
  name: "getBetaProgramStatus",
  filename: "src/lib/beta.functions.ts"
}, (opts) => getBetaProgramStatus.__executeServer(opts));
const getBetaProgramStatus = createServerFn({
  method: "GET"
}).handler(getBetaProgramStatus_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.rpc("get_beta_program_status");
  if (error) {
    console.error("get_beta_program_status error", error);
    throw new Error("Impossible de charger le statut du programme bêta");
  }
  return mapStatus(data ?? {});
});
const registerBetaTester_createServerFn_handler = createServerRpc({
  id: "65117adfd5647a791e45a207d716854c3c781657f0e684dc4baeb63efe0dc5a7",
  name: "registerBetaTester",
  filename: "src/lib/beta.functions.ts"
}, (opts) => registerBetaTester.__executeServer(opts));
const registerBetaTester = createServerFn({
  method: "POST"
}).inputValidator((data) => betaRegisterSchema.parse(data)).handler(registerBetaTester_createServerFn_handler, async ({
  data
}) => {
  const {
    data: result,
    error
  } = await supabaseAdmin.rpc("register_beta_tester", {
    p_full_name: data.fullName,
    p_email: data.email
  });
  if (error) {
    console.error("register_beta_tester error", error);
    throw new Error("Impossible de réserver ta place bêta pour le moment");
  }
  const payload = result ?? {};
  if (payload.error === "invalid_input") {
    throw new Error("Nom ou email invalide");
  }
  if (payload.error === "beta_full" || payload.beta_full) {
    return {
      ok: false,
      betaFull: true
    };
  }
  if (!payload.ok) {
    throw new Error("Inscription bêta impossible pour le moment");
  }
  return {
    ok: true,
    alreadyRegistered: !!payload.already_registered,
    betaCount: payload.beta_count ?? 0,
    spotsLeft: payload.spots_left ?? 0,
    betaFull: (payload.beta_count ?? 0) >= BETA_MAX_SPOTS
  };
});
const registerBetaWaitlist_createServerFn_handler = createServerRpc({
  id: "4bcda73d400cb49e762a97ef9e1e1a295fb702ad1ad1320c35c4b23b58c119b6",
  name: "registerBetaWaitlist",
  filename: "src/lib/beta.functions.ts"
}, (opts) => registerBetaWaitlist.__executeServer(opts));
const registerBetaWaitlist = createServerFn({
  method: "POST"
}).inputValidator((data) => waitlistSchema.parse(data)).handler(registerBetaWaitlist_createServerFn_handler, async ({
  data
}) => {
  const {
    data: result,
    error
  } = await supabaseAdmin.rpc("register_beta_waitlist", {
    p_email: data.email,
    p_full_name: data.fullName ?? null
  });
  if (error) {
    console.error("register_beta_waitlist error", error);
    throw new Error("Impossible de t'inscrire à la liste d'attente pour le moment");
  }
  const payload = result ?? {};
  if (payload.error === "invalid_input") {
    throw new Error("Email invalide");
  }
  if (!payload.ok) {
    throw new Error("Inscription à la liste d'attente impossible pour le moment");
  }
  return {
    ok: true,
    alreadyRegistered: !!payload.already_registered
  };
});
export {
  getBetaProgramStatus_createServerFn_handler,
  registerBetaTester_createServerFn_handler,
  registerBetaWaitlist_createServerFn_handler
};
