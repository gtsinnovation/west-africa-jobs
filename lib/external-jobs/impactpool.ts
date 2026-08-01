import * as cheerio from "cheerio";
import { Job } from "@/lib/types";
import { getSourceMeta } from "@/lib/external-sources";

const CITY_TO_COUNTRY: Record<string, string> = {
  monrovia: "Liberia",
  lagos: "Nigeria",
  abuja: "Nigeria",
  accra: "Ghana",
  kumasi: "Ghana",
  dakar: "Senegal",
  freetown: "Sierra Leone",
  banjul: "The Gambia",
  abidjan: "Côte d'Ivoire",
  ouagadougou: "Burkina Faso",
  conakry: "Guinea",
  liberia: "Liberia",
  nigeria: "Nigeria",
  ghana: "Ghana",
  senegal: "Senegal",
  "sierra leone": "Sierra Leone",
  gambia: "The Gambia",
  "côte d'ivoire": "Côte d'Ivoire",
  "ivory coast": "Côte d'Ivoire",
  "burkina faso": "Burkina Faso",
  guinea: "Guinea",
};

function matchCountry(location: string): string | null {
  const lower = location.toLowerCase();
  for (const [key, country] of Object.entries(CITY_TO_COUNTRY)) {
    if (lower.includes(key)) return country;
  }
  return null;
}

/**
 * Impactpool's public jobs feed is server-rendered HTML (no client-side
 * fetch required), but it doesn't expose a reliable country query param —
 * so we fetch their live recent-jobs feed and keep only postings whose
 * location text matches a West African country or major city. Best-effort:
 * on any given sync it may return zero matches if no West-Africa-based
 * roles are in their current top feed.
 */
export async function fetchImpactpoolJobs(): Promise<Job[]> {
  const source = getSourceMeta("impactpool")!;

  try {
    const res = await fetch("https://www.impactpool.org/jobs", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WAIJBot/1.0)" },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: Job[] = [];

    $('a[href^="/jobs/"]').each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const title = $(el).find("[type='cardTitle']").first().text().trim();
      const bodyLines = $(el)
        .find("[type='bodyEmphasis']")
        .map((__, node) => $(node).text().trim())
        .get()
        .filter(Boolean);

      if (!title || bodyLines.length === 0) return;

      const organization = bodyLines[0];
      const location = bodyLines[1] ?? "";
      const country = matchCountry(location) ?? matchCountry(title);
      if (!country) return;

      jobs.push({
        id: `impactpool-${href.replace(/[^0-9]/g, "")}`,
        title,
        organization,
        country,
        sector: "Governance & Policy",
        jobType: "Full-time",
        applicationUrl: `https://www.impactpool.org${href}`,
        description: `${organization} is hiring in ${location || country}. See the full posting on Impactpool for requirements and how to apply.`,
        postedDate: new Date().toISOString().slice(0, 10),
        closingDate: "See posting",
        archived: false,
        source: { id: source.id, name: source.name, homepageUrl: source.homepageUrl },
        isExternal: true,
      });
    });

    const uniqueById = new Map(jobs.map((j) => [j.id, j]));
    return [...uniqueById.values()];
  } catch {
    return [];
  }
}
