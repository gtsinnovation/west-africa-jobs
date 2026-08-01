import { NextResponse } from "next/server";
import { createInsight, getAllInsights, getPublishedInsights } from "@/lib/insights";
import { isAdminAuthenticated } from "@/lib/auth";
import { InsightInput } from "@/lib/insights-types";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limited = checkRateLimit(request, "insights-read", RATE_LIMITS.general);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get("all") === "true";

  if (includeDrafts) {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await getAllInsights());
  }

  return NextResponse.json(await getPublishedInsights());
}

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = checkRateLimit(request, "insights-mutate", RATE_LIMITS.jobMutation);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const body = (await request.json()) as InsightInput;

  if (!body.title || !body.summary || !body.content || !body.category) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const insight = await createInsight(body);
  return NextResponse.json(insight, { status: 201 });
}
