"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, EyeOff, Loader2, ExternalLink } from "lucide-react";
import { Insight, INSIGHT_CATEGORIES } from "@/lib/insights-types";

interface InsightsTableProps {
  refreshKey: number;
}

export function InsightsTable({ refreshKey }: InsightsTableProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Insight | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/insights?all=true")
      .then((res) => res.json())
      .then(setInsights)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const togglePublished = async (insight: Insight) => {
    setSavingId(insight.id);
    try {
      await fetch(`/api/insights/${insight.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !insight.published }),
      });
      load();
    } finally {
      setSavingId(null);
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSavingId(editing.id);
    try {
      await fetch(`/api/insights/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          summary: editing.summary,
          content: editing.content,
          category: editing.category,
          coverImageUrl: editing.coverImageUrl,
        }),
      });
      setEditing(null);
      load();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-slate-400">
                  Loading insights…
                </TableCell>
              </TableRow>
            )}
            {!loading && insights.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-slate-400">
                  No insights yet.
                </TableCell>
              </TableRow>
            )}
            {insights.map((insight) => (
              <TableRow key={insight.id}>
                <TableCell className="max-w-[240px]">
                  <div className="font-medium text-slate-800">{insight.title}</div>
                  <div className="text-xs text-slate-400">{insight.publishedDate}</div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm sm:table-cell">
                  {insight.category}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      insight.published
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                    }
                  >
                    {insight.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {insight.published && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/insights/${insight.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3.5 w-3.5" />
                          View
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setEditing(insight)}>
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={savingId === insight.id}
                      onClick={() => togglePublished(insight)}
                    >
                      {savingId === insight.id ? (
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                      ) : insight.published ? (
                        <EyeOff className="mr-1 h-3.5 w-3.5" />
                      ) : (
                        <Eye className="mr-1 h-3.5 w-3.5" />
                      )}
                      {insight.published ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Insight</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={editing.category}
                  onValueChange={(v) => setEditing({ ...editing, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSIGHT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Cover Image URL</Label>
                <Input
                  value={editing.coverImageUrl ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, coverImageUrl: e.target.value || null })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Summary</Label>
                <Textarea
                  rows={2}
                  value={editing.summary}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Content</Label>
                <Textarea
                  rows={8}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={saveEdit}
              disabled={savingId === editing?.id}
            >
              {savingId === editing?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
