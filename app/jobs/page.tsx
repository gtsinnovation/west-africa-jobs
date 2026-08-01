import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSearch } from "@/components/hero-search";
import { ActiveFilters } from "@/components/active-filters";
import { JobFeed } from "@/components/job-feed";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <Suspense fallback={<div className="h-64 bg-slate-800" />}>
        <HeroSearch />
      </Suspense>
      <Suspense fallback={null}>
        <ActiveFilters />
      </Suspense>
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
          }
        >
          <JobFeed />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
