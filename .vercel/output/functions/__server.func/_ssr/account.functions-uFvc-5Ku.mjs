import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { a as createServerFn } from "./index.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const deleteAccount_createServerFn_handler = createServerRpc({
  id: "605045233debcf4fbca7c93f06a21eab51d31e90e5fab3208ca6233b08e8f1d1",
  name: "deleteAccount",
  filename: "src/lib/account.functions.ts"
}, (opts) => deleteAccount.__executeServer(opts));
const deleteAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input || typeof input !== "object" || !("token" in input)) {
    throw new Error("Token requis.");
  }
  const token = input.token;
  if (typeof token !== "string" || token.length < 10) {
    throw new Error("Token invalide.");
  }
  return {
    token
  };
}).handler(deleteAccount_createServerFn_handler, async ({
  data
}) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  const verifyClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const {
    data: claimsData,
    error: claimsError
  } = await verifyClient.auth.getClaims(data.token);
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Authentification invalide.");
  }
  const userId = claimsData.claims.sub;
  await supabaseAdmin.from("creative_performance").delete().eq("user_id", userId);
  await supabaseAdmin.from("creatives").delete().eq("user_id", userId);
  await supabaseAdmin.from("daily_entries").delete().eq("user_id", userId);
  await supabaseAdmin.from("products").delete().eq("user_id", userId);
  await supabaseAdmin.from("profiles").delete().eq("id", userId);
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`Échec suppression: ${error.message}`);
  }
  return {
    success: true
  };
});
export {
  deleteAccount_createServerFn_handler
};
