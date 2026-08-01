export interface JobSource {
  id: string;
  name: string;
  homepageUrl: string;
}

export interface Job {
  id: string;
  title: string;
  organization: string;
  country: string;
  sector: string;
  jobType: string;
  applicationUrl: string;
  description: string;
  postedDate: string;
  closingDate: string;
  archived: boolean;
  source: JobSource;
  isExternal: boolean;
}

export type JobInput = Omit<
  Job,
  "id" | "postedDate" | "archived" | "source" | "isExternal"
>;

export interface CountryOption {
  name: string;
  flag: string;
}

export type ExternalSourceStatus = "live" | "pending_credentials" | "sample";

export interface ExternalSourceMeta {
  id: string;
  name: string;
  description: string;
  homepageUrl: string;
  status: ExternalSourceStatus;
  statusLabel: string;
  lastSyncedAt: string | null;
}

export interface WebhookLog {
  id: string;
  source: string;
  status: "success" | "failed" | "pending";
  receivedAt: string;
  detail: string;
}
