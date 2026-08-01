import { ExternalSourceMeta } from "@/lib/types";

export const EXTERNAL_SOURCES: ExternalSourceMeta[] = [
  {
    id: "reliefweb",
    name: "ReliefWeb",
    description:
      "UN-administered portal for humanitarian response, disaster relief, and rehabilitation jobs.",
    homepageUrl: "https://reliefweb.int/jobs",
    status: "pending_credentials",
    statusLabel: "Appname configured but rejected (HTTP 403) by ReliefWeb",
    lastSyncedAt: null,
  },
  {
    id: "afrorama",
    name: "Afrorama",
    description:
      "Africa-specific social impact job board covering NGOs, DFIs, and INGOs continent-wide.",
    homepageUrl: "https://www.afrorama.org/",
    status: "live",
    statusLabel: "Live — scraped via Afrorama's public listings feed",
    lastSyncedAt: null,
  },
  {
    id: "ngo-jobs-in-africa",
    name: "NGO Jobs in Africa",
    description:
      "Largest job site focused exclusively on non-profit and NGO vacancies across Africa.",
    homepageUrl: "https://ngojobsinafrica.com/",
    status: "sample",
    statusLabel: "No scrapable public API — proprietary widget, curated sample",
    lastSyncedAt: null,
  },
  {
    id: "wacsi",
    name: "WACSI",
    description:
      "West Africa Civil Society Institute — local civil-society capacity-building roles.",
    homepageUrl: "https://wacsi.org/work-with-us/",
    status: "live",
    statusLabel: "Live — scraped via WACSI's public WordPress REST API",
    lastSyncedAt: null,
  },
  {
    id: "impactpool",
    name: "Impactpool",
    description:
      "Career platform for the international impact sector — UN agencies, climate groups, social enterprises.",
    homepageUrl: "https://www.impactpool.org/",
    status: "live",
    statusLabel: "Live (best-effort) — scraped from Impactpool's public jobs feed",
    lastSyncedAt: null,
  },
  {
    id: "devex",
    name: "Devex",
    description:
      "Premier global development network tracking coordination and technical consultancy roles.",
    homepageUrl: "https://www.devex.com/jobs/search",
    status: "sample",
    statusLabel: "Blocked by anti-bot (DataDome) — curated sample",
    lastSyncedAt: null,
  },
  {
    id: "developmentaid",
    name: "DevelopmentAid",
    description:
      "International consulting job board aggregating long-term roles and SME contracts.",
    homepageUrl: "https://www.developmentaid.org/jobs/search",
    status: "sample",
    statusLabel: "Blocks non-browser requests — curated sample",
    lastSyncedAt: null,
  },
  {
    id: "ctg",
    name: "CTG (Committed to Good)",
    description:
      "Humanitarian enabler recruitment engine for aid programs in conflict-affected regions.",
    homepageUrl: "https://ctg.org/work-with-us/jobs/",
    status: "sample",
    statusLabel: "No public API — proprietary HR widget, curated sample",
    lastSyncedAt: null,
  },
];

export function getSourceMeta(id: string): ExternalSourceMeta | undefined {
  return EXTERNAL_SOURCES.find((s) => s.id === id);
}
