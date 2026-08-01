"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { flagFor } from "@/lib/constants";

export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const country = searchParams.get("country");
  const sector = searchParams.get("sector");
  const q = searchParams.get("q");

  const badges: { key: string; label: string }[] = [];
  if (country) badges.push({ key: "country", label: `${flagFor(country)} ${country}` });
  if (sector) badges.push({ key: "sector", label: sector });
  if (q) badges.push({ key: "q", label: `"${q}"` });

  if (badges.length === 0) return null;

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-4 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Active filters
      </span>
      {badges.map((b) => (
        <button
          key={b.key}
          onClick={() => removeParam(b.key)}
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 transition-colors hover:bg-emerald-100"
        >
          {b.label}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        onClick={() => router.push("/jobs", { scroll: false })}
        className="ml-1 text-sm font-medium text-slate-500 underline decoration-dotted underline-offset-2 hover:text-slate-700"
      >
        Clear all
      </button>
    </div>
  );
}
