import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getInsightBySlug } from "@/lib/insights";

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b1d3a]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/insights"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-amber-300 hover:text-amber-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Insights
        </Link>

        <div className="rounded-xl border-2 border-amber-400/50 bg-[#132a52] p-6 shadow-lg sm:p-8">
          <span className="inline-flex w-fit items-center rounded-full border border-amber-400/60 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
            {insight.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{insight.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            Published {insight.publishedDate}
            {insight.updatedAt !== insight.publishedDate && ` · updated ${insight.updatedAt}`}
          </p>

          {insight.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={insight.coverImageUrl}
              alt=""
              className="mt-5 w-full rounded-lg border border-amber-400/30 object-cover"
            />
          )}

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200">
            {insight.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
