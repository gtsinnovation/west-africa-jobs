"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ExternalSourceMeta, WebhookLog } from "@/lib/types";

interface IntegrationGatewayProps {
  logs: WebhookLog[];
  onSynced: () => void;
}

const logStatusConfig = {
  success: { icon: CheckCircle, className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  pending: { icon: Clock, className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  failed: { icon: XCircle, className: "bg-red-100 text-red-700 hover:bg-red-100" },
} as const;

const sourceStatusConfig = {
  live: { className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  pending_credentials: { className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  sample: { className: "bg-slate-100 text-slate-600 hover:bg-slate-100" },
} as const;

export function IntegrationGateway({ logs, onSynced }: IntegrationGatewayProps) {
  const [autoFormat, setAutoFormat] = useState(false);
  const [sources, setSources] = useState<ExternalSourceMeta[]>([]);
  const [syncing, setSyncing] = useState(false);

  const loadSources = () => {
    fetch("/api/external-sources")
      .then((res) => res.json())
      .then((data) => setSources(data.sources ?? []));
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/external-jobs/sync", { method: "POST" });
      loadSources();
      onSynced();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
          <Globe className="h-5 w-5 text-emerald-600" />
          System Integration Gateway
        </CardTitle>
        <p className="text-sm text-slate-500">
          Aggregated partner job boards, inbound sync status, and outbound broadcast configuration.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-600">Partner Board Connectors</h4>
            <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
              {syncing ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              )}
              Sync Now
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {sources.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-slate-700">{s.name}</span>
                  <Badge className={sourceStatusConfig[s.status].className}>{s.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-400">{s.statusLabel}</p>
                <a
                  href={s.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
                >
                  View board
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-600">Inbound Webhook Status Log</h4>
          <div className="space-y-2">
            {logs.map((log) => {
              const cfg = logStatusConfig[log.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{log.source}</span>
                      <Badge className={cfg.className}>
                        <Icon className="mr-1 h-3 w-3" />
                        {log.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{log.detail}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
                    {new Date(log.receivedAt).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
          <div>
            <Label htmlFor="auto-format" className="text-sm font-semibold text-slate-700">
              Auto-Format New Jobs for Facebook Graph API Broadcast
            </Label>
            <p className="mt-1 text-xs text-slate-400">
              When enabled, newly published listings are auto-formatted and queued for the
              Facebook Graph API outbound broadcaster (placeholder — not yet connected).
            </p>
          </div>
          <Switch id="auto-format" checked={autoFormat} onCheckedChange={setAutoFormat} />
        </div>
      </CardContent>
    </Card>
  );
}
