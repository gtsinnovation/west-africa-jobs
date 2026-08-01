"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, SearchX, RefreshCw } from "lucide-react";
import { Job } from "@/lib/types";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 5;
let cachedJobs: Job[] | null = null;

async function fetchJobs(): Promise<Job[]> {
  if (cachedJobs) return cachedJobs;
  const [directRes, externalRes] = await Promise.all([
    fetch("/api/jobs", { cache: "force-cache" }),
    fetch("/api/external-jobs", { cache: "force-cache" }),
  ]);
  if (!directRes.ok) throw new Error("Failed to load jobs");
  const direct = (await directRes.json()) as Job[];
  const external = externalRes.ok ? ((await externalRes.json()) as Job[]) : [];
  const merged = [...direct, ...external].sort((a, b) =>
    a.postedDate < b.postedDate ? 1 : -1
  );
  cachedJobs = merged;
  return merged;
}

export function JobFeed() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const country = searchParams.get("country");
  const sector = searchParams.get("sector");
  const q = searchParams.get("q")?.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchJobs()
      .then((data) => {
        if (!cancelled) setJobs(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [country, sector, q]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (country && country !== "All West Africa" && job.country !== country) return false;
      if (sector && job.sector !== sector) return false;
      if (q && !`${job.title} ${job.organization}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [jobs, country, sector, q]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const externalCount = filtered.filter((j) => j.isExternal).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <p className="text-sm text-slate-500">Couldn&apos;t load listings. Check your connection.</p>
        <Button
          variant="outline"
          onClick={() => {
            cachedJobs = null;
            setLoading(true);
            fetchJobs()
              .then(setJobs)
              .catch(() => setError(true))
              .finally(() => setLoading(false));
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <SearchX className="h-8 w-8 text-slate-300" />
        <p className="font-medium text-slate-600">No listings match your filters</p>
        <p className="text-sm text-slate-400">Try a different country, sector, or keyword.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
        {externalCount > 0 && (
          <span className="ml-1 text-slate-400">
            · {externalCount} aggregated from partner boards
          </span>
        )}
      </p>
      {visible.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
            <Loader2 className="mr-2 h-4 w-4" />
            Load more jobs
          </Button>
        </div>
      )}
    </div>
  );
}
