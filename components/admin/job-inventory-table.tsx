"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit, FolderOpen, Loader2 } from "lucide-react";
import { Job } from "@/lib/types";
import { COUNTRIES, SECTORS, JOB_TYPES } from "@/lib/constants";

interface JobInventoryTableProps {
  jobs: Job[];
  loading: boolean;
  onChanged: () => void;
}

export function JobInventoryTable({ jobs, loading, onChanged }: JobInventoryTableProps) {
  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return jobs.filter(
      (j) => j.title.toLowerCase().includes(s) || j.organization.toLowerCase().includes(s)
    );
  }, [jobs, search]);

  const toggleArchive = async (job: Job) => {
    setSavingId(job.id);
    try {
      await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !job.archived }),
      });
      onChanged();
    } finally {
      setSavingId(null);
    }
  };

  const saveEdit = async () => {
    if (!editingJob) return;
    setSavingId(editingJob.id);
    try {
      await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingJob.title,
          organization: editingJob.organization,
          city: editingJob.city,
          country: editingJob.country,
          sector: editingJob.sector,
          jobType: editingJob.jobType,
          applicationUrl: editingJob.applicationUrl,
          description: editingJob.description,
          closingDate: editingJob.closingDate,
        }),
      });
      setEditingJob(null);
      onChanged();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search active inventory…"
          className="border-0 p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>City / Country</TableHead>
              <TableHead className="hidden sm:table-cell">Sector</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-slate-400">
                  Loading inventory…
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-slate-400">
                  No records match.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="max-w-[220px]">
                  <div className="font-medium text-slate-800">{job.title}</div>
                  <div className="text-xs text-slate-400">{job.organization}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {job.city ? `${job.city}, ` : ""}
                  {job.country}
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm sm:table-cell">
                  {job.sector}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      job.archived
                        ? "bg-slate-100 text-slate-500 hover:bg-slate-100"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    }
                  >
                    {job.archived ? "Archived" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={savingId === job.id}
                      onClick={() => toggleArchive(job)}
                    >
                      {savingId === job.id ? (
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <FolderOpen className="mr-1 h-3.5 w-3.5" />
                      )}
                      {job.archived ? "Restore" : "Archive"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Parameters</DialogTitle>
          </DialogHeader>
          {editingJob && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Job Title</Label>
                <Input
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Organization</Label>
                <Input
                  value={editingJob.organization}
                  onChange={(e) => setEditingJob({ ...editingJob, organization: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input
                    value={editingJob.city ?? ""}
                    onChange={(e) => setEditingJob({ ...editingJob, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Select
                    value={editingJob.country}
                    onValueChange={(v) => setEditingJob({ ...editingJob, country: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.filter((c) => c.name !== "All West Africa").map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.flag} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Job Type</Label>
                  <Select
                    value={editingJob.jobType}
                    onValueChange={(v) => setEditingJob({ ...editingJob, jobType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Closing Date</Label>
                  <Input
                    type="date"
                    value={editingJob.closingDate}
                    onChange={(e) => setEditingJob({ ...editingJob, closingDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Application URL</Label>
                <Input
                  type="url"
                  value={editingJob.applicationUrl}
                  onChange={(e) => setEditingJob({ ...editingJob, applicationUrl: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Detailed Description</Label>
                <Textarea
                  rows={4}
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingJob(null)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={saveEdit}
              disabled={savingId === editingJob?.id}
            >
              {savingId === editingJob?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
