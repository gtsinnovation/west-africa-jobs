import { CountryOption } from "@/lib/types";

export const COUNTRIES: CountryOption[] = [
  { name: "All West Africa", flag: "🌍" },
  { name: "Liberia", flag: "🇱🇷" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Sierra Leone", flag: "🇸🇱" },
  { name: "The Gambia", flag: "🇬🇲" },
  { name: "Côte d'Ivoire", flag: "🇨🇮" },
  { name: "Burkina Faso", flag: "🇧🇫" },
  { name: "Guinea", flag: "🇬🇳" },
];

export const SECTORS: string[] = [
  "Tech-for-Good",
  "Youth & Education",
  "Healthcare",
  "Capacity Building",
  "Governance & Policy",
  "Agriculture & Livelihoods",
  "WASH (Water & Sanitation)",
  "Gender & Protection",
];

export const JOB_TYPES: string[] = [
  "Full-time",
  "Contract",
  "Consultancy",
  "Remote",
  "Part-time",
];

export function flagFor(country: string): string {
  return COUNTRIES.find((c) => c.name === country)?.flag ?? "🌍";
}
