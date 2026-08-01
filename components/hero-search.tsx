"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { COUNTRIES, SECTORS } from "@/lib/constants";

export function HeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const country = searchParams.get("country") ?? "All West Africa";
  const sector = searchParams.get("sector") ?? "All Sectors";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const isDefault = value === "All West Africa" || value === "All Sectors" || value === "";
      if (isDefault) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/jobs?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <section className="relative overflow-hidden bg-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-emerald-300 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Find your next social-impact role in West Africa
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
          NGO, development, and social-good jobs from Liberia to Nigeria — filtered by
          country, sector, and keyword so you only see what matters to you.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl bg-white p-3 shadow-lg sm:grid-cols-[1fr_1fr_auto] sm:gap-2 sm:p-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:border-0">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
            <Select value={country} onValueChange={(v) => updateParam("country", v)}>
              <SelectTrigger className="border-0 p-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:border-0 sm:border-l sm:border-slate-200 sm:pl-4">
            <Select value={sector} onValueChange={(v) => updateParam("sector", v)}>
              <SelectTrigger className="border-0 p-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sectors">All Sectors</SelectItem>
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:col-span-1"
            onSubmit={(e) => {
              e.preventDefault();
              updateParam("q", query);
            }}
          >
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => updateParam("q", query)}
              placeholder="Job title or keyword…"
              className="border-0 p-0 shadow-none focus-visible:ring-0"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
