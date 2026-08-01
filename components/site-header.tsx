import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { getSessionUserId } from "@/lib/user-session";

export async function SiteHeader() {
  const userId = await getSessionUserId();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <Image
              src="/logo-icon.png"
              alt="West Africa Impact Jobs logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
              West Africa Impact Jobs
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Social-impact &amp; NGO careers across the region
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {userId ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            >
              <UserCircle className="h-4 w-4" />
              <span>My Account</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-slate-600 hover:text-emerald-700 sm:block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
