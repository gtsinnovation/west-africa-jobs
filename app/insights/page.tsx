import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getPublishedInsights } from "@/lib/insights";

export default async function InsightsPage() {
  const insights = await getPublishedInsights();

  return (
    <div className="min-h-screen bg-[#0b1d3a]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-amber-300 hover:text-amber-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-amber-400 bg-[#132a52] text-amber-300">
            <Newspaper className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Insights &amp; Resources</h1>
            <p className="text-sm text-slate-300">
              Market trends, career advice, and sector spotlights for the West Africa social-impact job market.
            </p>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-amber-400/40 py-16 text-center text-slate-300">
            No insights published yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <Link
                key={insight.id}
                href={`/insights/${insight.slug}`}
                className="group flex flex-col rounded-xl border-2 border-amber-400/50 bg-[#132a52] p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-amber-400"
              >
                <span className="mb-3 inline-flex w-fit items-center rounded-full border border-amber-400/60 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  {insight.category}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300">
                  {insight.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-300">
                  {insight.summary}
                </p>
                <p className="mt-4 text-xs text-slate-400">{insight.publishedDate}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
