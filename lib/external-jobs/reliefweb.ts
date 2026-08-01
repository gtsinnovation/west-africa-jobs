import { Job } from "@/lib/types";
import { COUNTRIES } from "@/lib/constants";
import { getSourceMeta } from "@/lib/external-sources";

const WEST_AFRICA_COUNTRIES = COUNTRIES.map((c) => c.name).filter(
  (n) => n !== "All West Africa"
);

interface ReliefWebField {
  title: string;
  source?: { name: string }[];
  country?: { name: string }[];
  theme?: { name: string }[];
  type?: { name: string }[];
  url_alias?: string;
  body?: string;
  date?: { created?: string; closing?: string };
}

interface ReliefWebEntry {
  id: string;
  fields: ReliefWebField;
}

export interface ReliefWebResult {
  jobs: Job[];
  live: boolean;
  error: string | null;
}

/**
 * Live ReliefWeb API connector. ReliefWeb's public API requires a
 * pre-approved `appname` before it will serve traffic. We use the appname
 * provided via env var RELIEFWEB_APPNAME. If ReliefWeb returns 403 (appname
 * not yet approved for this environment) we surface that honestly instead
 * of silently failing.
 */
export async function fetchReliefWebJobs(): Promise<ReliefWebResult> {
  const appname = process.env.RELIEFWEB_APPNAME;
  if (!appname) {
    return { jobs: [], live: false, error: "No RELIEFWEB_APPNAME configured." };
  }

  const source = getSourceMeta("reliefweb")!;
  const params = new URLSearchParams();
  params.set("appname", appname);
  params.set("profile", "list");
  params.set("preset", "latest");
  params.set("slim", "1");
  params.set("limit", "20");
  params.set("filter[field]", "country.name");
  WEST_AFRICA_COUNTRIES.forEach((c) => params.append("filter[value][]", c));

  try {
    const res = await fetch(`https://api.reliefweb.int/v2/jobs?${params.toString()}`, {
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      let message = `ReliefWeb API returned HTTP ${res.status}.`;
      try {
        const errBody = await res.json();
        if (errBody?.error?.message) message = errBody.error.message;
      } catch {
        /* ignore parse errors on error body */
      }
      return { jobs: [], live: false, error: message };
    }

    const data = (await res.json()) as { data?: ReliefWebEntry[] };
    if (!data.data) return { jobs: [], live: true, error: null };

    const jobs = data.data
      .map((entry): Job | null => {
        const f = entry.fields;
        const country = f.country?.[0]?.name;
        const matchedCountry = WEST_AFRICA_COUNTRIES.find((c) => c === country);
        if (!matchedCountry) return null;

        return {
          id: `reliefweb-${entry.id}`,
          title: f.title,
          organization: f.source?.[0]?.name ?? "ReliefWeb Partner",
          country: matchedCountry,
          sector: f.theme?.[0]?.name ?? "Capacity Building",
          jobType: f.type?.[0]?.name ?? "Contract",
          applicationUrl: f.url_alias ?? source.homepageUrl,
          description: (f.body ?? "See full posting on ReliefWeb for details.").slice(0, 400),
          postedDate: (f.date?.created ?? new Date().toISOString()).slice(0, 10),
          closingDate: (f.date?.closing ?? "").slice(0, 10) || "Rolling",
          archived: false,
          source: { id: source.id, name: source.name, homepageUrl: source.homepageUrl },
          isExternal: true,
        };
      })
      .filter((j): j is Job => j !== null);

    return { jobs, live: true, error: null };
  } catch (err) {
    return { jobs: [], live: false, error: err instanceof Error ? err.message : "Fetch failed." };
  }
}
