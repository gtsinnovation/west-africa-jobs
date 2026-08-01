import { NextResponse } from "next/server";
import { getInsightById, setPublished, updateInsight } from "@/lib/insights";
import { isAdminAuthenticated } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const body = await request.json();

  if (typeof body.published === "boolean" && Object.keys(body).length === 1) {
    const insight = await setPublished(id, body.published);
    if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(insight);
  }

  const insight = await updateInsight(id, body);
  if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(insight);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const insight = await getInsightById(id);
  if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(insight);
}
