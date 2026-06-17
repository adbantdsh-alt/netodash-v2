import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
import { R as Route$E, u as useAuth } from "./router-CzeTO2qA.mjs";
import { L as Logo } from "./Logo-DK9rHYhn.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { R as REFERRAL_SOURCES } from "./countries-CQCxvze2.mjs";
import "../_libs/stripe.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client.server-CcppqNZQ.mjs";
import "./shopify-sync.server-B3mu1MxO.mjs";
import "./stripe.server-D419Yq3N.mjs";
import "events";
import "http";
import "https";
import "os";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const DEFAULT_SUPPORT_WHATSAPP = "+13474952236";
function whatsAppDigits(number) {
  return number.replace(/[^0-9]/g, "");
}
function whatsAppHref(number) {
  return `https://wa.me/${whatsAppDigits(number)}`;
}
function formatWhatsAppDisplay(number) {
  const digits = whatsAppDigits(number);
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return number.startsWith("+") ? number : `+${digits}`;
}
function SignupWhatsAppHelp({ className, compact }) {
  const display = formatWhatsAppDisplay(DEFAULT_SUPPORT_WHATSAPP);
  const href = whatsAppHref(DEFAULT_SUPPORT_WHATSAPP);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: cn(
        "block brutal-border-thin border-[#25D366] bg-[#25D366]/10 p-4 hover:bg-[#25D366]/15 transition-colors group",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "flex-shrink-0 w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center brutal-border-thin border-[#128C7E]",
            "aria-hidden": true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "w-5 h-5 fill-current", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26L3.673 19.5l3.981-1.307zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-black text-[#128C7E] mb-1", children: "Besoin d'aide ?" }),
          !compact && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug mb-2", children: "Un souci pour créer ton compte ? Écris-nous sur WhatsApp, on te répond rapidement." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-base sm:text-lg font-black text-foreground group-hover:text-[#128C7E] transition-colors break-all", children: display }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-bold text-[#25D366] mt-1", children: "Ouvrir WhatsApp →" })
        ] })
      ] })
    }
  );
}
const ALL_COUNTRIES = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", dial: "+93" },
  { code: "ZA", name: "Afrique du Sud", flag: "🇿🇦", dial: "+27" },
  { code: "AL", name: "Albanie", flag: "🇦🇱", dial: "+355" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿", dial: "+213" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", dial: "+49" },
  { code: "AD", name: "Andorre", flag: "🇦🇩", dial: "+376" },
  { code: "AO", name: "Angola", flag: "🇦🇴", dial: "+244" },
  { code: "AG", name: "Antigua-et-Barbuda", flag: "🇦🇬", dial: "+1268" },
  { code: "SA", name: "Arabie saoudite", flag: "🇸🇦", dial: "+966" },
  { code: "AR", name: "Argentine", flag: "🇦🇷", dial: "+54" },
  { code: "AM", name: "Arménie", flag: "🇦🇲", dial: "+374" },
  { code: "AU", name: "Australie", flag: "🇦🇺", dial: "+61" },
  { code: "AT", name: "Autriche", flag: "🇦🇹", dial: "+43" },
  { code: "AZ", name: "Azerbaïdjan", flag: "🇦🇿", dial: "+994" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", dial: "+1242" },
  { code: "BH", name: "Bahreïn", flag: "🇧🇭", dial: "+973" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", dial: "+880" },
  { code: "BB", name: "Barbade", flag: "🇧🇧", dial: "+1246" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", dial: "+32" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", dial: "+501" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯", dial: "+229" },
  { code: "BT", name: "Bhoutan", flag: "🇧🇹", dial: "+975" },
  { code: "BY", name: "Biélorussie", flag: "🇧🇾", dial: "+375" },
  { code: "BO", name: "Bolivie", flag: "🇧🇴", dial: "+591" },
  { code: "BA", name: "Bosnie-Herzégovine", flag: "🇧🇦", dial: "+387" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", dial: "+267" },
  { code: "BR", name: "Brésil", flag: "🇧🇷", dial: "+55" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", dial: "+673" },
  { code: "BG", name: "Bulgarie", flag: "🇧🇬", dial: "+359" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", dial: "+226" },
  { code: "BI", name: "Burundi", flag: "🇧🇮", dial: "+257" },
  { code: "KH", name: "Cambodge", flag: "🇰🇭", dial: "+855" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", dial: "+237" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "CV", name: "Cap-Vert", flag: "🇨🇻", dial: "+238" },
  { code: "CF", name: "Centrafrique", flag: "🇨🇫", dial: "+236" },
  { code: "CL", name: "Chili", flag: "🇨🇱", dial: "+56" },
  { code: "CN", name: "Chine", flag: "🇨🇳", dial: "+86" },
  { code: "CY", name: "Chypre", flag: "🇨🇾", dial: "+357" },
  { code: "CO", name: "Colombie", flag: "🇨🇴", dial: "+57" },
  { code: "KM", name: "Comores", flag: "🇰🇲", dial: "+269" },
  { code: "CG", name: "Congo", flag: "🇨🇬", dial: "+242" },
  { code: "KP", name: "Corée du Nord", flag: "🇰🇵", dial: "+850" },
  { code: "KR", name: "Corée du Sud", flag: "🇰🇷", dial: "+82" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", dial: "+506" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", dial: "+225" },
  { code: "HR", name: "Croatie", flag: "🇭🇷", dial: "+385" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", dial: "+53" },
  { code: "DK", name: "Danemark", flag: "🇩🇰", dial: "+45" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", dial: "+253" },
  { code: "DM", name: "Dominique", flag: "🇩🇲", dial: "+1767" },
  { code: "EG", name: "Égypte", flag: "🇪🇬", dial: "+20" },
  { code: "AE", name: "Émirats arabes unis", flag: "🇦🇪", dial: "+971" },
  { code: "EC", name: "Équateur", flag: "🇪🇨", dial: "+593" },
  { code: "ER", name: "Érythrée", flag: "🇪🇷", dial: "+291" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", dial: "+34" },
  { code: "EE", name: "Estonie", flag: "🇪🇪", dial: "+372" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", dial: "+268" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", dial: "+1" },
  { code: "ET", name: "Éthiopie", flag: "🇪🇹", dial: "+251" },
  { code: "FJ", name: "Fidji", flag: "🇫🇯", dial: "+679" },
  { code: "FI", name: "Finlande", flag: "🇫🇮", dial: "+358" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", dial: "+241" },
  { code: "GM", name: "Gambie", flag: "🇬🇲", dial: "+220" },
  { code: "GE", name: "Géorgie", flag: "🇬🇪", dial: "+995" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", dial: "+233" },
  { code: "GI", name: "Gibraltar", flag: "🇬🇮", dial: "+350" },
  { code: "GR", name: "Grèce", flag: "🇬🇷", dial: "+30" },
  { code: "GD", name: "Grenade", flag: "🇬🇩", dial: "+1473" },
  { code: "GL", name: "Groenland", flag: "🇬🇱", dial: "+299" },
  { code: "GP", name: "Guadeloupe", flag: "🇬🇵", dial: "+590" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", dial: "+502" },
  { code: "GG", name: "Guernesey", flag: "🇬🇬", dial: "+44" },
  { code: "GN", name: "Guinée", flag: "🇬🇳", dial: "+224" },
  { code: "GQ", name: "Guinée équatoriale", flag: "🇬🇶", dial: "+240" },
  { code: "GW", name: "Guinée-Bissau", flag: "🇬🇼", dial: "+245" },
  { code: "GY", name: "Guyana", flag: "🇬🇾", dial: "+592" },
  { code: "GF", name: "Guyane française", flag: "🇬🇫", dial: "+594" },
  { code: "HT", name: "Haïti", flag: "🇭🇹", dial: "+509" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", dial: "+504" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", dial: "+852" },
  { code: "HU", name: "Hongrie", flag: "🇭🇺", dial: "+36" },
  { code: "IN", name: "Inde", flag: "🇮🇳", dial: "+91" },
  { code: "ID", name: "Indonésie", flag: "🇮🇩", dial: "+62" },
  { code: "IQ", name: "Irak", flag: "🇮🇶", dial: "+964" },
  { code: "IR", name: "Iran", flag: "🇮🇷", dial: "+98" },
  { code: "IE", name: "Irlande", flag: "🇮🇪", dial: "+353" },
  { code: "IS", name: "Islande", flag: "🇮🇸", dial: "+354" },
  { code: "IL", name: "Israël", flag: "🇮🇱", dial: "+972" },
  { code: "IT", name: "Italie", flag: "🇮🇹", dial: "+39" },
  { code: "JM", name: "Jamaïque", flag: "🇯🇲", dial: "+1876" },
  { code: "JP", name: "Japon", flag: "🇯🇵", dial: "+81" },
  { code: "JE", name: "Jersey", flag: "🇯🇪", dial: "+44" },
  { code: "JO", name: "Jordanie", flag: "🇯🇴", dial: "+962" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", dial: "+7" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dial: "+254" },
  { code: "KG", name: "Kirghizistan", flag: "🇰🇬", dial: "+996" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮", dial: "+686" },
  { code: "KW", name: "Koweït", flag: "🇰🇼", dial: "+965" },
  { code: "RE", name: "La Réunion", flag: "🇷🇪", dial: "+262" },
  { code: "LA", name: "Laos", flag: "🇱🇦", dial: "+856" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", dial: "+266" },
  { code: "LV", name: "Lettonie", flag: "🇱🇻", dial: "+371" },
  { code: "LB", name: "Liban", flag: "🇱🇧", dial: "+961" },
  { code: "LR", name: "Libéria", flag: "🇱🇷", dial: "+231" },
  { code: "LY", name: "Libye", flag: "🇱🇾", dial: "+218" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", dial: "+423" },
  { code: "LT", name: "Lituanie", flag: "🇱🇹", dial: "+370" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", dial: "+352" },
  { code: "MO", name: "Macao", flag: "🇲🇴", dial: "+853" },
  { code: "MK", name: "Macédoine du Nord", flag: "🇲🇰", dial: "+389" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", dial: "+261" },
  { code: "MY", name: "Malaisie", flag: "🇲🇾", dial: "+60" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", dial: "+265" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", dial: "+960" },
  { code: "ML", name: "Mali", flag: "🇲🇱", dial: "+223" },
  { code: "MT", name: "Malte", flag: "🇲🇹", dial: "+356" },
  { code: "MA", name: "Maroc", flag: "🇲🇦", dial: "+212" },
  { code: "MQ", name: "Martinique", flag: "🇲🇶", dial: "+596" },
  { code: "MU", name: "Maurice", flag: "🇲🇺", dial: "+230" },
  { code: "MR", name: "Mauritanie", flag: "🇲🇷", dial: "+222" },
  { code: "YT", name: "Mayotte", flag: "🇾🇹", dial: "+262" },
  { code: "MX", name: "Mexique", flag: "🇲🇽", dial: "+52" },
  { code: "MD", name: "Moldavie", flag: "🇲🇩", dial: "+373" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", dial: "+377" },
  { code: "MN", name: "Mongolie", flag: "🇲🇳", dial: "+976" },
  { code: "ME", name: "Monténégro", flag: "🇲🇪", dial: "+382" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", dial: "+258" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", dial: "+95" },
  { code: "NA", name: "Namibie", flag: "🇳🇦", dial: "+264" },
  { code: "NR", name: "Nauru", flag: "🇳🇷", dial: "+674" },
  { code: "NP", name: "Népal", flag: "🇳🇵", dial: "+977" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", dial: "+505" },
  { code: "NE", name: "Niger", flag: "🇳🇪", dial: "+227" },
  { code: "NG", name: "Nigéria", flag: "🇳🇬", dial: "+234" },
  { code: "NO", name: "Norvège", flag: "🇳🇴", dial: "+47" },
  { code: "NC", name: "Nouvelle-Calédonie", flag: "🇳🇨", dial: "+687" },
  { code: "NZ", name: "Nouvelle-Zélande", flag: "🇳🇿", dial: "+64" },
  { code: "OM", name: "Oman", flag: "🇴🇲", dial: "+968" },
  { code: "UG", name: "Ouganda", flag: "🇺🇬", dial: "+256" },
  { code: "UZ", name: "Ouzbékistan", flag: "🇺🇿", dial: "+998" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", dial: "+92" },
  { code: "PA", name: "Panama", flag: "🇵🇦", dial: "+507" },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée", flag: "🇵🇬", dial: "+675" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", dial: "+595" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱", dial: "+31" },
  { code: "PE", name: "Pérou", flag: "🇵🇪", dial: "+51" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dial: "+63" },
  { code: "PL", name: "Pologne", flag: "🇵🇱", dial: "+48" },
  { code: "PF", name: "Polynésie française", flag: "🇵🇫", dial: "+689" },
  { code: "PR", name: "Porto Rico", flag: "🇵🇷", dial: "+1787" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dial: "+351" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", dial: "+974" },
  { code: "CD", name: "RD Congo", flag: "🇨🇩", dial: "+243" },
  { code: "RO", name: "Roumanie", flag: "🇷🇴", dial: "+40" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", dial: "+44" },
  { code: "RU", name: "Russie", flag: "🇷🇺", dial: "+7" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", dial: "+250" },
  { code: "KN", name: "Saint-Kitts-et-Nevis", flag: "🇰🇳", dial: "+1869" },
  { code: "SM", name: "Saint-Marin", flag: "🇸🇲", dial: "+378" },
  { code: "VC", name: "Saint-Vincent-et-les-Grenadines", flag: "🇻🇨", dial: "+1784" },
  { code: "LC", name: "Sainte-Lucie", flag: "🇱🇨", dial: "+1758" },
  { code: "SV", name: "Salvador", flag: "🇸🇻", dial: "+503" },
  { code: "WS", name: "Samoa", flag: "🇼🇸", dial: "+685" },
  { code: "ST", name: "Sao Tomé-et-Principe", flag: "🇸🇹", dial: "+239" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳", dial: "+221" },
  { code: "RS", name: "Serbie", flag: "🇷🇸", dial: "+381" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", dial: "+248" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", dial: "+232" },
  { code: "SG", name: "Singapour", flag: "🇸🇬", dial: "+65" },
  { code: "SK", name: "Slovaquie", flag: "🇸🇰", dial: "+421" },
  { code: "SI", name: "Slovénie", flag: "🇸🇮", dial: "+386" },
  { code: "SO", name: "Somalie", flag: "🇸🇴", dial: "+252" },
  { code: "SD", name: "Soudan", flag: "🇸🇩", dial: "+249" },
  { code: "SS", name: "Soudan du Sud", flag: "🇸🇸", dial: "+211" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", dial: "+94" },
  { code: "SE", name: "Suède", flag: "🇸🇪", dial: "+46" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", dial: "+41" },
  { code: "SR", name: "Suriname", flag: "🇸🇷", dial: "+597" },
  { code: "SY", name: "Syrie", flag: "🇸🇾", dial: "+963" },
  { code: "TJ", name: "Tadjikistan", flag: "🇹🇯", dial: "+992" },
  { code: "TW", name: "Taïwan", flag: "🇹🇼", dial: "+886" },
  { code: "TZ", name: "Tanzanie", flag: "🇹🇿", dial: "+255" },
  { code: "TD", name: "Tchad", flag: "🇹🇩", dial: "+235" },
  { code: "CZ", name: "Tchéquie", flag: "🇨🇿", dial: "+420" },
  { code: "TH", name: "Thaïlande", flag: "🇹🇭", dial: "+66" },
  { code: "TL", name: "Timor oriental", flag: "🇹🇱", dial: "+670" },
  { code: "TG", name: "Togo", flag: "🇹🇬", dial: "+228" },
  { code: "TO", name: "Tonga", flag: "🇹🇴", dial: "+676" },
  { code: "TT", name: "Trinité-et-Tobago", flag: "🇹🇹", dial: "+1868" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", dial: "+216" },
  { code: "TM", name: "Turkménistan", flag: "🇹🇲", dial: "+993" },
  { code: "TR", name: "Turquie", flag: "🇹🇷", dial: "+90" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻", dial: "+688" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", dial: "+380" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", dial: "+598" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", dial: "+678" },
  { code: "VA", name: "Vatican", flag: "🇻🇦", dial: "+379" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", dial: "+58" },
  { code: "VN", name: "Viêt Nam", flag: "🇻🇳", dial: "+84" },
  { code: "YE", name: "Yémen", flag: "🇾🇪", dial: "+967" },
  { code: "ZM", name: "Zambie", flag: "🇿🇲", dial: "+260" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", dial: "+263" }
];
function findCountry(code) {
  if (!code) return void 0;
  return ALL_COUNTRIES.find((c) => c.code === code);
}
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function searchCountries(q, limit = 8) {
  const query = normalize(q.trim());
  if (!query) return [];
  const starts = [];
  const contains = [];
  for (const c of ALL_COUNTRIES) {
    const n = normalize(c.name);
    if (n.startsWith(query) || c.code.toLowerCase().startsWith(query)) starts.push(c);
    else if (n.includes(query)) contains.push(c);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
const credSchema = objectType({
  email: stringType().trim().email("Email invalide").max(255),
  password: stringType().min(8, "8 caractères minimum").max(72)
});
function AuthPage() {
  const {
    mode,
    ref,
    email: emailParam,
    firstName: firstNameParam,
    lastName: lastNameParam,
    beta
  } = Route$E.useSearch();
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  const [hydrated, setHydrated] = reactExports.useState(false);
  const [isSignup, setIsSignup] = reactExports.useState(mode === "signup");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [firstName, setFirstName] = reactExports.useState("");
  const [lastName, setLastName] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [countryQuery, setCountryQuery] = reactExports.useState("");
  const [countryOpen, setCountryOpen] = reactExports.useState(false);
  const [phoneCode, setPhoneCode] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [referralSource, setReferralSource] = reactExports.useState("");
  const [selectedMode, setSelectedMode] = reactExports.useState("dropshipping");
  const [affiliateCode, setAffiliateCode] = reactExports.useState(ref ?? "");
  const [affiliateInfo, setAffiliateInfo] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [signupSentTo, setSignupSentTo] = reactExports.useState(null);
  reactExports.useEffect(() => setHydrated(true), []);
  reactExports.useEffect(() => {
    const c = findCountry(country);
    if (c && c.dial) setPhoneCode(c.dial);
  }, [country]);
  const countrySuggestions = countryOpen && countryQuery.trim() ? searchCountries(countryQuery, 8) : [];
  reactExports.useEffect(() => setIsSignup(mode === "signup"), [mode]);
  reactExports.useEffect(() => {
    if (ref) setIsSignup(true);
  }, [ref]);
  reactExports.useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (firstNameParam) setFirstName(firstNameParam);
    if (lastNameParam) setLastName(lastNameParam);
    if (beta === "1" || emailParam) setIsSignup(true);
  }, [emailParam, firstNameParam, lastNameParam, beta]);
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/dashboard"
    });
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    const code = affiliateCode.trim().toLowerCase();
    if (!isSignup || !code) {
      setAffiliateInfo(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const {
        data,
        error
      } = await supabase.rpc("validate_affiliate_code", {
        _code: code
      });
      if (cancelled) return;
      const row = Array.isArray(data) ? data[0] : null;
      if (!error && row && row.valid) {
        setAffiliateInfo({
          valid: true,
          trial_days: row.trial_days,
          label: row.label
        });
      } else {
        setAffiliateInfo({
          valid: false
        });
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [affiliateCode, isSignup]);
  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    const parsed = credSchema.safeParse({
      email,
      password
    });
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }
    if (isSignup) {
      if (password !== confirmPassword) {
        setErr("Les deux mots de passe ne correspondent pas.");
        return;
      }
      if (!firstName.trim()) {
        setErr("Le prénom est obligatoire.");
        return;
      }
      if (!lastName.trim()) {
        setErr("Le nom est obligatoire.");
        return;
      }
      if (!phone.trim()) {
        setErr("Le numéro de téléphone est obligatoire.");
        return;
      }
      if (!phoneCode.trim()) {
        setErr("L'indicatif téléphonique est obligatoire.");
        return;
      }
    }
    setBusy(true);
    try {
      if (isSignup) {
        const code = affiliateCode.trim().toLowerCase();
        const meta = {};
        if (code) meta.affiliate_code = code;
        if (firstName.trim()) meta.first_name = firstName.trim();
        if (lastName.trim()) meta.last_name = lastName.trim();
        if (country) meta.country = country;
        if (phoneCode.trim()) meta.phone_country_code = phoneCode.trim();
        if (phone.trim()) meta.phone = phone.trim();
        if (referralSource) meta.referral_source = referralSource;
        meta.selected_mode = selectedMode;
        meta.active_mode = selectedMode;
        if (firstName.trim() || lastName.trim()) {
          meta.display_name = `${firstName.trim()} ${lastName.trim()}`.trim();
        }
        if (beta === "1") meta.beta_tester = "1";
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: Object.keys(meta).length ? meta : void 0
          }
        });
        if (error) throw error;
        if (!data.session) {
          setSignupSentTo(parsed.data.email);
          toast.success(beta === "1" ? "Compte bêta créé. Vérifie ton email — Scale gratuit 6 mois + -50 % à vie." : "Compte créé. Vérifie ton email.");
          return;
        }
        if (data.user?.id) {
          await supabase.from("profiles").update({
            selected_mode: selectedMode,
            active_mode: selectedMode
          }).eq("id", data.user.id);
        }
        toast.success(beta === "1" ? "Compte bêta créé — Scale gratuit 6 mois, puis -50 % à vie !" : affiliateInfo?.valid ? `Compte créé. Essai gratuit ${affiliateInfo.trial_days} jours !` : "Compte créé.");
        navigate({
          to: "/dashboard"
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password
        });
        if (error) throw error;
        toast.success("Connecté.");
        navigate({
          to: "/dashboard"
        });
      }
    } catch (e2) {
      const msg = e2?.message ?? "Erreur inconnue";
      setErr(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }
  async function handleReset() {
    if (!email) {
      setErr("Entre ton email d'abord.");
      return;
    }
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) toast.error(error.message);
    else toast.success("Email de réinitialisation envoyé.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground", children: "← Retour" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 brutal-border p-6 sm:p-8 md:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { mode: "cod", priority: true, className: "h-7 md:h-8 w-auto object-contain shrink-0" }) }),
      signupSentTo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-accent font-bold mb-2", children: "✓ Compte créé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-black mb-3 tracking-tighter", children: "VÉRIFIE TON EMAIL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: "Un email de confirmation vient d'être envoyé à :" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin px-4 py-3 font-mono text-sm break-all mb-4 bg-muted", children: signupSentTo }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: [
          "Clique sur le lien dans l'email pour activer ton compte, puis reviens te connecter. Pense à vérifier tes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "spams / promotions" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setSignupSentTo(null);
          setIsSignup(false);
          setPassword("");
        }, className: "w-full brutal-border bg-foreground text-background px-4 py-3 font-black uppercase tracking-wider hover:bg-accent hover:border-accent", children: "Aller à la connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          const {
            error
          } = await supabase.auth.resend({
            type: "signup",
            email: signupSentTo,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`
            }
          });
          if (error) toast.error(error.message);
          else toast.success("Email renvoyé.");
        }, className: "w-full mt-3 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground", children: "Renvoyer l'email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SignupWhatsAppHelp, { className: "mt-6", compact: true })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "tablist", "aria-label": "Mode d'authentification", className: "grid grid-cols-2 brutal-border-thin mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "tab", "aria-selected": !isSignup, onClick: () => {
            setIsSignup(false);
            setErr(null);
          }, className: `px-3 py-3 text-xs uppercase tracking-widest font-black transition-colors ${!isSignup ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"}`, children: "Connexion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "tab", "aria-selected": isSignup, onClick: () => {
            setIsSignup(true);
            setErr(null);
          }, className: `px-3 py-3 text-xs uppercase tracking-widest font-black border-l border-foreground transition-colors ${isSignup ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"}`, children: "Créer un compte" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-black mb-1 tracking-tighter", children: isSignup ? "CRÉER UN COMPTE" : "CONNEXION" }),
        isSignup && beta === "1" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-accent bg-accent/10 px-4 py-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-black text-accent mb-1", children: "Programme bêta-testeur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: [
            "Inscription identique aux autres utilisateurs. Les bêta-testeurs bénéficient du plan",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Scale" }),
            " gratuit pendant",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "6 mois" }),
            ", puis",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "-50 % à vie" }),
            " sur tous les plans (places limitées à 10)."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: isSignup ? beta === "1" ? "Finalise ton inscription bêta en 30 secondes." : "Démarre en 30 secondes." : "Accède à ton dashboard." }),
        isSignup && /* @__PURE__ */ jsxRuntimeExports.jsx(SignupWhatsAppHelp, { className: "mb-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, method: "post", action: "/auth", className: "space-y-5", autoComplete: "on", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "email", name: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "username", className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2", placeholder: "toi@exemple.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: "Mot de passe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 8, autoComplete: isSignup ? "new-password" : "current-password", className: "w-full bg-background brutal-border-thin px-4 py-3 pr-12 font-mono text-sm focus:border-accent outline-none focus:border-2", placeholder: "********" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), tabIndex: -1, "aria-label": showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe", className: "absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground", children: showPassword ? "Masquer" : "Voir" })
            ] })
          ] }),
          isSignup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "confirmPassword", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: "Confirmer le mot de passe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "confirmPassword", name: "confirmPassword", type: showConfirmPassword ? "text" : "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, minLength: 8, autoComplete: "new-password", className: "w-full bg-background brutal-border-thin px-4 py-3 pr-12 font-mono text-sm focus:border-accent outline-none focus:border-2", placeholder: "********" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirmPassword((v) => !v), tabIndex: -1, "aria-label": showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe", className: "absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground", children: showConfirmPassword ? "Masquer" : "Voir" })
            ] }),
            confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-2 text-xs font-bold ${password === confirmPassword ? "text-emerald-600" : "text-amber-600"}`, children: password === confirmPassword ? "✓ Les mots de passe correspondent" : "✗ Les mots de passe ne correspondent pas" })
          ] }),
          isSignup && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "firstName", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: "Prénom *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "firstName", type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), maxLength: 60, required: true, autoComplete: "given-name", className: "w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2", placeholder: "Aïssa" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lastName", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: "Nom *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "lastName", type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), maxLength: 60, required: true, autoComplete: "family-name", className: "w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2", placeholder: "Diop" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "country", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: [
                "Pays ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal normal-case", children: "(opt., tape pour rechercher)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "country", type: "text", value: countryQuery, onChange: (e) => {
                setCountryQuery(e.target.value);
                setCountryOpen(true);
                if (country) setCountry("");
              }, onFocus: () => setCountryOpen(true), onBlur: () => setTimeout(() => setCountryOpen(false), 150), autoComplete: "off", className: "w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2", placeholder: "ex. France, Sénégal, Côte d'Ivoire…" }),
              country && countryQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] font-mono text-emerald-600", children: [
                "✓ ",
                findCountry(country)?.flag,
                " ",
                findCountry(country)?.name
              ] }),
              countrySuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { role: "listbox", className: "absolute z-20 left-0 right-0 mt-1 bg-background brutal-border-thin max-h-60 overflow-auto shadow-[4px_4px_0_0_var(--color-foreground)]", children: countrySuggestions.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onMouseDown: (e) => e.preventDefault(), onClick: () => {
                setCountry(c.code);
                setCountryQuery(`${c.flag} ${c.name}`);
                if (c.dial) setPhoneCode(c.dial);
                setCountryOpen(false);
              }, className: "w-full text-left px-3 py-2 font-mono text-sm hover:bg-muted flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: c.flag }),
                  c.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: c.dial })
              ] }) }, c.code)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] font-mono text-muted-foreground", children: [
                "Tape les premières lettres (ex. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "fra" }),
                " pour France)."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-widest font-bold mb-2", children: [
                "Téléphone ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-normal normal-case", children: "*" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal normal-case", children: "(utile pour WhatsApp)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: phoneCode, onChange: (e) => setPhoneCode(e.target.value), maxLength: 5, required: true, placeholder: "+33", "aria-label": "Indicatif", className: "w-20 bg-background brutal-border-thin px-2 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value.replace(/[^\d\s]/g, "")), maxLength: 20, required: true, autoComplete: "tel-national", placeholder: "6 12 34 56 78", className: "flex-1 bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] font-mono text-muted-foreground", children: "L'indicatif se met à jour automatiquement quand tu choisis ton pays." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "referral", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: [
                "Comment nous as-tu connu ? ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal normal-case", children: "(opt.)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "referral", value: referralSource, onChange: (e) => setReferralSource(e.target.value), className: "w-full bg-background brutal-border-thin px-3 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Sélectionner —" }),
                REFERRAL_SOURCES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label }, s.value))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-widest font-bold mb-2", children: "Avec quel mode tu démarres ? *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedMode("dropshipping"), "aria-pressed": selectedMode === "dropshipping", className: `brutal-border-thin px-3 py-3 text-left transition-colors ${selectedMode === "dropshipping" ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-muted"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-black uppercase tracking-widest", children: "Dropshipping" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono mt-1 opacity-80", children: "Shopify + Meta/TikTok" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedMode("cod"), "aria-pressed": selectedMode === "cod", className: `brutal-border-thin px-3 py-3 text-left transition-colors ${selectedMode === "cod" ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-muted"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-black uppercase tracking-widest", children: "COD" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono mt-1 opacity-80", children: "Cash on Delivery · FCFA" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[10px] font-mono text-muted-foreground leading-snug", children: "Tu pourras changer de mode après. Sur le plan Basic ($5), un seul mode est actif à la fois. Plans Pro/Premium : Drop + COD en parallèle." })
            ] })
          ] }),
          isSignup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "affiliate", className: "block text-xs uppercase tracking-widest font-bold mb-2", children: [
              "Code parrainage ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal normal-case", children: "(optionnel)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "affiliate", name: "affiliate", type: "text", value: affiliateCode, onChange: (e) => setAffiliateCode(e.target.value), autoComplete: "off", className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono text-sm focus:border-accent outline-none focus:border-2 lowercase", placeholder: "ntdsh-xxxx" }),
            affiliateCode && affiliateInfo?.valid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs font-bold text-emerald-600", children: [
              "✓ Code valide — Essai gratuit ",
              affiliateInfo.trial_days,
              " jours",
              affiliateInfo.label ? ` (${affiliateInfo.label})` : ""
            ] }),
            affiliateCode && affiliateInfo && !affiliateInfo.valid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs font-bold text-amber-600", children: "Code inconnu — essai standard 3 jours appliqué" }),
            !affiliateCode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "Sans code : essai gratuit de 3 jours" })
          ] }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-accent text-accent px-3 py-2 text-sm font-bold", children: err }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !hydrated || busy, className: "w-full brutal-border bg-foreground text-background px-4 py-4 font-black uppercase tracking-wider hover:bg-accent hover:border-accent disabled:opacity-50", children: !hydrated ? "CHARGEMENT…" : busy ? "…" : isSignup ? "CRÉER LE COMPTE" : "SE CONNECTER" })
        ] }),
        !isSignup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-xs uppercase tracking-widest", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleReset, className: "text-muted-foreground hover:text-foreground", children: "Mot de passe oublié ?" }) })
      ] })
    ] })
  ] }) });
}
export {
  AuthPage as component
};
