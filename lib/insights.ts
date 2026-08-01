import { prisma } from "@/lib/prisma";
import { Insight, InsightInput } from "@/lib/insights-types";
import type { Insight as InsightRow } from "@prisma/client";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toInsight(row: InsightRow): Insight {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    category: row.category,
    coverImageUrl: row.coverImageUrl,
    published: row.published,
    publishedDate: row.publishedDate,
    updatedAt: row.updatedAt,
  };
}

export async function getPublishedInsights(): Promise<Insight[]> {
  const rows = await prisma.insight.findMany({
    where: { published: true },
    orderBy: { publishedDate: "desc" },
  });
  return rows.map(toInsight);
}

export async function getAllInsights(): Promise<Insight[]> {
  const rows = await prisma.insight.findMany({ orderBy: { publishedDate: "desc" } });
  return rows.map(toInsight);
}

export async function getInsightBySlug(slug: string): Promise<Insight | undefined> {
  const row = await prisma.insight.findFirst({ where: { slug, published: true } });
  return row ? toInsight(row) : undefined;
}

export async function getInsightById(id: string): Promise<Insight | undefined> {
  const row = await prisma.insight.findUnique({ where: { id } });
  return row ? toInsight(row) : undefined;
}

export async function createInsight(input: InsightInput): Promise<Insight> {
  const baseSlug = slugify(input.title) || "insight";
  let slug = baseSlug;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.insight.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${n++}`;
  }

  const now = new Date().toISOString().slice(0, 10);
  const row = await prisma.insight.create({
    data: {
      slug,
      title: input.title,
      summary: input.summary,
      content: input.content,
      category: input.category,
      coverImageUrl: input.coverImageUrl,
      published: input.published,
      publishedDate: now,
      updatedAt: now,
    },
  });
  return toInsight(row);
}

export async function updateInsight(
  id: string,
  input: Partial<InsightInput>
): Promise<Insight | undefined> {
  try {
    const row = await prisma.insight.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.summary !== undefined && { summary: input.summary }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.coverImageUrl !== undefined && { coverImageUrl: input.coverImageUrl }),
        ...(input.published !== undefined && { published: input.published }),
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    });
    return toInsight(row);
  } catch {
    return undefined;
  }
}

export async function setPublished(
  id: string,
  published: boolean
): Promise<Insight | undefined> {
  try {
    const row = await prisma.insight.update({
      where: { id },
      data: { published, updatedAt: new Date().toISOString().slice(0, 10) },
    });
    return toInsight(row);
  } catch {
    return undefined;
  }
}
