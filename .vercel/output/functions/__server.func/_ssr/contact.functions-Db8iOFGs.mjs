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
const contactSchema = objectType({
  name: stringType().trim().min(2, "Nom trop court").max(100),
  email: stringType().trim().email("Email invalide").max(255),
  subject: stringType().trim().min(2, "Sujet requis").max(200),
  message: stringType().trim().min(10, "Message trop court (10 caractères min)").max(2e3)
});
const submitContactMessage_createServerFn_handler = createServerRpc({
  id: "6791d96029119711fff64366333434540863937081e92a2093993c6c31f4287b",
  name: "submitContactMessage",
  filename: "src/lib/contact.functions.ts"
}, (opts) => submitContactMessage.__executeServer(opts));
const submitContactMessage = createServerFn({
  method: "POST"
}).inputValidator((data) => contactSchema.parse(data)).handler(submitContactMessage_createServerFn_handler, async ({
  data
}) => {
  const {
    error
  } = await supabaseAdmin.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message
  });
  if (error) {
    console.error("contact_messages insert error", error);
    throw new Error("Impossible d'envoyer le message pour le moment");
  }
  return {
    ok: true
  };
});
export {
  submitContactMessage_createServerFn_handler
};
