import { Insight, InsightInput } from "@/lib/insights-types";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// In-memory store, seeded with representative launch content. Fully
// admin-editable from /admin/dashboard → Insights.
const insights: Insight[] = [
  {
    id: "1",
    slug: "hiring-trends-west-africa-2026",
    title: "Hiring Trends Across West Africa's Social-Impact Sector in 2026",
    summary:
      "Tech-for-good and climate-resilience roles are growing fastest, while NGO administrative hiring has plateaued. Here's what employers are prioritizing this year.",
    content:
      "Across Liberia, Ghana, Nigeria, and Senegal, we're seeing sustained demand for roles that blend technical skill with grassroots program delivery — data-for-development officers, digital-literacy trainers, and MEL (Monitoring, Evaluation & Learning) specialists top the list.\n\nDonor priorities are shifting too: climate adaptation and resilience funding has grown significantly, which is translating into new consultancy and project-management openings across the Sahel.\n\nFor job seekers, the clearest signal is this — pairing a technical skill (data analysis, GIS, digital tools) with sector expertise (health, education, governance) makes candidates dramatically more competitive than generalist profiles.",
    category: "Market Trends",
    coverImageUrl: null,
    published: true,
    publishedDate: "2026-07-20",
    updatedAt: "2026-07-20",
  },
  {
    id: "2",
    slug: "writing-a-standout-ngo-cover-letter",
    title: "How to Write a Cover Letter That Gets Shortlisted for NGO Roles",
    summary:
      "Recruiters at development organizations read hundreds of applications. Here's the structure that consistently gets candidates to interview.",
    content:
      "1. Open with impact, not biography. Lead with a specific result you drove, not a summary of your career.\n\n2. Mirror the job description's language. Most NGOs use applicant tracking systems — using their exact terminology for sectors and skills matters.\n\n3. Address the local context directly. If you have experience in the specific country or region, say so in the first paragraph.\n\n4. Keep it to one page. Recruiters at organizations like WACSI and UNICEF report that concise, well-structured letters get read in full far more often than dense ones.\n\n5. Close with availability and flexibility — many roles need candidates who can start quickly or travel within the region.",
    category: "Career Advice",
    coverImageUrl: null,
    published: true,
    publishedDate: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: "3",
    slug: "spotlight-wash-sector-guinea-sierra-leone",
    title: "Sector Spotlight: WASH Roles Are Surging in Guinea and Sierra Leone",
    summary:
      "New multi-year water-infrastructure funding is creating a wave of technical and community-engagement roles across the region.",
    content:
      "Water, Sanitation, and Hygiene (WASH) programming has seen a marked increase in funded positions this year, particularly technical coordinator and community engagement roles supporting rural water-systems rehabilitation.\n\nOrganizations are increasingly looking for candidates who combine engineering or public-health backgrounds with strong community-liaison skills, since these programs depend heavily on local buy-in and behavior-change work alongside the infrastructure itself.\n\nIf you have a WASH background, now is an especially strong time to be active in the West Africa job market.",
    category: "Sector Spotlight",
    coverImageUrl: null,
    published: true,
    publishedDate: "2026-07-10",
    updatedAt: "2026-07-10",
  },
];

let idCounter = insights.length + 1;

export function getPublishedInsights(): Insight[] {
  return insights
    .filter((i) => i.published)
    .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export function getAllInsights(): Insight[] {
  return [...insights].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export function getInsightBySlug(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug && i.published);
}

export function getInsightById(id: string): Insight | undefined {
  return insights.find((i) => i.id === id);
}

export function createInsight(input: InsightInput): Insight {
  const baseSlug = slugify(input.title) || `insight-${idCounter}`;
  let slug = baseSlug;
  let n = 2;
  while (insights.some((i) => i.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }

  const now = new Date().toISOString().slice(0, 10);
  const insight: Insight = {
    ...input,
    id: String(idCounter++),
    slug,
    publishedDate: now,
    updatedAt: now,
  };
  insights.unshift(insight);
  return insight;
}

export function updateInsight(id: string, input: Partial<InsightInput>): Insight | undefined {
  const insight = insights.find((i) => i.id === id);
  if (!insight) return undefined;
  Object.assign(insight, input, { updatedAt: new Date().toISOString().slice(0, 10) });
  return insight;
}

export function setPublished(id: string, published: boolean): Insight | undefined {
  const insight = insights.find((i) => i.id === id);
  if (!insight) return undefined;
  insight.published = published;
  insight.updatedAt = new Date().toISOString().slice(0, 10);
  return insight;
}
