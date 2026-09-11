// Pays couverts par Netodash — Afrique de l'Ouest uniquement.
//
// Avant, ce fichier contenait la liste mondiale complète (~200 pays, dont
// l'Europe) et en extrayait les 9 pays d'Afrique de l'Ouest. Le produit
// s'adressant exclusivement à l'Afrique de l'Ouest, la donnée mondiale a été
// supprimée : plus aucun pays européen dans le code.
export type WorldCountry = { code: string; name: string; flag: string; dial: string };

/** Les 9 pays d'Afrique de l'Ouest couverts (zone XOF / UEMOA + Mauritanie). */
export const WEST_AFRICA: WorldCountry[] = [
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

export function findCountry(code?: string | null): WorldCountry | undefined {
  if (!code) return undefined;
  return WEST_AFRICA.find((c) => c.code === code);
}

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function searchCountries(q: string, limit = 8): WorldCountry[] {
  const query = normalize(q.trim());
  if (!query) return [];
  const starts: WorldCountry[] = [];
  const contains: WorldCountry[] = [];
  for (const c of WEST_AFRICA) {
    const n = normalize(c.name);
    if (n.startsWith(query) || c.code.toLowerCase().startsWith(query)) starts.push(c);
    else if (n.includes(query)) contains.push(c);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
