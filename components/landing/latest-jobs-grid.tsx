"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Clock, ArrowUpRight } from "lucide-react";
import { Job } from "@/lib/types";
import { flagFor } from "@/lib/constants";

const SEVENTY_TWO_HOURS_MS = 72 * 60 * 60 * 1000;

export function LatestJobsGrid() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/external-jobs").then((r) => r.json()),
    ])
      .then(([direct, external]: [Job[], Job[]]) => {
        if (cancelled) return;
        const merged = [...direct, ...external];
        setJobs(merged);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const recentJobs = useMemo(() => {
    const now = Date.now();
    return jobs
      .filter((job) => {
        const posted = new Date(job.postedDate).getTime();
        if (Number.isNaN(posted)) return false;
        return now - posted <= SEVENTY_TWO_HOURS_MS;
      })
      .sort((a, b) => (a.postedDate < b.postedDate ? 1 : -1))
      .slice(0, 6);
  }, [jobs]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  if (recentJobs.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-amber-400/40 py-12 text-center text-slate-300">
        No new postings in the last 72 hours — check back soon, or{" "}
        <Link href="/jobs" className="font-semibold text-amber-300 underline">
          browse all listings
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recentJobs.map((job) => {
        const href = job.isExternal ? job.applicationUrl : `/jobs/${job.id}`;
        const isInternalLink = !job.isExternal;
        const content = (
          <>
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-full border border-emerald-400/60 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
                New
              </span>
              <span className="shrink-0 text-xs font-semibold text-amber-300">
                {job.country} {flagFor(job.country)}
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-base font-bold text-white group-hover:text-amber-300">
              {job.title}
            </h3>
            <p className="mt-1 truncate text-xs text-slate-400">{job.organization}</p>
            <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
            </p>
          </>
        );

        const className =
          "group flex flex-col rounded-xl border-2 border-amber-400/50 bg-[#132a52] p-4 shadow-lg transition-all hover:-translate-y-1 hover:border-amber-400";

        return isInternalLink ? (
          <Link key={job.id} href={href} className={className}>
            {content}
          </Link>
        ) : (
          <a
            key={job.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {content}
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-300">
              via {job.source.name}
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </a>
        );
      })}
    </div>
  );
}
