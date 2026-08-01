import { Job } from "@/lib/types";
import { COUNTRIES } from "@/lib/constants";
import { getSourceMeta } from "@/lib/external-sources";

const WEST_AFRICA_COUNTRIES = COUNTRIES.map((c) => c.name).filter(
  (n) => n !== "All West Africa"
);

const OPPORTUNITY_TITLE_RE =
  /call for applications|vacanc|recruitment|consultan|internship programme|job opening|fellowship/i;

interface WpPost {
  id: number;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&#8230;|&hellip;/g, "…").trim();
}

function detectCountry(text: string): string | null {
  const lower = text.toLowerCase();
  return (
    WEST_AFRICA_COUNTRIES.find((c) => lower.includes(c.toLowerCase())) ?? null
  );
}

/**
 * Live WACSI connector. WACSI runs on WordPress, which exposes a public,
 * read-only REST API at /wp-json/wp/v2/posts. We search their real posts
 * feed for opportunity-shaped announcements — the same content WACSI
 * publishes under Work With Us — filter out unrelated news matches, and
 * heuristically tag each with whichever West African country is mentioned
 * in the title/excerpt (defaulting to Ghana, WACSI's HQ, when none is).
 */
export async function fetchWacsiJobs(): Promise<Job[]> {
  const source = getSourceMeta("wacsi")!;
  const queries = ["Call for Applications", "Vacancy", "Consultant", "Fellowship"];

  try {
    const results = await Promise.all(
      queries.map(async (q) => {
        const params = new URLSearchParams({
          search: q,
          per_page: "8",
          orderby: "date",
          order: "desc",
          _fields: "id,link,date,title,excerpt",
        });
        const res = await fetch(`https://wacsi.org/wp-json/wp/v2/posts?${params.toString()}`, {
          next: { revalidate: 900 },
        });
        if (!res.ok) return [];
        return (await res.json()) as WpPost[];
      })
    );

    const seen = new Set<number>();
    const posts = results.flat().filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return OPPORTUNITY_TITLE_RE.test(stripHtml(p.title.rendered));
    });

    return posts.map((post): Job => {
      const title = stripHtml(post.title.rendered);
      const excerpt = stripHtml(post.excerpt.rendered);
      const country = detectCountry(`${title} ${excerpt}`) ?? "Ghana";

      return {
        id: `wacsi-${post.id}`,
        title,
        organization: "WACSI",
        country,
        sector: "Capacity Building",
        jobType: /consultan/i.test(title) ? "Consultancy" : "Contract",
        applicationUrl: post.link,
        description: excerpt || "See the full call for applications on WACSI's website.",
        postedDate: post.date.slice(0, 10),
        closingDate: "See posting",
        archived: false,
        source: { id: source.id, name: source.name, homepageUrl: source.homepageUrl },
        isExternal: true,
      };
    });
  } catch {
    return [];
  }
}
