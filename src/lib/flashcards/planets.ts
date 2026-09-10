import type { FlashcardItem, Subject } from "./types";

interface PlanetFacts {
  name: string;
  icon: string;
  moons: string;
  distance: string;
  orbit: string;
  day: string;
  diameter: string;
  temperature: string;
  atmosphere: string;
  funFact: string;
}

// Figures are rounded averages for memorability, not mission-grade precision.
const PLANETS: PlanetFacts[] = [
  {
    name: "Mercury",
    icon: "🟤",
    moons: "0",
    distance: "57.9 million km (0.39 AU) from the Sun",
    orbit: "88 Earth days — the shortest year of any planet",
    day: "59 Earth days per rotation",
    diameter: "4,880 km — the smallest planet",
    temperature: "-180°C to 430°C — the widest swing of any planet, since it has no real atmosphere to trap heat",
    atmosphere: "Essentially none — just a thin exosphere of oxygen, sodium, and hydrogen",
    funFact: "Its day-night cycle takes about 176 Earth days — longer than its entire year",
  },
  {
    name: "Venus",
    icon: "🟡",
    moons: "0",
    distance: "108.2 million km (0.72 AU) from the Sun",
    orbit: "225 Earth days",
    day: "243 Earth days — and it spins backwards (retrograde), so its day is longer than its year",
    diameter: "12,104 km — almost the same size as Earth",
    temperature: "~465°C average — the hottest planet, hotter than Mercury",
    atmosphere: "Thick carbon dioxide (96%) with clouds of sulfuric acid",
    funFact: "It's hotter than Mercury even though it's farther from the Sun, thanks to a runaway greenhouse effect",
  },
  {
    name: "Earth",
    icon: "🌍",
    moons: "1 (the Moon)",
    distance: "149.6 million km (1 AU) from the Sun",
    orbit: "365.25 days",
    day: "24 hours",
    diameter: "12,742 km",
    temperature: "~15°C average",
    atmosphere: "78% nitrogen, 21% oxygen",
    funFact: "The only known planet with liquid water on its surface — and the only one known to host life",
  },
  {
    name: "Mars",
    icon: "🔴",
    moons: "2 (Phobos and Deimos)",
    distance: "227.9 million km (1.52 AU) from the Sun",
    orbit: "687 Earth days (about 1.9 years)",
    day: "24.6 hours — close to Earth's",
    diameter: "6,779 km — about half Earth's size",
    temperature: "~-65°C average, ranging from -140°C to 20°C",
    atmosphere: "Thin — 95% carbon dioxide",
    funFact: "Home to Olympus Mons, the largest volcano in the solar system at ~21 km tall",
  },
  {
    name: "Jupiter",
    icon: "🟠",
    moons: "95 known, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto",
    distance: "778.5 million km (5.2 AU) from the Sun",
    orbit: "12 Earth years",
    day: "10 hours — the fastest-spinning planet",
    diameter: "139,820 km — the largest planet, big enough to fit over 1,300 Earths inside",
    temperature: "~-110°C at the cloud tops",
    atmosphere: "Mostly hydrogen and helium — a gas giant",
    funFact: "The Great Red Spot is a storm bigger than Earth that has raged for centuries",
  },
  {
    name: "Saturn",
    icon: "🪐",
    moons: "146 known, the largest being Titan, which is bigger than the planet Mercury",
    distance: "1.43 billion km (9.5 AU) from the Sun",
    orbit: "29 Earth years",
    day: "~10.7 hours",
    diameter: "116,460 km — the second-largest planet",
    temperature: "~-140°C",
    atmosphere: "Mostly hydrogen and helium — a gas giant",
    funFact: "It's the least dense planet — it would float in a big enough bathtub. Its rings are mostly ice and rock",
  },
  {
    name: "Uranus",
    icon: "🔵",
    moons: "28 known",
    distance: "2.87 billion km (19.2 AU) from the Sun",
    orbit: "84 Earth years",
    day: "17 hours",
    diameter: "50,724 km",
    temperature: "~-195°C — the coldest atmosphere in the solar system",
    atmosphere: "Hydrogen, helium, and methane (which gives it a blue-green color) — an ice giant",
    funFact: "It spins on its side, tilted about 98° — likely knocked over by an ancient collision",
  },
  {
    name: "Neptune",
    icon: "🟦",
    moons: "16 known, the largest being Triton, which orbits backwards",
    distance: "4.5 billion km (30.1 AU) from the Sun",
    orbit: "165 Earth years",
    day: "16 hours",
    diameter: "49,244 km",
    temperature: "~-200°C",
    atmosphere: "Hydrogen, helium, and methane — an ice giant with the fastest winds in the solar system, up to 2,100 km/h",
    funFact: "It has only completed one full orbit of the Sun since its discovery in 1846 (in 2011)",
  },
  {
    name: "Pluto",
    icon: "⚪",
    moons: "5, the largest being Charon, roughly half Pluto's own size",
    distance: "5.9 billion km (39.5 AU) from the Sun on average",
    orbit: "248 Earth years",
    day: "6.4 Earth days",
    diameter: "2,377 km — smaller than Earth's Moon",
    temperature: "~-225°C",
    atmosphere: "A thin nitrogen atmosphere that partially freezes onto its surface as it moves farther from the Sun",
    funFact: "Reclassified from the ninth planet to a \"dwarf planet\" by the IAU in 2006",
  },
];

const FACT_FIELDS: {
  key: keyof Omit<PlanetFacts, "name" | "icon">;
  slug: string;
  question: string;
  label: string;
}[] = [
  { key: "moons", slug: "moons", question: "How many moons does it have?", label: "Moons" },
  { key: "distance", slug: "distance", question: "How far is it from the Sun?", label: "Distance from Sun" },
  { key: "orbit", slug: "orbit", question: "How long is one year (orbit)?", label: "Orbital Period" },
  { key: "day", slug: "day", question: "How long is one day (rotation)?", label: "Day Length" },
  { key: "diameter", slug: "diameter", question: "What is its diameter?", label: "Diameter" },
  { key: "temperature", slug: "temperature", question: "What's its average temperature?", label: "Temperature" },
  { key: "atmosphere", slug: "atmosphere", question: "What's its atmosphere made of?", label: "Atmosphere" },
  { key: "funFact", slug: "funfact", question: "What's an interesting fact about it?", label: "Fun Fact" },
];

export const PLANETS_SUBJECT: Subject = {
  id: "planets",
  label: "Solar System",
  icon: "🪐",
  groupLabel: "Planet",
  groups: PLANETS.map((p) => p.name),
};

export const PLANETS_ITEMS: FlashcardItem[] = PLANETS.flatMap((planet) =>
  FACT_FIELDS.map((field) => ({
    id: `${planet.name.toLowerCase()}-${field.slug}`,
    subject: "planets" as const,
    group: planet.name,
    icon: planet.icon,
    frontTitle: planet.name,
    frontSubtitle: field.question,
    backTitle: planet[field.key],
    backSubtitle: `${planet.name} — ${field.label}`,
  }))
);
