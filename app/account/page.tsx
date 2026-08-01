import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AccountPanel } from "@/components/auth/account-panel";

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <AccountPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
