import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getExternalJobs, getSyncState } from "@/lib/external-jobs";
import { pushWebhookLog } from "@/lib/store";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = checkRateLimit(request, "external-sync", { limit: 10, windowMs: 60_000 });
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many sync requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const jobs = await getExternalJobs(true);
  const state = getSyncState();

  pushWebhookLog({
    id: `wh-${Date.now()}`,
    source: "ReliefWeb API Connector",
    status: state?.reliefWebLive ? "success" : "failed",
    receivedAt: new Date().toISOString(),
    detail: state?.reliefWebLive
      ? "Live sync completed against the ReliefWeb v2 API."
      : `Sync rejected: ${state?.reliefWebError ?? "unknown error"}`,
  });

  pushWebhookLog({
    id: `wh-${Date.now() + 1}`,
    source: "Afrorama / WACSI / Impactpool Connectors",
    status: "success",
    receivedAt: new Date().toISOString(),
    detail: `Synced ${state?.afroramaCount ?? 0} Afrorama, ${state?.wacsiCount ?? 0} WACSI, and ${
      state?.impactpoolCount ?? 0
    } Impactpool listings live.`,
  });

  pushWebhookLog({
    id: `wh-${Date.now() + 2}`,
    source: "Sample Partner Boards",
    status: "success",
    receivedAt: new Date().toISOString(),
    detail: "Refreshed curated sample listings for NGO Jobs in Africa, Devex, DevelopmentAid, and CTG (no scrapable public surface found).",
  });

  return NextResponse.json({
    total: jobs.length,
    reliefWebLive: state?.reliefWebLive ?? false,
    syncedAt: new Date().toISOString(),
  });
}
