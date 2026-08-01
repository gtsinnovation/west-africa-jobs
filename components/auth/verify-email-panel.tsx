"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token was provided.");
      return;
    }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "Verification failed.");
          return;
        }
        setStatus("success");
        setMessage(`${data.email} has been verified.`);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <span
          className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
            status === "success"
              ? "bg-emerald-100 text-emerald-700"
              : status === "error"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          {status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
          {status === "success" && <CheckCircle2 className="h-6 w-6" />}
          {status === "error" && <XCircle className="h-6 w-6" />}
        </span>
        <CardTitle className="text-xl text-slate-800">
          {status === "loading" && "Verifying your email…"}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-slate-500">{message}</p>
        {status === "success" && (
          <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            <Link href="/login">Continue to Log In</Link>
          </Button>
        )}
        {status === "error" && (
          <Button asChild variant="outline" className="mt-4">
            <Link href="/signup">Back to Sign Up</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function VerifyEmailPanel() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
