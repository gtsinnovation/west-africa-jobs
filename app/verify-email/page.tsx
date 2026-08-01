import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <VerifyEmailPanel />
      </div>
      <SiteFooter />
    </div>
  );
}
