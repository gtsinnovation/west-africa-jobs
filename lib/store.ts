import { prisma } from "@/lib/prisma";
import { Job, JobInput, JobSource, WebhookLog } from "@/lib/types";
import type { Job as JobRow, WebhookLog as WebhookLogRow } from "@prisma/client";

function toJob(row: JobRow): Job {
  const source: JobSource = {
    id: row.sourceId,
    name: row.sourceName,
    homepageUrl: row.sourceHomepageUrl,
  };
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    city: row.city ?? undefined,
    country: row.country,
    sector: row.sector,
    jobType: row.jobType,
    applicationUrl: row.applicationUrl,
    description: row.description,
    postedDate: row.postedDate,
    closingDate: row.closingDate,
    archived: row.archived,
    source,
    isExternal: row.isExternal,
  };
}

function toWebhookLog(row: WebhookLogRow): WebhookLog {
  return {
    id: row.id,
    source: row.source,
    status: row.status as WebhookLog["status"],
    receivedAt: row.receivedAt.toISOString(),
    detail: row.detail,
  };
}

export async function getActiveJobs(): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: { archived: false },
    orderBy: { postedDate: "desc" },
  });
  return rows.map(toJob);
}

export async function getAllJobs(): Promise<Job[]> {
  const rows = await prisma.job.findMany({ orderBy: { postedDate: "desc" } });
  return rows.map(toJob);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const row = await prisma.job.findUnique({ where: { id } });
  return row ? toJob(row) : undefined;
}

export async function createJob(input: JobInput): Promise<Job> {
  const row = await prisma.job.create({
    data: {
      title: input.title,
      organization: input.organization,
      city: input.city ?? null,
      country: input.country,
      sector: input.sector,
      jobType: input.jobType,
      applicationUrl: input.applicationUrl,
      description: input.description,
      postedDate: new Date().toISOString().slice(0, 10),
      closingDate: input.closingDate,
      archived: false,
      sourceId: "direct",
      sourceName: "West Africa Impact Jobs",
      sourceHomepageUrl: "",
      isExternal: false,
    },
  });
  return toJob(row);
}

export async function updateJob(
  id: string,
  input: Partial<JobInput>
): Promise<Job | undefined> {
  try {
    const row = await prisma.job.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.organization !== undefined && { organization: input.organization }),
        ...(input.city !== undefined && { city: input.city }),
        ...(input.country !== undefined && { country: input.country }),
        ...(input.sector !== undefined && { sector: input.sector }),
        ...(input.jobType !== undefined && { jobType: input.jobType }),
        ...(input.applicationUrl !== undefined && { applicationUrl: input.applicationUrl }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.closingDate !== undefined && { closingDate: input.closingDate }),
      },
    });
    return toJob(row);
  } catch {
    return undefined;
  }
}

export async function setArchived(id: string, archived: boolean): Promise<Job | undefined> {
  try {
    const row = await prisma.job.update({ where: { id }, data: { archived } });
    return toJob(row);
  } catch {
    return undefined;
  }
}

export async function getWebhookLogs(): Promise<WebhookLog[]> {
  const rows = await prisma.webhookLog.findMany({
    orderBy: { receivedAt: "desc" },
    take: 50,
  });
  return rows.map(toWebhookLog);
}

export async function pushWebhookLog(log: WebhookLog): Promise<void> {
  await prisma.webhookLog.create({
    data: {
      source: log.source,
      status: log.status,
      receivedAt: new Date(log.receivedAt),
      detail: log.detail,
    },
  });
}
