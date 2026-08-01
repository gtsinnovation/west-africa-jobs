import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Clock, Briefcase, Layers, Calendar, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getJobById } from "@/lib/store";
import { flagFor } from "@/lib/constants";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job || job.archived) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all listings
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm font-semibold text-slate-500">{job.organization}</span>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {job.country} {flagFor(job.country)}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">{job.title}</h1>

          {job.city && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
              <MapPin className="h-4 w-4" />
              {job.city}, {job.country}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <Briefcase className="h-3.5 w-3.5" />
              {job.jobType}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <Layers className="h-3.5 w-3.5" />
              {job.sector}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <Clock className="h-3.5 w-3.5" />
              Posted {job.postedDate}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <Calendar className="h-3.5 w-3.5" />
              Closes {job.closingDate}
            </span>
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {job.description}
          </p>

          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Apply Now
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
