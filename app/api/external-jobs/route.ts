import { NextResponse } from "next/server";
import { getExternalJobs } from "@/lib/external-jobs";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limited = checkRateLimit(request, "external-jobs-read", RATE_LIMITS.general);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const jobs = await getExternalJobs();
  return NextResponse.json(jobs);
}
