import { Job, JobInput, WebhookLog } from "@/lib/types";

const DIRECT_SOURCE = {
  id: "direct",
  name: "West Africa Impact Jobs",
  homepageUrl: "",
};

// In-memory mock database. Resets on server restart — fine for demo purposes.
const jobs: Job[] = [
  {
    id: "1",
    title: "Program Officer, Youth Digital Skills",
    organization: "BuildUp Liberia Foundation",
    country: "Liberia",
    sector: "Tech-for-Good",
    jobType: "Full-time",
    applicationUrl: "https://example.org/careers/program-officer-liberia",
    description:
      "Lead the rollout of digital-literacy bootcamps for out-of-school youth across Montserrado County, coordinating with local tech hubs and donors.",
    postedDate: "2026-07-24",
    closingDate: "2026-08-30",
    archived: false,
    source: DIRECT_SOURCE,
    isExternal: false,
  },
  {
    id: "2",
    title: "Community Health Field Coordinator",
    organization: "Lofa Health Access Network",
    country: "Liberia",
    sector: "Healthcare",
    jobType: "Contract",
    applicationUrl: "https://example.org/careers/health-field-coordinator",
    description:
      "Coordinate mobile health clinics and maternal-health outreach in Lofa County in partnership with district health teams.",
    postedDate: "2026-07-20",
    closingDate: "2026-09-05",
    archived: false,
    source: DIRECT_SOURCE,
    isExternal: false,
  },
  {
    id: "3",
    title: "Monitoring & Evaluation Consultant",
    organization: "West Africa Development Alliance",
    country: "Ghana",
    sector: "Capacity Building",
    jobType: "Consultancy",
    applicationUrl: "https://example.org/careers/me-consultant-ghana",
    description:
      "Design the M&E framework for a 3-year governance strengthening program spanning six regions of Ghana.",
    postedDate: "2026-07-27",
    closingDate: "2026-08-22",
    archived: false,
    source: DIRECT_SOURCE,
    isExternal: false,
  },
  {
    id: "4",
    title: "Girls' Education Project Manager",
    organization: "Bright Futures Ghana",
    country: "Ghana",
    sector: "Youth & Education",
    jobType: "Full-time",
    applicationUrl: "https://example.org/careers/girls-education-pm",
    description:
      "Manage a scholarship and mentorship program for adolescent girls in the Northern Region, including donor reporting and school partnerships.",
    postedDate: "2026-07-18",
    closingDate: "2026-08-31",
    archived: false,
    source: DIRECT_SOURCE,
    isExternal: false,
  },
  {
    id: "5",
    title: "Remote Grants & Compliance Officer",
    organization: "Niger Delta Impact Collective",
    country: "Nigeria",
    sector: "Governance & Policy",
    jobType: "Remote",
    applicationUrl: "https://example.org/careers/grants-compliance-officer",
    description:
      "Support sub-grantee due diligence, donor compliance reporting, and financial monitoring for community-led NGOs across the Niger Delta.",
    postedDate: "2026-07-29",
    closingDate: "2026-09-15",
    archived: false,
    source: DIRECT_SOURCE,
    isExternal: false,
  },
];

const webhookLogs: WebhookLog[] = [
  {
    id: "wh-1",
    source: "ReliefWeb API Connector",
    status: "pending",
    receivedAt: "2026-07-30T09:14:00Z",
    detail: "Live endpoint wired; awaiting an approved ReliefWeb appname to go active.",
  },
  {
    id: "wh-2",
    source: "External Partner Sync",
    status: "success",
    receivedAt: "2026-07-29T18:02:00Z",
    detail: "Refreshed curated sample listings for 6 partner boards without public APIs.",
  },
  {
    id: "wh-3",
    source: "Devex Listings Import",
    status: "failed",
    receivedAt: "2026-07-28T07:45:00Z",
    detail: "No public API/RSS exposed — requires a dedicated scraper connector.",
  },
];

let idCounter = jobs.length + 1;

export function getActiveJobs(): Job[] {
  return jobs.filter((j) => !j.archived).sort((a, b) => (a.postedDate < b.postedDate ? 1 : -1));
}

export function getAllJobs(): Job[] {
  return [...jobs].sort((a, b) => (a.postedDate < b.postedDate ? 1 : -1));
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

export function createJob(input: JobInput): Job {
  const job: Job = {
    ...input,
    id: String(idCounter++),
    postedDate: new Date().toISOString().slice(0, 10),
    archived: false,
    source: DIRECT_SOURCE,
    isExternal: false,
  };
  jobs.unshift(job);
  return job;
}

export function updateJob(id: string, input: Partial<JobInput>): Job | undefined {
  const job = jobs.find((j) => j.id === id);
  if (!job) return undefined;
  Object.assign(job, input);
  return job;
}

export function setArchived(id: string, archived: boolean): Job | undefined {
  const job = jobs.find((j) => j.id === id);
  if (!job) return undefined;
  job.archived = archived;
  return job;
}

export function getWebhookLogs(): WebhookLog[] {
  return webhookLogs;
}

export function pushWebhookLog(log: WebhookLog): void {
  webhookLogs.unshift(log);
}
