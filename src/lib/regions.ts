// Régions / villes principales par pays cible
// Source : découpages administratifs courants (régions, villes principales)
// pour les pays d'Afrique de l'Ouest couverts par Netodash.
// L'utilisateur peut toujours ajouter manuellement une région personnalisée.

export const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  SN: [
    "Dakar", "Thiès", "Diourbel", "Fatick", "Kaffrine", "Kaolack",
    "Kédougou", "Kolda", "Louga", "Matam", "Saint-Louis", "Sédhiou",
    "Tambacounda", "Ziguinchor",
  ],
  CI: [
    "Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "San-Pédro", "Korhogo",
    "Man", "Gagnoa", "Divo", "Anyama", "Abengourou", "Agboville",
    "Grand-Bassam", "Dabou", "Soubré", "Bondoukou", "Odienné", "Séguéla",
  ],
  ML: [
    "Bamako", "Kayes", "Koulikoro", "Sikasso", "Ségou", "Mopti",
    "Tombouctou", "Gao", "Kidal", "Taoudénit", "Ménaka",
  ],
  BF: [
    "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Ouahigouya",
    "Kaya", "Tenkodogo", "Fada N'Gourma", "Dédougou", "Manga",
    "Dori", "Gaoua", "Ziniaré",
  ],
  GN: [
    "Conakry", "Nzérékoré", "Kindia", "Kankan", "Boké", "Labé",
    "Mamou", "Faranah", "Siguiri", "Kissidougou",
  ],
  TG: [
    "Lomé", "Sokodé", "Kara", "Kpalimé", "Atakpamé", "Dapaong",
    "Tsévié", "Aného", "Bassar", "Tchamba",
  ],
  BJ: [
    "Cotonou", "Porto-Novo", "Parakou", "Abomey", "Bohicon", "Djougou",
    "Natitingou", "Lokossa", "Kandi", "Ouidah", "Abomey-Calavi",
  ],
  NE: [
    "Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso",
    "Tillabéri", "Diffa",
  ],
  MR: [
    "Nouakchott", "Nouadhibou", "Rosso", "Kaédi", "Zouérat", "Atar",
    "Néma", "Kiffa", "Aleg", "Tidjikja",
  ],
};

export function regionsFor(countryCodes: string[] | null | undefined): string[] {
  if (!countryCodes || countryCodes.length === 0) return [];
  const set = new Set<string>();
  for (const code of countryCodes) {
    for (const r of REGIONS_BY_COUNTRY[code] ?? []) set.add(r);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
}
