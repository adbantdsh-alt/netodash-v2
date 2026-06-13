// Pays cibles NETODASH : Afrique francophone (Ouest + Centrale) + Maroc

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
  // Afrique centrale francophone
  { code: "CM", name: "Cameroun", flag: "🇨🇲", dial: "+237" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", dial: "+241" },
  { code: "CG", name: "Congo", flag: "🇨🇬", dial: "+242" },
  { code: "CD", name: "RD Congo", flag: "🇨🇩", dial: "+243" },
  { code: "TD", name: "Tchad", flag: "🇹🇩", dial: "+235" },
  { code: "CF", name: "Centrafrique", flag: "🇨🇫", dial: "+236" },
  // Maroc
  { code: "MA", name: "Maroc", flag: "🇲🇦", dial: "+212" },
  // Autre
  { code: "OTHER", name: "Autre", flag: "🌍", dial: "" },
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
