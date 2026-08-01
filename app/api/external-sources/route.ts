import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { getSyncState } from "@/lib/external-jobs";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = getSyncState();

  const sources = EXTERNAL_SOURCES.map((s) => {
    if (s.id === "reliefweb" && state) {
      return state.reliefWebLive
        ? { ...s, status: "live" as const, statusLabel: "Live — synced from ReliefWeb API" }
        : {
            ...s,
            status: "pending_credentials" as const,
            statusLabel: state.reliefWebError ?? s.statusLabel,
          };
    }
    if (s.id === "afrorama" && state) {
      return { ...s, statusLabel: `Live — ${state.afroramaCount} West Africa listings synced` };
    }
    if (s.id === "wacsi" && state) {
      return { ...s, statusLabel: `Live — ${state.wacsiCount} listings synced from WACSI's REST API` };
    }
    if (s.id === "impactpool" && state) {
      return {
        ...s,
        statusLabel:
          state.impactpoolCount > 0
            ? `Live — ${state.impactpoolCount} West Africa matches in latest feed`
            : "Live — 0 West Africa matches in current feed (best-effort)",
      };
    }
    return s;
  });

  return NextResponse.json({
    sources,
    cacheAgeMs: state ? Date.now() - state.fetchedAt : null,
  });
}
