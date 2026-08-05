import { Job } from "@/lib/types";
import { getSourceMeta } from "@/lib/external-sources";

// Afrorama's Supabase REST endpoint (public anon key)
const SUPABASE_URL = "https://vqchwioyhyiuunpyildz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_HeGZfQZEDI_IR46a2Ezp-Q_tIUdhF6_";

const COUNTRY_CODE_MAP: Record<string, string> = {
  LR: "Liberia",
  NG: "Nigeria",
  GH: "Ghana",
  SN: "Senegal",
  SL: "Sierra Leone",
  GM: "The Gambia",
  CI: "Côte d'Ivoire",
  BF: "Burkina Faso",
  GN: "Guinea",
};

const SECTOR_MAP: Record<string, string> = {
  "Agriculture & Food Security": "Agriculture & Livelihoods",
  "Climate & Environment": "Governance & Policy",
  Education: "Youth & Education",
  "Finance & Economics": "Governance & Policy",
  "Gender & Social Inclusion": "Gender & Protection",
  "Governance & Public Policy": "Governance & Policy",
  Health: "Healthcare",
  "Human Rights": "Gender & Protection",
  "Infrastructure & Urban Development": "Capacity Building",
  "Innovation & Technology": "Tech-for-Good",
  Peacebuilding: "Governance & Policy",
  "Private Sector Development": "Capacity Building",
  "Youth & Employment": "Youth & Education",
};

const TYPE_MAP: Record<string, string> = {
  jobs: "Full-time",
  consultancy: "Consultancy",
  internship: "Contract",
  capacity: "Contract",
};

interface AfroramaListing {
  id: string;
  title: string;
  organisation: string;
  type: string | null;
  sector: string | null;
  country: string | null;
  posted: string | null;
  deadline: string | null;
  apply_url: string | null;
  description: string | null;
}

export async function fetchAfroramaJobs(): Promise<Job[]> {
  const source = getSourceMeta("afrorama")!;
  const codes = Object.keys(COUNTRY_CODE_MAP).join(",");
  const params = new URLSearchParams({
    select: "id,title,organisation,type,sector,country,posted,deadline,apply_url,description",
    country: `in.(${codes})`,
    order: "posted.desc.nullslast",
    limit: "20",
  });

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/listings?${params.toString()}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];

    const rows = (await res.json()) as AfroramaListing[];
    return rows.map((row): Job => {
      const country = (row.country && COUNTRY_CODE_MAP[row.country]) || "Nigeria";
      return {
        id: `afrorama-${row.id}`,
        title: row.title,
        organization: row.organisation,
        country,
        sector: (row.sector && SECTOR_MAP[row.sector]) || "Capacity Building",
        jobType: (row.type && TYPE_MAP[row.type]) || "Full-time",
        applicationUrl: row.apply_url ?? source.homepageUrl,
        description:
          row.description?.split("─────")[0].trim() ||
          "See the full posting on Afrorama for details.",
        postedDate: (row.posted ?? new Date().toISOString()).slice(0, 10),
        closingDate: (row.deadline ?? "").slice(0, 10) || "Rolling",
        archived: false,
        source: { id: source.id, name: source.name, homepageUrl: source.homepageUrl },
        isExternal: true,
      };
    });
  } catch {
    return [];
  }
}
