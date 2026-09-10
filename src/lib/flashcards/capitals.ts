import { COUNTRIES, CONTINENTS } from "./countries";
import { flagEmoji } from "./flag";
import type { FlashcardItem, Subject } from "./types";

export const CAPITALS_SUBJECT: Subject = {
  id: "capitals",
  label: "Capital Cities",
  icon: "🌍",
  groupLabel: "Continent",
  groups: CONTINENTS,
};

export const CAPITALS_ITEMS: FlashcardItem[] = COUNTRIES.map((country) => ({
  id: country.code,
  subject: "capitals",
  group: country.continent,
  icon: flagEmoji(country.code),
  frontTitle: country.name,
  frontSubtitle: "Tap to reveal capital",
  backTitle: country.capital,
  backSubtitle: country.name,
}));
