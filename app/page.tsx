import {
  Briefcase,
  Newspaper,
  UserPlus,
  ShieldCheck,
  Sparkles,
  Globe2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TopicCard } from "@/components/landing/topic-card";
import { LatestJobsGrid } from "@/components/landing/latest-jobs-grid";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b1d3a]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-amber-400/30">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Liberia · Nigeria · Ghana · Senegal · Sierra Leone &amp; more
          </span>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Purpose-driven careers,{" "}
            <span className="text-amber-300">built for West Africa</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            The consolidated home for NGO, development, and social-impact jobs across the
            region — plus the market insight to help you land the right role.
          </p>
        </div>
      </section>

      {/* Topic grid */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-amber-300">
          Where would you like to go?
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TopicCard
            href="/jobs"
            icon={Briefcase}
            title="Browse All Jobs"
            description="Filter by country, sector, and keyword across every listing on the platform."
          />
          <TopicCard
            href="/insights"
            icon={Newspaper}
            title="Insights & Resources"
            description="Market trends, career advice, and sector spotlights from across the region."
          />
          <TopicCard
            href="/signup"
            icon={UserPlus}
            title="Create Your Account"
            description="Save your resume, verify your email, and apply faster to roles you care about."
          />
          <TopicCard
            href="/jobs?sector=Governance+%26+Policy"
            icon={Globe2}
            title="Governance & Policy Roles"
            description="Explore openings in public policy, advocacy, and institutional strengthening."
          />
          <TopicCard
            href="/jobs?sector=Healthcare"
            icon={Sparkles}
            title="Healthcare & WASH"
            description="Community health, WASH, and public-health program roles across the region."
          />
          <TopicCard
            href="/admin"
            icon={ShieldCheck}
            title="Staff Portal"
            description="Manage listings, partner sync status, and published insights."
          />
        </div>
      </section>

      {/* Latest postings */}
      <section className="border-t-2 border-amber-400/30 bg-[#0a1830] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest Postings</h2>
              <p className="mt-1 text-sm text-slate-300">
                New roles added in the last 72 hours, across direct and partner listings.
              </p>
            </div>
          </div>
          <LatestJobsGrid />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
