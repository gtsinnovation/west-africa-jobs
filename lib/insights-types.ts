export interface Insight {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  coverImageUrl: string | null;
  published: boolean;
  publishedDate: string;
  updatedAt: string;
}

export type InsightInput = Omit<Insight, "id" | "slug" | "publishedDate" | "updatedAt">;

export const INSIGHT_CATEGORIES = [
  "Market Trends",
  "Career Advice",
  "Sector Spotlight",
  "Employer Guides",
  "Policy & Funding",
] as const;
