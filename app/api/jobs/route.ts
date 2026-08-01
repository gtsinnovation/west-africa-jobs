import { NextResponse } from "next/server";
import { createJob, getActiveJobs, getAllJobs } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";
import { JobInput } from "@/lib/types";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limited = checkRateLimit(request, "jobs-read", RATE_LIMITS.general);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const url = new URL(request.url);
  const includeArchived = url.searchParams.get("all") === "true";

  if (includeArchived) {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await getAllJobs());
  }

  return NextResponse.json(await getActiveJobs());
}

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = checkRateLimit(request, "jobs-mutate", RATE_LIMITS.jobMutation);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const body = (await request.json()) as JobInput;

  if (
    !body.title ||
    !body.organization ||
    !body.city ||
    !body.country ||
    !body.applicationUrl
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const job = await createJob(body);
  return NextResponse.json(job, { status: 201 });
}
