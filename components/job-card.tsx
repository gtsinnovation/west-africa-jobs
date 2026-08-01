"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, Briefcase, Layers, Check, Globe2, MapPin } from "lucide-react";
import { Job } from "@/lib/types";
import { flagFor } from "@/lib/constants";

interface JobCardProps {
  job: Job;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.5.05-1 .25-3.36-.7-2.84-1.15-4.66-4.06-4.8-4.25-.14-.19-1.15-1.53-1.15-2.92s.72-2.07 1-2.35c.26-.28.56-.35.75-.35h.53c.17 0 .4-.03.62.47.24.55.8 1.9.87 2.04.07.14.11.3.02.49-.09.19-.14.3-.28.46-.14.16-.3.36-.42.48-.14.14-.29.29-.13.57.17.28.75 1.24 1.6 2 1.1.98 2.03 1.29 2.31 1.43.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.86c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

export function JobCard({ job }: JobCardProps) {
  const [copiedFb, setCopiedFb] = useState(false);
  const flag = flagFor(job.country);
  const jobUrl = useMemo(() => {
    if (job.isExternal) return job.applicationUrl;
    if (typeof window === "undefined") return `/jobs/${job.id}`;
    return `${window.location.origin}/jobs/${job.id}`;
  }, [job.id, job.isExternal, job.applicationUrl]);

  const postedLabel = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
    } catch {
      return job.postedDate;
    }
  }, [job.postedDate]);

  const shareWhatsApp = () => {
    const text = `${job.title} at ${job.organization} (${job.country}) — ${jobUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=600"
    );
    setCopiedFb(true);
    setTimeout(() => setCopiedFb(false), 1500);
  };

  const titleContent = (
    <h3 className="text-lg font-bold leading-snug text-slate-800 group-hover:text-emerald-700 sm:text-xl">
      {job.title}
    </h3>
  );

  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-slate-500">{job.organization}</span>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
          {job.country} {flag}
        </span>
      </div>

      {job.isExternal ? (
        <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 block">
          {titleContent}
        </a>
      ) : (
        <Link href={`/jobs/${job.id}`} className="mt-1.5 block">
          {titleContent}
        </Link>
      )}

      {job.city && (
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          {job.city}, {job.country}
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          <Briefcase className="h-3.5 w-3.5" />
          {job.jobType}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          <Layers className="h-3.5 w-3.5" />
          {job.sector}
        </span>
        {job.isExternal ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
            <Globe2 className="h-3.5 w-3.5" />
            via {job.source.name}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Direct listing
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-500">{job.description}</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          Posted {postedLabel}
        </span>
        <a
          href={job.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          Apply Now
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={shareWhatsApp}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#1DA851] sm:flex-none sm:px-3"
        >
          <WhatsAppIcon />
          Share on WhatsApp
        </button>
        <button
          onClick={shareFacebook}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2] sm:flex-none sm:px-3"
        >
          {copiedFb ? <Check className="h-4 w-4" /> : <FacebookIcon />}
          Share on Facebook
        </button>
      </div>
    </article>
  );
}
