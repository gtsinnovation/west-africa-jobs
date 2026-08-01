"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Newspaper, Loader2, CheckCircle } from "lucide-react";
import { INSIGHT_CATEGORIES, InsightInput } from "@/lib/insights-types";

interface InsightEditorFormProps {
  onCreated: () => void;
}

const emptyForm: InsightInput = {
  title: "",
  summary: "",
  content: "",
  category: "",
  coverImageUrl: null,
  published: true,
};

export function InsightEditorForm({ onCreated }: InsightEditorFormProps) {
  const [form, setForm] = useState<InsightInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof InsightInput>(key: K, value: InsightInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to publish insight.");
        return;
      }
      setForm(emptyForm);
      setSuccess(true);
      onCreated();
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
          <Newspaper className="h-5 w-5 text-emerald-600" />
          Write a New Insight
        </CardTitle>
        <p className="text-sm text-slate-500">
          Publish an article to the public Insights page and landing page.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="insight-title">Title</Label>
            <Input
              id="insight-title"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Hiring Trends Across West Africa's Social-Impact Sector"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
            <Label htmlFor="insight-cover">Cover Image URL (optional)</Label>
            <Input
              id="insight-cover"
              type="url"
              value={form.coverImageUrl ?? ""}
              onChange={(e) => update("coverImageUrl", e.target.value || null)}
              placeholder="https://…"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="insight-summary">Summary (shown on cards)</Label>
            <Textarea
              id="insight-summary"
              required
              rows={2}
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="One or two sentences that appear on the Insights grid and landing page."
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="insight-content">Full Article Content</Label>
            <Textarea
              id="insight-content"
              required
              rows={8}
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Full article body. Use blank lines to separate paragraphs."
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3 sm:col-span-2">
            <div>
              <Label htmlFor="insight-published" className="text-sm font-medium text-slate-700">
                Publish immediately
              </Label>
              <p className="text-xs text-slate-400">
                Off saves as a draft — visible only in this admin list until you publish it.
              </p>
            </div>
            <Switch
              id="insight-published"
              checked={form.published}
              onCheckedChange={(v) => update("published", v)}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="sm:col-span-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700 sm:col-span-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700">
                Insight saved.
              </AlertDescription>
            </Alert>
          )}

          <div className="sm:col-span-2">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Insight
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
