import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-xs text-slate-400 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <span>
          © 2026 West Africa Impact Jobs — connecting talent to purpose across the region.
        </span>
        <Link href="/admin" className="font-medium text-slate-400 hover:text-emerald-700 hover:underline">
          Staff Only
        </Link>
      </div>
    </footer>
  );
}
