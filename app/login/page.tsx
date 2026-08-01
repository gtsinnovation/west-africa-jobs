import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <LoginForm />
      </div>
      <SiteFooter />
    </div>
  );
}
