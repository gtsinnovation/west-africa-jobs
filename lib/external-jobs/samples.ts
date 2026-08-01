import { Job } from "@/lib/types";
import { getSourceMeta } from "@/lib/external-sources";

function src(id: string) {
  const s = getSourceMeta(id)!;
  return { id: s.id, name: s.name, homepageUrl: s.homepageUrl };
}

/**
 * Curated, representative sample listings for the partner boards that we
 * confirmed CANNOT be reliably live-scraped (verified by direct inspection):
 *  - NGO Jobs in Africa: listings render via a proprietary JS widget with no
 *    exposed public API (their WordPress REST API only serves generic
 *    pages/posts, not the job board data).
 *  - Devex: fronted by DataDome anti-bot/CAPTCHA — returns a JS challenge
 *    page to any non-browser request.
 *  - DevelopmentAid: blocks non-browser requests outright (empty response).
 *  - CTG: job listings are rendered by a client-side widget backed by their
 *    "Tayo" HR platform with no public API surface.
 * These are illustrative samples — not scraped live — clearly tagged with a
 * "Sample listing" badge, each linking through to the real partner job board.
 */
export function getSampleExternalJobs(): Job[] {
  return [
    {
      id: "ext-ngojobsinafrica-1",
      title: "Community Development Officer",
      organization: "Freetown Relief Network",
      country: "Sierra Leone",
      sector: "Capacity Building",
      jobType: "Contract",
      applicationUrl: "https://ngojobsinafrica.com/",
      description:
        "Sample listing — coordinate community-led development committees in the Western Area. View live openings on NGO Jobs in Africa.",
      postedDate: "2026-07-26",
      closingDate: "Rolling",
      archived: false,
      source: src("ngo-jobs-in-africa"),
      isExternal: true,
    },
    {
      id: "ext-ngojobsinafrica-2",
      title: "Medical/Health Program Officer",
      organization: "Gambia River Health Alliance",
      country: "The Gambia",
      sector: "Healthcare",
      jobType: "Full-time",
      applicationUrl: "https://ngojobsinafrica.com/",
      description:
        "Sample listing — oversee a maternal-health program across riverine communities. View live openings on NGO Jobs in Africa.",
      postedDate: "2026-07-21",
      closingDate: "Rolling",
      archived: false,
      source: src("ngo-jobs-in-africa"),
      isExternal: true,
    },
    {
      id: "ext-devex-1",
      title: "Technical Coordinator, WASH Systems",
      organization: "International Development Consortium",
      country: "Guinea",
      sector: "WASH (Water & Sanitation)",
      jobType: "Consultancy",
      applicationUrl: "https://www.devex.com/jobs/search",
      description:
        "Sample listing — lead technical assistance for rural water-systems rehabilitation. View live openings on Devex.",
      postedDate: "2026-07-23",
      closingDate: "Rolling",
      archived: false,
      source: src("devex"),
      isExternal: true,
    },
    {
      id: "ext-developmentaid-1",
      title: "Short-Term Subject-Matter Expert, Agribusiness",
      organization: "Global Agriculture Advisory Group",
      country: "The Gambia",
      sector: "Agriculture & Livelihoods",
      jobType: "Consultancy",
      applicationUrl: "https://www.developmentaid.org/jobs/search",
      description:
        "Sample listing — short-term SME contract supporting smallholder value-chain development. View live openings on DevelopmentAid.",
      postedDate: "2026-07-20",
      closingDate: "Rolling",
      archived: false,
      source: src("developmentaid"),
      isExternal: true,
    },
    {
      id: "ext-ctg-1",
      title: "Field Operations Associate",
      organization: "CTG Field Programs",
      country: "Liberia",
      sector: "Capacity Building",
      jobType: "Contract",
      applicationUrl: "https://ctg.org/work-with-us/jobs/",
      description:
        "Sample listing — support humanitarian field-team logistics and duty-of-care operations. View live openings on CTG.",
      postedDate: "2026-07-24",
      closingDate: "Rolling",
      archived: false,
      source: src("ctg"),
      isExternal: true,
    },
    {
      id: "ext-ctg-2",
      title: "Monitoring & Evaluation Associate",
      organization: "CTG Field Programs",
      country: "Burkina Faso",
      sector: "Capacity Building",
      jobType: "Contract",
      applicationUrl: "https://ctg.org/work-with-us/jobs/",
      description:
        "Sample listing — track results for a multi-country stabilization program. View live openings on CTG.",
      postedDate: "2026-07-17",
      closingDate: "Rolling",
      archived: false,
      source: src("ctg"),
      isExternal: true,
    },
  ];
}
