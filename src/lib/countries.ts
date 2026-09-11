// Pays cibles NETODASH : Afrique de l'Ouest uniquement.
//
// Les pays d'Afrique centrale, le Maroc et l'entree « Autre » ont ete retires :
// la seule devise du produit est le FCFA et le marche vise est l'Afrique de
// l'Ouest. Meme perimetre que ce que l'application proposait deja comme
// « Afrique de l'Ouest francophone ».

export type Country = {
  code: string; // ISO-2
  name: string;
  flag: string;
  dial: string;
};

export const COUNTRIES: Country[] = [
  // Afrique de l'Ouest francophone
  { code: "SN", name: "Sénégal", flag: "🇸🇳", dial: "+221" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", dial: "+225" },
  { code: "ML", name: "Mali", flag: "🇲🇱", dial: "+223" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", dial: "+226" },
  { code: "GN", name: "Guinée", flag: "🇬🇳", dial: "+224" },
  { code: "TG", name: "Togo", flag: "🇹🇬", dial: "+228" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯", dial: "+229" },
  { code: "NE", name: "Niger", flag: "🇳🇪", dial: "+227" },
  { code: "MR", name: "Mauritanie", flag: "🇲🇷", dial: "+222" },
];

export const REFERRAL_SOURCES: { value: string; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "google", label: "Google / Recherche" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "ami", label: "Bouche-à-oreille / Ami" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "autre", label: "Autre" },
];

export function getCountry(code?: string | null): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code);
}

export function getReferralLabel(value?: string | null): string {
  if (!value) return "—";
  return REFERRAL_SOURCES.find((s) => s.value === value)?.label ?? value;
}
