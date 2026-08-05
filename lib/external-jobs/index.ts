import { Job } from "@/lib/types";
import { fetchReliefWebJobs } from "@/lib/external-jobs/reliefweb";
import { fetchAfroramaJobs } from "@/lib/external-jobs/afrorama";
import { fetchWacsiJobs } from "@/lib/external-jobs/wacsi";
import { fetchImpactpoolJobs } from "@/lib/external-jobs/impactpool";
import { getSampleExternalJobs } from "@/lib/external-jobs/samples";

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface SyncState {
  jobs: Job[];
  fetchedAt: number;
  reliefWebLive: boolean;
  reliefWebError: string | null;
  afroramaCount: number;
  wacsiCount: number;
  impactpoolCount: number;
}

let cache: SyncState | null = null;

export async function getExternalJobs(forceRefresh = false): Promise<Job[]> {
  const isFresh = cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS;
  if (isFresh && !forceRefresh) {
    return cache!.jobs;
  }

  const [reliefWeb, afrorama, wacsi, impactpool] = await Promise.all([
    fetchReliefWebJobs(),
    fetchAfroramaJobs(),
    fetchWacsiJobs(),
    fetchImpactpoolJobs(),
  ]);

  const jobs = [
    ...reliefWeb.jobs,
    ...afrorama,
    ...wacsi,
    ...impactpool,
    ...getSampleExternalJobs(),
  ];

  cache = {
    jobs,
    fetchedAt: Date.now(),
    reliefWebLive: reliefWeb.live,
    reliefWebError: reliefWeb.error,
    afroramaCount: afrorama.length,
    wacsiCount: wacsi.length,
    impactpoolCount: impactpool.length,
  };

  return jobs;
}

export function getSyncState(): SyncState | null {
  return cache;
}
