"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck } from "lucide-react";
import { Job, WebhookLog } from "@/lib/types";
import { JobIngestionForm } from "@/components/admin/job-ingestion-form";
import { JobInventoryTable } from "@/components/admin/job-inventory-table";
import { IntegrationGateway } from "@/components/admin/integration-gateway";
import { UsersPanel } from "@/components/admin/users-panel";
import { InsightEditorForm } from "@/components/admin/insight-editor-form";
import { InsightsTable } from "@/components/admin/insights-table";

export function DashboardClient() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsRefreshKey, setInsightsRefreshKey] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, logsRes] = await Promise.all([
        fetch("/api/jobs?all=true"),
        fetch("/api/webhooks"),
      ]);
      setJobs(await jobsRes.json());
      setLogs(await logsRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const activeCount = jobs.filter((j) => !j.archived).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-800 sm:text-lg">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">
                {activeCount} active listing{activeCount !== 1 ? "s" : ""} in the field
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <Tabs defaultValue="ingest">
          <TabsList className="flex-wrap">
            <TabsTrigger value="ingest">Ingestion Desk</TabsTrigger>
            <TabsTrigger value="inventory">Active Inventory</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="users">Users &amp; Mail</TabsTrigger>
          </TabsList>

          <TabsContent value="ingest" className="mt-4">
            <JobIngestionForm onCreated={refresh} />
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <JobInventoryTable jobs={jobs} loading={loading} onChanged={refresh} />
          </TabsContent>

          <TabsContent value="insights" className="mt-4 space-y-6">
            <InsightEditorForm onCreated={() => setInsightsRefreshKey((k) => k + 1)} />
            <InsightsTable refreshKey={insightsRefreshKey} />
          </TabsContent>

          <TabsContent value="integrations" className="mt-4">
            <IntegrationGateway logs={logs} onSynced={refresh} />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <UsersPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
